"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.resetPassword({
            newPassword: "Alex1234",
            token,
          });
        }}
      >
        Reset Password
      </Button>
    </div>
  );
}
