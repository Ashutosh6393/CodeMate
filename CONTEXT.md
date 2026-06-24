# CodeMate

CodeMate is a real-time collaborative code editor: a person owns one or more
saved workspaces, opens one in the browser, shares its link, and others can
watch — and, when allowed, type into — the same code live, with everyone's edits
merging together. Anyone can run the code against a hosted execution engine. This
glossary fixes the language the team uses for those concepts so the same word
means the same thing in code, UI, and conversation.

## Identity & Access

**User**:
A person identified by their Google account (email and name). The unit of
authentication; owns CodeSpaces.
_Avoid_: Account, Member, Client.

**Access Token / Refresh Token**:
The short-lived and long-lived credentials that prove a User's identity. The
Access Token authorizes requests; the Refresh Token mints a new Access Token when
it expires.
_Avoid_: Session token, Auth token (ambiguous between the two).

## CodeSpaces & Collaboration

**CodeSpace**:
A saved, first-class workspace owned by exactly one User: the code, the chosen
Language, input and output. It has a stable identity that appears in its
shareable link, persists between sessions, and outlives any single connection. A
User may own at most five CodeSpaces.
_Avoid_: Editor, Workspace, Playground, Codespace (one word, lowercase `s`),
Live Share, Broadcast.

**Owner**:
The User who created and owns a CodeSpace. Ownership is durable — it is a
property of the CodeSpace, not of any active session — and the Owner controls
Allow Edit. The CodeSpace's shareable link carries the CodeSpace's identity, not
the Owner's.
_Avoid_: Sharer, Host, Presenter, Broadcaster.

**Viewer**:
A User who opens someone else's CodeSpace through its link. A Viewer watches the
code update live (read-only but real-time) and can also type only when Allow Edit
is on.
_Avoid_: Guest, Watcher, Participant, Spectator.

**Collaborator**:
The relationship recording that a User has access to a CodeSpace — as its Owner
or as a Viewer who has opened it. This is what powers a User's list of recently
opened CodeSpaces.
_Avoid_: Membership, Participant, Sharee.

**Allow Edit**:
The Owner-controlled permission that lets Viewers type into the CodeSpace. When
off, Viewers can only watch; when on, their edits merge into the shared document
alongside everyone else's. It is a single switch for the whole CodeSpace, not
per-Viewer.
_Avoid_: Write access, Edit permission, Collaborator mode.

**Invite Link**:
The shareable URL that opens a CodeSpace; it embeds the CodeSpace's own identity,
so opening it joins that CodeSpace as a Viewer.
_Avoid_: Share link, Join link, Watch ID.

**Concurrent Edit**:
The unit of change everyone exchanges while collaborating: an incremental edit,
not a whole-document snapshot. Multiple Users may type at the same time and their
edits are merged into a single document that converges to the same state for
everyone, with no edit lost.
_Avoid_: Realtime Code, Snapshot, Patch, Diff, Operation, Delta. (Supersedes the
former snapshot model, in which the full document was resent on every change.)

## Code Execution

**Language**:
The programming language selected for a CodeSpace. The selection is part of the
CodeSpace and is synced to Viewers. Some Languages (e.g. HTML, CSS) are
display-only and cannot be run.
_Avoid_: Runtime, Mode.

**Run Code**:
Executing the current code against the hosted execution engine and showing its
output (stdout, stderr, compile output, timing). Distinct from the collaboration
path — running is a one-off request, not part of the live sync.
_Avoid_: Compile, Execute, Submit.
