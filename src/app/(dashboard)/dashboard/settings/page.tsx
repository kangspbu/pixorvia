"use client";

import { authClient } from "@/lib/auth-client";
import {
  AccountSettingsCards,
  SecuritySettingsCards,
} from "@daveyplate/better-auth-ui";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * TODO:
 * check session
 * if not redirect to sign in page
 * if yes show the settings
 */

const Page = ({}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await authClient.getSession();
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader2 className="text-primary mb-2 h-14 w-14 animate-spin" />
        <p>Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="my-8 flex flex-col items-center justify-center gap-6">
      <AccountSettingsCards className="max-w-4xl" />
      <SecuritySettingsCards className="max-w-4xl" />
    </div>
  );
};

export default Page;
