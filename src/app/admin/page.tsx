import TrafficChart from "@/components/admin/traffic-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Customize Layout
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/services">
            <Card className="hover:bg-muted transition-colors">
            <CardHeader>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>
                Add, edit, or delete your service offerings.
                </CardDescription>
            </CardHeader>
            </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Website Traffic</CardTitle>
            <CardDescription>A look at your website's traffic over the last 6 months.</CardDescription>
          </Header>
          <CardContent>
            <TrafficChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
