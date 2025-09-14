'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { uploadImage } from '@/lib/storage';
import { addLogEntry } from './logs';

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

export async function addService(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    const longDescription = formData.get('longDescription') as string;
    const requirementsRaw = formData.get('requirements') as string;
    const imageFile = formData.get('imageFile') as File | null;
    const imageRemoved = formData.get('imageRemoved') === 'true';

    if (!title || !description || !icon) {
        return;
    }
    
    let imageUrl = 'https://picsum.photos/800/600';
    if(imageRemoved) {
        imageUrl = "";
    } else if (imageFile && imageFile.size > 0) {
        try {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const dataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
            imageUrl = await uploadImage(dataUri, `service-${Date.now()}`);
        } catch (e) {
             // Handle upload error if necessary
             console.error("Image upload failed:", e);
        }
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
    
    await addLogEntry('Created Service', `New service added: '${title}'.`);
    
    revalidatePath('/');
    revalidatePath('/admin/services');

    redirect('/admin/services');
}

export async function updateService(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    const longDescription = formData.get('longDescription') as string;
    const requirementsRaw = formData.get('requirements') as string;
    const imageFile = formData.get('imageFile') as File | null;
    const imageRemoved = formData.get('imageRemoved') === 'true';
    
    const services = await readServices();
    const serviceIndex = services.findIndex(s => s.id === id);

    if (serviceIndex !== -1) {
        let imageUrl = services[serviceIndex].image;
         if (imageRemoved) {
            imageUrl = "";
        } else if (imageFile && imageFile.size > 0) {
            try {
                const arrayBuffer = await imageFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const dataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
                imageUrl = await uploadImage(dataUri, `service-${Date.now()}`);
            } catch (e) {
                // Handle upload error if necessary
                console.error("Image upload failed:", e);
            }
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

    await addLogEntry('Updated Service', `Service updated: '${title}'.`);

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
    const service = services.find(s => s.id === id);
    if (service) {
        await addLogEntry('Deleted Service', `Service moved to recycle bin: '${service.title}'.`);
    }

    services = services.map(s => s.id === id ? { ...s, status: 'trash' } : s);
    await writeServices(services);

    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath('/admin/emails/trash');
}


export async function permanentlyDeleteService(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };

    let services = await readServices();
    const service = services.find(s => s.id === id);
    services = services.filter(s => s.id !== id);
    await writeServices(services);

    if (service) {
        await addLogEntry('Permanently Deleted Service', `Service permanently deleted: '${service.title}'.`);
    }

    revalidatePath('/admin/emails/trash');
    return { success: true };
}

export async function restoreService(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const id = formData.get('id') as string;
    if (!id) return { success: false, error: 'ID not provided' };
    
    let services = await readServices();
    const service = services.find(s => s.id === id);
    services = services.map(s => s.id === id ? { ...s, status: 'active' } : s);
    await writeServices(services);

    if (service) {
        await addLogEntry('Restored Service', `Service restored from recycle bin: '${service.title}'.`);
    }

    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath('/admin/emails/trash');
    return { success: true };
}

export async function restoreAllServices(): Promise<{ success: boolean, error?: string }> {
    try {
        let services = await readServices();
        const restoredCount = services.filter(s => s.status === 'trash').length;
        services = services.map(s => s.status === 'trash' ? { ...s, status: 'active' } : s);
        await writeServices(services);

        if (restoredCount > 0) {
            await addLogEntry('Bulk Restored Services', `Restored ${restoredCount} services from the recycle bin.`);
        }

        revalidatePath('/');
        revalidatePath('/admin/services');
        revalidatePath('/admin/emails/trash');
        return { success: true };
    } catch (e) {
        return { success: false, error: "Failed to restore all services." };
    }
}
