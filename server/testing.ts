import { Database } from "@db/sqlite";
import { afterAll, beforeAll } from "@std/testing/bdd";
import { createTable } from "./repositories/sqlite-insight-repository.ts";

type Row = { id: number; brand: number; createdAt: string; text: string };
type InsertRow = Omit<Row, "id">;

export type Fixture = {
  db: Database;
  insights: {
    insert(rows: InsertRow[]): void;
    selectAll(): Row[];
  };
};

export const withDB = <R>(fn: (fixture: Fixture) => R): R => {
  const db = new Database(":memory:");

  beforeAll(() => db.exec(createTable));
  afterAll(() => db.close());

  return fn({
    db,
    insights: {
      selectAll: () => db.sql<Row>`SELECT * FROM insights`,
      insert(rows) {
        for (const item of rows) {
          db.prepare("INSERT INTO insights (brand, createdAt, text) VALUES (?, ?, ?)")
            .run(item.brand, item.createdAt, item.text);
        }
      },
    },
  });
};
