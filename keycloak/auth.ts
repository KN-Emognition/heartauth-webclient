import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.NEXT_KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) token.id_token = account.id_token;
      if (account?.access_token) token.access_token = account.access_token;
      return token;
    },
    async session({ session, token }) {
      session.id_token = token.id_token as string | undefined;
      session.access_token = token.access_token as string | undefined;
      return session;
    },
  },
};
export default authOptions;
