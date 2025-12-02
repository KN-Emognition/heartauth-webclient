import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import authOptions from "@/keycloak/auth";
import { Navbar } from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";

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
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-slate-100 via-sky-20 to-indigo-300 text-slate-900`}
      >
        <div className="min-h-screen flex flex-col">
          <SessionProvider session={session}>
            <Navbar />
            <main className="flex-1">
              <div className="container max-w-5xl py-8 mx-auto">{children}</div>
            </main>
            <footer className="border-t bg-white/80">
              <div className="container max-w-5xl py-6 text-sm text-gray-500 flex flex-wrap items-center justify-between gap-2 mx-auto">
                <span>Example tenant application</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
            </footer>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
