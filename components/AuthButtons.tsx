"use client";
import { signIn, signOut } from "next-auth/react";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export function LoginButton() {
  return (
    <button
      className={`${base} bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-400`}
      onClick={() => signIn("keycloak", { callbackUrl: "/" })}
    >
      Sign in
    </button>
  );
}

export function LogoutButton() {
  return (
    <button
      className={`${base} bg-white border border-gray-300 hover:bg-gray-100 focus-visible:ring-gray-300`}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Log out
    </button>
  );
}
