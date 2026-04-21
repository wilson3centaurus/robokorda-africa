import type { Product } from "@/data/site";

export type CartItem = Product & {
  quantity: number;
};

export type CheckoutPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryMethod: string;
  paymentMethod: string;
  items: CartItem[];
};
