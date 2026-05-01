"use client";

import { useRouter } from "next/navigation";

export function FooterCopyright() {
  const router = useRouter();
  return (
    <p
      className="select-none cursor-default"
      onDoubleClick={() => router.push("/admin/login")}
    >
      © {new Date().getFullYear()} Robokorda Africa. All rights reserved.
    </p>
  );
}
