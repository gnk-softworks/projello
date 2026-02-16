import { addListener, removeListener, getScrollback } from "@/lib/terminal";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response("Missing sessionId", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const listener = (data: string) => {
        const encoded = Buffer.from(data).toString("base64");
        controller.enqueue(encoder.encode(`data: ${encoded}\n\n`));
      };

      try {
        addListener(sessionId, listener);
      } catch {
        controller.close();
        return;
      }

      // Replay scrollback so reconnecting clients see previous output
      const scrollback = getScrollback(sessionId);
      if (scrollback) {
        const encoded = Buffer.from(scrollback).toString("base64");
        controller.enqueue(encoder.encode(`data: ${encoded}\n\n`));
      }

      // Clean up when client disconnects
      req.signal.addEventListener("abort", () => {
        removeListener(sessionId, listener);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
