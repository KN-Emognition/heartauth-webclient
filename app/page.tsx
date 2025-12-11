"use client";
import { LoginButton } from "@/components/AuthButtons";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="space-y-8">
      <section className="bg-white/90 backdrop-blur rounded-2xl border border-indigo-100 shadow-sm p-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium
              ${
                isAuthenticated
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isAuthenticated ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isAuthenticated
                ? "You are authenticated"
                : "You are not authenticated"}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Example Tenant Application
            </h1>
            <p className="text-gray-600 max-w-xl">
              This app represents a single tenant that is secured by your
              Keycloak realm. Use it to test sign-in, sign-out and protected
              areas without any business logic.
            </p>
          </div>

          <div className="flex gap-3">
            {!isAuthenticated && <LoginButton />}
          </div>
        </div>

        {/* Auth state explanation */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-600 bg-gray-50/60">
            {isAuthenticated ? (
              <>
                <p className="font-medium text-gray-800 mb-1">
                  You are signed in to this tenant.
                </p>
                <p>
                  Requests from this app will include your Keycloak session. Use
                  this as an example of how a real tenant app would behave once
                  the user is authenticated.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-800 mb-1">
                  You are browsing as a guest.
                </p>
                <p>
                  No user session is attached yet. Click{" "}
                  <span className="font-medium">Sign in</span> to start the
                  Keycloak flow and see how an authenticated tenant behaves.
                </p>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="rounded-xl border border-gray-200 p-4 bg-white text-xs text-gray-700">
              <p className="font-medium text-gray-800 mb-2">
                Session snapshot (for demo purposes)
              </p>
              <div className="overflow-auto max-h-60 rounded-md bg-gray-900 text-gray-100 p-3 text-[11px] leading-relaxed">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(
                    {
                      user: {
                        name: session.user?.name,
                        email: session.user?.email,
                      },
                      expires: session.expires,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Simple, non-tiley explanation section */}
      <section
        id="how-it-works"
        className="text-sm text-gray-600 bg-white/70 border border-dashed border-gray-200 rounded-2xl p-6"
      >
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          What this app is
        </h2>
        <p className="mb-2">
          All it really demonstrates is whether the user is authenticated and
          how the session flows through the app.
        </p>
        <p>
          Swap the logo, colors and routes to simulate different tenants while
          keeping the same Keycloak realm and multi-tenant HeartAuth extension.
        </p>
      </section>
    </div>
  );
}
