import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteHeroImage, type HeroImage } from "@/lib/hero-images";
import { DeleteButton } from "@/components/admin/delete-button";
import Image from "next/image";

export default function HeroImagesList({ images }: { images: HeroImage[]}) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => {
                return (
                    <Card key={image.id}>
                        <CardHeader>
                            <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                                <Image src={image.image} alt={image.title} fill className="object-cover" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <CardTitle className="text-lg">{image.title}</CardTitle>
                           <p className="text-sm text-muted-foreground">{image.description}</p>
                            <div className="flex justify-end gap-2 pt-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm">Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this image.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <form action={deleteHeroImage}>
                                                <input type="hidden" name="id" value={image.id} />
                                                <DeleteButton />
                                            </form>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
             {images.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-12">
                    <p>No hero images have been added yet.</p>
                </div>
            )}
        </div>
    );
}
