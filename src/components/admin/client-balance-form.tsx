'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Check, ChevronsUpDown, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Client, ClientBalance, updateClientBalance } from '@/lib/client-balances';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface ClientBalanceFormProps {
    clients: Client[];
    balances: ClientBalance[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Balance
        </Button>
    )
}

export default function ClientBalanceForm({ clients, balances }: ClientBalanceFormProps) {
    const { toast } = useToast();
    const [state, formAction] = useActionState(updateClientBalance, { success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'credit' | 'debit'>('credit');
    
    useEffect(() => {
        if (state.success && state.message) {
            toast({
                title: 'Success!',
                description: state.message,
            });
            // Reset form on success
            setSelectedClient('');
            setAmount('');
            setType('credit');
        }
    }, [state, toast]);

    const handleClientSelect = (clientName: string) => {
        setSelectedClient(clientName);
        const balance = balances.find(b => b.clientName === clientName);
        if (balance) {
            setAmount(balance.amount.toString());
            setType(balance.type);
        } else {
            setAmount('');
            setType('credit');
        }
        setOpen(false);
    };

    return (
         <form 
            action={formAction} 
            ref={formRef} 
            className="max-w-xl mx-auto space-y-6"
         >
            <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                 <input type="hidden" name="clientName" value={selectedClient} />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between font-normal"
                        >
                        {selectedClient || "Select a client..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                            <CommandInput placeholder="Search clients..." />
                            <CommandList>
                                <CommandEmpty>No clients found. Add a transaction in the 'Manifest' module first.</CommandEmpty>
                                <CommandGroup>
                                    {clients.map((client) => (
                                    <CommandItem
                                        key={client.name}
                                        value={client.name}
                                        onSelect={() => handleClientSelect(client.name)}
                                    >
                                        <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedClient === client.name ? "opacity-100" : "opacity-0"
                                        )}
                                        />
                                        {client.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="amount">Opening Balance Amount ($)</Label>
                    <Input 
                        id="amount" 
                        name="amount" 
                        type="number" 
                        step="0.01" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 500.00" 
                        required 
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="type">Balance Type</Label>
                     <Select name="type" value={type} onValueChange={(value) => setType(value as 'credit' | 'debit')}>
                        <SelectTrigger id="type">
                            <SelectValue>
                                {type === 'credit' ? (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <ArrowDownLeft className="h-4 w-4" />
                                        <span>Payment In (Credit)</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span>Payment Out (Debit)</span>
                                    </div>
                                )}
                            </SelectValue>
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
                </div>
            </div>

            {selectedClient && (
                <Alert className="bg-muted/50">
                    <Wallet className="h-4 w-4" />
                    <AlertTitle>Current Opening Balance</AlertTitle>
                    <AlertDescription>
                        {balances.find(b => b.clientName === selectedClient) ? (
                            <span className={cn(
                                "font-semibold",
                                balances.find(b => b.clientName === selectedClient)?.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            )}>
                                ${balances.find(b => b.clientName === selectedClient)?.amount.toFixed(2)} ({balances.find(b => b.clientName === selectedClient)?.type})
                            </span>
                        ) : (
                            "No opening balance has been set for this client yet."
                        )}
                    </AlertDescription>
                </Alert>
            )}
            
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
