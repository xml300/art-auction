import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import crypto from "crypto";
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

export class LocalStorageService implements IStorageService {
  private baseDir = process.cwd();
  private publicUploadsDir = path.join(this.baseDir, "public", "uploads");
  private privateStorageDir = path.join(this.baseDir, ".storage", "private");

  constructor() {
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    try {
      await fsp.mkdir(this.publicUploadsDir, { recursive: true });
      await fsp.mkdir(this.privateStorageDir, { recursive: true });
    } catch (err) {
      console.error("Failed to initialize local storage directories:", err);
    }
  }

  private resolveDiskPath(category: string, storageKey: string, accessLevel: string): string {
    const root = accessLevel === "public" ? this.publicUploadsDir : this.privateStorageDir;
    // Sanitize path against directory traversal
    const safeKey = path.normalize(storageKey).replace(/^(\.\.[\/\\])+/, "");
    return path.join(root, safeKey);
  }

  async saveFile(input: SaveFileInput): Promise<StoredFileRecord> {
    // 1. Validation
    const validation = validateFile(input.buffer, input.category, input.mimeType);
    if (!validation.isValid) {
      throw new Error(validation.error || "File validation failed");
    }

    const accessLevel = PRIVATE_CATEGORIES.has(input.category) ? "private" : "public";
    const sanitizedOriginalName = sanitizeFilename(input.originalFilename);
    const ext = path.extname(sanitizedOriginalName) || ".bin";
    const uuid = crypto.randomUUID();
    const storageKey = path.join(input.category, `${uuid}${ext}`);
    const diskPath = this.resolveDiskPath(input.category, storageKey, accessLevel);

    // 2. Write file to disk
    await fsp.mkdir(path.dirname(diskPath), { recursive: true });
    await fsp.writeFile(diskPath, input.buffer);

    const publicUrl =
      accessLevel === "public"
        ? `/uploads/${storageKey.replace(/\\/g, "/")}`
        : null;

    const hash = computeSha256(input.buffer);

    // 3. Insert record in DB
    const record = await Files.create({
      userId: input.userId,
      category: input.category,
      accessLevel,
      status: "ready",
      storageBucket: "local-disk",
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

    // Public file redirect
    if (record.accessLevel === "public" && record.publicUrl) {
      return {
        type: "redirect",
        url: record.publicUrl,
      };
    }

    // Private file RBAC check
    if (record.accessLevel !== "public") {
      const isOwner = record.userId === requestingUserId;
      if (!isOwner && !isAdmin) {
        throw new Error("Forbidden: You do not have permission to view this document");
      }
    }

    const diskPath = this.resolveDiskPath(record.category, record.storageKey, record.accessLevel);
    if (!fs.existsSync(diskPath)) {
      throw new Error("File content not found on local disk");
    }

    const stream = fs.createReadStream(diskPath);
    return {
      type: "stream",
      stream,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes,
      filename: record.originalFilename,
      isPrivate: record.accessLevel !== "public",
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

    const diskPath = this.resolveDiskPath(record.category, record.storageKey, record.accessLevel);
    await fsp.unlink(diskPath).catch(() => {});

    await Files.delete(fileId);
    return true;
  }

  async getFile(fileId: number): Promise<FileRecord | undefined> {
    return Files.findById(fileId);
  }
}
