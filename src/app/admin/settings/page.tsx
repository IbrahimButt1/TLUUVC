import { Suspense } from "react";
import SettingsClient from "./settings-client";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/site-settings";

// ✅ Server Component
export default async function SettingsPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const settings: SiteSettings = await getSiteSettings();
  const tab = searchParams.tab || "branding";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* ✅ pass settings + tab to Client Component */}
        <SettingsClient settings={settings} tab={tab} />
      </Suspense>
    </div>
  );
}