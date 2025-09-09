'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from './storage';

export interface SiteSettings {
    logo: string;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'site-settings.json');

async function readSiteSettings(): Promise<SiteSettings> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { logo: 'https://picsum.photos/32/32' };
        }
        console.error("Could not read site-settings.json:", error);
        return { logo: 'https://picsum.photos/32/32' };
    }
}

async function writeSiteSettings(settings: SiteSettings): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(settings, null, 2), 'utf-8');
}


export async function getSiteSettings(): Promise<SiteSettings> {
    return await readSiteSettings();
}

export async function updateSiteSettings(formData: FormData) {
    const logoDataUri = formData.get('logo') as string;
    const currentSettings = await readSiteSettings();

    let logoUrl = currentSettings.logo;
    if (logoDataUri && logoDataUri.startsWith('data:image')) {
        logoUrl = await uploadImage(logoDataUri, `logo-${Date.now()}`);
    }

    const newSettings: SiteSettings = {
        ...currentSettings,
        logo: logoUrl,
    };

    await writeSiteSettings(newSettings);
    
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');

    redirect('/admin/settings');
}
