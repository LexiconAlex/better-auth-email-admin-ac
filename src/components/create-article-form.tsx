"use client";

import { createArticle, getSignedUploadUrl } from "@/actions/article";
import { Loader2, Upload } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function CreateArticleForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let featuredImageUrl;
    let imageKey;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File;

    console.log(file);

    try {
      if (file && file.size > 0) {
        const uploadResult = await getSignedUploadUrl(file.name, file.type);
        console.log(uploadResult);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }
        const response = await fetch(uploadResult.uploadUrl!, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        console.log(response);
        if (!response.ok) throw new Error("Upload failed");

        featuredImageUrl = uploadResult.fileUrl;
        imageKey = uploadResult.key;
      }

      const result = await createArticle(
        title,
        content,
        featuredImageUrl,
        imageKey,
      );

      if (!result.success) throw new Error(result.error);
      e.currentTarget.reset();
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            id="title"
            name="title"
            required
            disabled={isLoading}
            placeholder="Article Title"
          />
          <Textarea
            id="content"
            name="content"
            required
            disabled={isLoading}
            placeholder="Article Content"
            rows={6}
          />
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Article
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
