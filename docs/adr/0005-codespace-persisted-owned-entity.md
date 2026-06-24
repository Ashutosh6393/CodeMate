# CodeSpace is a persisted, owned, many-per-user entity (max 5)

Status: accepted

A CodeSpace is a durable, Postgres-backed entity with its own stable id, owned by
exactly one User, who may own up to five. It persists between sessions and
outlives any single connection. This supersedes the earlier model in which a
share was ephemeral and keyed on the Sharer's `userId` (see ADR 0002), existing
only while that User was connected.

The driver is shareable links and ownership: a link must keep working — and the
code must still be there — after the Owner closes the tab, so the workspace
cannot be tied to a live socket. Giving the CodeSpace its own identity (rather
than reusing the Owner's User id) lets a User own several, lets the link embed the
CodeSpace instead of the person, and lets us record per-User access for
"recently opened" lists.

Consequences:

- The CodeSpace, its latest code, Language, and Allow Edit flag are now durable
  rows in Postgres, not transient Redis state. They must be loaded on open and
  saved on change.
- A per-User cap of five CodeSpaces is enforced; creating a sixth is rejected.
- Ownership and access are modelled explicitly (Owner, Collaborator) rather than
  inferred from who is currently connected.
