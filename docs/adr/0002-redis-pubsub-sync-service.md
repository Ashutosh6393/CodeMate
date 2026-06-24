# Redis pub/sub on a dedicated WebSocket service for real-time sync

Real-time collaboration runs on its own `ws` server (port 8080), separate from
the REST API, and fans messages out through Redis pub/sub rather than holding
all collaborators on a single in-process socket map. Each Live Share maps to a
Redis channel named `code:{sharerUserId}` — the Sharer's User id _is_ the room
key. A Sharer subscribes to their own channel; each Viewer subscribes to the
Sharer's channel; updates are published to Redis and delivered to every
subscriber.

Two reasons. First, keeping realtime off the REST server lets the two scale and
deploy independently — a stateless HTTP API versus a stateful socket process.
Second, routing through Redis (rather than an in-memory map) means socket
servers don't have to share process memory, so the service can run more than one
instance without collaborators on different instances losing each other.

Consequences worth knowing:

- **Identity is the room.** Because the channel key is the Sharer's User id, a
  User can host only one Live Share at a time, and there is no separate session
  or room entity to outlive a disconnect. Live Share state (latest code,
  language, allow-edit flag, viewer set) lives in Redis keyed by that id and is
  deleted on Sharer disconnect.
- Redis is now a hard runtime dependency for collaboration — if Redis is
  unreachable, Live Share does not work (the REST API and code execution still
  do).
