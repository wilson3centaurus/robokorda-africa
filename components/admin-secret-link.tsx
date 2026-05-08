"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

export function AdminSecretLink() {
  const router = useRouter();
  const clickCount = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    clickCount.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 400);

    if (clickCount.current >= 2) {
      clickCount.current = 0;
      router.push("/admin/login");
    }
  }

  return (
    <p
      className="cursor-default select-none text-[var(--text-muted)]"
      onClick={handleClick}
    >
      © {new Date().getFullYear()} Robokorda Africa. All rights reserved.
    </p>
  );
}
