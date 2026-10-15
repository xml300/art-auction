import { IStorageService } from "./types";
import { LocalStorageService } from "./localStorageService";
import { GCSStorageService } from "./gcsStorageService";

let storageInstance: IStorageService | null = null;

export function getStorageService(): IStorageService {
  if (storageInstance) return storageInstance;

  const provider = (
    process.env.STORAGE_PROVIDER ||
    (process.env.NODE_ENV === "production" ? "gcs" : "local")
  ).toLowerCase();

  if (provider === "gcs") {
    storageInstance = new GCSStorageService();
  } else {
    storageInstance = new LocalStorageService();
  }

  return storageInstance;
}

export * from "./types";
export * from "./validation";
