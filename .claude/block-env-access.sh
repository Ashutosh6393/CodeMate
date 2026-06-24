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
      // Only block commands that actually READ a .env file, not ones that
      // merely mention the token (e.g. a commit message, or
      // `git log -- .env.example`). We match either a reader command
      // consuming a .env path as an argument, or an input redirection from a
      // .env file. The single quote is built via fromCharCode so it never
      // collides with the surrounding `node -e ...` shell quoting.
      const q = String.fromCharCode(39);
      const bnd = "(?:^|[\\s\"" + q + "`=:(/\\\\])";
      const envTok = "\\.env(\\.[A-Za-z0-9_-]+)?(?![A-Za-z0-9_.-])";
      const readers =
        "cat|tac|nl|head|tail|less|more|bat|od|xxd|hexdump|strings|" +
        "grep|egrep|fgrep|rg|ag|ack|awk|sed|cut|paste|sort|uniq|wc|" +
        "tee|dd|cp|scp|rsync|mv|ln|source";
      const wrap = "(?:(?:sudo|xargs|env|time|command|nohup)\\s+)*";
      const res = [
        // reader at a command position, then a .env path among its args
        new RegExp(
          "(?:^|[|;&(\\n])\\s*" + wrap + "(?:" + readers +
            ")\\b[^|;&\\n]*?" + bnd + envTok,
          "g",
        ),
        // input redirection: `< .env` (but not the `<<` heredoc operator)
        new RegExp("(?:^|[^<])<(?!<)\\s*(?:[\"" + q + "`])?" + envTok, "g"),
      ];
      for (const re of res) {
        let m;
        while ((m = re.exec(cmd)) !== null) {
          const base = ".env" + (m[1] || "");
          if (isBlockedBase(base)) { blocked = true; detail = base; break; }
        }
        if (blocked) break;
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
