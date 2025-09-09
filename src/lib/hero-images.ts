'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export interface HeroImage {
    id: string;
    title: string;
    description: string;
    image: string;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'hero-images.json');

async function readHeroImages(): Promise<HeroImage[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Could not read hero-images.json:", error);
        return [];
    }
}

async function writeHeroImages(images: HeroImage[]): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(images, null, 2), 'utf-8');
}


export async function getHeroImages(): Promise<HeroImage[]> {
    return await readHeroImages();
}

function generateId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function addHeroImage(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    
    if (!title || !description || !image) {
        return;
    }

    const newImage: HeroImage = {
        id: generateId(title),
        title,
        description,
        image,
    };

    const images = await readHeroImages();
    images.push(newImage);
    await writeHeroImages(images);
    
    revalidatePath('/');
    revalidatePath('/admin/hero');

    redirect('/admin/hero');
}

export async function deleteHeroImage(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    
    let images = await readHeroImages();
    images = images.filter(s => s.id !== id);
    await writeHeroImages(images);

    revalidatePath('/');
    revalidatePath('/admin/hero');
    
    redirect('/admin/hero');
}
