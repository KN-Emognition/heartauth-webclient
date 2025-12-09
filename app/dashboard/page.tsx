"use client";

import { useRouter } from "next/navigation";
import { useApiConfig } from "@/components/ApiConfigProvider";
import VisualizationDashboard from "@/components/Visualization";

export default function DashboardPage() {
  const router = useRouter();
  const { setApiKey, setApiUrl } = useApiConfig();

  const handleBack = () => {
    setApiKey('');
    setApiUrl('');
    router.push("/");
  };

  return (
    <div className="p-6">
      <button
        onClick={handleBack}
        className="mb-4 rounded border px-3 py-1 text-sm hover:bg-gray-100"
      >
        ← Change API config
      </button>

      <VisualizationDashboard />
    </div>
  );
}
