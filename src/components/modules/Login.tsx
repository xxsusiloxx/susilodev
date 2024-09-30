"use client";

import React from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "../ui/button";

import { AuthSessionGuard } from "./SessionGuard";

export default function Login() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col w-full">
      <AuthSessionGuard />

      {!session ? (
        <Button onClick={() => signIn("google")}>Login with Google</Button>
      ) : (
        <>
          <p>Welcome, {session.user?.name}</p>
        </>
      )}
    </div>
  );
}
