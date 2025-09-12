'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Testimonial } from "@/lib/testimonials";
import { Loader2, Check, ChevronsUpDown, GraduationCap, Globe, Upload, XCircle } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { countries, Country } from '@/lib/countries';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TestimonialFormProps {
    action: (imageDataUri: string, formData: FormData) => Promise<void>;
    testimonial?: Testimonial;
    submitText: string;
}

function SubmitButton({ submitText }: { submitText: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitText}
        </Button>
    )
}

const roles = [
    { value: 'Student Visa', label: 'Student Visa' },
    { value: 'Work Visa', label: 'Work Visa' },
    { value: 'Family Visa', label: 'Family Visa' },
    { value: 'Partner Visa', label: 'Partner Visa' },
    { value: 'Tourist Visa', label: 'Tourist Visa' },
    { value: 'Business Visa', label: 'Business Visa' },
    { value: 'Skilled Worker', label: 'Skilled Worker' },
    { value: 'Tech Professional', label: 'Tech Professional' },
];

const MAX_FILE_SIZE_MB = 1;


export default function TestimonialForm({ action, testimonial, submitText }: TestimonialFormProps) {
    const [rolePopoverOpen, setRolePopoverOpen] = useState(false);
    const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState(testimonial?.role || "");
    const [selectedCountry, setSelectedCountry] = useState(testimonial?.country || "");
    const [imagePreview, setImagePreview] = useState(testimonial?.image || null);
    const [imageDataUri, setImageDataUri] = useState("");
    const [imageRemoved, setImageRemoved] = useState(false);
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());


    const destinationValue = `${selectedRole} in ${selectedCountry}`;
    
    const currentCountry = countries.find((c) => c.value === selectedCountry);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                toast({
                    title: 'File Too Large',
                    description: `Please upload an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
                    variant: 'destructive'
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setImagePreview(dataUrl);
                setImageDataUri(dataUrl);
                setImageRemoved(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const formAction = action.bind(null, imageDataUri);

    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageDataUri("");
        setImageRemoved(true);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setFileInputKey(Date.now());
    };


    return (
        <form action={formAction} className="space-y-6">
            {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
            <input type="hidden" name="destination" value={destinationValue} />
            <input type="hidden" name="role" value={selectedRole} />
            <input type="hidden" name="country" value={selectedCountry} />
            <input type="hidden" name="imageRemoved" value={imageRemoved.toString()} />


            <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" name="name" defaultValue={testimonial?.name} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Popover open={rolePopoverOpen} onOpenChange={setRolePopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={rolePopoverOpen}
                            className="w-full justify-between font-normal"
                            >
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                {selectedRole
                                    ? roles.find((r) => r.value === selectedRole)?.label
                                    : "Select role..."}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search roles..." />
                                <CommandList>
                                    <CommandEmpty>No role found.</CommandEmpty>
                                    <CommandGroup>
                                        {roles.map((r) => (
                                        <CommandItem
                                            key={r.value}
                                            value={r.value}
                                            onSelect={(currentValue) => {
                                                setSelectedRole(currentValue === selectedRole ? "" : currentValue)
                                                setRolePopoverOpen(false)
                                            }}
                                        >
                                            <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedRole === r.value ? "opacity-100" : "opacity-0"
                                            )}
                                            />
                                            {r.label}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="country">Destination Country</Label>
                     <Popover open={countryPopoverOpen} onOpenChange={setCountryPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countryPopoverOpen}
                            className="w-full justify-between font-normal"
                            >
                            <div className="flex items-center gap-2">
                                {currentCountry ? (
                                     <Image 
                                        src={`https://flagcdn.com/w20/${currentCountry.code.toLowerCase()}.png`} 
                                        alt={`${currentCountry.label} flag`} 
                                        width={20} 
                                        height={15} 
                                        className="h-4 w-5 object-contain"
                                    />
                                ) : (
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                )}
                                {selectedCountry
                                    ? currentCountry?.label
                                    : "Select country..."}
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search country..." />
                                <CommandList>
                                    <CommandEmpty>No country found.</CommandEmpty>
                                    <CommandGroup>
                                        {countries.map((c) => (
                                        <CommandItem
                                            key={c.value}
                                            value={c.value}
                                            onSelect={(currentValue) => {
                                                setSelectedCountry(currentValue === selectedCountry ? "" : currentValue)
                                                setCountryPopoverOpen(false)
                                            }}
                                        >
                                            <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedCountry === c.value ? "opacity-100" : "opacity-0"
                                            )}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Image 
                                                    src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                                    alt={`${c.label} flag`} 
                                                    width={20} 
                                                    height={15}
                                                    className="h-4 w-5 object-contain mr-2"
                                                />
                                                <span>{c.label}</span>
                                            </div>
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-4">
                <Label htmlFor="image-upload">Client Image</Label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative rounded-full border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                        {imagePreview ? (
                            <>
                                <Image src={imagePreview} alt="Client image preview" width={96} height={96} className="w-full h-full object-cover" />
                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-0 right-0 h-6 w-6 text-white bg-black/50 hover:bg-black/75 hover:text-white"
                                    onClick={handleRemoveImage}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                             <div className="text-center text-muted-foreground text-sm p-2">
                                <Upload className="mx-auto h-6 w-6" />
                                <span>Preview</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <Input key={fileInputKey} id="image-upload" name="imageFile" type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        <p className="text-sm text-muted-foreground mt-2">
                            Upload a photo of the client. A square image works best. Max file size: ${MAX_FILE_SIZE_MB}MB.
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="testimonial">Testimonial</Label>
                <Textarea id="testimonial" name="testimonial" defaultValue={testimonial?.testimonial} rows={5} required />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/testimonials">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
