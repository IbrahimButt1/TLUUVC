import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/site-settings";
import BrandingForm from "@/components/admin/branding-form";
import CredentialsForm from "@/components/admin/credentials-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/admin/profile-form";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { tab: string | undefined };
}) {
    const settings = await getSiteSettings();
    const activeTab = searchParams.tab || "branding";

    return (
        <div className="max-w-2xl mx-auto">
             <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
            <Tabs defaultValue={activeTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="branding">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>Update your company's logo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BrandingForm settings={settings} />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="credentials">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Credentials</CardTitle>
                            <CardDescription>Manage administrator username and password.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CredentialsForm settings={settings} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Profile</CardTitle>
                            <CardDescription>Update your administrator profile picture.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm settings={settings} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
