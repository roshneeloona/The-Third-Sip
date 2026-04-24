import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export function useAdminSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadSummary(background = false) {
      try {
        const data = await apiRequest("/api/dashboard/summary");
        if (!ignore) {
          setSummary(data);
          setError("");
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.message || "Could not load dashboard summary");
        }
      } finally {
        if (!ignore && !background) {
          setLoading(false);
        }
      }
    }

    loadSummary();
    const intervalId = setInterval(() => {
      loadSummary(true);
    }, 4000);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, []);

  return { summary, loading, error, setSummary };
}
