# Redis demoted to a cross-process bus (run-result delivery + presence fan-out)

Status: accepted

Amends/supersedes: ADR 0002 (Redis pub/sub as the sync service)

Redis is no longer the source of truth for collaboration state. The authoritative
document now lives in the socketServer's in-memory `Y.Doc` and is persisted to
Postgres (`ydocState`, see ADR 0006). Redis is demoted to a cross-process message
bus with two jobs: delivering Run Code results from the Express API to the
socketServer instance that owns the relevant room, and fanning out presence
across socketServer instances.

ADR 0002 made Redis the room store and sync fabric, keyed on the Sharer's User
id. That role is gone: with CRDT documents owned per-room by one instance (room
affinity), routing edits through Redis is unnecessary and would invite multi-
master merge. But two needs remain that cross process boundaries — the REST API
runs code in a different process than the socket server, and presence must be
visible across instances — so Redis stays as the bus for exactly those.

Consequences:

- Redis is no longer required for the document to survive; losing Redis breaks
  run-result delivery and cross-instance presence, not the saved code.
- Collaboration state is split: the document is in Postgres/the owning instance;
  Redis carries only transient cross-process messages.
