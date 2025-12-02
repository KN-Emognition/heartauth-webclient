"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider session={{
  user: {
    name: "Demo Tenant User",
    email: "demo.user@example-tenant.com",
    image: "https://avatars.dicebear.com/api/initials/Demo%20Tenant.svg",
  },
  expires: "2099-01-01T00:00:00.000Z",
}}>
      {children}
    </NextAuthSessionProvider>
  );
}
