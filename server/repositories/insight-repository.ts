import type { Insight, CreateInsightInput } from "../domain/insight.ts";

export interface InsightRepository {
  findAll(): Insight[];
  findById(id: number): Insight | undefined;
  create(input: CreateInsightInput): Insight;
  delete(id: number): boolean;
}
