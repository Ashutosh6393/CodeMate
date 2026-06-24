#!/usr/bin/env bash
# Claude Code PostToolUse hook: format the edited file with Prettier.
# Reads the hook's stdin JSON, extracts the file path with node (jq isn't
# available on Windows Git Bash), and runs the repo-local prettier on it.
f=$(node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{const j=JSON.parse(d||"{}");const p=(j.tool_response&&j.tool_response.filePath)||(j.tool_input&&j.tool_input.file_path);if(p)process.stdout.write(p);}catch(e){}})')
[ -n "$f" ] && pnpm exec prettier --write --ignore-unknown "$f" 2>/dev/null
exit 0
