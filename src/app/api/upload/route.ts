import { auth } from "@/lib/auth";
import { getUploadUrl } from "@/lib/s3";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["create"],
      },
    },
  });

  if (!success) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and content type are required" },
        { status: 400 },
      );
    }

    if (!contentType.startWith("image/")) {
      return NextResponse.json(
        { error: "Only images are allowed" },
        { status: 400 },
      );
    }

    const { uploadUrl, key, fileUrl } = await getUploadUrl(
      filename,
      contentType,
    );

    return NextResponse.json({
      uploadUrl,
      key,
      fileUrl,
    });
  } catch (e) {
    console.log(e);
  }
  return NextResponse.json(
    { error: "Failed to generate upload URL" },
    { status: 500 },
  );
}
