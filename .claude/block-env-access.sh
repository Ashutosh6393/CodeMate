#!/usr/bin/env bash
# Claude Code PreToolUse hook: deny access to .env secret files.
# Covers Read (file_path), Grep (path / glob), and Bash (command string).
# Parses the hook's stdin JSON with node (jq isn't available on Windows Git
# Bash). Real .env files are blocked; .env.example/.sample/.template are allowed.
node -e '
let d = "";
process.stdin.on("data", c => (d += c)).on("end", () => {
  let blocked = false;
  let detail = "";
  try {
    const j = JSON.parse(d || "{}");
    const tool = j.tool_name || "";
    const ti = j.tool_input || {};

    const allow = new Set([".env.example", ".env.sample", ".env.template"]);
    const isBlockedBase = (base) =>
      base === ".env" || (base.startsWith(".env.") && !allow.has(base));
    const baseOf = (p) => String(p).split(/[\\/]/).pop();

    if (tool === "Read" || tool === "Grep") {
      const p = ti.file_path || ti.path || "";
      if (p && isBlockedBase(baseOf(p))) { blocked = true; detail = baseOf(p); }
      if (!blocked && ti.glob && isBlockedBase(baseOf(ti.glob))) {
        blocked = true; detail = String(ti.glob);
      }
    } else if (tool === "Bash") {
      const cmd = String(ti.command || "");
      // Match a .env filename token: preceded by start/separator, optional
      // .suffix, and NOT part of a longer word like .environment or .envrc.
      const re = /(^|[\s"'"'"'`=:(/\\])\.env(\.[A-Za-z0-9_-]+)?(?![A-Za-z0-9_.-])/g;
      let m;
      while ((m = re.exec(cmd)) !== null) {
        const base = ".env" + (m[2] || "");
        if (isBlockedBase(base)) { blocked = true; detail = base; break; }
      }
    }
  } catch (e) {}

  if (blocked) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "Access to " + detail + " is blocked: .env files may contain secrets " +
          "(JWT/Redis/DB/Judge0 credentials). Use the matching .env.example for variable names.",
      },
    }));
  }
});
'
exit 0
