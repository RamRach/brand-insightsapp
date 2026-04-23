import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  const loadInsights = async () => {
    const res = await fetch("/api/insights");
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
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header onSuccess={loadInsights} />
      <Insights
        className={styles.insights}
        insights={insights}
        onDelete={loadInsights}
      />
    </main>
  );
};
