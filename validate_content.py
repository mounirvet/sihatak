#!/usr/bin/env python3
# validate_content.py — pre-build content validator for asnanik.com
# Scans every .md in content/articles + content/insights and checks the things
# that break the Next.js static build or hurt SEO/YMYL, BEFORE you run build.
#
# Usage:  python3 validate_content.py
# Exit code 0 = all clean; 1 = problems found (so it can gate a build).

import os, re, sys

ROOT = os.getcwd()
DIRS = [os.path.join(ROOT, "content", "articles"),
        os.path.join(ROOT, "content", "insights")]

VALID_PILLARS = {
    'amrad-al-litha','tasawwus-al-asnan','asnan-al-atfal','tabyid-al-asnan',
    'al-inaya-al-yawmiyya','ziraat-al-asnan','taqwim-al-asnan','taghdiya-wa-sihhat-al-fam',
}

# Try PyYAML for a real parse; fall back to a manual scan if it's not installed.
try:
    import yaml
    HAVE_YAML = True
except Exception:
    HAVE_YAML = False

errors = []      # build-breaking
warnings = []    # quality / SEO / YMYL

def err(f, msg):  errors.append(f"  ✗ {os.path.basename(f)}: {msg}")
def warn(f, msg): warnings.append(f"  ⚠ {os.path.basename(f)}: {msg}")

def split_frontmatter(raw):
    # frontmatter is between the first two '---' lines
    if not raw.startswith('---'):
        return None, None
    parts = raw.split('---', 2)
    if len(parts) < 3:
        return None, None
    return parts[1], parts[2]

def scan_nested_quotes(fm, f):
    # The exact bug that broke the build: a double-quoted YAML scalar that
    # contains an inner straight double-quote.
    for ln, line in enumerate(fm.split('\n'), start=2):  # +2: after the opening ---
        s = line.strip()
        for key in ('a: "','q: "','answer: "','excerpt: "','title: "','pillar: "','date: "','updated: "'):
            if s.startswith(key):
                inner = s[len(key):]
                if inner.endswith('"'):
                    inner = inner[:-1]
                if '"' in inner:
                    err(f, f"nested double-quote in YAML at line ~{ln} (use «» inside \"...\") → {key.strip()}")

def check_file(f):
    raw = open(f, encoding='utf-8').read()

    # 0) encoding / replacement chars
    if '\ufffd' in raw:
        err(f, "contains replacement character \\ufffd (encoding corruption)")

    fm, body = split_frontmatter(raw)
    if fm is None:
        err(f, "no valid frontmatter block (must start with --- ... ---)")
        return

    # 1) the build-breaker: nested quotes (manual scan, always runs)
    scan_nested_quotes(fm, f)

    # 2) real YAML parse (the definitive build-safety check)
    if HAVE_YAML:
        try:
            data = yaml.safe_load(fm)
            if not isinstance(data, dict):
                err(f, "frontmatter does not parse to a mapping")
                data = {}
        except yaml.YAMLError as e:
            msg = str(e).split('\n')[0]
            err(f, f"YAML parse error: {msg}")
            data = {}
    else:
        data = {}

    # 3) required fields
    for k in ['title','pillar','reviewer','date','excerpt','answer','faq','sources']:
        if HAVE_YAML and k not in data:
            err(f, f"missing required field: {k}")

    # 4) pillar must be valid (articles only; insights use category)
    if HAVE_YAML and 'articles' in f and data.get('pillar') not in VALID_PILLARS:
        err(f, f"invalid/unknown pillar: {data.get('pillar')!r}")

    # 5) slug must be clean ASCII
    slug = os.path.basename(f)[:-3]
    if not re.match(r'^[a-z0-9\-]+$', slug):
        err(f, f"slug has non-ASCII or invalid chars: {slug!r}")

    # 6) stray-Latin inside Arabic body (the recurring content bug)
    if body:
        body_no_tags = re.sub(r'<[^>]+>', '', body)
        seen = set()
        for m in re.findall(r'[\u0600-\u06FF][a-zA-Z]|[a-zA-Z][\u0600-\u06FF]', body_no_tags):
            if m not in seen:
                seen.add(m)
                warn(f, f"possible stray-Latin glued to Arabic: {m!r}")
        for m in re.findall(r'[\u0600-\u06FF][0-9]+[\u0600-\u06FF]', body):
            warn(f, f"digits glued inside Arabic word: {m!r}")

    # 7) light YMYL/quality nudges (warnings only)
    if HAVE_YAML and isinstance(data.get('sources'), list) and len(data['sources']) < 2:
        warn(f, "fewer than 2 sources")

def main():
    files = []
    for d in DIRS:
        if os.path.isdir(d):
            files += [os.path.join(d, x) for x in os.listdir(d) if x.endswith('.md')]
    files.sort()

    if not files:
        print("No .md files found. Run this from your project root.")
        sys.exit(1)

    for f in files:
        check_file(f)

    print(f"Scanned {len(files)} files.")
    print(f"  Build-breaking errors: {len(errors)}")
    print(f"  Quality warnings:      {len(warnings)}")
    if not HAVE_YAML:
        print("  (note: PyYAML not installed — ran manual checks only.")
        print("   For full YAML validation: pip3 install pyyaml --break-system-packages)")

    if errors:
        print("\n=== ERRORS (these break `npm run build`) ===")
        print('\n'.join(errors))
    if warnings:
        print("\n=== WARNINGS (quality / SEO / YMYL) ===")
        print('\n'.join(warnings[:80]))
        if len(warnings) > 80:
            print(f"  … and {len(warnings)-80} more warnings")

    if not errors and not warnings:
        print("\n✓ All clean — safe to build.")
    elif not errors:
        print("\n✓ No build-breaking errors — safe to build. (Warnings are optional cleanups.)")
    else:
        print("\n✗ Fix the errors above before running npm run build.")

    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
