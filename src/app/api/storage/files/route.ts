import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStorageService } from "@/lib/storage";
import { Files } from "@/models/file.model";
import { FileCategory } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const [session, authError] = await getSession();
  if (authError || !session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as FileCategory | null;
    const entityType = formData.get("entityType")?.toString();
    const entityIdRaw = formData.get("entityId")?.toString();
    const entityId = entityIdRaw ? parseInt(entityIdRaw, 10) : undefined;

    if (!file || !(file instanceof File) || file.size <= 0) {
      return NextResponse.json(
        { success: false, error: "A valid non-empty file must be provided" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: "File category is required" },
        { status: 400 }
      );
    }

    const storage = getStorageService();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = await storage.saveFile({
      userId: session.userId,
      category,
      originalFilename: file.name,
      mimeType: file.type || "application/octet-stream",
      buffer,
      entityType,
      entityId,
    });

    return NextResponse.json(
      {
        success: true,
        file: saved,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process file upload";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const [session, authError] = await getSession();
  if (authError || !session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const category = (searchParams.get("category") as FileCategory) || undefined;

  try {
    const userFiles = await Files.listByUser(session.userId, {
      category,
      status: "ready",
    });

    return NextResponse.json({
      success: true,
      files: userFiles,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch files";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
