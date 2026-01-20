"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getAllArticles() {
  return await prisma.article.findMany();
}

export async function createArticle(title: string, content: string) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permissions: {
        article: ["create"],
      },
    },
  });
  if (!success) {
    return { succes: false };
  }
  try {
    await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { succes: false };
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
    return { succes: false };
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
    return { succes: false };
  }
}
