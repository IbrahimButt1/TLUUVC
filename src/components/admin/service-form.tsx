'use client';

import { useFormStatus } from 'react-dom';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Service } from "@/lib/services";
import { Loader2 } from 'lucide-react';

interface ServiceFormProps {
    action: (formData: FormData) => Promise<void>;
    service?: Service;
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

export default function ServiceForm({ action, service, submitText }: ServiceFormProps) {
    // useActionState is not available in this React version, so we use a simple form action
    return (
        <form action={action} className="space-y-6">
            {service && <input type="hidden" name="id" value={service.id} />}
            <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input id="title" name="title" defaultValue={service?.title} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Service Description</Label>
                <Textarea id="description" name="description" defaultValue={service?.description} rows={5} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input id="icon" name="icon" defaultValue={service?.icon} placeholder="e.g., University" required />
                <p className="text-sm text-muted-foreground">
                    Enter a valid icon name from the <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Lucide Icons</a> library.
                </p>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/admin/services">Cancel</Link>
                </Button>
                <SubmitButton submitText={submitText} />
            </div>
        </form>
    );
}
