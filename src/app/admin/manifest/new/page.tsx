import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ManifestForm from "@/components/admin/manifest-form";
import { addManifestEntry } from "@/lib/manifest";

export default function NewManifestEntryPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <div className="space-y-1">
                        <CardTitle>Add New Manifest Entry</CardTitle>
                        <CardDescription>Fill out the form below to log a new transaction. Only 'Released' clients are shown.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <ManifestForm action={addManifestEntry} />
                </CardContent>
            </Card>
        </div>
    );
}
