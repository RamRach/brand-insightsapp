import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import { BRANDS } from "../../lib/consts.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onDelete: () => void;
};

const brandName = (id: number) => BRANDS.find((b) => b.id === id)?.name ?? `Brand ${id}`;

export const Insights = ({ insights, className, onDelete }: InsightsProps) => {
  const [error, setError] = useState<string | null>(null);

  const deleteInsight = async (id: number) => {
    setError(null);
    const res = await fetch(`/api/insights/${id}`, { method: "DELETE" });
    if (res.ok) {
      onDelete();
    } else {
      setError("Failed to delete insight. Please try again.");
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      {error && <p>{error}</p>}
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, date, brandId }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{brandName(brandId)}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{date.toLocaleString(undefined, { timeZoneName: "longGeneric" })}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={() => deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
