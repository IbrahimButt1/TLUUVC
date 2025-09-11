import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import type { HeroImage } from "@/lib/hero-images";
import { deleteHeroImage } from "@/lib/hero-images";
import Image from "next/image";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FilePenLine, Trash2 } from "lucide-react";

export default function HeroImagesList({ images }: { images: HeroImage[]}) {
    return (
        <Card>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Image</TableHead>
                            <TableHead className="w-[250px]">Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {images.map((image) => (
                            <TableRow key={image.id}>
                                <TableCell>
                                    <div className="relative w-32 h-20 rounded-md overflow-hidden border">
                                        <Image src={image.image} alt={image.title} fill className="object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{image.title}</TableCell>
                                <TableCell className="text-muted-foreground max-w-md truncate">{image.description}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/hero/edit/${image.id}`} className="flex items-center">
                                                    <FilePenLine className="mr-2 h-4 w-4" />
                                                    <span>Edit</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:text-destructive flex items-center"
                                                        onSelect={(e) => e.preventDefault()}
                                                    >
                                                       <Trash2 className="mr-2 h-4 w-4" />
                                                       <span>Delete</span>
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete this hero image.
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
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                         ))}
                    </TableBody>
                </Table>
                {images.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        <p>No hero images have been added yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
