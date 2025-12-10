"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

type ApiConfigContextValue = {
  apiUrl: string;
  apiKey: string;
  setApiUrl: (value: string) => void;
  setApiKey: (value: string) => void;
};

const ApiConfigContext = createContext<ApiConfigContextValue | undefined>(
  undefined
);

// Change these to whatever defaults you want:
const DEFAULT_API_URL = "";
const DEFAULT_API_KEY = "";

// LocalStorage keys
const API_URL_KEY = "apiConfig.apiUrl";
const API_KEY_KEY = "apiConfig.apiKey";

type ApiConfigProviderProps = {
  children: ReactNode;
};

export const ApiConfigProvider: React.FC<ApiConfigProviderProps> = ({
  children,
}) => {
  const [apiUrl, _setApiUrl] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_API_URL;

    const stored = window.localStorage.getItem(API_URL_KEY);
    return stored ?? DEFAULT_API_URL;
  });

  const [apiKey, _setApiKey] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_API_KEY;

    const stored = window.localStorage.getItem(API_KEY_KEY);
    return stored ?? DEFAULT_API_KEY;
  });

  const setApiUrl = useCallback((value: string) => {
    _setApiUrl(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(API_URL_KEY, value);
    }
  }, []);

  const setApiKey = useCallback((value: string) => {
    _setApiKey(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(API_KEY_KEY, value);
    }
  }, []);

  const value = useMemo(
    () => ({
      apiUrl,
      apiKey,
      setApiUrl,
      setApiKey,
    }),
    [apiUrl, apiKey, setApiUrl, setApiKey]
  );

  return (
    <ApiConfigContext.Provider value={value}>
      {children}
    </ApiConfigContext.Provider>
  );
};

export const useApiConfig = (): ApiConfigContextValue => {
  const context = useContext(ApiConfigContext);

  if (!context) {
    throw new Error("useApiConfig must be used within an ApiConfigProvider");
  }

  return context;
};
