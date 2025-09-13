import { LoginButton } from "@/components/AuthButtons";
import authOptions from "@/keycloak/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl border p-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome{session ? `, ${session.user?.name ?? ""}` : ""}
        </h1>
        <p className="mt-2 text-gray-600">
          Secure login with Keycloak. Explore the app and protected areas.
        </p>

        <div className="mt-6 flex gap-3">
          {!session && (
            <>
              <LoginButton />
              <Link
                href="/#features"
                className="h-9 inline-flex items-center rounded-md border border-gray-300 bg-white px-5 hover:bg-gray-100"
              >
                Learn more
              </Link>
            </>
          )}
        </div>
      </section>

      <section id="features" className="grid gap-6 sm:grid-cols-2">
        {[
          {
            title: "Server-side session",
            desc: "No tokens in localStorage. Reliable across refreshes.",
          },
          {
            title: "Protected routes",
            desc: "Use server redirects or middleware to guard pages.",
          },
          {
            title: "Clean UI",
            desc: "Minimal, responsive layout with Tailwind.",
          },
          {
            title: "Keycloak ready",
            desc: "Works with your existing realm & flows.",
          },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-xl border p-6">
            <h3 className="font-medium">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
