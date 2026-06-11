#!/bin/bash
# check.sh — validate all content, then optionally build only if clean.
# Usage:
#   ./check.sh          → just validate everything
#   ./check.sh build    → validate, and run `npm run build` ONLY if no errors

cd "$(dirname "$0")"

# make sure PyYAML is available for full validation (one-time)
python3 -c "import yaml" 2>/dev/null || pip3 install pyyaml --break-system-packages --quiet 2>/dev/null

python3 validate_content.py
RESULT=$?

if [ "$1" = "build" ]; then
  if [ $RESULT -eq 0 ]; then
    echo ""
    echo "✓ Validation passed — running build…"
    npm run build
  else
    echo ""
    echo "✗ Validation failed — build skipped. Fix the errors above first."
    exit 1
  fi
fi
