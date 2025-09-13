import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL!));

  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.state",
  ];
  for (const name of cookieNames) {
    res.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return res;
}
