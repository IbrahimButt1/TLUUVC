import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ManifestForm from "@/components/admin/manifest-form";
import { addManifestEntry } from "@/lib/manifest";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function NewManifestEntryPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="relative">
                    <div className="space-y-1">
                        <CardTitle>Add New Manifest Entry</CardTitle>
                        <CardDescription>Fill out the form below to log a new transaction. Only 'Released' clients are shown.</CardDescription>
                    </div>
                    <div className="absolute top-6 right-6 w-48 space-y-1">
                        <Label htmlFor="transactionId" className="text-xs text-muted-foreground">Transaction ID</Label>
                        <Input id="transactionId" name="transactionId" value="[Auto-Generated]" readOnly disabled className="text-xs text-muted-foreground text-center" />
                    </div>
                </CardHeader>
                <CardContent>
                    <ManifestForm action={addManifestEntry} />
                </CardContent>
            </Card>
        </div>
    );
}
