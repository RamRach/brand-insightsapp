import type { Insight, CreateInsightInput } from "../domain/insight.ts";
import type { InsightRepository } from "../repositories/insight-repository.ts";

export class InsightService {
  constructor(private readonly repo: InsightRepository) {}

  listInsights(): Insight[] {
    return this.repo.findAll();
  }

  lookupInsight(id: number): Insight | undefined {
    return this.repo.findById(id);
  }

  createInsight(input: CreateInsightInput): Insight {
    return this.repo.create(input);
  }

  deleteInsight(id: number): boolean {
    return this.repo.delete(id);
  }
}
