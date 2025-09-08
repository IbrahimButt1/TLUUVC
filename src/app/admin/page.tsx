import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
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
    </div>
  );
}
