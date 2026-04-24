import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export function useAdminSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadSummary() {
      try {
        const data = await apiRequest("/api/dashboard/summary");
        if (!ignore) {
          setSummary(data);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load dashboard summary");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSummary();
    return () => {
      ignore = true;
    };
  }, []);

  return { summary, loading, error, setSummary };
}
