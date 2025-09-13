import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!;
  const postLogout = new URL(
    "/api/logout-finish",
    process.env.NEXTAUTH_URL!
  ).toString();

  const base = issuer.replace(/\/+$/, "");
  const url = new URL(`${base}/protocol/openid-connect/logout`);
  url.searchParams.set("post_logout_redirect_uri", postLogout);
  url.searchParams.set("client_id", clientId);
  if (token?.id_token)
    url.searchParams.set("id_token_hint", token.id_token as string);

  return NextResponse.redirect(url);
}
