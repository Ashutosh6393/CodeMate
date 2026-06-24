# Yjs CRDT for true concurrent editing (server-authoritative doc, room affinity)

Status: accepted

Supersedes: ADR 0003 (naive full-document broadcast)

Real-time sync now uses a Yjs CRDT. Clients exchange incremental Yjs updates, not
whole-document snapshots, so multiple Users can type simultaneously and every
edit merges into a single converging document with no lost updates. The
socketServer holds the authoritative `Y.Doc` for each room, applies incoming
updates to it, and persists its encoded state (`ydocState`) to Postgres on a
debounce. Each room is pinned to a single socketServer instance (room affinity)
so exactly one process owns and merges that document.

This replaces the deliberate stopgap recorded in ADR 0003, where the entire
document was rebroadcast on every change and concurrent edits clobbered each
other (last write wins). Concurrent editing is now a real requirement, and the
correct fix was to replace the broadcast model rather than patch merge logic onto
it — exactly the migration ADR 0003 anticipated.

Consequences:

- Document state is opaque binary CRDT data, not readable text in the store;
  debugging and any server-side inspection must decode the `Y.Doc`.
- Room affinity is mandatory: routing a room's connections to two instances would
  create two masters merging independently and diverge. The socketServer can
  still scale out, but each room lives on one instance (see ADR 0007 for the
  cross-instance bus).
- Persistence is debounced, so a crash can lose the last few unsaved updates —
  an accepted trade-off against writing on every keystroke.
