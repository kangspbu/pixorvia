"use server";

import { auth, products } from "@/lib/auth";
import { headers } from "next/headers";

export async function getProducts() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return products.map((product) => ({
    productId: product.productId,
  }));
}
