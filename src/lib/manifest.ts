'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { addLogEntry } from './logs';
import { getClients } from './clients';

export interface ManifestEntry {
    id: string;
    clientId: string;
    clientName: string;
    date: string;
    description: string;
    type: 'credit' | 'debit';
    amount: number;
    status: 'active' | 'inactive';
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'manifest.json');

async function readManifestEntries(): Promise<ManifestEntry[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const entries = JSON.parse(fileContent);
        // Add status to old entries if it doesn't exist
        return entries.map((e: any) => ({ ...e, status: e.status || 'active' }));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Could not read manifest.json:", error);
        return [];
    }
}

async function writeManifestEntries(entries: ManifestEntry[]): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(entries, null, 2), 'utf-8');
}

export async function getManifestEntries(): Promise<ManifestEntry[]> {
    const entries = await readManifestEntries();
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getManifestAsJson(): Promise<string> {
    const entries = await getManifestEntries();
    return JSON.stringify(entries, null, 2);
}

export async function getManifestEntriesByClientId(clientId: string): Promise<ManifestEntry[]> {
    const entries = await getManifestEntries();
    return entries.filter(entry => entry.clientId === clientId);
}


export async function addManifestEntry(formData: FormData) {
    const clientId = formData.get('clientId') as string;
    const date = formData.get('date') as string;
    let description = formData.get('description') as string;
    const otherDescription = formData.get('otherDescription') as string;
    const type = formData.get('type') as 'credit' | 'debit';
    const amount = parseFloat(formData.get('amount') as string);
    
    let finalDescription = description === 'Other' ? otherDescription : description;

    if (!clientId || !date || !finalDescription || !type || isNaN(amount)) {
        // Simple validation
        return;
    }

    const clients = await getClients();
    const client = clients.find(c => c.id === clientId);

    if (!client) {
        // This should not happen if the form is working correctly
        return;
    }

    const newEntry: ManifestEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        clientId,
        clientName: client.name,
        date,
        description: finalDescription,
        type,
        amount,
        status: 'active',
    };

    const entries = await readManifestEntries();
    entries.unshift(newEntry);
    await writeManifestEntries(entries);
    
    await addLogEntry('Created Manifest Entry', `New ${type} entry of $${amount.toFixed(2)} for '${client.name}'.`);
    
    revalidatePath('/admin/manifest');
    revalidatePath('/admin/ledger');
    redirect('/admin/manifest');
}

export async function closeOutManifestEntries(): Promise<ManifestEntry[]> {
    const allEntries = await readManifestEntries();
    const closedEntries: ManifestEntry[] = [];
    
    const updatedEntries = allEntries.map(entry => {
        if (entry.status === 'active') {
            closedEntries.push({ ...entry, status: 'inactive' });
            return { ...entry, status: 'inactive' as const };
        }
        return entry;
    });

    await writeManifestEntries(updatedEntries);

    if (closedEntries.length > 0) {
        await addLogEntry('Closed Out Records', `Marked ${closedEntries.length} active transaction(s) as inactive.`);
    }

    revalidatePath('/admin/manifest');
    revalidatePath('/admin/ledger', 'layout');

    return closedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function flushManifestEntries(): Promise<void> {
    const entries = await readManifestEntries();
    const activeCount = entries.filter(e => e.status === 'active').length;
    await writeManifestEntries([]);
    if (activeCount > 0) {
       await addLogEntry('Flushed Records', `Permanently deleted ${activeCount} active transaction(s).`);
    }
    revalidatePath('/admin/manifest');
    revalidatePath('/admin/ledger', 'layout');
}