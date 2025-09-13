
'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AddClientState, Client } from '@/lib/clients';

interface ClientFormProps {
    action: (prevState: any, formData: FormData) => Promise<AddClientState>;
    onClientAdded: (newClient: Client) => void;
    existingClients: string[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Client
        </Button>
    )
}

export default function ClientForm({ action, onClientAdded, existingClients }: ClientFormProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(action, { success: false });
    const formRef = useRef<HTMLFormElement>(null);
    
    useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Success!',
                description: state.message,
            });
            if (state.newClient) {
                onClientAdded(state.newClient);
            }
            formRef.current?.reset();
        }
    }, [state, toast, onClientAdded]);

    const clientExists = (name: string) => {
        return existingClients.some(client => client.toLowerCase() === name.toLowerCase());
    }

    return (
         <form 
            action={formAction} 
            ref={formRef} 
            className="space-y-6"
         >
             <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input 
                    id="clientName" 
                    name="clientName" 
                    placeholder="e.g. John Doe" 
                    required 
                    onChange={(e) => {
                        if(clientExists(e.target.value)) {
                            e.target.setCustomValidity("A client with this name already exists.");
                        } else {
                            e.target.setCustomValidity("");
                        }
                    }}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="amount">Opening Balance Amount ($)</Label>
                    <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        step="0.01" 
                        placeholder="e.g. 500.00 (optional)"
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Opening Balance Type</Label>
                     <Select name="type" defaultValue="credit">
                        <SelectTrigger id="type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="credit">
                                <div className="flex items-center gap-2 text-green-600">
                                    <ArrowDownLeft className="h-4 w-4" />
                                    <span>Payment In (Credit)</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="debit">
                                 <div className="flex items-center gap-2 text-red-600">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span>Payment Out (Debit)</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                     <p className="text-xs text-muted-foreground">Only applicable if an opening balance amount is entered.</p>
                </div>
            </div>
            
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}
