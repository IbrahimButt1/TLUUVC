
'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Testimonial } from "@/lib/testimonials";
import { Loader2, Check, ChevronsUpDown, GraduationCap, Globe } from 'lucide-react';
import React from 'react';
import { countries } from '@/lib/countries';

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
    action: (formData: FormData) => Promise<void>;
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

export default function TestimonialForm({ action, testimonial, submitText }: TestimonialFormProps) {
    const [rolePopoverOpen, setRolePopoverOpen] = React.useState(false);
    const [countryPopoverOpen, setCountryPopoverOpen] = React.useState(false);

    const [selectedRole, setSelectedRole] = React.useState(testimonial?.role || "");
    const [selectedCountry, setSelectedCountry] = React.useState(testimonial?.country || "");

    const destinationValue = `${selectedRole} in ${selectedCountry}`;
    
    return (
        <form action={action} className="space-y-6">
            {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
            <input type="hidden" name="destination" value={destinationValue} />
            <input type="hidden" name="role" value={selectedRole} />
            <input type="hidden" name="country" value={selectedCountry} />


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
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                {selectedCountry
                                    ? countries.find((c) => c.value === selectedCountry)?.label
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
                                            {c.label}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" placeholder="https://picsum.photos/100/100" defaultValue={testimonial?.image} required />
                 <p className="text-sm text-muted-foreground">
                    Use a service like <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">picsum.photos</a> or upload an image and paste the URL here.
                </p>
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
