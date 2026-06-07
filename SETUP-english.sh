#!/bin/bash
# ============================================================
#  Asnanik — English version setup script
#  Run this ONCE from the root of your project (the sihatak folder).
#  It restructures the Arabic routes into an (ar) route group and
#  fixes their import paths. Then you unzip en-files.zip on top.
# ============================================================
set -e

echo "==> Checking we're in the project root..."
if [ ! -d "app" ] || [ ! -f "next.config.js" ]; then
  echo "ERROR: Run this from your project root (where app/ and next.config.js are)."
  exit 1
fi

echo "==> Backing up app/ to app_backup/ (just in case)..."
rm -rf app_backup
cp -r app app_backup
echo "    Backup created at app_backup/ — delete it once everything works."

echo "==> Creating (ar) route group and moving Arabic routes into it..."
mkdir -p "app/(ar)"
for item in page.js maqalat mahawir mustalahat man-nahnu; do
  if [ -e "app/$item" ]; then
    mv "app/$item" "app/(ar)/$item"
    echo "    moved app/$item -> app/(ar)/$item"
  fi
done

echo "==> Fixing relative import paths in moved files (one level deeper)..."
# Every moved file's ../lib or ../components needs one extra ../
find "app/(ar)" -name "*.js" | while read f; do
  # skip the (ar)/layout.js we ship fresh (it's added by the zip, not here)
  python3 - "$f" <<'PY'
import re, sys
p = sys.argv[1]
s = open(p, encoding='utf-8').read()
s = re.sub(r"from '((?:\.\./)+)(lib|components)", lambda m: "from '../"+m.group(1)+m.group(2), s)
open(p, 'w', encoding='utf-8').write(s)
PY
  echo "    fixed imports: $f"
done

echo ""
echo "==> Structural move DONE."
echo "    Next: unzip en-files.zip into the project root (it adds the English"
echo "    section, new lib/components/content, and replaces 3 files)."
echo "    Then run: npm run build  (to test), then git add/commit/push."
