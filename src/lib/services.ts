'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

// Path to the JSON file that acts as our database
const dataPath = path.join(process.cwd(), 'src', 'lib', 'services.json');

// Function to read services from the JSON file
async function readServices(): Promise<Service[]> {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
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
    return await readServices();
}

export async function getServiceById(id: string): Promise<Service | undefined> {
    const services = await readServices();
    return services.find(s => s.id === id);
}

export async function addService(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;

    if (!title || !description || !icon) {
        return;
    }

    const newService: Service = {
        id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        title,
        description,
        icon,
    };

    const services = await readServices();
    services.push(newService);
    await writeServices(services);
    
    // Revalidate all relevant paths
    revalidatePath('/');
    revalidatePath('/admin/services');

    redirect('/admin/services');
}

export async function updateService(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    
    const services = await readServices();
    const serviceIndex = services.findIndex(s => s.id === id);

    if (serviceIndex !== -1) {
        services[serviceIndex] = { ...services[serviceIndex], title, description, icon };
        await writeServices(services);
    }

    // Revalidate all relevant paths
    revalidatePath('/');
    revalidatePath('/admin/services');
    revalidatePath(`/admin/services/edit/${id}`);

    redirect('/admin/services');
}

export async function deleteService(formData: FormData) {
    const id = formData.get('id') as string;
    if (!id) return;
    
    let services = await readServices();
    services = services.filter(s => s.id !== id);
    await writeServices(services);

    // Revalidate all relevant paths
    revalidatePath('/');
    revalidatePath('/admin/services');
    
    redirect('/admin/services');
}
