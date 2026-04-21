import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/types";

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutPayload;

  if (
    !payload.name?.trim() ||
    !payload.email?.trim() ||
    !payload.phone?.trim() ||
    !payload.address?.trim()
  ) {
    return NextResponse.json(
      { message: "Please complete all required checkout fields." },
      { status: 400 },
    );
  }

  if (!payload.items?.length) {
    return NextResponse.json(
      { message: "Your cart is empty. Please add items before checkout." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    message: "Checkout request received.",
    orderId: `RK-AF-${Math.floor(1000 + Math.random() * 9000)}`,
  });
}
