import type { ReactNode } from "react";
import { Card } from "@/components/card";

export function BlueCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className} variant="blue">
      {children}
    </Card>
  );
}
