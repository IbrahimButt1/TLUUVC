'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface Service {
    id: string;
    title: string;
    description: string;
}

// This is mock data. In a real application, you would use a database.
let services: Service[] = [
    {
      id: "student-visas",
      title: "Student Visas",
      description: "Comprehensive guidance for students aspiring to study abroad, from application to approval."
    },
    {
      id: "work-visas",
      title: "Work Visas",
      description: "Tailored support for professionals seeking employment opportunities in a new country."
    },
    {
      id: "family-partner-visas",
      title: "Family & Partner Visas",
      description: "Helping you reunite with your loved ones through dedicated family and partner visa services."
    },
    {
      id: "application-review",
      title: "Application Review",
      description: "Meticulous review of your visa application to maximize your chances of success."
    }
];

export async function getServices(): Promise<Service[]> {
    return Promise.resolve(services);
}

export async function getServiceById(id: string): Promise<Service | undefined> {
    return Promise.resolve(services.find(s => s.id === id));
}

export async function addService(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!title || !description) {
        return;
    }

    const newService: Service = {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        description,
    };

    services.push(newService);
    
    // Revalidate all relevant paths
    revalidatePath('/');
    revalidatePath('/admin/services');

    redirect('/admin/services');
}

export async function updateService(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex !== -1) {
        services[serviceIndex] = { ...services[serviceIndex], title, description };
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
    services = services.filter(s => s.id !== id);

    // Revalidate all relevant paths
    revalidatePath('/');
    revalidatePath('/admin/services');
    
    redirect('/admin/services');
}
