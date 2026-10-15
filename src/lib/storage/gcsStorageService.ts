import path from "path";
import crypto from "crypto";
import { adminStorage } from "@/lib/firebaseAdmin";
import { Files } from "@/models/file.model";
import { FileRecord } from "@/types";
import {
  IStorageService,
  SaveFileInput,
  StoredFileRecord,
  ReadTarget,
  PRIVATE_CATEGORIES,
} from "./types";
import { validateFile, computeSha256, sanitizeFilename } from "./validation";

export class GCSStorageService implements IStorageService {
  private getBucket() {
    return adminStorage.bucket();
  }

  async saveFile(input: SaveFileInput): Promise<StoredFileRecord> {
    const validation = validateFile(input.buffer, input.category, input.mimeType);
    if (!validation.isValid) {
      throw new Error(validation.error || "File validation failed");
    }

    const bucket = this.getBucket();
    const accessLevel = PRIVATE_CATEGORIES.has(input.category) ? "private" : "public";
    const sanitizedOriginalName = sanitizeFilename(input.originalFilename);
    const ext = path.extname(sanitizedOriginalName) || ".bin";
    const uuid = crypto.randomUUID();
    const storageKey = `${accessLevel}/${input.category}/${uuid}${ext}`;

    const blob = bucket.file(storageKey);
    const hash = computeSha256(input.buffer);

    await blob.save(input.buffer, {
      contentType: input.mimeType,
      resumable: false,
      metadata: {
        contentType: input.mimeType,
        metadata: {
          originalFilename: sanitizedOriginalName,
          userId: String(input.userId),
          sha256: hash,
        },
      },
    });

    const publicUrl =
      accessLevel === "public"
        ? `https://storage.googleapis.com/${bucket.name}/${storageKey}`
        : null;

    const record = await Files.create({
      userId: input.userId,
      category: input.category,
      accessLevel,
      status: "ready",
      storageBucket: bucket.name,
      storageKey,
      publicUrl,
      originalFilename: sanitizedOriginalName,
      mimeType: input.mimeType,
      sizeBytes: input.buffer.length,
      sha256Hash: hash,
      entityType: input.entityType,
      entityId: input.entityId,
    });

    return {
      id: record.id,
      storageKey: record.storageKey,
      publicUrl: record.publicUrl,
      category: record.category,
      accessLevel: record.accessLevel,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,
      originalFilename: record.originalFilename,
      createdAt: record.createdAt,
    };
  }

  async getReadTarget(
    fileId: number,
    requestingUserId: number,
    isAdmin = false
  ): Promise<ReadTarget> {
    const record = await Files.findById(fileId);
    if (!record || record.status !== "ready") {
      throw new Error("File not found or not ready");
    }

    if (record.accessLevel === "public" && record.publicUrl) {
      return {
        type: "redirect",
        url: record.publicUrl,
      };
    }

    if (record.accessLevel !== "public") {
      const isOwner = record.userId === requestingUserId;
      if (!isOwner && !isAdmin) {
        throw new Error("Forbidden: You do not have permission to view this document");
      }
    }

    const bucket = this.getBucket();
    const blob = bucket.file(record.storageKey);

    const [signedUrl] = await blob.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15-minute TTL
      responseDisposition: `attachment; filename="${encodeURIComponent(record.originalFilename)}"`,
    });

    return {
      type: "redirect",
      url: signedUrl,
    };
  }

  async deleteFile(
    fileId: number,
    requestingUserId: number,
    isAdmin = false
  ): Promise<boolean> {
    const record = await Files.findById(fileId);
    if (!record || record.status === "deleted") {
      throw new Error("File not found");
    }

    if (record.userId !== requestingUserId && !isAdmin) {
      throw new Error("Forbidden: You cannot delete this file");
    }

    const bucket = this.getBucket();
    await bucket.file(record.storageKey).delete({ ignoreNotFound: true });

    await Files.delete(fileId);
    return true;
  }

  async getFile(fileId: number): Promise<FileRecord | undefined> {
    return Files.findById(fileId);
  }
}
