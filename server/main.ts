// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { z } from "zod";
import { Port } from "../lib/utils/index.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import * as insightsTable from "./tables/insights.ts";
import { openApiSpec, swaggerUiHtml } from "./openapi.ts";

const CreateInsightBody = z.object({
  brand: z.number().int().min(1),
  createdAt: z.string().datetime(),
  text: z.string().min(1),
});

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.exec(insightsTable.createTable);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx: oak.RouterContext<string>) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/docs", (ctx: oak.RouterContext<string>) => {
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = swaggerUiHtml("/openapi.json");
  ctx.response.status = 200;
});

router.get("/openapi.json", (ctx: oak.RouterContext<string>) => {
  ctx.response.body = openApiSpec;
  ctx.response.status = 200;
});

router.get("/insights", (ctx: oak.RouterContext<string>) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx: oak.RouterContext<string>) => {
  const params = ctx.params as Record<string, any>;
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "id must be an integer" };
    return;
  }
  const result = lookupInsight({ db, id });
  if (!result) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Insight not found" };
    return;
  }
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx: oak.RouterContext<string>) => {
  const body = await ctx.request.body.json();
  const parsed = CreateInsightBody.safeParse(body);
  if (!parsed.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: parsed.error.message };
    return;
  }
  const result = createInsight({ db, ...parsed.data });
  ctx.response.body = result;
  ctx.response.status = 201;
});

router.delete("/insights/:id", (ctx: oak.RouterContext<string>) => {
  const id = parseInt(ctx.params.id, 10);
  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "id must be an integer" };
    return;
  }
  const deleted = deleteInsight({ db, id });
  if (!deleted) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Insight not found" };
    return;
  }
  ctx.response.status = 204;
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
