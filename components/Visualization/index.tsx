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
  "umap_fit_on_larfield",
];

export default function VisualizationDashboard() {
  const [selectedMethods, setSelectedMethods] = useState<Method[]>([
    "tsne_fit_on_all_ref",
  ]);

  const { apiKey, apiUrl } = useApiConfig();
  const [apiClient, setApiClient] = useState<ModelApiClient | null>(null);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [minTimestamp, setMinTimestamp] = useState(0);
  const [dotSize, setDotSize] = useState(8);

  const parseTs = (ts: string) => new Date(ts.replace(" ", "T")).getTime();

  useEffect(() => {
    setApiClient(createClientInstance(apiKey, apiUrl));
  }, [apiKey, apiUrl]);

  const { data, refetch } = useVisualizationQuery({
    selectedMethods,
    apiClient,
  });

  useEffect(() => {
    if (!apiClient || !autoRefresh) return;

    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [apiClient, refetch, autoRefresh]);

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
          <div className="flex flex-row gap-4 items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Visualization Dashboard
            </h1>
            {/* Record toggle with soft pulse */}
        <button
          onClick={() => setAutoRefresh((v) => !v)}
          className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-red-500 relative"
        >
          <div
            className={`
              w-3.5 h-3.5 rounded-full transition-all duration-500
              ${autoRefresh ? "bg-red-500 opacity-80 animate-[pulse_2s_ease-in-out_infinite]" : "bg-red-500 opacity-20"}
            `}
          />
        </button>
          </div>
          <p className="text-sm text-gray-500">Real-time embedding projections</p>
        </div>
        
      
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
      {/* Tools: sliders */}
      <div className="mb-8 flex flex-wrap gap-8 items-center">
        

        {/* Timestamp slider */}
        {data && (() => {
          const allTs = Object.values(data.mapping_method_to_coordinates)
            .flatMap((m) => m.test_ecgs)
            .map((p) => new Date(p.timestamp.replace(" ", "T")).getTime());

          const minTs = Math.min(...allTs);
          const maxTs = Math.max(...allTs);

          if (minTimestamp === 0) setMinTimestamp(minTs);

          return (
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Min test timestamp</label>
              <input
                type="range"
                min={minTs}
                max={maxTs}
                value={minTimestamp}
                onChange={(e) => setMinTimestamp(Number(e.target.value))}
                className="w-30 h-1.5"
              />
              {/* <span className="text-xs text-gray-500 mt-1">
                {new Date(minTimestamp).toLocaleString()}
              </span> */}
            </div>
          );
        })()}

        {/* Dot size slider */}
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Dot size</label>
          <input
            type="range"
            min={4}
            max={20}
            value={dotSize}
            onChange={(e) => setDotSize(Number(e.target.value))}
            className="w-30 h-1.5"
          />
        </div>
        
      </div>

      {/* Plots */}
      {data && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(data.mapping_method_to_coordinates).map(
            ([method, coords]) => {
              // parse timestamps
              const parsed = coords.test_ecgs.map((p) => ({
                ...p,
                _ts: parseTs(p.timestamp),
              }));

              // filter according to slider
              const filteredTest = parsed.filter((p) => p._ts >= minTimestamp);

              // newest test
              const newest =
                filteredTest.length > 0
                  ? filteredTest.reduce((a, b) => (a._ts > b._ts ? a : b))
                  : null;
              const testPos = filteredTest.filter(p => p.authenticated);
              const testNeg = filteredTest.filter(p => !p.authenticated);
              return (
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
                          marker: { color: "blue", size: 8 },
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
  x: testPos.map(p => p.x),
  y: testPos.map(p => p.y),
  type: "scatter",
  mode: "markers",
  name: "Test Positive",
  marker: {
    size: dotSize,
    color: "green"
  },
  text: testPos.map(
    (p) =>
      `score: ${p.score}<br/>authenticated: ${p.authenticated}<br/>${p.timestamp}`
  ),
  hoverinfo: "text",
},
{
  x: testNeg.map(p => p.x),
  y: testNeg.map(p => p.y),
  type: "scatter",
  mode: "markers",
  name: "Test Negative",
  marker: {
    size: dotSize,
    color: "red"
  },
  text: testNeg.map(
    (p) =>
      `score: ${p.score}<br/>authenticated: ${p.authenticated}<br/>${p.timestamp}`
  ),
  hoverinfo: "text",
},
                        ...(newest
                          ? [
                              {
                                x: [newest.x],
                                y: [newest.y],
                                type: "scatter",
                                mode: "markers",
                                name: "Newest",
                                marker: {
                                  size: dotSize + 4,
                                  symbol: "diamond",
                                  color: newest.authenticated ? "green" : "red",
                                  // line: { width: 3 },
                                },
                              },
                            ]
                          : []),
                      ]}
                      layout={{
                        autosize: true,
                        margin: { t: 10, l: 10, r: 10, b: 10 },
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        legend: {
                          orientation: "v",
                          x: 0.99,
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
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

function scaleHelper(
  reference_ecgs: components["schemas"]["EcgPoint"][],
  test_ecgs: components["schemas"]["EcgPoint"][]
) {
  const allBasePoints = [...reference_ecgs, ...test_ecgs];
  const xs = allBasePoints.map((p) => p.x);
  const ys = allBasePoints.map((p) => p.y);

  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  const paddingX = (xMax - xMin) * 0.2;
  const paddingY = (yMax - yMin) * 0.2;

  return {
    xRange: [xMin - paddingX, xMax + paddingX] as [number, number],
    yRange: [yMin - paddingY, yMax + paddingY] as [number, number],
  };
}
