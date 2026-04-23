---
name: review-pr
description: Use when reviewing a pull request in the cyfor-ai-workshop repository.
---

# Review PR

Checklist for reviewing changes in this Hono API + React/Vite booking app.

## Run first
```bash
npm run typecheck   # must pass clean
```

## Things that matter

**API changes** — Zod schemas in `api/src/app.ts` are the source of truth. Check that request/response shapes are correct and nullable fields are intentional.

**Generated client** — if any API route or Prisma schema changed, `npm run generate` must have been re-run. Stale `web/src/api/` hooks are a common mistake.

**No hand-written fetches** — frontend should only use generated hooks (`useGetItems`, `usePostItems`, etc.), never raw `fetch()` or `axios`.

**Domain language** — use _resource_, _booking_, _category_. Flag uses of _item_, _object_, _entry_.

**Scope** — changes should be small and focused. Large diffs mixing unrelated concerns are a red flag.
