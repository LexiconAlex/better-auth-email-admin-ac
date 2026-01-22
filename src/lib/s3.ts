"use server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { headers } from "next/headers";

const s3Client = new S3Client({
  region: process.env.S3_REGION || "",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function getUploadUrl(filename: string, contentType: string) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permission: {
        article: ["create"],
      },
    },
  });

  if (!success) {
    throw new Error("Unathorized");
  }

  const key = `articles/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;

  return {
    uploadUrl: signedUrl,
    key,
    fileUrl,
  };
}

export async function deleteFile(key: string) {
  const { success } = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      permission: {
        article: ["delete"],
      },
    },
  });

  if (!success) {
    throw new Error("Unathorized");
  }
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getPublicUrl(key: string) {
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
}
