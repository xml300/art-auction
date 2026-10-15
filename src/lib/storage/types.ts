import { FileCategory, FileRecord } from "@/types";

export interface SaveFileInput {
  userId: number;
  category: FileCategory;
  originalFilename: string;
  mimeType: string;
  buffer: Buffer;
  entityType?: string;
  entityId?: number;
}

export interface StoredFileRecord {
  id: number;
  storageKey: string;
  publicUrl: string | null;
  category: FileCategory;
  accessLevel: "public" | "private" | "confidential";
  mimeType: string;
  sizeBytes: number;
  originalFilename: string;
  createdAt: Date;
}

export type ReadTarget =
  | {
      type: "redirect";
      url: string;
    }
  | {
      type: "stream";
      stream: NodeJS.ReadableStream;
      mimeType: string;
      sizeBytes: number;
      filename: string;
      isPrivate: boolean;
    };

export interface IStorageService {
  saveFile(input: SaveFileInput): Promise<StoredFileRecord>;
  getReadTarget(fileId: number, requestingUserId: number, isAdmin?: boolean): Promise<ReadTarget>;
  deleteFile(fileId: number, requestingUserId: number, isAdmin?: boolean): Promise<boolean>;
  getFile(fileId: number): Promise<FileRecord | undefined>;
}

export const ALLOWED_MIME_TYPES: Record<FileCategory, string[]> = {
  avatar: ["image/jpeg", "image/png", "image/webp"],
  artwork_image: ["image/jpeg", "image/png", "image/webp"],
  artwork_document: ["application/pdf", "image/jpeg", "image/png", "image/tiff"],
  kyc_document: ["application/pdf", "image/jpeg", "image/png"],
  transaction_receipt: ["application/pdf", "image/jpeg", "image/png"],
};

export const MAX_FILE_SIZES: Record<FileCategory, number> = {
  avatar: 5 * 1024 * 1024,            // 5MB
  artwork_image: 25 * 1024 * 1024,    // 25MB
  artwork_document: 20 * 1024 * 1024, // 20MB
  kyc_document: 10 * 1024 * 1024,     // 10MB
  transaction_receipt: 10 * 1024 * 1024, // 10MB
};

export const PRIVATE_CATEGORIES: Set<FileCategory> = new Set([
  "artwork_document",
  "kyc_document",
  "transaction_receipt",
]);
