
'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { ManifestEntry } from './manifest';
import { addLogEntry } from './logs';

export interface ClientBalance {
    clientName: string;
    amount: number;
    type: 'credit' | 'debit';
}

export interface Client {
    name: string;
}

const manifestDataPath = path.join(process.cwd(), 'src', 'lib', 'manifest.json');
const balancesDataPath = path.join(process.cwd(), 'src', 'lib', 'client-balances.json');


async function readManifestEntries(): Promise<ManifestEntry[]> {
    try {
        const fileContent = await fs.readFile(manifestDataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function getUniqueClients(): Promise<Client[]> {
    const entries = await readManifestEntries();
    const uniqueNames = [...new Set(entries.map(entry => entry.clientName))];
    return uniqueNames.map(name => ({ name }));
}

async function readClientBalances(): Promise<ClientBalance[]> {
    try {
        const fileContent = await fs.readFile(balancesDataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return []; // If file doesn't exist, return empty array
        }
        console.error("Could not read client-balances.json:", error);
        return [];
    }
}

async function writeClientBalances(balances: ClientBalance[]): Promise<void> {
    await fs.writeFile(balancesDataPath, JSON.stringify(balances, null, 2), 'utf-8');
}

export async function getClientBalances(): Promise<ClientBalance[]> {
    return await readClientBalances();
}

export async function updateClientBalance(
    prevState: any,
    formData: FormData
): Promise<{ success: boolean; error?: string; message?: string }> {
    const clientName = formData.get('clientName') as string;
    const amountStr = formData.get('amount') as string;
    const type = formData.get('type') as 'credit' | 'debit';
    const amount = parseFloat(amountStr);

    if (!clientName) {
        return { success: false, error: 'Please select a client.' };
    }
     if (!type || isNaN(amount)) {
        return { success: false, error: 'Invalid amount or balance type provided.' };
    }

    const balances = await readClientBalances();
    const clientIndex = balances.findIndex(b => b.clientName === clientName);

    const newBalance: ClientBalance = { clientName, amount, type };

    if (clientIndex !== -1) {
        balances[clientIndex] = newBalance;
    } else {
        balances.push(newBalance);
    }

    try {
        await writeClientBalances(balances);
        await addLogEntry('Updated Client Balance', `Opening balance for '${clientName}' set to $${amount.toFixed(2)} (${type}).`);
        revalidatePath('/admin/client-balances');
        return { success: true, message: `Opening balance for ${clientName} has been saved successfully.` };
    } catch (error) {
        return { success: false, error: 'Failed to save the opening balance. Please try again.' };
    }
}
