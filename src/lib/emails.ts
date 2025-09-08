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
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'emails.json');

async function readEmails(): Promise<Email[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
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
    // Sort emails by received date, newest first
    return emails.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
}

export async function addEmail(emailData: { name: string; email: string; subject: string, message: string }) {
    const newEmail: Email = {
        id: `${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`,
        ...emailData,
        receivedAt: new Date().toISOString(),
    };

    const emails = await readEmails();
    emails.push(newEmail);
    await writeEmails(emails);
    
    revalidatePath('/admin/inbox');
}
