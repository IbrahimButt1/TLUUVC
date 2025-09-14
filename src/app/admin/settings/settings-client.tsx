"use client";

import { useRouter, usePathname } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandingForm from "@/components/admin/branding-form";
import CredentialsForm from "@/components/admin/credentials-form";
import ProfileForm from "@/components/admin/profile-form";
import type { SiteSettings } from "@/lib/site-settings";

export default function SettingsClient({ settings, tab }: { settings: SiteSettings; tab: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="branding">Branding</TabsTrigger>
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="branding">
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Update your company logo.</CardDescription>
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
            <CardDescription>Update your profile picture.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm settings={settings} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}