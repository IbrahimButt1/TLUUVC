import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import HeroImageForm from "@/components/admin/hero-image-form";
import { addHeroImage } from "@/lib/hero-images";

export default function NewHeroImagePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Hero Image</CardTitle>
                    <CardDescription>Fill out the form below to add a new image to your homepage slider.</CardDescription>
                </CardHeader>
                <CardContent>
                    <HeroImageForm action={addHeroImage} submitText="Save Image" />
                </CardContent>
            </Card>
        </div>
    );
}
