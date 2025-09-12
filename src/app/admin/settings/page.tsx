'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/site-settings";
import BrandingForm from "@/components/admin/branding-form";
import CredentialsForm from "@/components/admin/credentials-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "@/components/admin/profile-form";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/site-settings";

export default function SettingsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    const activeTab = searchParams.get('tab') || "branding";

    useEffect(() => {
        getSiteSettings().then(setSettings);
    }, []);

    const handleTabChange = (value: string) => {
        router.replace(`${pathname}?tab=${value}`);
    };
    
    if (!settings) {
        return (
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
             <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
