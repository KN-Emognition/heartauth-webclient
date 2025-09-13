import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import authOptions from "@/keycloak/auth";
import { Navbar } from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeartAuth App",
  description: "Next.js + Keycloak demo",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <SessionProvider session={session}>
            <Navbar />
            <main className="flex-1 bg-gray-50">
              <div className="container max-w-5xl py-8 mx-auto">{children}</div>
            </main>
            <footer className="border-t bg-white">
              <div className="container max-w-5xl py-6 text-sm text-gray-500">
                © {new Date().getFullYear()} HeartAuth
              </div>
            </footer>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
