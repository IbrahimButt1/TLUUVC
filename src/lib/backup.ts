
'use server';

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { addLogEntry } from './logs';

const dataFiles = [
    'about-content.json',
    'clients.json',
    'emails.json',
    'hero-images.json',
    'manifest.json',
    'services.json',
    'site-settings.json',
    'testimonials.json',
    'client-balances.json',
    'logs.json'
];

// In a real-world scenario, you would not store backups in the src directory,
// but in a secure, non-public location or a dedicated cloud storage service.
const dataPath = (file: string) => path.join(process.cwd(), 'src', 'lib', file);

export async function getBackupData(): Promise<string> {
    const backupObject: { [key: string]: any } = {};

    for (const file of dataFiles) {
        try {
            const content = await fs.readFile(dataPath(file), 'utf-8');
            backupObject[file] = JSON.parse(content);
        } catch (error) {
            console.warn(`Could not read ${file} for backup, skipping.`);
            backupObject[file] = [];
        }
    }
    
    await addLogEntry('Created Backup', 'A full site backup was downloaded.');
    return JSON.stringify(backupObject, null, 2);
}

export async function restoreBackupData(backupContent: string): Promise<{ success: boolean; error?: string }> {
    let backupObject: { [key: string]: any };

    try {
        backupObject = JSON.parse(backupContent);
    } catch (error) {
        return { success: false, error: 'Invalid backup file. The file is not valid JSON.' };
    }
    
    // Simple validation to check if it looks like one of our backups
    const requiredKey = 'site-settings.json';
    if (!backupObject.hasOwnProperty(requiredKey)) {
        return { success: false, error: `Invalid backup file format. Missing required data: ${requiredKey}`};
    }

    for (const file of dataFiles) {
        if (backupObject.hasOwnProperty(file)) {
            try {
                const contentToWrite = JSON.stringify(backupObject[file], null, 2);
                await fs.writeFile(dataPath(file), contentToWrite, 'utf-8');
            } catch (error) {
                console.error(`Failed to write to ${file} during restore.`, error);
                return { success: false, error: `Error restoring data for ${file}. Restore has been aborted.` };
            }
        } else {
             console.warn(`Backup file is missing data for ${file}. Skipping this file.`);
        }
    }
    
    await addLogEntry('Restored from Backup', 'The site was restored from a backup file.');
    // Revalidate all paths to reflect restored data
    revalidatePath('/', 'layout');

    return { success: true };
}
