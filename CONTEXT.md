# CodeMate

CodeMate is a real-time collaborative code editor: one person edits code in the
browser, others watch (and optionally edit) the same code live, and anyone can
run it against a hosted execution engine. This glossary fixes the language the
team uses for those concepts so the same word means the same thing in code,
UI, and conversation.

## Identity & Access

**User**:
A registered account, identified by email, with a name and password. The unit of
authentication; every Live Share is owned by exactly one User.
_Avoid_: Account, Member, Client.

**Access Token / Refresh Token**:
The short-lived and long-lived JWTs that prove a User's identity. The Access
Token authorizes requests; the Refresh Token mints a new Access Token when it
expires.
_Avoid_: Session token, Auth token (ambiguous between the two).

## Collaboration (Live Share)

**Live Share**:
The act of a User broadcasting their CodeSpace so others can watch it update in
real time. There is no separate session or room object — a Live Share exists for
as long as its Sharer stays connected, and is identified by the Sharer's own User
id. A User can run at most one Live Share at a time.
_Avoid_: Session, Room, Broadcast, Meeting.

**Sharer**:
The User who owns a Live Share and drives the code. Their User id is what
identifies the share to everyone else.
_Avoid_: Host, Owner, Presenter, Broadcaster.

**Viewer**:
A User who has joined someone else's Live Share to watch the code update live. A
Viewer can edit only when the Sharer has turned on Allow Edit.
_Avoid_: Guest, Watcher, Participant, Spectator.

**Watch ID**:
The identifier a Viewer uses to join a specific Live Share. It is equal to the
Sharer's User id, and is carried to Viewers inside the Invite Link (the `watch`
query parameter).
_Avoid_: Room ID, Session ID, Share code.

**Invite Link**:
The shareable URL a Sharer hands out to invite others; it embeds the Watch ID so
that opening it joins the Sharer's Live Share as a Viewer.
_Avoid_: Share link, Join link.

**Allow Edit**:
The Sharer-controlled permission that lets Viewers type into the shared code.
When off, Viewers can only watch; when on, their edits are broadcast back to the
Sharer and other Viewers. It is a single switch for the whole Live Share, not
per-Viewer.
_Avoid_: Write access, Edit permission, Collaborator mode.

**Realtime Code**:
The full current contents of the editor, sent in its entirety on every change.
CodeMate does not send edits, diffs, or operations — only whole-document
snapshots. The most recent snapshot is what a newly arriving Viewer receives.
_Avoid_: Patch, Diff, Edit, Operation, Delta.

## Code Execution

**Language**:
The programming language selected for a CodeSpace, carrying the numeric id the
execution engine expects. The selection is part of a Live Share and is synced to
Viewers. Some Languages (e.g. HTML, CSS) are display-only and cannot be run.
_Avoid_: Runtime, Mode.

**Run Code**:
Executing the current code against the hosted execution engine and showing its
output (stdout, stderr, compile output, timing). Distinct from the realtime
collaboration path — running is a one-off request, not part of the live sync.
_Avoid_: Compile, Execute, Submit.

**CodeSpace**:
The editor workspace a User works in — the Monaco editor plus language picker,
input, output, and the Live Share controls. The thing a Sharer shares and a
Viewer joins.
_Avoid_: Editor, Workspace, Playground, Codespace (one word, lowercase `s`).
