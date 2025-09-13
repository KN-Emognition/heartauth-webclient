"use client";
import { signIn } from "next-auth/react";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export function LoginButton() {
  return (
    <button
      className={`${base} bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-400`}
      onClick={() => signIn("keycloak")}
    >
      Sign in
    </button>
  );
}

export function LogoutButton() {
  return (
    <button
      className={`${base} bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-400`}
      onClick={() => {
        window.location.href = "/api/logout-start";
      }}
    >
      Sign out
    </button>
  );
}
