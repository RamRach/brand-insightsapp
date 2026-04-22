import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import type { Insight } from "$models/insight.ts";
import createInsight from "./create-insight.ts";

describe("creating an insight in the database", () => {
  withDB((fixture) => {
    const input = {
      brand: 2,
      createdAt: "2024-06-01T00:00:00.000Z",
      text: "Denim jackets trending in urban areas",
    };

    let result: Insight;

    beforeAll(() => {
      result = createInsight({ ...fixture, ...input });
    });

    it("returns an insight with a generated id", () => {
      expect(typeof result.id).toBe("number");
      expect(result.id).toBeGreaterThan(0);
    });

    it("returns an insight with the correct brand", () => {
      expect(result.brand).toBe(input.brand);
    });

    it("returns an insight with createdAt as a Date", () => {
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe(input.createdAt);
    });

    it("returns an insight with the correct text", () => {
      expect(result.text).toBe(input.text);
    });

    it("persists the row in the database", () => {
      const rows = fixture.insights.selectAll();
      expect(rows.length).toBe(1);
      expect(rows[0].id).toBe(result.id);
      expect(rows[0].brand).toBe(input.brand);
      expect(rows[0].createdAt).toBe(input.createdAt);
      expect(rows[0].text).toBe(input.text);
    });
  });
});
