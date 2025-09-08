import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewServicePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Service</CardTitle>
                    <CardDescription>Fill out the form below to add a new service to your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Service Title</Label>
                            <Input id="title" name="title" placeholder="e.g., Tourist Visas" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Service Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe the service in detail." rows={5} required />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" asChild>
                               <Link href="/admin/services">Cancel</Link>
                            </Button>
                            <Button type="submit">Save Service</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
