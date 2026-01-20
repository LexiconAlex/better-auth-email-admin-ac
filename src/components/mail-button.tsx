"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { createArticle } from "@/actions/article";

export default function MailButton() {
  const session = authClient.useSession();

  return (
    <>
      {session.data && <p>UserRole : {session.data.user.role}</p>}
      <div className="flex gap-4">
        <Button
          onClick={async () => {
            authClient.signUp.email({
              email: "alexander@test.se",
              name: "Alexander",
              password: "test1234",
            });
          }}
        >
          Send email
        </Button>
        <Button
          onClick={async () => {
            authClient.signIn.email({
              email: "alexander@test.se",
              password: "Alex1234",
            });
          }}
        >
          Test login
        </Button>
        <Button
          onClick={async () => {
            authClient.requestPasswordReset({
              email: "alexander@test.se",
              redirectTo: "/reset-password",
            });
          }}
        >
          Reset Password
        </Button>
        {session.data && (
          <Button
            onClick={async () => {
              authClient.signOut();
            }}
          >
            Logout
          </Button>
        )}
        <Button
          onClick={async () => {
            await createArticle("Test Article", "Test content");
          }}
        >
          Create Article
        </Button>
      </div>
    </>
  );
}
