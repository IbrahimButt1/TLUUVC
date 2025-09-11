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
    avatar?: string;
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
            password: settings.password || 'password',
            avatar: settings.avatar || 'https://picsum.photos/100',
        };
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return { 
                logo: 'https://picsum.photos/32/32',
                username: 'admin',
                password: 'password',
                avatar: 'https://picsum.photos/100',
            };
        }
        console.error("Could not read site-settings.json:", error);
         return { 
            logo: 'https://picsum.photos/32/32',
            username: 'admin',
            password: 'password',
            avatar: 'https://picsum.photos/100',
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
    const logoFile = formData.get('logoFile') as File | null;
    const avatarFile = formData.get('avatarFile') as File | null;
    const username = formData.get('username') as string;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    const currentSettings = await readSiteSettings();

    if (newPassword) {
        if (currentSettings.password !== 'password' && currentPassword !== currentSettings.password) {
            return { message: "", error: "The current password you entered is incorrect.", success: false };
        }
        if (newPassword !== confirmPassword) {
            return { message: "", error: "The new passwords do not match.", success: false };
        }
    } else if (username && username !== currentSettings.username) {
        if (currentSettings.password !== 'password' && currentPassword !== currentSettings.password) {
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

    let avatarUrl = currentSettings.avatar;
    if (avatarFile && avatarFile.size > 0) {
        try {
            const arrayBuffer = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dataUri = `data:${avatarFile.type};base64,${buffer.toString('base64')}`;
            avatarUrl = await uploadImage(dataUri, `avatar-${Date.now()}`);
        } catch (e) {
             return { message: "", error: "Failed to upload the avatar. Please try again.", success: false };
        }
    }

    const newSettings: SiteSettings = {
        ...currentSettings,
        logo: logoUrl,
        avatar: avatarUrl,
        username: username || currentSettings.username,
        password: newPassword ? newPassword : currentSettings.password,
    };

    await writeSiteSettings(newSettings);
    
    revalidatePath('/');
    revalidatePath('/admin', 'layout');
    
    return { message: 'Settings updated successfully.', error: null, success: true }
}
