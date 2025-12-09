"use client";

import { useState, useEffect } from "react";
import { createClientInstance, ModelApiClient } from "@/contract/client";
import { useApiConfig } from "../ApiConfigProvider";

import { components } from "@/contract/generated/model-api";
import { useVisualizationQuery } from "./useVisualizationQuery";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type Method = components["schemas"]["VisualizationRequest"]["methods"][number];

const METHODS: Method[] = [
  "tsne_fit_on_all_ref",
  "umap_fit_on_all_ref",
  "umap_fit_larfield",
];

export default function VisualizationDashboard() {
  const [selectedMethods, setSelectedMethods] = useState<Method[]>([
    "tsne_fit_on_all_ref",
  ]);

  const { apiKey, apiUrl } = useApiConfig();
  const [apiClient, setApiClient] = useState<ModelApiClient | null>(null);

  useEffect(() => {
    setApiClient(createClientInstance(apiKey, apiUrl));
  }, [apiKey, apiUrl]);

  const { data, refetch } = useVisualizationQuery({
    selectedMethods,
    apiClient,
  });

  useEffect(() => {
    if (!apiClient) return;
    const interval = setInterval(refetch, 10000);
    return () => clearInterval(interval);
  }, [apiClient, refetch]);

  const toggleMethod = (method: Method) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Visualization Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Real-time embedding projections
          </p>
        </div>

        {/* <button
          onClick={refetch}
          disabled={isLoading}
          className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition
            ${
              isLoading
                ? "bg-gray-300 text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }
          `}
        >
          {isLoading ? "Updating…" : "Update"}
        </button> */}
      </div>

      {/* Method Toggles */}
      <div className="mb-6 flex flex-wrap gap-2">
        {METHODS.map((method) => {
          const active = selectedMethods.includes(method);
          return (
            <button
              key={method}
              onClick={() => toggleMethod(method)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition
                ${
                  active
                    ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                    : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100"
                }
              `}
            >
              {method}
            </button>
          );
        })}
      </div>

      {/* Plots */}
      {data && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(data.mapping_method_to_coordinates).map(
            ([method, coords]) => (
              <div
                key={method}
                className="
                  w-full
                  aspect-square
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  p-4
                  shadow-sm
                  flex
                  flex-col
                "
              >
                <h3 className="mb-2 text-sm font-semibold text-gray-700 shrink-0">
                  {method}
                </h3>

                <div className="flex-1">
                  <Plot
                    useResizeHandler
                    style={{ width: "100%", height: "100%" }}
                    data={[
                      {
                        x: coords.reference_ecgs.map((p) => p.x),
                        y: coords.reference_ecgs.map((p) => p.y),
                        type: "scatter",
                        mode: "markers",
                        name: "Reference",
                        marker: {
                          color: "blue",
                          size: 8,
                          // symbol: "circle-open",
                          // line: { width: 2 },
                        },
                      },
                      {
                        x: coords.others_ecgs.map((p) => p.x),
                        y: coords.others_ecgs.map((p) => p.y),
                        type: "scatter",
                        mode: "markers",
                        name: "Others",
                        marker: { color: "gray", size: 6, opacity: 0.6 },
                      },
                      {
                        x: coords.test_ecgs.map((p) => p.x),
                        y: coords.test_ecgs.map((p) => p.y),
                        type: "scatter",
                        mode: "markers",
                        name: "Test",
                        marker: {
                          size: 8,
                          color: coords.test_ecgs.map((p) =>
                            p.authenticated ? "green" : "red"
                          ),
                          // symbol: "diamond",
                        },
                        text: coords.test_ecgs.map(
                          (p) =>
                            `score: ${p.score}<br/>authenticated: ${p.authenticated}<br/>${p.timestamp}`
                        ),
                        hoverinfo: "text",
                      },
                    ]}
                    // layout={{
                    //   height: 320,
                    //   margin: { t: 20, l: 30, r: 10, b: 30 },
                    //   yaxis: { scaleanchor: "x" },
                    //   paper_bgcolor: "transparent",
                    //   plot_bgcolor: "transparent",
                    // }}
                    layout={{
                      autosize: true,
                      margin: { t: 10, l: 10, r: 10, b: 10 },
                      paper_bgcolor: "transparent",
                      plot_bgcolor: "transparent",
                      legend: {
                        orientation: "v",
                        x: 0.01,
                        y: 0.99,
                        xanchor: "left",
                        yanchor: "top",
                        bgcolor: "rgba(255,255,255,0.6)",
                        font: { size: 11 },
                      },
                      xaxis: {
                        visible: false,
                        range: scaleHelper(
                          coords.reference_ecgs,
                          coords.others_ecgs
                        ).xRange,
                      },
                      yaxis: {
                        visible: false,
                        range: scaleHelper(
                          coords.reference_ecgs,
                          coords.others_ecgs
                        ).yRange,
                        scaleanchor: "x",
                      },
                    }}
                    config={{ displayModeBar: false, responsive: true }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function scaleHelper(reference_ecgs: components["schemas"]["EcgPoint"][], test_ecgs: components["schemas"]["EcgPoint"][]) {
  const allBasePoints = [...reference_ecgs, ...test_ecgs];

  const xs = allBasePoints.map((p) => p.x);
  const ys = allBasePoints.map((p) => p.y);

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  const xPadding = (xMax - xMin) * 0.2;
  const yPadding = (yMax - yMin) * 0.2;

  const xRange: [number, number] = [xMin - xPadding, xMax + xPadding];

  const yRange: [number, number] = [yMin - yPadding, yMax + yPadding];
  return { xRange, yRange };
}
