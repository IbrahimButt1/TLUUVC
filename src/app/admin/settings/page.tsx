import { Suspense } from "react";
import SettingsClient from "./settings-client";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/site-settings";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // ✅ get settings at build/runtime
  const settings: SiteSettings = await getSiteSettings();
  // ✅ safe way to read tab param
  const tab = searchParams.tab || "branding";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      <Suspense fallback={<div>Loading Settings...</div>}>
        <SettingsClient settings={settings} tab={tab} />
      </Suspense>
    </div>
  );
}