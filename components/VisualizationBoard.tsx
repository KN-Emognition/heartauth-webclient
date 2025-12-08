import { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useApiConfig } from "./ApiConfigProvider";

// ================= TYPES =================

type Coordinates = {
  test_ecgs: [number, number];
  reference_ecgs: [number, number][];
  others_ecgs: [number, number][];
};

type VisualizationResponse = {
  mapping_method_to_coordinates: Record<string, Coordinates>;
  score: number;
  authenticated: boolean;
  timestamp: string;
};

// ================= CONSTANTS =================

const METHODS = [
  "tsne_fit_on_all_ref",
  "umap_fit_on_all_ref",
  "umap_fit_larfield",
] as const;

// ================= COMPONENT =================

export default function VisualizationDashboard() {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([
    "umap_fit_larfield",
  ]);
  const [data, setData] = useState<VisualizationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { apiKey, apiUrl } = useApiConfig();
  const fetchVisualization = async () => {
    if (selectedMethods.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/v1/visualize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ methods: selectedMethods }),
      });

      if (!res.ok) throw new Error("Visualization request failed");

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5173/ws/visualization");

    ws.onopen = () => console.log("WebSocket connected");
    ws.onmessage = () => fetchVisualization();
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  const toggleMethod = (method: string) => {
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

        <button onClick={fetchVisualization} disabled={loading}>
          {loading ? "Loading..." : "Update"}
        </button>
        <button
          onClick={async () => {
            const res = await fetch(`${API_BASE}/v1/predict`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                refEcg: [
                  [0, 0],
                  [0, 0],
                ],
                testEcg: [0, 0],
              }),
            });
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "DUMMY PREDICT"}
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
                      x: coords.reference_ecgs.map((p) => p[0]),
                      y: coords.reference_ecgs.map((p) => p[1]),
                      type: "scatter",
                      mode: "markers",
                      name: "Reference",
                    },
                    {
                      x: coords.others_ecgs.map((p) => p[0]),
                      y: coords.others_ecgs.map((p) => p[1]),
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
