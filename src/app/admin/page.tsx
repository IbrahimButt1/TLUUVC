import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminDashboard() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Welcome, {settings.username}</CardTitle>
                <CardDescription>
                    You are the manager of The LUU Visa Consultant.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Select an option from the left to get started.</p>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
