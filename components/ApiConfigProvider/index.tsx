"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
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

type ApiConfigProviderProps = {
  children: ReactNode;
  initialApiUrl: string;
  initialApiKey: string;
};

export const ApiConfigProvider: React.FC<ApiConfigProviderProps> = ({
  children,
  initialApiUrl,
  initialApiKey,
}) => {
  const [apiUrl, setApiUrl] = useState(initialApiUrl);
  const [apiKey, setApiKey] = useState(initialApiKey);

  const value = useMemo(
    () => ({
      apiUrl,
      apiKey,
      setApiUrl,
      setApiKey,
    }),
    [apiUrl, apiKey]
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
