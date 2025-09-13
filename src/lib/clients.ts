
'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import type { ManifestEntry } from './manifest';
import { addLogEntry } from './logs';

export interface Client {
    id: string;
    name: string;
    createdAt: string;
}

export type AddClientState = {
    success: boolean;
    error?: string;
    message?: string;
}

const clientsDataPath = path.join(process.cwd(), 'src', 'lib', 'clients.json');
const manifestDataPath = path.join(process.cwd(), 'src', 'lib', 'manifest.json');

async function readClients(): Promise<Client[]> {
    try {
        const fileContent = await fs.readFile(clientsDataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Could not read clients.json:", error);
        return [];
    }
}

async function writeClients(clients: Client[]): Promise<void> {
    await fs.writeFile(clientsDataPath, JSON.stringify(clients, null, 2), 'utf-8');
}

async function readManifestEntries(): Promise<ManifestEntry[]> {
     try {
        const fileContent = await fs.readFile(manifestDataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

async function writeManifestEntries(entries: ManifestEntry[]): Promise<void> {
    await fs.writeFile(manifestDataPath, JSON.stringify(entries, null, 2), 'utf-8');
}

export async function getClients(): Promise<Client[]> {
    return await readClients();
}

export async function addClient(prevState: any, formData: FormData): Promise<AddClientState> {
    const name = formData.get('clientName') as string;
    const amountStr = formData.get('amount') as string;
    const type = formData.get('type') as 'credit' | 'debit';
    const amount = amountStr ? parseFloat(amountStr) : null;

    if (!name) {
        return { success: false, error: 'Please enter a client name.' };
    }

    const clients = await readClients();
    if (clients.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, error: 'A client with this name already exists.' };
    }

    const newClient: Client = {
        id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
        name,
        createdAt: new Date().toISOString(),
    };
    
    clients.push(newClient);

    try {
        await writeClients(clients);
        await addLogEntry('Client Added', `New client created: '${name}'.`);

        // If an opening balance was provided, create a manifest entry for it
        if (amount !== null && !isNaN(amount)) {
            const manifestEntries = await readManifestEntries();
            const newEntry: ManifestEntry = {
                id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
                clientName: name,
                date: new Date().toISOString().split('T')[0],
                description: 'Client Opening Balance',
                type,
                amount,
                status: 'active',
            };
            manifestEntries.push(newEntry);
            await writeManifestEntries(manifestEntries);
            await addLogEntry('Opening Balance Set', `Opening balance for '${name}' set to $${amount.toFixed(2)} (${type}).`);
        }

        revalidatePath('/admin/client-balances');
        revalidatePath('/admin/manifest');
        return { success: true, message: `Client '${name}' has been added successfully.` };
    } catch (error) {
        return { success: false, error: 'Failed to save the new client. Please try again.' };
    }
}
