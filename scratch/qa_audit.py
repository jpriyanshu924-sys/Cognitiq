import os
import re
from bs4 import BeautifulSoup

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

html_files = ["index.html", "games.html", "mock-test.html", "tips.html", "pricing.html"]

errors = []
warnings = []

# ── 1. Check HTML script & style references ──────────────────────────────────
for html_name in html_files:
    file_path = os.path.join(workspace, html_name)
    if not os.path.exists(file_path):
        errors.append(f"Missing HTML file: {html_name}")
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
        
    # Check <script src="...">
    for script in soup.find_all("script", src=True):
        src = script["src"].split("?")[0] # remove query params
        if src.startswith("http://") or src.startswith("https://"):
            continue
        script_path = os.path.join(workspace, src.replace("/", os.sep))
        if not os.path.exists(script_path):
            errors.append(f"[{html_name}] Broken <script src='{src}'> reference!")

    # Check <link rel="stylesheet" href="...">
    for link in soup.find_all("link", rel=lambda r: r and "stylesheet" in r, href=True):
        href = link["href"].split("?")[0]
        if href.startswith("http://") or href.startswith("https://"):
            continue
        css_path = os.path.join(workspace, href.replace("/", os.sep))
        if not os.path.exists(css_path):
            errors.append(f"[{html_name}] Broken <link href='{href}'> stylesheet reference!")

    # Check internal links <a href="...">
    for a in soup.find_all("a", href=True):
        href = a["href"].split("#")[0]
        if not href or href.startswith("http://") or href.startswith("https://") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        link_path = os.path.join(workspace, href.replace("/", os.sep))
        if not os.path.exists(link_path):
            errors.append(f"[{html_name}] Broken <a href='{a['href']}'> link reference!")

# ── 2. Check app.js game configs vs games.html imports ──────────────────────
app_js_path = os.path.join(workspace, "app.js")
games_html_path = os.path.join(workspace, "games.html")

if os.path.exists(app_js_path) and os.path.exists(games_html_path):
    with open(app_js_path, "r", encoding="utf-8") as f:
        app_js = f.read()
    with open(games_html_path, "r", encoding="utf-8") as f:
        games_html = f.read()

    # Extract keys in GAME_CONFIG
    game_config_matches = re.findall(r"'([a-zA-Z0-9_-]+)':\s*\{", app_js)
    
    # Extract keys in GAME_MODULES
    game_module_matches = re.findall(r"'([a-zA-Z0-9_-]+)':\s*\(\)\s*=>", app_js)

    # Extract scripts loaded in games.html
    loaded_scripts = re.findall(r'src="games/([a-zA-Z0-9_-]+)\.js', games_html)

    for gid in game_config_matches:
        if gid not in game_module_matches:
            errors.append(f"[app.js] Game '{gid}' is defined in GAME_CONFIG but missing in GAME_MODULES constructors!")

    for gid in game_module_matches:
        if gid not in game_config_matches:
            errors.append(f"[app.js] Game '{gid}' is in GAME_MODULES but missing in GAME_CONFIG!")

# ── 3. Check mock-test.js providers vs GAME_CONFIG ──────────────────────────
mt_js_path = os.path.join(workspace, "mock-test.js")
if os.path.exists(mt_js_path) and os.path.exists(app_js_path):
    with open(mt_js_path, "r", encoding="utf-8") as f:
        mt_js = f.read()
    
    mt_game_ids = re.findall(r"id:\s*'([a-zA-Z0-9_-]+)'", mt_js)
    for gid in set(mt_game_ids):
        if gid not in game_config_matches:
            errors.append(f"[mock-test.js] Game '{gid}' in PROVIDERS is missing in app.js GAME_CONFIG!")

# ── Output Results ───────────────────────────────────────────────────────────
print(f"=== QA AUDIT COMPLETE ===")
print(f"Total Errors Found: {len(errors)}")
for err in errors:
    print("ERROR:", err)
print(f"Total Warnings Found: {len(warnings)}")
for warn in warnings:
    print("WARNING:", warn)
