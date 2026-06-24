# PRD: CodeMate CodeSpace Redesign

> Synthesis of a completed design conversation. Vocabulary in this document uses the
> **new** meanings agreed in that design (see _Further Notes → Vocabulary changes_);
> some terms diverge from the current `CONTEXT.md` glossary.

## Problem Statement

CodeMate today lets one person edit code in the browser while others watch it update
live, and anyone can run it against a hosted engine. But the way it works gets in the
way of the things people actually want to do with it:

- **My work disappears.** A share is ephemeral and lives only as long as I stay
  connected. The moment I close the tab, the code is gone. There is nowhere to keep a
  CodeSpace and come back to it, and nothing to find again later.
- **I can only have one.** A share is keyed to my own user id, so I effectively get a
  single live document at a time. I can't keep separate scratchpads for separate
  problems.
- **Two of us can't really type together.** When more than one person edits, the app
  ships the whole document on every change and the last write wins — so concurrent
  edits clobber each other. "Collaborative editing" only works if exactly one person
  is actually editing.
- **Sharing leaks my identity and is spoofable.** The link people open is built from
  my user id, and the realtime server trusts a user id the client sends. That couples
  the share to my account and lets a client claim to be someone it isn't.
- **Signing up is friction.** Email + password means a new account to create and a
  password to remember and for us to store, when almost everyone already has a Google
  account.
- **I can't tell what's happening.** There's no clear sense of who else is in the
  document, where their cursor is, whether I'm still connected, or whether my work has
  been saved.

## Solution

Make the **CodeSpace** a real, saved thing you own — and make editing it together
actually work.

- **Sign in with Google, once.** Google is the only front door. Behind it, CodeMate
  issues its own session so the rest of the app keeps working the way it does today.
- **Keep up to five CodeSpaces.** Each CodeSpace is persisted, owned by you, has a
  stable link, and shows up on a dashboard. Create, open, rename, and delete them. You
  get a clear cap (five) so the model stays simple.
- **Edit together for real.** Multiple people can type in the same CodeSpace at the
  same time without stepping on each other, using a proper conflict-free merge instead
  of whole-document broadcasts. You see other people's colored cursors and selections
  and a list of who's present.
- **Share with a clean link.** Hand someone the CodeSpace's own link. Opening it drops
  them into the live document; if you've turned Allow Edit off, they watch your edits
  live, read-only.
- **Run code and everyone sees the output.** Hit Run; the result (stdout, stderr,
  compile output, timing) fans out to everyone in the CodeSpace, not just you.
- **Trust the connection.** Connection status, a reconnecting indicator, and an
  autosave indicator tell you the system has your back; reconnects resync silently.

## User Stories

### Authentication & session

1. As a visitor, I want to sign in with my Google account, so that I don't have to
   create or remember a CodeMate password.
2. As a visitor, I want Google to be the only sign-in option, so that there's one
   obvious way in and nothing to set up.
3. As a returning User, I want CodeMate to keep me signed in across page loads, so that
   I don't re-authenticate every visit.
4. As a signed-in User, I want my access token to refresh automatically in the
   background, so that my session doesn't drop mid-edit.
5. As a signed-in User, I want to sign out, so that I can end my session on a shared
   machine.
6. As a User, I want my name and avatar from Google shown in the app, so that I and
   others can recognize who's who.
7. As a non-authenticated visitor, I want to be redirected to sign in when I open a
   CodeSpace link, so that access is always tied to an account (anonymous access is
   not supported in v1).

### Dashboard & CodeSpace lifecycle

8. As a User, I want a dashboard listing my owned CodeSpaces ("My CodeSpaces"), so that
   I can return to anything I created.
9. As a User, I want a "Recently opened" list of CodeSpaces I've visited but don't own,
   so that I can get back to other people's CodeSpaces I've joined.
10. As a User, I want to create a new CodeSpace from the dashboard, so that I can start
    a fresh document.
