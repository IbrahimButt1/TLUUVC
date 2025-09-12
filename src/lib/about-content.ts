'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from '@/lib/storage';

export interface AboutContent {
    title: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'about-content.json');

async function readAboutContent(): Promise<AboutContent> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Could not read about-content.json:", error);
        return {
            title: "",
            paragraph1: "",
            paragraph2: "",
            image: "",
        };
    }
}

async function writeAboutContent(content: AboutContent): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(content, null, 2), 'utf-8');
}

export async function getAboutContent(): Promise<AboutContent> {
    return await readAboutContent();
}

export async function updateAboutContent(prevState: any, formData: FormData) {
    const title = formData.get('title') as string;
    const paragraph1 = formData.get('paragraph1') as string;
    const paragraph2 = formData.get('paragraph2') as string;
    const imageFile = formData.get('imageFile') as File | null;
    const imageRemoved = formData.get('imageRemoved') === 'true';

    
    if (!title || !paragraph1 || !paragraph2) {
        return { message: "", error: "Please fill out all text fields.", success: false };
    }

    const currentContent = await readAboutContent();
    let imageUrl = currentContent.image;
    
    if (imageRemoved) {
        imageUrl = "";
    } else if (imageFile && imageFile.size > 0) {
        try {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
            imageUrl = await uploadImage(dataUri, `about-${Date.now()}`);
        } catch (e) {
             return { message: "", error: "Failed to upload image. Please try again.", success: false };
        }
    }

    const newContent: AboutContent = {
        title,
        paragraph1,
        paragraph2,
        image: imageUrl,
    };

    await writeAboutContent(newContent);
    
    revalidatePath('/');
    revalidatePath('/admin/about');
    
    return { message: "About section updated successfully.", error: null, success: true };
}
