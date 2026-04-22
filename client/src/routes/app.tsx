import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadInsights = async () => {
    try {
      const res = await fetch("/api/insights");
      if (!res.ok) throw new Error("Failed to load insights");
      const data = await res.json();
      setInsights(
        data.map(
          (item: {
            id: number;
            brand: number;
            createdAt: string;
            text: string;
          }) => ({
            id: item.id,
            brandId: item.brand,
            date: new Date(item.createdAt),
            text: item.text,
          }),
        ),
      );
      setFetchError(null);
    } catch {
      setFetchError("Failed to load insights. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header onSuccess={loadInsights} />
      {loading
        ? <p>Loading...</p>
        : fetchError
          ? <p>{fetchError}</p>
          : (
            <Insights
              className={styles.insights}
              insights={insights}
              onDelete={loadInsights}
            />
          )}
    </main>
  );
};
