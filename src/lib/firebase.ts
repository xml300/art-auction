// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET, // This is the important one
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);