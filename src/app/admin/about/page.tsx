import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { getAboutContent, updateAboutContent } from "@/lib/about-content";
import AboutForm from "@/components/admin/about-form";

export default async function AboutPage() {
    const aboutContent = await getAboutContent();

    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit About Section</CardTitle>
                    <CardDescription>Update the content for the 'About Us' section on your homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AboutForm 
                        content={aboutContent}
                        action={updateAboutContent}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
