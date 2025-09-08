import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getServiceById, updateService } from "@/lib/services";
import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/service-form";

export default async function EditServicePage({ params }: { params: { id: string } }) {
    const service = await getServiceById(params.id);
    if (!service) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Service</CardTitle>
                    <CardDescription>Update the details for the service below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ServiceForm
                        service={service}
                        action={updateService}
                        submitText="Save Changes"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
