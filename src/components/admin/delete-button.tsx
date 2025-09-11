'use client';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

export function DeleteButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="destructive" type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Deleting...' : 'Delete'}
        </Button>
    )
}
