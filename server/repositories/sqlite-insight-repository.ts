import type { Database } from "@db/sqlite";
import type { Insight, CreateInsightInput } from "../domain/insight.ts";
import type { InsightRepository } from "./insight-repository.ts";

type Row = {
  id: number;
  brand: number;
  createdAt: string;
  text: string;
};

export const createTable = `
  CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brand INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
  )
`;

const toInsight = (row: Row): Insight => ({
  ...row,
  createdAt: new Date(row.createdAt),
});

export class SqliteInsightRepository implements InsightRepository {
  constructor(private readonly db: Database) {}

  findAll(): Insight[] {
    console.log("[SqliteInsightRepository] findAll");
    const rows = this.db.sql<Row>`SELECT * FROM insights`;
    console.log(`[SqliteInsightRepository] findAll returned ${rows.length} rows`);
    return rows.map(toInsight);
  }

  findById(id: number): Insight | undefined {
    console.log(`[SqliteInsightRepository] findById id=${id}`);
    const [row] = this.db.sql<Row>`SELECT * FROM insights WHERE id = ${id} LIMIT 1`;
    if (row) {
      console.log(`[SqliteInsightRepository] findById found id=${id}`);
    } else {
      console.log(`[SqliteInsightRepository] findById not found id=${id}`);
    }
    return row ? toInsight(row) : undefined;
  }

  create(input: CreateInsightInput): Insight {
    console.log(`[SqliteInsightRepository] create brand=${input.brand} createdAt=${input.createdAt}`);
    this.db
      .prepare("INSERT INTO insights (brand, createdAt, text) VALUES (?, ?, ?)")
      .run(input.brand, input.createdAt, input.text);
    const [row] = this.db.sql<Row>`SELECT * FROM insights WHERE id = last_insert_rowid()`;
    console.log(`[SqliteInsightRepository] create inserted id=${row.id}`);
    return toInsight(row);
  }

  delete(id: number): boolean {
    console.log(`[SqliteInsightRepository] delete id=${id}`);
    this.db.prepare("DELETE FROM insights WHERE id = ?").run(id);
    const deleted = this.db.changes > 0;
    console.log(`[SqliteInsightRepository] delete id=${id} deleted=${deleted}`);
    return deleted;
  }
}
