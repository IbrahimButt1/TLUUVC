'use server';

import { getStorage } from 'firebase-admin/storage';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import sharp from 'sharp';

function initializeFirebaseApp() {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.warn(
            'Firebase service account key is not set. Image uploads will fall back to data URIs. Please add it to your .env file.'
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
                'Firebase service account key is invalid. Image uploads will fall back to data URIs.'
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
    if (!isFirebaseInitialized || !dataUri.startsWith('data:image')) {
        return dataUri;
    }

    const bucket = getStorage().bucket();
    const mimeType = dataUri.match(/data:(.*);base64,/)![1];
    const base64Data = dataUri.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const file = bucket.file(`images/${filename}.webp`);
    
    await file.save(optimizedBuffer, {
        metadata: {
            contentType: 'image/webp',
        },
        public: true,
    });
    
    return file.publicUrl();
}
