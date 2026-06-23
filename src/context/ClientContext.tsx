import { createContext, useContext, useState, useEffect } from "react";
import type { ApiClient } from "../types";

interface ClientContextValue {
  client: ApiClient | null;
  loading: boolean;
  error: string | null;
}

const ClientContext = createContext<ClientContextValue>({
  client: null,
  loading: true,
  error: null,
});

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<ApiClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (!res.ok) {
          return res.json().then(
            (body) => { throw new Error(body?.error ?? `HTTP ${res.status}`); },
            () => { throw new Error(`HTTP ${res.status}`); }
          );
        }
        return res.json() as Promise<ApiClient>;
      })
      .then((data) => {
        setClient(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <ClientContext.Provider value={{ client, loading, error }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}
