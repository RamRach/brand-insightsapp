import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  createdAt: string; // ISO 8601
  text: string;
};

export default (input: Input): Insight => {
  const insert: insightsTable.Insert = {
    brand: input.brand,
    createdAt: input.createdAt,
    text: input.text,
  };

  input.db.exec(insightsTable.insertStatement(insert));

  const [row] = input.db.sql<insightsTable.Row>`
    SELECT * FROM insights WHERE id = last_insert_rowid()
  `;

  return { ...row, createdAt: new Date(row.createdAt) };
};
