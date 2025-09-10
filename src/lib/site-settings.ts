'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from './storage';

export interface SiteSettings {
    logo: string;
    username?: string;
    password?: string;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'site-settings.json');

async function readSiteSettings(): Promise<SiteSettings> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const settings = JSON.parse(fileContent);
        // Provide default credentials if they don't exist
        return {
            ...settings,
            username: settings.username || 'admin',
            password: settings.password || 'password'
        };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { 
                logo: 'https://picsum.photos/32/32',
                username: 'admin',
                password: 'password'
            };
        }
        console.error("Could not read site-settings.json:", error);
         return { 
            logo: 'https://picsum.photos/32/32',
            username: 'admin',
            password: 'password'
        };
    }
}

async function writeSiteSettings(settings: SiteSettings): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(settings, null, 2), 'utf-8');
}


export async function getSiteSettings(): Promise<SiteSettings> {
    return await readSiteSettings();
}

export async function updateSiteSettings(prevState: any, formData: FormData) {
    const logoFile = formData.get('logoFile') as File;
    const username = formData.get('username') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    const currentSettings = await readSiteSettings();

    if (newPassword && newPassword !== confirmPassword) {
        return { message: "Passwords do not match." };
    }

    let logoUrl = currentSettings.logo;
    if (logoFile && logoFile.size > 0) {
        const arrayBuffer = await logoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUri = `data:${logoFile.type};base64,${buffer.toString('base64')}`;
        logoUrl = await uploadImage(dataUri, `logo-${Date.now()}`);
    }

    const newSettings: SiteSettings = {
        ...currentSettings,
        logo: logoUrl,
        username: username || currentSettings.username,
        password: newPassword ? newPassword : currentSettings.password,
    };

    await writeSiteSettings(newSettings);
    
    revalidatePath('/');
    revalidatePath('/admin', 'layout');
    
    return { message: 'Settings updated successfully.'}
}

