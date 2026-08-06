"""
Fix 1: Add .lnav-profile-btn and .lnav-right-group base CSS to landing.css
Fix 2: Rewrite game card HTML template in app.js to match apt-card flat style
"""
import os, re

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# ─────────────────────────────────────────────────────────────────
# 1. landing.css – add base styles for profile btn & right group
# ─────────────────────────────────────────────────────────────────
LANDING = os.path.join(ws, "landing.css")
with open(LANDING, encoding="utf-8") as f:
    css = f.read()

PROFILE_CSS = """
/* ─── Profile button pill & right-group (always inline) ─── */
.lnav-right-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-shrink: 0;
}

.lnav-profile-btn {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  padding: 5px 12px 5px 7px;
  cursor: pointer;
  font-family: var(--fi);
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  flex-shrink: 0;
}
.lnav-profile-btn:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.lnav-avatar-text {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  font-family: var(--fh);
  flex-shrink: 0;
  line-height: 1;
}
.lnav-avatar-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.lnav-online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  flex-shrink: 0;
  display: inline-block;
}
"""

# Inject after the .lnav-cta:hover line
INJECT_AFTER = ".lnav-cta:hover { background: var(--violet-d); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(37,99,235,0.35); }"
if INJECT_AFTER in css:
    css = css.replace(INJECT_AFTER, INJECT_AFTER + "\n" + PROFILE_CSS, 1)
    print("[landing.css] Injected profile button CSS.")
else:
    css = css + "\n" + PROFILE_CSS
    print("[landing.css] Appended profile button CSS (inject target not found).")

with open(LANDING, "w", encoding="utf-8") as f:
    f.write(css)

# ─────────────────────────────────────────────────────────────────
# 2. app.js – rewrite game card template to apt-card flat style
# ─────────────────────────────────────────────────────────────────
APP = os.path.join(ws, "app.js")
with open(APP, encoding="utf-8") as f:
    app = f.read()

# The old card template (identify by its unique start/end markers)
OLD_CARD_START = "return `\n          <div class=\"game-card\" id=\"card-${gameId}\" data-game=\"${gameId}\">"
OLD_CARD_END   = "          </div>`;"

# Find the block
start_idx = app.find(OLD_CARD_START)
end_idx   = app.find(OLD_CARD_END, start_idx) + len(OLD_CARD_END)

if start_idx == -1:
    print("[app.js] WARNING: card template start not found. Trying alternate search...")
    # Try line by line
    lines = app.splitlines()
    for i, l in enumerate(lines):
        if 'gc-header-block' in l and 'cat.bg' in l:
            print(f"  Found at line {i+1}: {l[:80]}")
else:
    print(f"[app.js] Found card template at pos {start_idx}-{end_idx}")
    old_block = app[start_idx:end_idx]
    
    # New apt-card style flat template
    # The icon will be a coloured circle with the emoji instead of gradient header
    NEW_CARD = """return `
          <div class="game-card apt-style-card" id="card-${gameId}" data-game="${gameId}">
            <div>
              <div class="apt-card-top">
                <div class="gc-icon-pill" style="background: ${cat.color};">
                  <span style="font-size:1.4rem; line-height:1;">${cfg.icon}</span>
                </div>
                <span class="apt-card-badge gc-cat-badge">${cat.tag}</span>
              </div>
              <h3 class="apt-card-title">${cfg.name}</h3>
              <p class="apt-card-desc">${cfg.desc}</p>
            </div>
            <div>
              <div class="apt-card-meta">
                <span class="difficulty ${diffClass}">${difficultyLabel}</span>
                <div class="game-best" id="best-${gameId}" style="${bestData ? '' : 'display:none'}">
                  🏆 ${bestData ? `<strong>${scoreStr}</strong>${accStr}` : ''}
                </div>
              </div>
              <button class="apt-btn-start btn-play" data-game="${gameId}">
                Start Practice →
              </button>
            </div>
          </div>`;"""
    
    app = app[:start_idx] + NEW_CARD + app[end_idx:]
    print("[app.js] Card template replaced with apt-style flat card.")

with open(APP, "w", encoding="utf-8") as f:
    f.write(app)

print("\n=== FIXES COMPLETE ===")
