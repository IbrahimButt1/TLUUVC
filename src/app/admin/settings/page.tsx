import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import SettingsForm from "@/components/admin/settings-form";

export default async function SettingsPage() {
    const settings = await getSiteSettings();

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>Manage your website's general settings, branding, and administrator credentials.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm
                        settings={settings}
                        action={updateSiteSettings}
                        submitText="Save Changes"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
