import { authOptions } from "@/keycloak/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin/keycloak?callbackUrl=%2Fdashboard");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Only visible when authenticated.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium">Your profile</h3>
          <p className="mt-1 text-sm text-gray-600">
            {session.user?.email ?? "No email"}
            {/* add more user info as needed */}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-medium">Quick links</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
            <li>Settings</li>
            <li>Docs</li>
            <li>Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