11. As a User, I want to be prevented from creating a sixth CodeSpace and told why, so
    that I stay within the five-CodeSpace cap with a clear message rather than a silent
    failure.
12. As a User, I want to open any of my CodeSpaces from the dashboard, so that I can
    resume editing where I left off.
13. As a User, I want to rename a CodeSpace, so that I can tell my CodeSpaces apart.
14. As a User, I want to delete a CodeSpace I own, so that I can free up one of my five
    slots and remove work I no longer need.
15. As a User, I want each CodeSpace to remember its language selection, so that I don't
    re-pick the language every time I open it.
16. As a User, I want my CodeSpace's contents to persist, so that closing the tab
    doesn't lose my work.

### Opening, sharing & links

17. As an owner, I want a stable shareable link of the form `/<codeSpaceId>`, so that I
    can hand it out and it keeps working over time.
18. As an owner, I want a one-click "copy link" action, so that sharing is frictionless.
19. As a User, I want opening someone's CodeSpace link to drop me into the live
    document, so that joining is just clicking a link.
20. As a User, I want opening a link to record me as a collaborator on that CodeSpace,
    so that it shows up in my "Recently opened" list afterward.
21. As an owner, I want the link to be the CodeSpace's own id rather than my user id, so
    that sharing a CodeSpace doesn't expose my account identity.

### Concurrent editing, presence & permissions

22. As an editor, I want my keystrokes and another person's keystrokes to merge without
    clobbering each other, so that we can truly type at the same time.
23. As a participant, I want to see other participants' cursors and selections in
    distinct colors, so that I can follow what everyone is doing.
24. As a participant, I want a participant list showing who is currently in the
    CodeSpace, so that I know who I'm working with.
25. As an owner, I want a single "Allow Edit" switch for the whole CodeSpace, so that I
    can control whether others can type.
26. As an owner, I want toggling Allow Edit off to immediately make non-owners
    read-only, so that I can take back control at any moment.
27. As a viewer when Allow Edit is off, I want to watch the owner's edits update live,
    so that I follow along in real time even though I can't type.
28. As a viewer when Allow Edit is off, I want my attempts to type to be silently
    ignored (not error out), so that read-only feels natural rather than broken.
29. As a participant, I want an Allow-Edit-status badge visible in the CodeSpace, so
    that I know at a glance whether I can edit or only watch.
30. As an owner, I want edit permission enforced on the server, so that a modified
    client can't bypass read-only and inject edits.

### Running code & shared output

31. As a participant, I want to run the CodeSpace's code, so that I can see whether it
    works.
32. As a participant, I want to provide standard input as a single text block before
    running, so that programs that read stdin can be exercised (batch input, not an
    interactive terminal).
33. As a participant, I want to choose the language (JavaScript, Python, Java, C++), so
    that I run the code in the right runtime.
34. As a participant, I want the run output — stdout, stderr, compile output, and timing
    — shown after a run, so that I can diagnose results and errors.
35. As any participant in the CodeSpace, I want to see the run output when anyone runs
    the code, so that the whole group sees the same result.
36. As a participant editing HTML or CSS, I want Run disabled for those languages, so
    that I'm not offered an action that can't execute.

### Connection, reconnect & persistence feedback

37. As a participant, I want a connection-status indicator, so that I know whether I'm
    live.
38. As a participant, I want a "reconnecting" indicator when the connection drops, so
    that I understand a hiccup is temporary.
39. As a participant, I want reconnecting to resync the document invisibly, so that I
    don't lose edits or have to reload after a blip.
40. As a participant, I want the document to resync correctly when my access token
    expired and the socket reconnected, so that token refresh is invisible to me.
41. As an owner, I want an autosave indicator showing that recent edits have been
    persisted, so that I trust my work is safe before I leave.
42. As a User, I want a CodeSpace I reopen to load exactly the latest saved state, so
    that persistence is reliable across sessions and participants.

