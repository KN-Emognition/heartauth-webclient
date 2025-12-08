import { ModelApiClient } from "@/contract/client";
import { components } from "@/contract/generated/model-api";
import { useQuery } from "@tanstack/react-query";

type Method = components["schemas"]["VisualizationRequest"]["methods"][number];

interface UseVisualizationQueryProps {
  selectedMethods: Method[];
  apiClient: ModelApiClient | null;
}

export function useVisualizationQuery({
  selectedMethods,
  apiClient,
}: UseVisualizationQueryProps) {
  const query = useQuery({
    queryKey: ["visualization", selectedMethods],
    enabled: selectedMethods.length > 0 && !!apiClient,
    queryFn: async () => {
      if (!apiClient) {
        throw new Error("API client is not initialized");
      }
      const res = await apiClient.POST("/v1/visualize", {
        body: {
          methods: selectedMethods,
        },
      });

      if (!res.response.ok) {
        throw new Error("Visualization request failed");
      }
      if (!res.data) {
        throw new Error("No data returned from visualization endpoint");
      }

      return res.data;
    },
  });

  return query;
}
