"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getUploadUrl } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getAllArticles() {
  return await prisma.article.findMany();
}

export async function getSignedUploadUrl(
  filename: string,
  contentType: string,
) {
  if (!contentType.startsWith("image/")) {
    return { success: false, error: "Only images are allowed" };
  }

  try {
    const { uploadUrl, key, fileUrl } = await getUploadUrl(
      filename,
      contentType,
    );
    return {
      success: true,
      uploadUrl,
      fileUrl,
      key,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to generate upload URL",
    };
  }
}

export async function createArticle(
  title: string,
  content: string,
  featuredImage?: string,
  imageKey?: string,
) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["create"],
      },
    },
  });
  if (!success) {
    return { success: false, error: "Unauthorized" };
  }
  try {
    await prisma.article.create({
      data: {
        title,
        content,
        featuredImage,
        imageKey,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to create article" };
  }
}

export async function deleteArticle(id: string) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["delete"],
      },
    },
  });
  if (!success) {
    return { success: false };
  }
  try {
    await prisma.article.delete({
      where: {
        id,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}
