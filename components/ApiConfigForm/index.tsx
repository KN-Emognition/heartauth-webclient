"use client";
import React, { useState, FormEvent } from "react";
import { useApiConfig } from "../ApiConfigProvider";

export const ApiClientForm = () => {
  const { apiKey, apiUrl, setApiKey, setApiUrl } = useApiConfig();

  const [localApiKey, setLocalApiKey] = useState(apiKey ?? "");
  const [localApiUrl, setLocalApiUrl] = useState(apiUrl ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedKey = localApiKey.trim();
    const trimmedUrl = localApiUrl.trim();

    if (!trimmedKey || !trimmedUrl) {
      return;
    }

    setApiKey(trimmedKey);
    setApiUrl(trimmedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col mx-auto w-[400px]">
      <div className="flex w-full">
        <label className="flex w-full">
          API Key
          <input
            className="ml-auto"
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="Enter API key"
          />
        </label>
      </div>

      <div className="flex w-full">
        <label className="flex w-full">
          API URL
          <input
            className="ml-auto"
            type="text"
            value={localApiUrl}
            onChange={(e) => setLocalApiUrl(e.target.value)}
            placeholder="https://api.example.com"
          />
        </label>
      </div>

      <button className="bg-blue-500 p-2 hover:bg-blue-900 active:bg-red-300" type="submit">
        Save API Config
      </button>
    </form>
  );
};
