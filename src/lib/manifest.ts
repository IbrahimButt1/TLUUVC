'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export interface ManifestEntry {
    id: string;
    clientName: string;
    date: string;
    description: string;
    type: 'credit' | 'debit';
    amount: number;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'manifest.json');

async function readManifestEntries(): Promise<ManifestEntry[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
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

export async function addManifestEntry(formData: FormData) {
    const clientName = formData.get('clientName') as string;
    const date = formData.get('date') as string;
    let description = formData.get('description') as string;
    const otherDescription = formData.get('otherDescription') as string;
    const notes = formData.get('notes') as string;
    const type = formData.get('type') as 'credit' | 'debit';
    const amount = parseFloat(formData.get('amount') as string);
    
    let finalDescription = description === 'Other' ? otherDescription : description;
    if (notes) {
        finalDescription = `${finalDescription} - ${notes}`;
    }


    if (!clientName || !date || !finalDescription || !type || isNaN(amount)) {
        // Simple validation
        return;
    }

    const newEntry: ManifestEntry = {
        id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
        clientName,
        date,
        description: finalDescription,
        type,
        amount,
    };

    const entries = await readManifestEntries();
    entries.push(newEntry);
    await writeManifestEntries(entries);
    
    revalidatePath('/admin/manifest');
    redirect('/admin/manifest');
}