Testing

No integration or e2e tests — with 20 engineers merging frequently, unit tests alone aren't enough. Adding Playwright or similar for e2e would catch regressions across the full stack.
No test coverage thresholds enforced in CI — easy to slip in untested code at scale.
CI/CD

No pipeline defined (no GitHub Actions, no lint/type-check/test on PR). With 20 engineers, you need automated gates before anything merges — type check, lint, format, and test should all run on every PR.
Database

No migrations system — right now the schema is created on startup with IF NOT EXISTS. As the schema evolves with 20 engineers making changes, you need a proper migration tool (e.g. a simple versioned SQL file runner) so schema changes are tracked, reviewable, and reversible.
API contract

No shared type contract between server and client — the field mapping (brand → brandId) is done manually in app.tsx and could easily drift. A shared schema (moving the Zod models into lib/) would give both sides a single source of truth.
Auth

No authentication or authorisation — anyone can add or delete insights. At scale you'd need at minimum an API key or session-based auth before exposing this to real customers.
Observability

Only console.log for logging — no structured logging, no error tracking (e.g. Sentry), no request tracing. Hard to debug production issues with 20 engineers shipping daily.