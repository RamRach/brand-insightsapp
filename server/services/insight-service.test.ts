import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "../domain/insight.ts";
import { SqliteInsightRepository } from "../repositories/sqlite-insight-repository.ts";
import { InsightService } from "./insight-service.ts";

const makeService = (db: ConstructorParameters<typeof SqliteInsightRepository>[0]) =>
  new InsightService(new SqliteInsightRepository(db));

describe("InsightService.listInsights", () => {
  describe("empty DB", () => {
    withDB((fixture) => {
      let result: Insight[];
      beforeAll(() => { result = makeService(fixture.db).listInsights(); });
      it("returns empty array", () => { expect(result).toEqual([]); });
    });
  });

  describe("populated DB", () => {
    withDB((fixture) => {
      const seed: Insight[] = [
        { id: 1, brand: 1, createdAt: new Date("2024-01-01T00:00:00.000Z"), text: "first" },
        { id: 2, brand: 2, createdAt: new Date("2024-02-01T00:00:00.000Z"), text: "second" },
      ];
      let result: Insight[];
      beforeAll(() => {
        fixture.insights.insert(seed.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() })));
        result = makeService(fixture.db).listInsights();
      });
      it("returns all insights", () => { expect(result).toEqual(seed); });
    });
  });
});

describe("InsightService.lookupInsight", () => {
  describe("not found", () => {
    withDB((fixture) => {
      let result: Insight | undefined;
      beforeAll(() => { result = makeService(fixture.db).lookupInsight(999); });
      it("returns undefined", () => { expect(result).toBeUndefined(); });
    });
  });

  describe("found", () => {
    withDB((fixture) => {
      const seed: Insight[] = [
        { id: 1, brand: 1, createdAt: new Date("2024-01-01T00:00:00.000Z"), text: "target" },
      ];
      let result: Insight | undefined;
      beforeAll(() => {
        fixture.insights.insert(seed.map((i) => ({ ...i, createdAt: i.createdAt.toISOString() })));
        result = makeService(fixture.db).lookupInsight(1);
      });
      it("returns the insight", () => { expect(result).toEqual(seed[0]); });
    });
  });
});

describe("InsightService.createInsight", () => {
  withDB((fixture) => {
    const input = { brand: 2, createdAt: "2024-06-01T00:00:00.000Z", text: "Denim jackets trending" };
    let result: Insight;
    beforeAll(() => { result = makeService(fixture.db).createInsight(input); });

    it("returns insight with generated id", () => {
      expect(typeof result.id).toBe("number");
      expect(result.id).toBeGreaterThan(0);
    });
    it("returns correct brand", () => { expect(result.brand).toBe(input.brand); });
    it("returns createdAt as Date", () => {
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe(input.createdAt);
    });
    it("returns correct text", () => { expect(result.text).toBe(input.text); });
    it("persists to DB", () => {
      const rows = fixture.insights.selectAll();
      expect(rows.length).toBe(1);
      expect(rows[0].brand).toBe(input.brand);
      expect(rows[0].text).toBe(input.text);
    });
  });
});

describe("InsightService.deleteInsight", () => {
  describe("insight exists", () => {
    withDB((fixture) => {
      let result: boolean;
      beforeAll(() => {
        fixture.insights.insert([{ brand: 1, createdAt: new Date().toISOString(), text: "to delete" }]);
        result = makeService(fixture.db).deleteInsight(1);
      });
      it("returns true", () => { expect(result).toBe(true); });
      it("removes from DB", () => { expect(fixture.insights.selectAll()).toEqual([]); });
    });
  });

  describe("insight does not exist", () => {
    withDB((fixture) => {
      let result: boolean;
      beforeAll(() => { result = makeService(fixture.db).deleteInsight(999); });
      it("returns false", () => { expect(result).toBe(false); });
    });
  });
});
