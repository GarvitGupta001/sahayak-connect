"use client";

import { useRouter } from "next/navigation";

export default function ProtectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/sign-in");
  }

  return <>{children}</>;
}
