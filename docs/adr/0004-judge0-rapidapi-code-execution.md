# Code execution via Judge0 (RapidAPI)

Running code is delegated to the hosted Judge0 service through RapidAPI
(`judge0-ce.p.rapidapi.com`), called synchronously from the REST API's
`/submitcode` endpoint (`wait=true`), rather than executing untrusted user code
on our own infrastructure.

Running arbitrary user-submitted code safely requires a sandbox (resource
limits, isolation, no network/filesystem escape) — building and operating that
is a large, security-sensitive effort. Judge0 provides it as an API across many
languages, which is why the editor's language list is expressed as Judge0
`language_id`s. The trade-off is a hard dependency on a third party and its API
key/quota, per-request latency we don't control, and lock-in: the language
catalog and execution semantics are Judge0's, so swapping providers later means
remapping every language and reworking the submit path.
