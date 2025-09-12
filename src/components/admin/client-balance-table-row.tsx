'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/hooks/use-toast';
import { ClientBalance } from '@/lib/client-balances';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface ClientBalanceTableRowProps {
    clientName: string;
    currentBalance: ClientBalance | undefined;
    action: (prevState: any, formData: FormData) => Promise<{ success: boolean; error?: string; message?: string }>;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="sm">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
        </Button>
    )
}

export default function ClientBalanceTableRow({ clientName, currentBalance, action }: ClientBalanceTableRowProps) {
    const [state, formAction] = useActionState(action, { success: false });
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [key, setKey] = useState(Date.now()); // Used to reset form on success

    useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Success!',
                description: state.message,
            });
            // Reset the form by changing the key, which causes a re-render
            setKey(Date.now());
        }
        if (state.error) {
             toast({
                title: 'Error!',
                description: state.error,
                variant: 'destructive'
            });
        }
    }, [state, toast]);

    const defaultType = currentBalance?.type || 'credit';
    const defaultAmount = currentBalance?.amount || 0;

    return (
         <form 
            action={formAction} 
            ref={formRef} 
            key={key} 
            className="grid grid-cols-[1fr,1fr,1fr,1fr,auto] gap-4 items-center p-4 border-b last:border-b-0 hover:bg-muted/50"
         >
            <input type="hidden" name="clientName" value={clientName} />
            <div className="font-medium">{clientName}</div>
            <div className="text-center">
                 {currentBalance ? (
                    <Badge 
                        variant={currentBalance.type === 'credit' ? 'default' : 'destructive'}
                        className={cn(
                            "border-transparent",
                            currentBalance.type === 'credit' ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/50 dark:text-green-300" : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-300"
                          )}
                    >
                        ${defaultAmount.toFixed(2)} ({currentBalance.type})
                    </Badge>
                 ) : (
                    <Badge variant="outline">
                        Not Set
                    </Badge>
                 )}
            </div>
            <div>
                <Input id={`amount-${clientName}`} name="amount" type="number" step="0.01" defaultValue={defaultAmount} required className="h-9"/>
            </div>
            <div>
                 <RadioGroup defaultValue={defaultType} name="type" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit" id={`credit-${clientName}`} />
                        <Label htmlFor={`credit-${clientName}`}>Credit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit" id={`debit-${clientName}`} />
                        <Label htmlFor={`debit-${clientName}`}>Debit</Label>
                    </div>
                </RadioGroup>
            </div>
            <div className="text-right">
                <SubmitButton />
            </div>
        </form>
    );
}
