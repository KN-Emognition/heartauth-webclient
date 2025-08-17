"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LoginButton, LogoutButton } from "./AuthButtons";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-white">
      <div className="container max-w-5xl h-16 flex items-center justify-between mx-auto">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          HeartAuth
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>

          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded bg-gray-200" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-gray-600">
                {session.user?.name ?? session.user?.email}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </nav>
      </div>
    </header>
  );
}
