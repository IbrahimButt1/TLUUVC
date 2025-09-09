import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import HeroImageForm from "@/components/admin/hero-image-form";
import { getHeroImageById, updateHeroImage } from "@/lib/hero-images";
import { notFound } from "next/navigation";

export default async function EditHeroImagePage({ params }: { params: { id: string } }) {
    const image = await getHeroImageById(params.id);
    if (!image) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Hero Image</CardTitle>
                    <CardDescription>Update the details for the hero image below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <HeroImageForm
                        image={image}
                        action={updateHeroImage}
                        submitText="Save Changes"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
