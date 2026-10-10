import * as admin from 'firebase-admin';

export function getAdminStorage(): admin.storage.Storage | null {
  if (!admin.apps.length && process.env.ACCOUNT_KEY) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.ACCOUNT_KEY)),
        storageBucket: process.env.STORAGE_BUCKET,
      });
    } catch (error) {
      console.error('Firebase Admin initialization error', error);
      return null;
    }
  }

  if (!admin.apps.length) {
    return null;
  }

  return admin.storage();
}

export const adminStorage = {
  bucket: (name?: string) => {
    const storage = getAdminStorage();
    if (!storage) {
      throw new Error("Firebase Admin Storage is not configured. Please set ACCOUNT_KEY.");
    }
    return storage.bucket(name);
  }
};
