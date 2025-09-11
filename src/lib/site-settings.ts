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

export type UpdateSettingsState = {
    message: string;
    error: string | null;
    success: boolean;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'site-settings.json');

async function readSiteSettings(): Promise<SiteSettings> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const settings = JSON.parse(fileContent);
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

export async function updateSiteSettings(prevState: UpdateSettingsState, formData: FormData): Promise<UpdateSettingsState> {
    const logoFile = formData.get('logoFile') as File;
    const username = formData.get('username') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    const currentSettings = await readSiteSettings();
    let requiresPasswordCheck = !!(username && username !== currentSettings.username) || (logoFile && logoFile.size > 0) || !!newPassword;

    // Check if password change is intended
    if (newPassword) {
        if (!currentPassword) {
            return { message: "", error: "Please enter your current password to set a new one.", success: false };
        }
        if (currentPassword !== currentSettings.password) {
            return { message: "", error: "The current password you entered is incorrect.", success: false };
        }
        if (newPassword !== confirmPassword) {
            return { message: "", error: "The new passwords do not match.", success: false };
        }
    } else if (requiresPasswordCheck && currentPassword !== currentSettings.password) {
        // If other fields are changed, we still need to verify the user.
        // But only if a current password was entered. If it's blank, maybe they don't know it.
        // Let's only error if they provide an *incorrect* one.
        if (currentPassword) {
           return { message: "", error: "The current password you entered is incorrect.", success: false };
        }
    }


    let logoUrl = currentSettings.logo;
    if (logoFile && logoFile.size > 0) {
        try {
            const arrayBuffer = await logoFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dataUri = `data:${logoFile.type};base64,${buffer.toString('base64')}`;
            logoUrl = await uploadImage(dataUri, `logo-${Date.now()}`);
        } catch (e) {
             return { message: "", error: "Failed to upload the logo. Please try again.", success: false };
        }
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
    
    return { message: 'Settings updated successfully.', error: null, success: true }
}
