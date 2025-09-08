import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ServiceForm from "@/components/admin/service-form";
import { addService } from "@/lib/services";

export default function NewServicePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Service</CardTitle>
                    <CardDescription>Fill out the form below to add a new service to your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ServiceForm action={addService} submitText="Save Service" />
                </CardContent>
            </Card>
        </div>
    );
}
