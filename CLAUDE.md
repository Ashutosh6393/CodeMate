


# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

CodeMate is a real-time collaborative code editor. It's a pnpm + Turborepo monorepo with three deployable services and shared packages:

- `apps/client` — React 19 + Vite + TailwindCSS 4 + Monaco editor (Shadcn UI, React Router v7)
- `apps/server` — Express REST API (TypeScript), JWT auth (argon2), port 3000
- `apps/socketServer` — native WebSocket server (`ws`) backed by Redis pub/sub, port 8080
- `packages/database` — Prisma schema + migrations (PostgreSQL); imported as `@repo/*`
- `packages/errors`, `packages/typescript-config` — shared modules

## Commands

Package manager is **pnpm** (v10.x). Run from the repo root unless noted.

- `pnpm dev` — run all services (turbo persistent; runs `db:generate` first)
- `pnpm build` — build all packages (depends on `db:generate` and `^build`)
- `pnpm lint` / `pnpm lint:fix` — ESLint across packages
- `pnpm test` — run all tests (Vitest, via turbo). Per app: `pnpm --filter client test`, `--filter server test`, `--filter socketserver test`; add `:watch` for watch mode.
- `pnpm db:generate` — generate the Prisma client. **Run this after any schema change and before build/dev** — turbo wires it as a dependency, but a stale client causes confusing type errors.
- DB migrations live in `packages/database`: `db:migrate:dev` (dev) and `db:deploy` (production).

## Testing

Tests use **Vitest**. Each app has its own config: `apps/client` uses the `test` block in `vite.config.ts` (jsdom + React Testing Library, setup in `src/test/setup.ts`); `apps/server` and `apps/socketServer` use a `vitest.config.ts` with the node environment. Test files live next to source as `*.test.ts(x)` and are excluded from the production `tsc` build. Import test globals explicitly (`import { describe, it, expect } from "vitest"`) — `globals` is not enabled.

## Local dev setup

Beyond `pnpm install`, a fresh checkout needs:

- **`.env` files** per app, created from `.env.example` (see `copy-env.sh`). Required vars: client `VITE_SERVER_URL` / `VITE_SOCKET_URL`; server `JWT_ACCESS_TOKEN_SECRET` / `JWT_REFRESH_TOKEN_SECRET` / `JUDGE0_API_KEY`; socketServer `REDIS_*`; database `DATABASE_URL`.
- A reachable **PostgreSQL** (`DATABASE_URL`), then `pnpm db:generate` + migrations.
- A reachable **Redis** — the socket server's collaboration won't work without it.
- A **Judge0 API key** — the code compile/run feature won't work without it.

## Code style

- Prettier is the source of truth (`.prettierrc`): 2-space indent, double quotes, semicolons, trailing commas (`all`), `printWidth` 80, LF line endings. Don't hand-format against these.
- ESLint uses the flat-config format (`eslint.config.js` per app) with `prettier/prettier` as an error rule.
- Client TS path alias: `@/*` → `./src/*`.

## Sync model (socketServer)

Real-time collaboration is a **naive full-document broadcast**: a client sends content, the server rebroadcasts it to the room via Redis pub/sub. There is **no operational transform or CRDT** and no conflict resolution — keep this in mind before "fixing" the socket code with merge logic that isn't there.

## Git & deployment

- Work on **feature branches and open PRs into `main`** — don't commit directly to `main`.
- A husky pre-commit hook runs `turbo run format lint:fix --filter=...[HEAD]` on changed packages.
- **Pushing to `main` auto-deploys.** GitHub Actions (`.github/workflows/cd_*.yml`) build Docker images, push to DockerHub, and SSH-deploy to the production VPS. Treat merges to `main` as production releases.
