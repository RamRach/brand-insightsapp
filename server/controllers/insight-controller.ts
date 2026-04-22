import * as oak from "@oak/oak";
import { CreateInsightInput } from "../domain/insight.ts";
import type { InsightService } from "../services/insight-service.ts";

export class InsightController {
  constructor(private readonly service: InsightService) {}

  list(ctx: oak.RouterContext<string>) {
    ctx.response.body = this.service.listInsights();
    ctx.response.status = 200;
  }

  lookup(ctx: oak.RouterContext<string>) {
    const id = parseInt((ctx.params as Record<string, string>).id, 10);
    if (isNaN(id)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "id must be an integer" };
      return;
    }
    const insight = this.service.lookupInsight(id);
    if (!insight) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Insight not found" };
      return;
    }
    ctx.response.body = insight;
    ctx.response.status = 200;
  }

  async create(ctx: oak.RouterContext<string>) {
    const body = await ctx.request.body.json();
    const parsed = CreateInsightInput.safeParse(body);
    if (!parsed.success) {
      ctx.response.status = 400;
      ctx.response.body = { error: parsed.error.message };
      return;
    }
    ctx.response.body = this.service.createInsight(parsed.data);
    ctx.response.status = 201;
  }

  remove(ctx: oak.RouterContext<string>) {
    const id = parseInt((ctx.params as Record<string, string>).id, 10);
    if (isNaN(id)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "id must be an integer" };
      return;
    }
    const deleted = this.service.deleteInsight(id);
    if (!deleted) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Insight not found" };
      return;
    }
    ctx.response.status = 204;
  }
}
