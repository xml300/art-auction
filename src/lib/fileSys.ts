import { getStorageService } from "@/lib/storage";

export async function writeFile(file: File, path?: string, userId = 0): Promise<string> {
  if (!file || file.size <= 0) return "";

  try {
    const storage = getStorageService();
    const buffer = Buffer.from(await file.arrayBuffer());

    const saved = await storage.saveFile({
      userId,
      category: "avatar",
      originalFilename: file.name,
      mimeType: file.type || "image/jpeg",
      buffer,
    });

    return saved.publicUrl || `/api/storage/files/${saved.id}`;
  } catch (error) {
    console.error("Error writing file via storage service:", error);
    return "";
  }
}

export async function readFile(fileIdOrPath: string | number, requestingUserId = 0) {
  try {
    const storage = getStorageService();
    if (typeof fileIdOrPath === "number") {
      const target = await storage.getReadTarget(fileIdOrPath, requestingUserId);
      return target;
    }
    return null;
  } catch (error) {
    console.error("Error reading file via storage service:", error);
    return null;
  }
}
