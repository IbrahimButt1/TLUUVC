'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from './storage';

export interface Testimonial {
    id: string;
    name: string;
    destination: string;
    testimonial: string;
    image: string;
    role?: string;
    country?: string;
    status?: 'active' | 'trash';
}

const dataPath = path.join(process.cwd(), 'src', 'lib', 'testimonials.json');

async function readTestimonials(): Promise<Testimonial[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const testimonials = JSON.parse(fileContent);
        return testimonials.map((t: any) => ({ ...t, status: t.status || 'active' }));
    } catch (error) {
        console.error("Could not read testimonials.json:", error);
        return [];
    }
}

async function writeTestimonials(testimonials: Testimonial[]): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(testimonials, null, 2), 'utf-8');
}

export async function getTestimonials(): Promise<Testimonial[]> {
    const testimonials = await readTestimonials();
    return testimonials.filter(t => t.status === 'active');
}

export async function getTrashedTestimonials(): Promise<Testimonial[]> {
    const testimonials = await readTestimonials();
    return testimonials.filter(t => t.status === 'trash');
}

export async function getTestimonialById(id: string): Promise<Testimonial | undefined> {
    const testimonials = await readTestimonials();
    return testimonials.find(t => t.id === id);
}

function generateId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function addTestimonial(imageDataUri: string, formData: FormData) {
    const name = formData.get('name') as string;
    const destination = formData.get('destination') as string;
    const testimonial = formData.get('testimonial') as string;
    const role = formData.get('role') as string;
    const country = formData.get('country') as string;

    if (!name || !destination || !testimonial || !role || !country) {
        return;
    }

    let imageUrl = 'https://picsum.photos/100/100';
    if (imageDataUri) {
        imageUrl = await uploadImage(imageDataUri, `testimonial-${Date.now()}`);
    }

    const newTestimonial: Testimonial = {
        id: generateId(name),
        name,
        destination,
        testimonial,
        image: imageUrl,
        role,
        country,
        status: 'active',
    };

    const testimonials = await readTestimonials();
    testimonials.push(newTestimonial);
    await writeTestimonials(testimonials);
    
    revalidatePath('/');
    revalidatePath('/admin/testimonials');

    redirect('/admin/testimonials');
}

export async function updateTestimonial(imageDataUri: string, formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const destination = formData.get('destination') as string;
    const testimonial = formData.get('testimonial') as string;
    const role = formData.get('role') as string;
    const country = formData.get('country') as string;
    
    const testimonials = await readTestimonials();
    const testimonialIndex = testimonials.findIndex(t => t.id === id);

    if (testimonialIndex !== -1) {
        let imageUrl = testimonials[testimonialIndex].image;
        if (imageDataUri && imageDataUri.startsWith('data:image')) {
            imageUrl = await uploadImage(imageDataUri, `testimonial-${Date.now()}`);
        }
        testimonials[testimonialIndex] = { ...testimonials[testimonialIndex], id, name, destination, testimonial, image: imageUrl, role, country };
        await writeTestimonials(testimonials);
    }

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    revalidatePath(`/admin/testimonials/edit/${id}`);

    redirect('/admin/testimonials');
}

export async function deleteTestimonial(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    
    let testimonials = await readTestimonials();
    testimonials = testimonials.map(t => t.id === id ? { ...t, status: 'trash' } : t);
    await writeTestimonials(testimonials);

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    revalidatePath('/admin/inbox/trash');
}


export async function permanentlyDeleteTestimonial(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };

    let testimonials = await readTestimonials();
    testimonials = testimonials.filter(t => t.id !== id);
    await writeTestimonials(testimonials);

    revalidatePath('/admin/inbox/trash');
    return { success: true };
}

export async function restoreTestimonial(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };

    let testimonials = await readTestimonials();
    testimonials = testimonials.map(t => t.id === id ? { ...t, status: 'active' } : t);
    await writeTestimonials(testimonials);

    revalidatePath('/');
    revalidatePath('/admin/testimonials');
    revalidatePath('/admin/inbox/trash');
    return { success: true };
}
