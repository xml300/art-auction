import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { getSession } from "@/lib/auth";
import { getStorageService } from "@/lib/storage";
import { Roles } from "@/enums";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const id = parseInt(fileId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: "Invalid file ID" }, { status: 400 });
  }

  const [session] = await getSession();
  const userId = session?.userId ?? 0;
  const isAdmin = session?.roleId === Roles.Admin;

  try {
    const storage = getStorageService();
    const target = await storage.getReadTarget(id, userId, isAdmin);

    if (target.type === "redirect") {
      return NextResponse.redirect(target.url, { status: 307 });
    }

    const webStream = Readable.toWeb(target.stream as Readable);
    const disposition = target.isPrivate ? "attachment" : "inline";

    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": target.mimeType,
        "Content-Length": target.sizeBytes.toString(),
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(target.filename)}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": target.isPrivate
          ? "private, no-cache, no-store, must-revalidate"
          : "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retrieve file";
    const status = message.toLowerCase().includes("forbidden") ? 403 : 404;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const id = parseInt(fileId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: "Invalid file ID" }, { status: 400 });
  }

  const [session, authError] = await getSession();
  if (authError || !session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.roleId === Roles.Admin;

  try {
    const storage = getStorageService();
    await storage.deleteFile(id, session.userId, isAdmin);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete file";
    const status = message.toLowerCase().includes("forbidden") ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
