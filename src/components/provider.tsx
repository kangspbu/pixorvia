"use client";

import { authClient } from "@/lib/auth-client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={(url: string) => router.push(url)}
      replace={(url: string) => router.replace(url)}
      onSessionChange={async () => {
        // Clear router cache (protected routes)
        router.refresh();

        //Redirect to dashboard as soon as the user login successfully
        try {
          const session = await authClient.getSession();
          if (session.data?.user && typeof window != "undefined") {
            const currentPath = window.location.pathname;

            if (currentPath.startsWith("/auth/")) {
              router.push("/dashboard");
            }
          }
        } catch (e) {
          console.log(`Error fetching session: ${String(e)}`);
        }
      }}
      settings={{
        url: "/dashboard/settings", // Your custom settings page URL
      }}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}
