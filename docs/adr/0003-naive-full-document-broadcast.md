# Naive full-document broadcast (no OT/CRDT)

Status: accepted (interim — intended to be revisited)

Real-time sync sends the **entire document** on every change and the receiver
replaces its editor contents wholesale. There is no operational transform, no
CRDT, and no conflict resolution. When two people type at once, last write wins
and intermediate state can be clobbered.

This is a deliberate stopgap, not the intended end state. A full-document
broadcast was dramatically simpler to build and ship than an OT/CRDT engine, and
it is good enough for the common case (one Sharer driving, Viewers mostly
watching, edit access handed out occasionally). The plan is to migrate to a
proper CRDT (e.g. Yjs) once concurrent editing becomes a real requirement.

This is recorded specifically to stop a future contributor from "fixing" the
socket code by bolting on merge logic that was never there: the absence of
conflict resolution is a known, accepted limitation, and the correct path
forward is to replace the broadcast model, not patch it.
