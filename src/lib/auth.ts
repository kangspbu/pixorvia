import { env } from "@/env";
import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { db } from "@/server/db";
import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: "sandbox",
});

const prisma = new PrismaClient();

export const products = [
  { productId: "14395571-67cb-4158-9356-2a6c380b683d", slug: "small" },
  {
    productId: "2f1f1310-423c-4365-a0d6-930ea86ca856",
    slug: "medium",
  },
  { productId: "3581c1a9-62e0-42f1-8b23-8ab0bd9e913a", slug: "large" },
];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.NEXT_PUBLIC_BETTER_AUTH_URL],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: products,
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const consumerId = order.data.customer.externalId;

            if (!consumerId) {
              console.error(
                "No externalId (userId) found on customer for order",
              );
              throw new Error("No externalId found for the order");
            }

            const productId = order.data.productId;

            let addedCredits = 0;

            switch (productId) {
              case products[0]?.productId:
                addedCredits = 50;
                break;
              case products[1]?.productId:
                addedCredits = 150;
                break;
              case products[2]?.productId:
                addedCredits = 400;
                break;
            }

            //update user credits directly in db
            await db.user.update({
              where: { id: consumerId },
              data: { credits: { increment: addedCredits } },
            });
          },
        }),
      ],
    }),
  ],

  //   socialProviders: {
  //     google: {clientId:"",
  //   },
});
