// Import the functions you need
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// Import your storage instance
import { storage } from "./firebase"; // Adjust the path as needed
import { FirebaseError } from "firebase/app";


export async function writeFile(file: File) {
  if (!file) return;
  const storageRef = ref(storage, `json/${file.name}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded a blob or file!', snapshot);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function readFile(filePath: string) {
  const fileRef = ref(storage, filePath);
  
  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    // Handle any errors
    console.error("Error getting download URL:", error);
    
    // A common error is 'storage/object-not-found'
    if ((error as FirebaseError).code === 'storage/object-not-found') {
      console.warn('File does not exist at path:', filePath);
    }
    // Another common error is 'storage/unauthorized'
    if ((error as FirebaseError).code === 'storage/unauthorized') {
      console.warn('User does not have permission to access this file.');
    }
    
    return null;
  }
}