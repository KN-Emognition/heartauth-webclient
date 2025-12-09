"use client";

import React, { useState, FormEvent } from "react";
import { useApiConfig } from "../ApiConfigProvider";
import { useRouter } from "next/navigation";

export const ApiClientForm = () => {
  const { apiKey, apiUrl, setApiKey, setApiUrl } = useApiConfig();
  const router = useRouter();

  const [localApiKey, setLocalApiKey] = useState(apiKey ?? "");
  const [localApiUrl, setLocalApiUrl] = useState(apiUrl ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedKey = localApiKey.trim();
    const trimmedUrl = localApiUrl.trim();

    if (!trimmedKey || !trimmedUrl) return;

    setApiKey(trimmedKey);
    setApiUrl(trimmedUrl);

    router.push("/dashboard");
  };

  return (
    <form className="mx-auto w-[400px] space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">API Key</label>
        <input
          className="w-full rounded border px-3 py-2"
          type="password"
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">API URL</label>
        <input
          className="w-full rounded border px-3 py-2"
          type="text"
          value={localApiUrl}
          onChange={(e) => setLocalApiUrl(e.target.value)}
        />
      </div>

      <button
        className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700"
        type="submit"
      >
        Save & Continue
      </button>
    </form>
  );
};
