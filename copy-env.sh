#!/bin/bash

# List of directories to check
dirs=(
  "apps/server"
  "apps/client"
  "apps/socketServer"
  "packages/database"
)

for dir in "${dirs[@]}"; do
  example_file="$dir/.env.example"
  env_file="$dir/.env"

  if [ -f "$example_file" ]; then
    if [ ! -f "$env_file" ]; then
      cp "$example_file" "$env_file"
      echo "✅ Created: $env_file"
    else
      echo "⚠️ Skipped (already exists): $env_file"
    fi
  else
    echo "❌ .env.example not found in: $dir"
  fi
done
