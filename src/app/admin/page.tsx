import TrafficByCountryChart from "@/components/admin/traffic-by-country-chart";
import TrafficByCityChart from "@/components/admin/traffic-by-city-chart";
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

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic by Country</CardTitle>
            <CardDescription>Top countries visiting your website.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficByCountryChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Traffic by City</CardTitle>
            <CardDescription>Top cities visiting your website.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficByCityChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
