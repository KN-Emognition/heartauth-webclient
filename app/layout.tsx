import { ApiConfigProvider } from "@/components/ApiConfigProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keycloak Tenant Example",
  description: "Example tenant application secured with Keycloak.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-slate-100 via-sky-20 to-indigo-300 text-slate-900`}
      >
        <ApiConfigProvider
          initialApiUrl="Put your API URL here"
          initialApiKey="Put your Api Key here"
        >
          {children}
        </ApiConfigProvider>
      </body>
    </html>
  );
}
