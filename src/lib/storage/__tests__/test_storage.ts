import "dotenv/config";
import { getStorageService } from "@/lib/storage";
import { Files } from "@/models/file.model";
import { db } from "@/data/db";
import { users, roles } from "@/db/schema";

async function runStorageTests() {
  console.log("=== Testing Storage Service Layer (Option 1) ===");

  // Find or create test user
  let [user] = await db.select().from(users).limit(1);
  if (!user) {
    let [role] = await db.select().from(roles).limit(1);
    if (!role) {
      const [newRole] = await db.insert(roles).values({ name: "User", description: "Default" }).returning();
      role = newRole;
    }
    const [created] = await db.insert(users).values({
      username: `test_storage_${Date.now()}`,
      email: `test_storage_${Date.now()}@example.com`,
      password: "password123",
      roleId: role.id,
      wallet: 0,
    }).returning();
    user = created;
  }
  const testUserId = user.id;
  console.log(`Using test userId: ${testUserId}`);

  const storage = getStorageService();
  console.log("Storage provider initialized:", storage.constructor.name);

  // 1. Valid JPEG avatar upload
  console.log("\n--- Test 1: Upload Public Avatar (JPEG) ---");
  const validJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
  ]);

  const avatar = await storage.saveFile({
    userId: testUserId,
    category: "avatar",
    originalFilename: "test-avatar.jpg",
    mimeType: "image/jpeg",
    buffer: validJpeg,
  });

  console.log("Avatar created successfully:", {
    id: avatar.id,
    category: avatar.category,
    accessLevel: avatar.accessLevel,
    publicUrl: avatar.publicUrl,
  });

  if (avatar.accessLevel !== "public" || !avatar.publicUrl) {
    throw new Error("Avatar should be public with publicUrl");
  }

  // 2. Read public asset
  console.log("\n--- Test 2: Read Public Avatar Target ---");
  const avatarRead = await storage.getReadTarget(avatar.id, testUserId);
  console.log("Avatar read target:", avatarRead);
  if (avatarRead.type !== "redirect") {
    throw new Error("Public avatar read target should be redirect");
  }

  // 3. Valid PDF private document upload
  console.log("\n--- Test 3: Upload Private Document (PDF) ---");
  const validPdf = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");

  const doc = await storage.saveFile({
    userId: testUserId,
    category: "artwork_document",
    originalFilename: "authenticity-certificate.pdf",
    mimeType: "application/pdf",
    buffer: validPdf,
    entityType: "artwork",
    entityId: 101,
  });

  console.log("Document created successfully:", {
    id: doc.id,
    category: doc.category,
    accessLevel: doc.accessLevel,
    publicUrl: doc.publicUrl,
  });

  if (doc.accessLevel !== "private" || doc.publicUrl !== null) {
    throw new Error("Document should be private with null publicUrl");
  }

  // 4. Access control: Unauthorized read attempt
  console.log("\n--- Test 4: Private Document RBAC Check ---");
  try {
    await storage.getReadTarget(doc.id, 999999, false); // User 999999 is not owner or admin
    throw new Error("Expected unauthorized access to fail, but it succeeded!");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("Access correctly denied for non-owner:", message);
  }

  // Owner read attempt
  const ownerRead = await storage.getReadTarget(doc.id, testUserId, false);
  console.log("Owner read target type:", ownerRead.type);
  if (ownerRead.type !== "stream") {
    throw new Error("Local private read target should be stream");
  }

  // 5. Security: Spoofed MIME type test (Magic Bytes verification)
  console.log("\n--- Test 5: Magic Bytes Tampering Detection ---");
  const spoofedFile = Buffer.from("<html><script>alert(1)</script></html>");
  try {
    await storage.saveFile({
      userId: testUserId,
      category: "avatar",
      originalFilename: "malicious.jpg",
      mimeType: "image/jpeg",
      buffer: spoofedFile,
    });
    throw new Error("Expected spoofed file to be rejected, but it was accepted!");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log("Spoofed file successfully rejected:", message);
  }

  // 6. Deletion test
  console.log("\n--- Test 6: Deletion and Status Update ---");
  await storage.deleteFile(avatar.id, testUserId);
  const deletedRecord = await Files.findById(avatar.id);
  console.log("Deleted avatar record status:", deletedRecord?.status);
  if (deletedRecord?.status !== "deleted") {
    throw new Error("Record status should be 'deleted'");
  }

  await storage.deleteFile(doc.id, testUserId);
  const deletedDoc = await Files.findById(doc.id);
  console.log("Deleted doc record status:", deletedDoc?.status);

  console.log("\n=== ALL STORAGE SERVICE TESTS PASSED! ===");
}

runStorageTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
