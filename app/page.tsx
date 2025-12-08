"use client";
import { ApiClientForm } from "@/components/ApiConfigForm";
import VisualizationDashboard from "@/components/Visualization";

export default function Home() {
  return (
    <>
      <ApiClientForm />
      <VisualizationDashboard />
    </>
  );
}
