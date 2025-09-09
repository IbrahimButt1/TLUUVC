'use server';

import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.warn(
      'Firebase service account key is not set. Image uploads will not work. Please add it to your .env file.'
    );
}

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) 
    : {};

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

export async function uploadImage(dataUri: string, filename: string): Promise<string> {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        // Return a placeholder if Firebase is not configured
        return 'https://picsum.photos/800/800';
    }

    const bucket = getStorage().bucket();
    const mimeType = dataUri.match(/data:(.*);base64,/)![1];
    const base64Data = dataUri.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const file = bucket.file(`images/${filename}`);
    
    await file.save(buffer, {
        metadata: {
            contentType: mimeType,
        },
        public: true, // Make the file publicly accessible
    });
    
    return file.publicUrl();
}
