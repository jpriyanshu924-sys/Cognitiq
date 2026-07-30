import os
import re

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# 1. Update mock-test.js
mt_js_path = os.path.join(workspace, "mock-test.js")
if os.path.exists(mt_js_path):
    with open(mt_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove SHL provider block
    content = re.sub(r",\s*shl:\s*\{[\s\S]*?\n\s*\}", "", content)
    with open(mt_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[mock-test.js] Removed SHL provider block.")

# 2. Update mock-test.html
mt_html_path = os.path.join(workspace, "mock-test.html")
if os.path.exists(mt_html_path):
    with open(mt_html_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove SHL card
    content = re.sub(r'<button class="mt-pcard" data-provider="shl" id="mt-shl">[\s\S]*?</button>', '', content)
    with open(mt_html_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[mock-test.html] Removed SHL card.")

# 3. Update app.js
app_js_path = os.path.join(workspace, "app.js")
if os.path.exists(app_js_path):
    with open(app_js_path, "r", encoding="utf-8") as f:
        content = f.read()

    shl_game_ids = [
        'verify-numerical', 'verify-inductive', 'logic-deduction',
        'checking-game', 'calculation-game', 'scenario-judge', 'pattern-matrix'
    ]

    for gid in shl_game_ids:
        # Remove from GAME_CONFIG
        content = re.sub(rf"'{gid}':\s*\{{[\s\S]*?\n\s*\}},?\n?", "", content)
        # Remove from GAME_ORDER
        content = re.sub(rf"'{gid}',?\s*", "", content)
        # Remove from GAME_MODULES
        content = re.sub(rf"'{gid}':\s*\(\)\s*=>[\s\S]*?,\n?", "", content)

    # Clean empty comments or leftover SHL headings
    content = content.replace("// SHL (7 games)", "")
    content = content.replace("// SHL", "")
    content = content.replace("'SHL ASSESSMENT'", "'OTHER ASSESSMENT'")

    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[app.js] Removed SHL games from GAME_CONFIG, GAME_ORDER, and GAME_MODULES.")

# 4. Update games.html script tags
games_html_path = os.path.join(workspace, "games.html")
if os.path.exists(games_html_path):
    with open(games_html_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    shl_scripts = [
        "verify-numerical.js", "verify-inductive.js", "logic-deduction.js",
        "scenario-judge.js"
    ]
    for s in shl_scripts:
        content = re.sub(rf'<script src="games/{s}"></script>\n?', '', content)

    with open(games_html_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("[games.html] Removed SHL script tags.")

# 5. Delete SHL-only JS files
shl_files = [
    "games/verify-numerical.js", "games/verify-inductive.js",
    "games/logic-deduction.js", "games/scenario-judge.js"
]
for rel_path in shl_files:
    full_path = os.path.join(workspace, rel_path.replace("/", os.sep))
    if os.path.exists(full_path):
        os.remove(full_path)
        print(f"Deleted SHL file: {rel_path}")

print("=== SHL REMOVAL COMPLETE ===")
