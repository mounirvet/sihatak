#!/usr/bin/env python3
# validate_products.py — validates content/products/*.md before shipping.
# Python + PyYAML only (never bash-grep Arabic). Run from repo root.

import sys, os, re, glob
try:
    import yaml
except ImportError:
    print("PyYAML required: pip install pyyaml"); sys.exit(1)

REQUIRED = ["slug", "title_ar", "category", "price", "sku"]
VALID_CATEGORIES = {
    "whitening","electric-brushes","interdental-care","aligner-care",
    "kids","gum-care","fresh-breath","accessories",
    "toothpaste","mouthwash","denture-care",
}
# Stray non-Arabic/non-ASCII scripts that signal corruption.
CYRILLIC = re.compile(r"[\u0400-\u04FF]")
GEORGIAN = re.compile(r"[\u10A0-\u10FF]")
CONTROL = re.compile(r"[\u0000-\u0008\u000B\u000C\u000E-\u001F]")
REPLACEMENT = "\uFFFD"
SLUG_OK = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

def split_front_matter(text):
    if not text.startswith("---"):
        return None, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return None, text
    return parts[1], parts[2]

def main():
    root = os.getcwd()
    files = glob.glob(os.path.join(root, "content", "products", "*.md"))
    if not files:
        print("No product files found."); return 0
    errors = 0
    slugs = {}
    for path in files:
        name = os.path.basename(path)
        with open(path, encoding="utf-8") as f:
            text = f.read()
        fm, body = split_front_matter(text)
        if fm is None:
            print(f"[{name}] ERROR: no YAML front matter"); errors += 1; continue
        try:
            data = yaml.safe_load(fm) or {}
        except yaml.YAMLError as e:
            print(f"[{name}] ERROR: YAML parse: {e}"); errors += 1; continue

        for key in REQUIRED:
            if data.get(key) in (None, ""):
                print(f"[{name}] ERROR: missing required field '{key}'"); errors += 1

        slug = data.get("slug", "")
        if slug and not SLUG_OK.match(str(slug)):
            print(f"[{name}] ERROR: slug not clean ASCII kebab-case: '{slug}'"); errors += 1
        if slug in slugs:
            print(f"[{name}] ERROR: duplicate slug '{slug}' (also {slugs[slug]})"); errors += 1
        slugs[slug] = name

        cat = data.get("category")
        if cat and cat not in VALID_CATEGORIES:
            print(f"[{name}] ERROR: unknown category '{cat}'"); errors += 1

        price = data.get("price")
        if price is not None and not isinstance(price, (int, float)):
            print(f"[{name}] ERROR: price must be a number, got {price!r}"); errors += 1

        # whole-file corruption scan (front matter + body)
        if CYRILLIC.search(text):
            print(f"[{name}] ERROR: Cyrillic characters present"); errors += 1
        if GEORGIAN.search(text):
            print(f"[{name}] ERROR: Georgian characters present"); errors += 1
        if CONTROL.search(text):
            print(f"[{name}] ERROR: control/invisible characters present"); errors += 1
        if REPLACEMENT in text:
            print(f"[{name}] ERROR: replacement character present"); errors += 1

    total = len(files)
    if errors:
        print(f"\n{errors} error(s) across {total} product file(s).")
        return 1
    print(f"OK: {total} product file(s) valid.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
