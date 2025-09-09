'use server';

import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

function initializeFirebaseApp() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.warn(
            'Firebase service account key is not set. Image uploads will not work. Please add it to your .env file.'
        );
        return false;
    }
    
    if (getApps().length) {
        return true;
    }

    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        if (!serviceAccount.project_id) {
             console.warn(
                'Firebase service account key is invalid. Image uploads will not work.'
            );
            return false;
        }

        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        return true;
    } catch(error) {
        console.error("Failed to initialize Firebase Admin SDK:", error);
        return false;
    }
}


export async function uploadImage(dataUri: string, filename: string): Promise<string> {
    const isFirebaseInitialized = initializeFirebaseApp();
    if (!isFirebaseInitialized) {
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
