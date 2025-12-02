"use client";
import { signIn } from "next-auth/react";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export function LoginButton() {
  return (
    <button
      className={`${base} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-400`}
      onClick={() => signIn("keycloak")}
    >
      Sign in
    </button>
  );
}

export function LogoutButton() {
  return (
    <button
      className={`${base} bg-slate-800 text-white hover:bg-slate-700 focus-visible:ring-slate-500`}
      onClick={() => {
        window.location.href = "/api/logout-start";
      }}
    >
      Sign out
    </button>
  );
}
