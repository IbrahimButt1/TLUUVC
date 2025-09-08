'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

export interface Email {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    receivedAt: string;
    read: boolean;
    status: 'inbox' | 'trash';
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'emails.json');

async function readEmails(): Promise<Email[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        // Add status to old emails if it doesn't exist
        const emails = JSON.parse(fileContent);
        return emails.map((e: any) => ({ ...e, status: e.status || 'inbox' }));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Could not read emails.json:", error);
        return [];
    }
}

async function writeEmails(emails: Email[]): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(emails, null, 2), 'utf-8');
}

export async function getEmails(): Promise<Email[]> {
    const emails = await readEmails();
    return emails
        .filter(e => e.status === 'inbox')
        .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

export async function getTrashedEmails(): Promise<Email[]> {
    const emails = await readEmails();
    return emails
        .filter(e => e.status === 'trash')
        .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

export async function getUnreadEmailCount(): Promise<number> {
    const emails = await readEmails();
    return emails.filter(email => email.status === 'inbox' && !email.read).length;
}


export async function addEmail(emailData: { name: string; email: string; subject: string, message: string }) {
    const newEmail: Email = {
        id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
        ...emailData,
        receivedAt: new Date().toISOString(),
        read: false,
        status: 'inbox',
    };

    const emails = await readEmails();
    emails.push(newEmail);
    await writeEmails(emails);
    
    revalidatePath('/admin/inbox');
    revalidatePath('/admin');
}

export async function markAllEmailsAsRead() {
    const emails = await readEmails();
    const updatedEmails = emails.map(email => 
        email.status === 'inbox' ? { ...email, read: true } : email
    );
    await writeEmails(updatedEmails);
    revalidatePath('/admin/inbox');
    revalidatePath('/admin');
}

export async function deleteEmail(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    const emails = await readEmails();
    const updatedEmails = emails.map(e => e.id === id ? { ...e, status: 'trash' as const } : e);
    await writeEmails(updatedEmails);
    revalidatePath('/admin/inbox');
    revalidatePath('/admin/inbox/trash');
    revalidatePath('/admin');
}

export async function permanentlyDeleteEmail(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    let emails = await readEmails();
    emails = emails.filter(e => e.id !== id);
    await writeEmails(emails);
    revalidatePath('/admin/inbox/trash');
}

export async function restoreEmail(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    const emails = await readEmails();
    const updatedEmails = emails.map(e => e.id === id ? { ...e, status: 'inbox' as const } : e);
    await writeEmails(updatedEmails);
    revalidatePath('/admin/inbox');
    revalidatePath('/admin/inbox/trash');
    revalidatePath('/admin');
}
