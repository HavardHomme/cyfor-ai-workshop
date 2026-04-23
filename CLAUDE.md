# AGENTS.md — Cyfor Workshop

This is a **booking/resource management** web application. Use this file as a quick reference when working in the repo.

## Structure

| Path | What it is |
|---|---|
| `api/` | Hono REST API with Prisma + SQLite |
| `web/` | React + Vite frontend |
| `slides/` | Workshop presentation (Reveal.js) |
| `workshop-tasks/` | Workshop task descriptions |

## Running the project

```bash
npm install       # install all workspaces
npm run dev       # start API (port 3000) + frontend (port 5173) concurrently
npm run dev:api   # API only
npm run dev:web   # frontend only (assumes API is running)
```

## Code generation

After any change to the API routes or OpenAPI schema, regenerate the frontend client:

```bash
npm run generate
```

This runs Prisma client generation, exports `api/openapi.json`, and runs Orval to regenerate the typed hooks in `web/src/api/`.

## Key conventions

- **API changes**: define routes in `api/src/app.ts` using `@hono/zod-openapi`. Zod schemas are the source of truth for validation and the OpenAPI spec.
- **Frontend API calls**: use the generated hooks in `web/src/api/` (e.g. `useGetItems`, `usePostItems`). Do not hand-write fetch calls.
- **Database schema**: edit `api/prisma/schema.prisma`, then run `npm run generate` or `npx prisma db push` to sync.
- **Styling**: TailwindCSS utility classes, consistent with existing components in `web/src/`.
- Use existing npm scripts — do not introduce new tooling or build steps.
- Keep changes small and consistent with the current code style.

## After API/schema changes — checklist

1. Update the Zod schema in `api/src/app.ts`
2. Update `api/prisma/schema.prisma` if the DB model changed
3. Run `npm run generate` to regenerate the Prisma client, OpenAPI spec, and Orval hooks
4. Update the frontend to use new/changed fields
5. Run `npm run typecheck` to verify no type errors

## Domain language

This app manages **resources** (things that can be booked). Prefer domain terms like _resource_, _booking_, _category_, and _availability_ over generic terms like _item_ or _object_.
