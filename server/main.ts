import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import { InsightController } from "./controllers/insight-controller.ts";
import { openApiSpec, swaggerUiHtml } from "./openapi.ts";
import { SqliteInsightRepository, createTable } from "./repositories/sqlite-insight-repository.ts";
import { InsightService } from "./services/insight-service.ts";

console.log("Loading configuration");
const env = { port: Port.parse(Deno.env.get("SERVER_PORT")) };

const dbFilePath = path.resolve("tmp", "db.sqlite3");
console.log(`Opening SQLite database at ${dbFilePath}`);
await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.exec(createTable);

// Wire up layers
const insightRepo = new SqliteInsightRepository(db);
const insightService = new InsightService(insightRepo);
const insightController = new InsightController(insightService);

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

router.get("/insights", (ctx) => insightController.list(ctx));
router.get("/insights/:id", (ctx) => insightController.lookup(ctx));
router.post("/insights", (ctx) => insightController.create(ctx));
router.delete("/insights/:id", (ctx) => insightController.remove(ctx));

const app = new oak.Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
