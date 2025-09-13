import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getManifestEntries, type ManifestEntry } from "@/lib/manifest";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ManifestChart from "@/components/admin/manifest-chart";
import ManifestClient from "@/components/admin/manifest-client";

export default async function ManifestPage() {
  const entries = await getManifestEntries();
  
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Client Manifest</h1>
            <Button asChild>
                <Link href="/admin/manifest/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Entry
                </Link>
            </Button>
        </div>
        
        <ManifestClient initialEntries={entries} />
    </div>
  );
}
