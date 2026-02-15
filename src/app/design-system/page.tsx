import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge, PriorityBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

const COLORS = [
  { name: "Surface 0", var: "bg-surface-0" },
  { name: "Surface 50", var: "bg-surface-50" },
  { name: "Surface 100", var: "bg-surface-100" },
  { name: "Surface 200", var: "bg-surface-200" },
  { name: "Surface 300", var: "bg-surface-300" },
  { name: "Surface 400", var: "bg-surface-400" },
  { name: "Surface 500", var: "bg-surface-500" },
  { name: "Surface 600", var: "bg-surface-600" },
  { name: "Surface 700", var: "bg-surface-700" },
  { name: "Surface 800", var: "bg-surface-800" },
  { name: "Surface 900", var: "bg-surface-900" },
];

const ACCENT_COLORS = [
  { name: "Primary", var: "bg-primary" },
  { name: "Accent", var: "bg-accent" },
  { name: "Danger", var: "bg-danger" },
  { name: "Warning", var: "bg-warning" },
  { name: "Success", var: "bg-success" },
  { name: "Info", var: "bg-info" },
];

const PROJECT_COLORS = [
  { name: "Indigo", var: "bg-project-indigo" },
  { name: "Rose", var: "bg-project-rose" },
  { name: "Amber", var: "bg-project-amber" },
  { name: "Emerald", var: "bg-project-emerald" },
  { name: "Cyan", var: "bg-project-cyan" },
  { name: "Violet", var: "bg-project-violet" },
  { name: "Pink", var: "bg-project-pink" },
  { name: "Orange", var: "bg-project-orange" },
];

export default function DesignSystemPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-16">
      <div>
        <h1 className="text-3xl font-bold text-surface-900">Design System</h1>
        <p className="text-surface-400 mt-1">
          Visual language and component library for Projello
        </p>
      </div>

      {/* Colors */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Colors</h2>

        <div>
          <h3 className="text-sm font-medium text-surface-500 mb-3">Surface Scale</h3>
          <div className="grid grid-cols-11 gap-2">
            {COLORS.map((c) => (
              <div key={c.name} className="text-center">
                <div className={`w-full aspect-square rounded-lg ${c.var} border border-surface-200`} />
                <span className="text-[10px] text-surface-400 mt-1 block">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-surface-500 mb-3">Semantic Colors</h3>
          <div className="grid grid-cols-6 gap-2">
            {ACCENT_COLORS.map((c) => (
              <div key={c.name} className="text-center">
                <div className={`w-full aspect-square rounded-lg ${c.var}`} />
                <span className="text-[10px] text-surface-400 mt-1 block">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-surface-500 mb-3">Project Colors</h3>
          <div className="flex gap-3">
            {PROJECT_COLORS.map((c) => (
              <div key={c.name} className="text-center">
                <div className={`w-10 h-10 rounded-full ${c.var}`} />
                <span className="text-[10px] text-surface-400 mt-1 block">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Typography</h2>
        <div className="space-y-4 bg-surface-50 rounded-xl p-6 border border-surface-200">
          <p className="text-3xl font-bold text-surface-900">Heading 3XL Bold</p>
          <p className="text-2xl font-bold text-surface-900">Heading 2XL Bold</p>
          <p className="text-xl font-semibold text-surface-800">Heading XL Semibold</p>
          <p className="text-lg font-semibold text-surface-800">Heading LG Semibold</p>
          <p className="text-base text-surface-700">Body Base Regular</p>
          <p className="text-sm text-surface-600">Body SM Regular</p>
          <p className="text-xs text-surface-400">Caption XS Regular</p>
          <p className="text-sm font-mono text-surface-500">Monospace Text</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Buttons</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </Button>
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Form Elements</h2>
        <div className="grid grid-cols-2 gap-6 max-w-xl">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="With error" placeholder="Invalid input" error="This field is required" />
          <div className="col-span-2">
            <Textarea label="Description" placeholder="Write something..." rows={3} />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <PriorityBadge priority="low" />
          <PriorityBadge priority="medium" />
          <PriorityBadge priority="high" />
          <PriorityBadge priority="urgent" />
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Cards</h2>
        <div className="grid grid-cols-2 gap-5">
          <Card className="p-5">
            <h3 className="font-semibold text-surface-800">Card Title</h3>
            <p className="text-sm text-surface-400 mt-1">
              A basic card component with surface background and border.
            </p>
          </Card>
          <Card className="overflow-hidden hover:shadow-card-hover cursor-pointer">
            <div className="h-1.5 bg-project-rose" />
            <div className="p-5">
              <h3 className="font-semibold text-surface-800">Project Card</h3>
              <p className="text-sm text-surface-400 mt-1">
                A card with a color accent at the top.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Empty State */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-surface-800">Empty State</h2>
        <Card>
          <EmptyState
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            }
            title="Nothing here yet"
            description="This is an empty state component used when there's no content to display."
            action={<Button size="sm">Take Action</Button>}
          />
        </Card>
      </section>
    </div>
  );
}
