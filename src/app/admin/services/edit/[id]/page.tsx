import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data - in a real app, you would fetch this based on the [id]
const service = {
  id: "student-visas",
  title: "Student Visas",
  description: "Comprehensive guidance for students aspiring to study abroad, from application to approval."
};

export default function EditServicePage({ params }: { params: { id: string } }) {
    // You can use params.id to fetch the specific service details
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Service</CardTitle>
                    <CardDescription>Update the details for the service below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Service Title</Label>
                            <Input id="title" name="title" defaultValue={service.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Service Description</Label>
                            <Textarea id="description" name="description" defaultValue={service.description} rows={5} required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                               <Link href="/admin/services">Cancel</Link>
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
