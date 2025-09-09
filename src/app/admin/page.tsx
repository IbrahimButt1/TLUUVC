import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>
                    You can manage your website content from the sidebar.
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
