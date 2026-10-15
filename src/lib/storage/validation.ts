import crypto from "crypto";
import { FileCategory } from "@/types";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZES } from "./types";

export function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WebP: RIFF....WEBP
  if (mimeType === "image/webp") {
    if (buffer.length < 12) return false;
    const isRiff = buffer.toString("ascii", 0, 4) === "RIFF";
    const isWebp = buffer.toString("ascii", 8, 12) === "WEBP";
    return isRiff && isWebp;
  }

  // PDF: %PDF- (25 50 44 46 2D)
  if (mimeType === "application/pdf") {
    return buffer.toString("ascii", 0, 5) === "%PDF-";
  }

  // TIFF: II*. (little endian) or MM.* (big endian)
  if (mimeType === "image/tiff") {
    const isLittleEndian = buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00;
    const isBigEndian = buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a;
    return isLittleEndian || isBigEndian;
  }

  return false;
}

export function validateFile(
  buffer: Buffer,
  category: FileCategory,
  mimeType: string
): { isValid: boolean; error?: string } {
  // Check category allowance
  const allowed = ALLOWED_MIME_TYPES[category];
  if (!allowed || !allowed.includes(mimeType)) {
    return {
      isValid: false,
      error: `MIME type '${mimeType}' is not allowed for category '${category}'. Allowed: ${allowed?.join(", ")}`,
    };
  }

  // Check file size
  const maxSize = MAX_FILE_SIZES[category];
  if (buffer.length > maxSize) {
    const maxMb = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds max limit of ${maxMb} MB for ${category}`,
    };
  }

  // Check magic bytes
  if (!validateMagicBytes(buffer, mimeType)) {
    return {
      isValid: false,
      error: `File signature mismatch: file content does not match reported MIME type '${mimeType}'`,
    };
  }

  return { isValid: true };
}

export function computeSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function sanitizeFilename(filename: string): string {
  const base = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.substring(0, 100);
}
