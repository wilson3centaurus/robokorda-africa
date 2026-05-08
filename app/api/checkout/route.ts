import { NextResponse } from "next/server";
import type { CheckoutPayload } from "@/lib/types";
import { addShopOrder } from "@/lib/localdb";

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

  const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderRef = `RK-AF-${Math.floor(1000 + Math.random() * 9000)}`;

  addShopOrder({
    order_ref: orderRef,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    delivery_method: payload.deliveryMethod ?? "",
    payment_method: payload.paymentMethod ?? "",
    items: JSON.stringify(payload.items),
    total_usd: total,
  });

  return NextResponse.json({ message: "Checkout request received.", orderId: orderRef });
}
