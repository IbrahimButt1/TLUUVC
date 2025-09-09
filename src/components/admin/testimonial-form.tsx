
'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Testimonial } from "@/lib/testimonials";
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { getTestimonials } from '@/lib/testimonials';
import React from 'react';

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

export default function TestimonialForm({ action, testimonial, submitText }: TestimonialFormProps) {
    const [allTestimonials, setAllTestimonials] = React.useState<Testimonial[]>([]);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(testimonial?.destination || "");

    React.useEffect(() => {
        getTestimonials().then(data => setAllTestimonials(data));
    }, []);

    const destinations = React.useMemo(() => {
        const uniqueDestinations = [...new Set(allTestimonials.map(t => t.destination))];
        return uniqueDestinations.map(d => ({ value: d, label: d }));
    }, [allTestimonials]);
    
    return (
        <form action={action} className="space-y-6">
            {testimonial && <input type="hidden" name="id" value={testimonial.id} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input id="name" name="name" defaultValue={testimonial?.name} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="destination">Destination / Role</Label>
                    <Input type="hidden" name="destination" value={value} />
                     <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between font-normal"
                            >
                            {value
                                ? destinations.find((d) => d.value === value)?.label
                                : "Select destination..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search or add destination..." />
                                <CommandList>
                                    <CommandEmpty
                                        onSelect={() => {
                                            const inputValue = (document.querySelector('[cmdk-input]') as HTMLInputElement)?.value;
                                            setValue(inputValue);
                                            setOpen(false);
                                        }}
                                    >
                                        No destination found. Press Enter to add.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {destinations.map((d) => (
                                        <CommandItem
                                            key={d.value}
                                            value={d.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === d.value ? "opacity-100" : "opacity-0"
                                            )}
                                            />
                                            {d.label}
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