## Implementation Decisions

### Topology (unchanged — four pieces)

- **`apps/client`** — React 19 + Vite + Monaco + Yjs. Owns auth UI (Google sign-in),
  dashboard, and the CodeSpace editor. Holds a client-side `Y.Doc` bound to Monaco via
  `y-monaco`, and uses `y-protocols/awareness` for presence and cursors.
- **`apps/server`** (Express, :3000) — Google OAuth callback, JWT mint/refresh,
  CodeSpace CRUD with the five-cap, `/run` → Judge0, and publishing run results to
  Redis.
- **`apps/socketServer`** (`ws`, :8080) — authoritative per-room `Y.Doc` holder,
  JWT auth/authz on connect, debounced persistence, Redis subscriber.
- **`packages/database`** (Prisma/Postgres) — `User`, `CodeSpace`, `CodeSpaceCollaborator`.

### Authentication

- Replace email/password (argon2) with **Google OAuth as the only login**. Google is
  the front door only: the Express server still mints its **own** access + refresh
  JWTs, which remain the session currency for every other request and for the socket
  handshake. The existing JWT mint/refresh/verify helpers are reused; the OAuth
  callback issues tokens at the end of the Google flow instead of the password
  sign-in/sign-up controllers.
- Token refresh stays an **HTTP** concern. The client refreshes over HTTP before
  opening (or reopening) the socket; the socket itself does not perform refresh.

### Schema changes (`packages/database`)

- **`User`**: drop `password`; add `googleId` (unique) and `avatarUrl`. Keep `id`,
  `email`, `name`.
- **`CodeSpace`** (new, first-class, owned, persisted): stable `id` as `cuid()` — this
  single id is the **share link path, the socket room key, and the Yjs doc key**.
  Fields: `title`, `language`, `allowEdit` (boolean), `ownerId` (→ `User`),
  `ydocState` (`Bytes` — the encoded Yjs document; **source of truth** for content),
  `createdAt`, `updatedAt`.
- **`CodeSpaceCollaborator`** (new join table): `(codeSpaceId, userId)` with a `role`
  field. MVP writes `owner` for the creator and `viewer` for anyone who opens the link.
  It exists now as the future home of per-user roles (deferred) and powers "Recently
  opened."

Shape (decision-encoding, not final Prisma syntax):

```
User                { id, email, name, googleId @unique, avatarUrl }
CodeSpace           { id @cuid, title, language, allowEdit Bool,
                      ownerId, ydocState Bytes, createdAt, updatedAt }
CodeSpaceCollaborator { codeSpaceId, userId, role, @@unique([codeSpaceId, userId]) }
```

### Server API contracts (`apps/server`)

- `GET /auth/google` → redirect to Google; `GET /auth/google/callback` → exchange code,
  upsert `User` by `googleId`, mint access + refresh JWTs, set session.
- `POST /auth/refresh`, `POST /auth/logout` — reuse existing refresh/logout flow.
- `GET /codespaces` → owned list + recently-opened list (derived from
  `CodeSpaceCollaborator` where the user is a non-owner collaborator).
- `POST /codespaces` → create; **reject the sixth** owned CodeSpace with a clear,
  typed error (cap = 5). Writes an `owner` collaborator row.
