# Google OAuth as the sole login method; app-issued JWTs as session currency

Status: accepted

Users sign in only through Google OAuth — there is no email/password path and
CodeMate stores no credentials. Google is the front door (identity verification),
but once a User is authenticated the application mints and uses its own
access/refresh JWTs as the session currency for every subsequent request; the
Google session is not carried forward.

The trade-off is a hard dependency on a single identity provider against not
storing or hashing passwords at all. Removing credential storage shrinks the
security surface (no password resets, no breach of a password table) and the
trust model is simpler: we trust Google's verified email/name. We accept that
users without a Google account cannot sign in and that Google outages block
login. Keeping our own JWTs (rather than re-checking Google per request) keeps
the request path independent of Google after login and consistent with the
existing token model.

Consequences:

- The User record holds a Google-provided identity (email, name); there is no
  password field.
- Adding another login method later means adding an IdP, not reintroducing
  password storage.
