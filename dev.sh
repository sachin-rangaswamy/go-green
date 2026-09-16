#!/usr/bin/env bash
# Wrapper so the preview launcher can find the locally-installed Node.
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")"
exec npm run dev
