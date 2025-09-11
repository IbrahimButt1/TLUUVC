import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ManifestForm from "@/components/admin/manifest-form";
import { addManifestEntry } from "@/lib/manifest";

export default function NewManifestEntryPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Manifest Entry</CardTitle>
                    <CardDescription>Fill out the form below to log a new transaction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ManifestForm action={addManifestEntry} />
                </CardContent>
            </Card>
        </div>
    );
}
