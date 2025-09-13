
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
    status?: 'active' | 'trash';
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
        const clients: Client[] = JSON.parse(fileContent);
        return clients.map(c => ({...c, status: c.status || 'active'}));
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
    const clients = await readClients();
    return clients.filter(c => c.status !== 'trash');
}

export async function getTrashedClients(): Promise<Client[]> {
    const clients = await readClients();
    return clients.filter(c => c.status === 'trash');
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
        status: 'active',
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


export async function deleteClient(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    
    let clients = await readClients();
    const client = clients.find(c => c.id === id);
    if(client) {
        await addLogEntry('Client Moved to Recycle Bin', `Client '${client.name}' was moved to the recycle bin.`);
    }

    clients = clients.map(c => c.id === id ? { ...c, status: 'trash' } : c);
    await writeClients(clients);

    revalidatePath('/admin/client-balances');
    revalidatePath('/admin/manifest/new');
    revalidatePath('/admin/emails/trash');
}

export async function permanentlyDeleteClient(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };
    
    let clients = await readClients();
    const client = clients.find(c => c.id === id);
    clients = clients.filter(c => c.id !== id);
    await writeClients(clients);
    
    if(client) {
        await addLogEntry('Permanently Deleted Client', `Client '${client.name}' was permanently deleted.`);
    }

    revalidatePath('/admin/emails/trash');
    return { success: true };
}


export async function restoreClient(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };
    
    let clients = await readClients();
    const client = clients.find(c => c.id === id);
    if (!client) return { success: false, error: 'Client not found.' };

    clients = clients.map(c => c.id === id ? { ...c, status: 'active' } : c);
    await writeClients(clients);
    
    await addLogEntry('Restored Client', `Client '${client.name}' restored from recycle bin.`);

    revalidatePath('/admin/client-balances');
    revalidatePath('/admin/manifest/new');
    revalidatePath('/admin/emails/trash');
    return { success: true };
}


export async function restoreAllClients(): Promise<{ success: boolean, error?: string }> {
    try {
        let clients = await readClients();
        const restoredCount = clients.filter(c => c.status === 'trash').length;
        clients = clients.map(c => c.status === 'trash' ? { ...c, status: 'active' } : c);
        await writeClients(clients);

        if (restoredCount > 0) {
            await addLogEntry('Bulk Restored Clients', `Restored ${restoredCount} clients from the recycle bin.`);
        }

        revalidatePath('/admin/client-balances');
        revalidatePath('/admin/manifest/new');
        revalidatePath('/admin/emails/trash');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to restore all clients." };
    }
}
