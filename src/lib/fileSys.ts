import { adminStorage } from "./firebaseAdmin";

const storageClient = adminStorage; 

export async function writeFile(file: File, path: string) {
  if (!file) return null;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const blob = storageClient.bucket().file(`${path}/${file.name}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.type,
    },
  });

  return new Promise<Error | string | undefined>((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error("Error uploading file:", err);
      reject(err);
    });

    blobStream.on('finish', async () => {
      console.log('Uploaded a blob or file!');
      resolve((await blob.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', 
      })).at(0));
    });

    blobStream.end(fileBuffer);
  });
}

export async function readFile(filePath: string) {
  const file = storageClient.bucket().file(filePath);
  try {
    const [exists] = await file.exists();
    if (!exists) {
      console.warn('File does not exist at path:', filePath);
      return null;
    }

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',  
    });
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error getting download URL:", error); 
    if (error instanceof Error && error.message.includes('unauthorized')) {
      console.warn('User does not have permission to access this file.');
    }
    return null;
  }
}
