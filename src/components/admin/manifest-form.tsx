'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getServiceTitles, type ServiceTitle } from '@/lib/services';
import { transactionCategories } from '@/lib/service-data';

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
    const [description, setDescription] = useState('');

    useEffect(() => {
        async function fetchServices() {
            const serviceTitles = await getServiceTitles();
            setServices(serviceTitles);
        }
        fetchServices();
    }, []);
    
    return (
        <form action={action} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" name="clientName" required placeholder="e.g. Ali" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Select name="description" required onValueChange={setDescription} >
                    <SelectTrigger id="description">
                        <SelectValue placeholder="Select a transaction description..." />
                    </SelectTrigger>
                    <SelectContent>
                        {transactionCategories.map((cat) => (
                             <SelectItem key={cat.value} value={cat.label}>
                                {cat.label}
                            </SelectItem>
                        ))}
                        {services.map((service) => (
                            <SelectItem key={service.id} value={`Payment for ${service.title}`}>
                                Payment for {service.title}
                            </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                 {description === 'Other' && (
                    <Textarea 
                        name="otherDescription"
                        placeholder="Please specify the description for 'Other'"
                        className="mt-2"
                        required
                    />
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                    id="notes"
                    name="notes"
                    placeholder="Add any additional details about the transaction"
                />
            </div>
            <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="type">Transaction Type</Label>
                     <Select name="type" required defaultValue="credit">
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Select a transaction type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="credit">
                                <div className="flex items-center gap-2 text-green-600">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Client Payment Received</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="debit">
                                 <div className="flex items-center gap-2 text-red-600">
                                    <TrendingDown className="h-4 w-4" />
                                    <span>Vendor Payment Payout</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
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
