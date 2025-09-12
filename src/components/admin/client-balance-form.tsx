'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { ClientBalance } from '@/lib/client-balances';
import { cn } from '@/lib/utils';

interface ClientBalanceFormProps {
    clientName: string;
    currentBalance: ClientBalance | undefined;
    action: (prevState: any, formData: FormData) => Promise<{ success: boolean; error?: string; message?: string }>;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-32">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Balance
        </Button>
    )
}

export default function ClientBalanceForm({ clientName, currentBalance, action }: ClientBalanceFormProps) {
    const [state, formAction] = useActionState(action, { success: false });
    const { toast } = useToast();

    useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Success!',
                description: state.message,
            });
        }
    }, [state, toast]);

    const defaultType = currentBalance?.type || 'credit';
    const defaultAmount = currentBalance?.amount || 0;

    return (
        <form action={formAction} className="space-y-6">
            <div className="md:grid md:grid-cols-3 md:gap-6 items-center">
                 <input type="hidden" name="clientName" value={clientName} />
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 ">{clientName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Current Balance: 
                        <span className={cn(
                            "font-bold",
                             currentBalance?.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        )}>
                             ${defaultAmount.toFixed(2)} ({currentBalance ? currentBalance.type : 'N/A'})
                        </span>
                    </p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor={`amount-${clientName}`}>Balance Amount ($)</Label>
                            <Input id={`amount-${clientName}`} name="amount" type="number" step="0.01" defaultValue={defaultAmount} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`type-${clientName}`}>Balance Type</Label>
                            <RadioGroup defaultValue={defaultType} name="type" className="flex gap-4 pt-2">
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
                    </div>
                </div>
            </div>
             {state?.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end">
                <SubmitButton />
            </div>
            <Separator />
        </form>
    );
}