- `GET /codespaces/:id` → metadata for opening (title, language, allowEdit, owner,
  caller's relationship). Opening records a `viewer` collaborator row if absent.
- `PATCH /codespaces/:id` → rename / set language / toggle `allowEdit` (owner only).
- `DELETE /codespaces/:id` → owner only.
- `POST /run` → body carries the **code text** (materialized by the client from the Yjs
  doc), language, and stdin. Server calls Judge0, then **publishes** the result to Redis
  channel `room:{codeSpaceId}`. Run is a one-off HTTP request, **not** part of Yjs sync.
  HTML/CSS are run-disabled (rejected / not offered).

### Realtime sync authority (`apps/socketServer`)

- **Yjs CRDT replaces full-document broadcast** (this supersedes ADR-0003's stopgap;
  ADR-0003 explicitly anticipated migrating to Yjs once concurrent editing became a
  real requirement). The socketServer is the **authoritative** holder of each room's
  in-memory `Y.Doc`:
  - On first join for a `codeSpaceId`, load `ydocState` from Postgres into memory.
  - Apply incoming Yjs updates, broadcast to the room, and serve the **sync handshake**
    to new joiners.
  - **Debounce-persist** the encoded doc back to Postgres ~2s after edits settle, and
    again on room-empty. **Clients never save directly.**
- **Awareness** (presence + colored cursors) rides `y-protocols/awareness` over the
  same socket.

### Socket security & authorization

- The socket connection **carries the access token**. The server **verifies the JWT
  signature locally** and extracts `userId`. It **never** trusts a client-sent userId
  (closes the current spoofing hole).
- Authorization on connect: `userId === ownerId` → **owner**; else if `allowEdit` →
  **editor**; else → **read-only viewer**.
- **Read-only is enforced server-side** by silently dropping inbound Yjs updates from
  non-editors. Toggling `allowEdit` re-evaluates connected non-owners.
- On token expiry the socket reconnects (after an HTTP refresh) and Yjs **resyncs
  invisibly**.

### Scaling — room affinity

- Every socket for a given `codeSpaceId` routes to the **same socketServer replica**
  (single master per room; no multi-master Yjs merge). Scales as "many rooms, each
  modest." Affinity is keyed on `codeSpaceId`.

### Redis — demoted to a cross-process bus

- Redis is **no longer the sync source of truth** (revising the role from ADR-0002).
  It is a cross-process bus for: (a) **run-result delivery** (Express → the replica
  holding `room:{codeSpaceId}`, which fans the result to everyone), and (b)
  **cross-instance presence fan-out**. It is **not** on the per-keystroke path.

### Run result fan-out

1. Client POSTs `/run` to Express with materialized code text + language + stdin.
2. Express calls Judge0, gets stdout/stderr/compile/time.
3. Express PUBLISHes the result to `room:{codeSpaceId}`.
4. The socketServer replica holding that room receives it and **fans it to everyone**
   in the room.

## Testing Decisions

Tests use **Vitest**, following existing prior art:

- `apps/client`: jsdom + React Testing Library, setup in `src/test/setup.ts`
  (`vite.config.ts`/`vitest.config.ts` test block).
- `apps/server` and `apps/socketServer`: node environment via `vitest.config.ts`.
- Test files live next to source as `*.test.ts(x)`; test globals are imported
  explicitly (`globals` is off).

**Principle:** test **external behavior at the highest seam available**, not
implementation details. Prefer the seams that already exist; do not introduce mocks
for Yjs internals or Monaco rendering.

What to cover:

- **Server CodeSpace CRUD + cap (highest value).** Drive the HTTP handlers and assert
  behavior: creating up to five succeeds; the sixth is rejected with the typed
  cap error; rename/language/allowEdit are owner-only; delete is owner-only; opening a
  link records a collaborator row; the dashboard returns owned vs. recently-opened
  correctly. Use the request/response seam (controllers), not the ORM internals.
- **Socket authorization (security-critical).** Given a token, assert the derived role
  (owner / editor / read-only) and that **inbound updates from a read-only viewer are
  dropped** while owner/editor updates apply. Test by feeding messages to the
  connection handler with a verified vs. spoofed userId — assert the spoofed userId is
  ignored in favor of the JWT-extracted one.
- **Persistence lifecycle.** Assert load-on-first-join, debounced save fires after
  edits settle, and a save on room-empty — observed through the persistence seam
  (the function that reads/writes `ydocState`), with time controlled by fake timers.
- **Run fan-out.** Assert that a result published to `room:{codeSpaceId}` is delivered
  to every connection in that room, and that HTML/CSS runs are rejected. Mock Judge0 at
  the HTTP boundary and Redis publish at the client boundary.
- **Pure helpers.** JWT mint/verify, payload encode/decode, and any code-materialization
  helper get direct unit tests (mirrors existing `messagePayload.test.ts`,
  `response.test.ts`, `utils.test.ts`).
- **Client.** Smoke-test the dashboard (lists render, create-disabled-at-cap) and the
  CodeSpace shell (read-only badge reflects `allowEdit`, connection/autosave indicators
  render for given state) with RTL. Do **not** assert Yjs merge correctness in the
  client — rely on the library and the socket-side tests.

## Out of Scope

Deferred, explicitly not in v1:

- Interactive terminal / PTY (needs self-hosted containers; stdin stays a batch text
  block).
- Per-user roles and invites (the `CodeSpaceCollaborator.role` column exists but MVP
  only writes `owner`/`viewer`; Allow Edit remains a single global switch).
- Chat / comments.
- Multi-file or file-tree CodeSpaces (v1 is **single-file**).
- Forking, templates, snapshots, and edit history.
- Anonymous (non-logged-in) access.
- Multi-master Yjs merge across replicas (room affinity makes this unnecessary for v1).

## Further Notes

### V1 scope summary

- **Core:** Google-only login; single-file CodeSpace; run JS/Python/Java/C++ with batch
  stdin; global Allow Edit; shareable `/<codeSpaceId>` link.
- **Plus (cheap, included):** live presence + colored cursors; connection / reconnecting
  status; participant list; autosave indicator; copy-link action; edit-on/off badge.

### Vocabulary changes from current `CONTEXT.md`

This redesign changes several glossary terms; use the **new** meanings:

- **CodeSpace** — was the transient editor workspace; now a **persisted, owned,
  first-class entity** with its own `cuid` id. Many per User, hard-capped at 5.
- **Live Share / Sharer / Watch ID / Invite Link** — retired. There is no separate
  ephemeral share keyed to a user id. Sharing is just handing out the CodeSpace's own
  link `/<codeSpaceId>`; the former "Sharer" is the CodeSpace **owner**.
- **Viewer** — someone who opened a CodeSpace they don't own; persisted as a
  `CodeSpaceCollaborator`. When Allow Edit is off they get **live read-only**.
- **Allow Edit** — still a single global switch, now a field on the persisted
  CodeSpace, owner-toggled, enforced server-side.
- **Realtime Code** — retired as "whole-document snapshots." Sync is now **Yjs CRDT
  updates + awareness**, not full-document broadcast.
- **Run Code / Language** — unchanged in meaning; run output is now fanned to **all**
  participants, and the run path materializes code text from the Yjs doc.

### ADR impact

- **ADR-0002 (Redis pub/sub as sync service):** revised — Redis is demoted from sync
  source-of-truth to a cross-process bus (run-result delivery + presence fan-out).
- **ADR-0003 (naive full-document broadcast):** superseded — replaced by Yjs CRDT,
  exactly the migration ADR-0003 anticipated. The "don't bolt merge logic onto the
  broadcast" warning is moot once the broadcast model is gone.
- **ADR-0004 (Judge0 via RapidAPI):** unchanged — Judge0 stays the execution engine.
- **ADR-0001 (monorepo):** unchanged — same four pieces.

### Assumptions made during synthesis (non-blocking)

- `id` uses `cuid()` per the design note even though current `User.id` is `uuid()`;
  the two can coexist (User keeps its id strategy).
- The dashboard "Recently opened" list excludes CodeSpaces the user owns (those appear
  under "My CodeSpaces").
- Default language for a new CodeSpace is assumed JavaScript; the title defaults to an
  editable placeholder. These are UI defaults, not architectural commitments.
- The five-cap counts **owned** CodeSpaces only; being a collaborator on others' spaces
  does not consume a slot.
