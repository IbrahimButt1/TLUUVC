'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from '@/lib/storage';

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    longDescription?: string;
    requirements?: string[];
    image?: string;
    status?: 'active' | 'trash';
}

export interface ServiceTitle {
    id: string;
    title: string;
}

// Path to the JSON file that acts as our database
const dataPath = path.join(process.cwd(), 'src', 'lib', 'services.json');

// Function to read services from the JSON file
async function readServices(): Promise<Service[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const services = JSON.parse(fileContent);
        return services.map((s: any) => ({ ...s, status: s.status || 'active' }));
    } catch (error) {
        // If the file doesn't exist or is empty, return an empty array
        console.error("Could not read services.json:", error);
        return [];
    }
}

// Function to write services to the JSON file
async function writeServices(services: Service[]): Promise<void> {
    await fs.writeFile(dataPath, JSON.stringify(services, null, 2), 'utf-8');
}


export async function getServices(): Promise<Service[]> {
    const services = await readServices();
    return services.filter(s => s.status === 'active');
}

export async function getServiceTitles(): Promise<ServiceTitle[]> {
    const services = await getServices();
    return services.map(s => ({ id: s.id, title: s.title }));
}

export async function getTrashedServices(): Promise<Service[]> {
    const services = await readServices();
    return services.filter(s => s.status === 'trash');
}

export async function getServiceById(id: string): Promise<Service | undefined> {
    const services = await readServices();
    return services.find(s => s.id === id);
}

function generateId(title: string): string {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export async function addService(imageDataUri: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    const longDescription = formData.get('longDescription') as string;
    const requirementsRaw = formData.get('requirements') as string;

    if (!title || !description || !icon) {
        return;
    }
    
    let imageUrl = 'https://picsum.photos/800/600';
    if (imageDataUri) {
        imageUrl = await uploadImage(imageDataUri, `service-${Date.now()}`);
    }

    const newService: Service = {
        id: generateId(title),
        title,
        description,
        icon,
        longDescription,
        requirements: requirementsRaw.split('\n').filter(req => req.trim() !== ''),
        image: imageUrl,
        status: 'active',
    };

    const services = await readServices();
    services.push(newService);
    await writeServices(services);
    
    revalidatePath('/');
    revalidatePath('/admin/services');

    redirect('/admin/services');
}

export async function updateService(imageDataUri: string, formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    const longDescription = formData.get('longDescription') as string;
    const requirementsRaw = formData.get('requirements') as string;
    
    const services = await readServices();
    const serviceIndex = services.findIndex(s => s.id === id);

    if (serviceIndex !== -1) {
        let imageUrl = services[serviceIndex].image;
        if (imageDataUri && imageDataUri.startsWith('data:image')) {
            imageUrl = await uploadImage(imageDataUri, `service-${Date.now()}`);
        }
        
        services[serviceIndex] = { 
            ...services[serviceIndex], 
            title, 
            description, 
            icon,
            longDescription,
            requirements: requirementsRaw.split('\n').filter(req => req.trim() !== ''),
            image: imageUrl,
        };
        await writeServices(services);
    }

    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath(`/admin/services/edit/${id}`);
    revalidatePath(`/services/${id}`);

    redirect('/admin/services');
}

export async function deleteService(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    
    let services = await readServices();
    services = services.map(s => s.id === id ? { ...s, status: 'trash' } : s);
    await writeServices(services);

    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath('/admin/inbox/trash');
}


export async function permanentlyDeleteService(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };

    let services = await readServices();
    services = services.filter(s => s.id !== id);
    await writeServices(services);

    revalidatePath('/admin/inbox/trash');
    return { success: true };
}

export async function restoreService(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };

    let services = await readServices();
    services = services.map(s => s.id === id ? { ...s, status: 'active' } : s);
    await writeServices(services);

    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath('/admin/inbox/trash');
    return { success: true };
}
