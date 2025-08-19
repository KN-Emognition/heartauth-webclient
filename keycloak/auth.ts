import NextAuth, { type NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";


export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      jwks_endpoint: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/certs`,
      wellKnown: undefined,
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!, 
      issuer: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
      authorization: {
        params: {
          scope: "openid email profile",
        },
        url: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      },      
      token: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`,
      userinfo: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-expect-error add tokens to session object
      session.access_token = token.access_token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
