import type { ReactNode } from "react";
import { Card } from "@/components/card";

export function WhiteCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Card className={className}>{children}</Card>;
}
