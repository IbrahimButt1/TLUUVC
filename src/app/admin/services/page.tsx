import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { getServices } from "@/lib/services";
import ServicesListClient from "@/components/admin/services-list-client";

export default async function ManageServices() {
  const services = await getServices();
  return (
    <div>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Manage Services</h1>
            <Button asChild>
                <Link href="/admin/services/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Service
                </Link>
            </Button>
        </div>

        <ServicesListClient initialServices={services} />
    </div>
  );
}
