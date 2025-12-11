"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { LoginButton, LogoutButton } from "./AuthButtons";

export function Navbar() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = !!session;

  return (
    <header className="border-b border-indigo-100 bg-white/80 backdrop-blur">
      <div className="container max-w-5xl h-16 flex items-center justify-between mx-auto">
        {/* Left: generic tenant name */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-semibold tracking-tight text-lg text-indigo-700"
          >
            Example Tenant App
          </Link>
          <span className="text-xs text-slate-400 border border-dashed border-indigo-100 rounded-full px-2 py-0.5 bg-indigo-50/70">
            acts as a Keycloak tenant
          </span>
        </div>

        {/* Right: auth status + actions */}
        <nav className="flex items-center gap-3">
          {/* Auth state pill */}
          <div className="hidden sm:flex items-center">
            {isLoading ? (
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
            ) : (
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium
                ${
                  isAuthenticated
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAuthenticated ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {isAuthenticated ? "Authenticated" : "Guest (not signed in)"}
              </span>
            )}
          </div>

          {/* Right-hand actions */}
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded bg-slate-200" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-slate-600 truncate max-w-[160px]">
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
