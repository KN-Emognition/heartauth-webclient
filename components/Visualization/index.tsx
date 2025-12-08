"use client";
import { useState, useEffect } from "react";
import { useApiConfig } from "../ApiConfigProvider";
import { createClientInstance, ModelApiClient } from "@/contract/client";
import { components } from "@/contract/generated/model-api";
import { useVisualizationQuery } from "./useVisualizationQuery";
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});
// type Coordinates = components["schemas"]["Coordinates"];

// type VisualizationResponse = components["schemas"]["VisualizationResponse"];
type Method = components["schemas"]["VisualizationRequest"]["methods"][number];
const METHODS: Array<Method> = [
  "tsne_fit_on_all_ref",
  "umap_fit_on_all_ref",
  "umap_fit_larfield",
] as const;

export default function VisualizationDashboard() {
  const [selectedMethods, setSelectedMethods] = useState<Method[]>([
    "umap_fit_larfield",
  ]);
  const { apiKey, apiUrl } = useApiConfig();
  const [apiClient, setApiClient] = useState<ModelApiClient | null>(null);

  useEffect(() => {
    setApiClient(createClientInstance(apiKey, apiUrl));
  }, [apiKey, apiUrl]);
  const { data, isLoading, refetch } = useVisualizationQuery({
    selectedMethods,
    apiClient,
  });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5173/ws/visualization");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = () => refetch();
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  });

  const toggleMethod = (method: Method) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Visualization Dashboard</h1>

      <div style={{ marginBottom: 16 }}>
        {METHODS.map((method) => (
          <label key={method} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedMethods.includes(method)}
              onChange={() => toggleMethod(method)}
            />
            {method}
          </label>
        ))}

        <button onClick={() => refetch()} disabled={isLoading}>
          {isLoading ? "Loading..." : "Update"}
        </button>
      </div>

      {data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: 16,
          }}
        >
          {Object.entries(data.mapping_method_to_coordinates).map(
            ([method, coords]) => (
              <div
                key={method}
                style={{ border: "1px solid #ccc", padding: 12 }}
              >
                <h3>{method}</h3>
                <Plot
                  data={[
                    {
                      x: coords.reference_ecgs.map((p) => p.x),
                      y: coords.reference_ecgs.map((p) => p.y),
                      type: "scatter",
                      mode: "markers",
                      name: "Reference",
                    },
                    {
                      x: coords.others_ecgs.map((p) => p.x),
                      y: coords.others_ecgs.map((p) => p.y),
                      type: "scatter",
                      mode: "markers",
                      name: "Others",
                    },
                    {
                      x: [coords.test_ecgs[0]],
                      y: [coords.test_ecgs[1]],
                      type: "scatter",
                      mode: "markers",
                      name: "Test",
                      marker: { size: 12 },
                    },
                  ]}
                  layout={{ height: 350, margin: { t: 30 } }}
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
