"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionGuard() {
  const { status } = useSession();
  const router = useRouter();
  //console.log("data status: ", status);

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push("/auth/login?msg=unauthorized");
    }
  }, [status, router]);

  return <div />;
}

export function AuthSessionGuard() {
  const { status } = useSession();
  const router = useRouter();
  //   console.log("data status: ", status);

  useEffect(() => {
    if (status !== "loading" && status === "authenticated") {
      if (window.history.length > 1) {
        // window.history.back();
        router.push("/");
      } else {
        router.push("/");
      }
    }
  }, [status, router]);

  return <div />;
}
