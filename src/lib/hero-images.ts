'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from '@/lib/storage';

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

export async function getHeroImageById(id: string): Promise<HeroImage | undefined> {
    const images = await readHeroImages();
    return images.find(s => s.id === id);
}

function generateId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function addHeroImage(imageDataUri: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    if (!title || !description || !imageDataUri) {
        return;
    }

    const imageUrl = await uploadImage(imageDataUri, `hero-${Date.now()}`);

    const newImage: HeroImage = {
        id: generateId(title),
        title,
        description,
        image: imageUrl,
    };

    const images = await readHeroImages();
    images.push(newImage);
    await writeHeroImages(images);
    
    revalidatePath('/');
    revalidatePath('/admin/hero');

    redirect('/admin/hero');
}


export async function updateHeroImage(imageDataUri: string, formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    const images = await readHeroImages();
    const imageIndex = images.findIndex(s => s.id === id);

    if (imageIndex !== -1) {
        let imageUrl = images[imageIndex].image;
        if (imageDataUri && imageDataUri.startsWith('data:image')) {
            imageUrl = await uploadImage(imageDataUri, `hero-${Date.now()}`);
        }
        images[imageIndex] = { ...images[imageIndex], title, description, image: imageUrl };
        await writeHeroImages(images);
    }

    revalidatePath('/');
    revalidatePath('/admin/hero');
    revalidatePath(`/admin/hero/edit/${id}`);

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
