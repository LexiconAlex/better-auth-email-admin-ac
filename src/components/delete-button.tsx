"use client";

import { deleteArticle } from "@/actions/article";
import { Button } from "./ui/button";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <Button
      onClick={async () => {
        await deleteArticle(id);
      }}
    >
      Delete Article
    </Button>
  );
}
