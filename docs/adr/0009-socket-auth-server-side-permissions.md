# Socket connections authenticate via verified JWT and enforce permissions server-side

Status: accepted

Every WebSocket connection authenticates by presenting an Access Token, and the
socketServer verifies the JWT signature to establish who the User is. The server
— not the client — then enforces permissions: it drops inbound edits from anyone
who is not the Owner and not an allowed Viewer, so read-only access is enforced
server-side. This replaces the earlier design that trusted a client-supplied
`userId` with no verification.

The context is that edits now carry real authority: with a persisted,
CRDT-merged document (ADRs 0005, 0006), an unauthorized edit mutates durable
shared state, not just an ephemeral broadcast. A client-asserted identity is
trivially forged, so the server must be the bouncer — verify the token, derive
identity from it, and reject edits that the connection's permissions don't allow.

Consequences:

- Connections without a valid token are refused; identity can no longer be
  spoofed by sending a chosen `userId`.
- Allow Edit is enforced on the server: when off, Viewer edits are rejected even
  if a client tries to send them.
- The socketServer needs the JWT verification secret, coupling it to the auth
  token model (ADR 0008).
