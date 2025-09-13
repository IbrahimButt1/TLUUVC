
'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getServiceTitles, type ServiceTitle } from '@/lib/services';
import { transactionCategories } from '@/lib/service-data';
import { getClients, type Client } from '@/lib/clients';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"


interface ManifestFormProps {
    action: (formData: FormData) => Promise<void>;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Entry
        </Button>
    )
}

export default function ManifestForm({ action }: ManifestFormProps) {
    const [services, setServices] = useState<ServiceTitle[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [description, setDescription] = useState('');
    const [clientName, setClientName] = useState('');
    const [clientPopoverOpen, setClientPopoverOpen] = useState(false);

    useEffect(() => {
        getServiceTitles().then(setServices);
        getClients().then(setClients);
    }, []);
    
    return (
        <form action={action} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <input type="hidden" name="clientName" value={clientName} />
                    <Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={clientPopoverOpen}
                            className="w-full justify-between font-normal"
                            >
                            {clientName || "Select an existing client..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput 
                                    placeholder="Search clients..."
                                />
                                <CommandList>
                                    <CommandEmpty>No clients found. Add one on the 'Manage Clients' page.</CommandEmpty>
                                    <CommandGroup>
                                        {clients.filter(c => c.status === 'active').map((c) => (
                                        <CommandItem
                                            key={c.id}
                                            value={c.name}
                                            onSelect={(currentValue) => {
                                                setClientName(currentValue === clientName ? "" : currentValue)
                                                setClientPopoverOpen(false)
                                            }}
                                        >
                                            <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                clientName === c.name ? "opacity-100" : "opacity-0"
                                            )}
                                            />
                                            {c.name}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <select 
                    id="description"
                    name="description"
                    required 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" disabled>Select a transaction description...</option>
                    <optgroup label="Standard Transactions">
                        {transactionCategories.map((cat) => (
                             <option key={cat.value} value={cat.label}>
                                {cat.label}
                            </option>
                        ))}
                    </optgroup>
                    <optgroup label="Service Payments">
                        {services.map((service) => (
                            <option key={service.id} value={`Payment for ${service.title}`}>
                                Payment for {service.title}
                            </option>
                        ))}
                    </optgroup>
                    <option value="Other">Other</option>
                </select>
                 {description === 'Other' && (
                    <Textarea 
                        name="otherDescription"
                        placeholder="Please specify the description for 'Other'"
                        className="mt-2"
                        required
                    />
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                    <RadioGroup defaultValue="credit" name="type" className="flex gap-4 pt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit" id="credit" />
                            <Label htmlFor="credit">Credit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="debit" id="debit" />
                            <Label htmlFor="debit">Debit</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" required placeholder="e.g. 150.00" />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/manifest">Cancel</Link>
                </Button>
                <SubmitButton />
            </div>
        </form>
    );
}
