import { getSettingsDisplay } from "@/actions/settings";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
  const settings = await getSettingsDisplay();

  return (
    <div className="p-4 md:p-8 pt-14 md:pt-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-surface-900 mb-1">Settings</h1>
      <p className="text-sm text-surface-400 mb-8">
        Configure integrations and where Projello stores its data.
      </p>

      <SettingsForm settings={settings} />
    </div>
  );
}
