# Monorepo with pnpm + Turborepo

CodeMate is split across three independently deployable services (the React
client, the Express REST API, and the WebSocket sync server) plus shared
packages (`@repo/db`, `@repo/errors`, `typescript-config`). We keep all of it in
a single pnpm-workspace monorepo orchestrated by Turborepo rather than separate
repositories.

The driver is that the three services share types and the Prisma client and
evolve together — a change to the WebSocket message protocol or the auth token
shape needs to land across client and server atomically. A monorepo makes those
cross-cutting changes a single commit, and Turborepo wires the build graph
(`db:generate` before everything, `^build` ordering) so a stale shared package
can't silently break a downstream service. The trade-off is heavier tooling
(pnpm + turbo) and that the CI/CD pipeline must filter changes per package
(`--filter=...[HEAD]`) instead of building one thing.
