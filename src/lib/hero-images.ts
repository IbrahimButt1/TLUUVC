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
    status?: 'active' | 'trash';
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'hero-images.json');

async function readHeroImages(): Promise<HeroImage[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const images = JSON.parse(fileContent);
        return images.map((img: any) => ({ ...img, status: img.status || 'active' }));
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
    const images = await readHeroImages();
    return images.filter(img => img.status === 'active');
}

export async function getTrashedHeroImages(): Promise<HeroImage[]> {
    const images = await readHeroImages();
    return images.filter(img => img.status === 'trash');
}

export async function getPaginatedHeroImages(page: number, limit: number) {
    const allImages = await getHeroImages();
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const images = allImages.slice(startIndex, endIndex);
    return {
        images,
        totalCount: allImages.length
    }
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
    const imageRemoved = formData.get('imageRemoved') === 'true';

    
    if (!title || !description) {
        return;
    }
    
    let imageUrl = 'https://picsum.photos/1920/1080';
    if (imageRemoved) {
        imageUrl = "";
    } else if (imageDataUri) {
        imageUrl = await uploadImage(imageDataUri, `hero-${Date.now()}`);
    }

    const newImage: HeroImage = {
        id: generateId(title),
        title,
        description,
        image: imageUrl,
        status: 'active',
    };

    const images = await readHeroImages();
    images.unshift(newImage);
    await writeHeroImages(images);
    
    revalidatePath('/');
    revalidatePath('/admin/hero');

    redirect('/admin/hero');
}


export async function updateHeroImage(imageDataUri: string, formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageRemoved = formData.get('imageRemoved') === 'true';

    const images = await readHeroImages();
    const imageIndex = images.findIndex(s => s.id === id);

    if (imageIndex !== -1) {
        let imageUrl = images[imageIndex].image;
        if (imageRemoved) {
            imageUrl = "";
        } else if (imageDataUri && imageDataUri.startsWith('data:image')) {
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
    images = images.map(img => img.id === id ? { ...img, status: 'trash' } : img);
    await writeHeroImages(images);

    revalidatePath('/');
    revalidatePath('/admin/hero');
    revalidatePath('/admin/inbox/trash');
}

export async function permanentlyDeleteHeroImage(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };
    
    let images = await readHeroImages();
    images = images.filter(img => img.id !== id);
    await writeHeroImages(images);

    revalidatePath('/admin/inbox/trash');
    return { success: true };
}

export async function restoreHeroImage(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };

    let images = await readHeroImages();
    images = images.map(img => img.id === id ? { ...img, status: 'active' } : img);
    await writeHeroImages(images);

    revalidatePath('/');
    revalidatePath('/admin/hero');
    revalidatePath('/admin/inbox/trash');
    return { success: true };
}
