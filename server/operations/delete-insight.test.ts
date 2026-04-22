import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleting an insight from the database", () => {
  describe("insight exists in the DB", () => {
    withDB((fixture) => {
      let result: boolean;

      beforeAll(() => {
        fixture.insights.insert([
          { brand: 1, createdAt: new Date().toISOString(), text: "test insight" },
        ]);
        result = deleteInsight({ ...fixture, id: 1 });
      });

      it("returns true", () => {
        expect(result).toBe(true);
      });

      it("removes the row from the DB", () => {
        expect(fixture.insights.selectAll()).toEqual([]);
      });
    });
  });

  describe("insight does not exist in the DB", () => {
    withDB((fixture) => {
      let result: boolean;

      beforeAll(() => {
        result = deleteInsight({ ...fixture, id: 999 });
      });

      it("returns false", () => {
        expect(result).toBe(false);
      });
    });
  });
});
