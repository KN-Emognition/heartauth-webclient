import createClient from "openapi-fetch";
import type { paths as InternalPaths } from "../contract/generated/model-api";

export type ModelApiClient = ReturnType<typeof createModelApiClient>;

export function createModelApiClient(opts?: {
  baseUrl?: string;
  additionalHeaders?: Record<string, string>;
}) {
  const { baseUrl, additionalHeaders = {} } = opts ?? {};

  return createClient<InternalPaths>({
    baseUrl,
    fetch: globalThis.fetch,
    headers: {
      "content-type": "application/json",
      ...additionalHeaders,
    },
  });
}

export const createApiKey = (key: string) => ({
  "X-API-Key": key,
});

export const createClientInstance = (apiKey: string, apiUrl: string) => {
  return createModelApiClient({
    baseUrl: apiUrl,
    additionalHeaders: createApiKey(apiKey),
  });
};
