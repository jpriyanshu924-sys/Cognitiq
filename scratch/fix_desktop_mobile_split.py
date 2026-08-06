"""
Fix: Desktop layout unchanged, only mobile gets the new apt-style.
1. Restore original gradient card template in app.js (grid-3 for desktop)
2. games.html: have both heroes, toggle via CSS
3. CSS: desktop shows light hero + grid-3, mobile shows dark hero + 1-col cards
"""
import os

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# ─────────────────────────────────────────────────────────────────
# 1. app.js — revert to original gradient card template
# ─────────────────────────────────────────────────────────────────
APP = os.path.join(ws, "app.js")
with open(APP, encoding="utf-8") as f:
    app = f.read()

# Revert grid class
OLD_GRID = '<div class="game-grid game-grid-single" id="game-grid-cat-${catId}">'
NEW_GRID = '<div class="game-grid grid-3" id="game-grid-cat-${catId}">'
if OLD_GRID in app:
    app = app.replace(OLD_GRID, NEW_GRID)
    print("[app.js] Grid reverted to grid-3.")
else:
    print("[app.js] WARNING: grid-single not found")

# Revert card template back to original gradient card
OLD_CARD = r"""return `
          <div class="game-card apt-style-card" id="card-${gameId}" data-game="${gameId}">
            <div class="card-stripe" style="background: ${cat.color};"></div>
            <div class="card-body">
              <div class="apt-card-top">
                <div class="gc-icon-pill" style="background: ${cat.color}22; border: 1px solid ${cat.color}44;">
                  <span style="font-size:1.5rem; line-height:1;">${cfg.icon}</span>
                </div>
                <span class="gc-cat-badge">${cat.tag.toUpperCase()}</span>
              </div>
              <h3 class="apt-card-title">${cfg.name}</h3>
              <p class="apt-card-desc">${cfg.desc}</p>
              <div class="apt-card-meta">
                <span class="difficulty ${diffClass}">${difficultyLabel}</span>
                <span style="font-size:0.72rem; color:#94a3b8; font-weight:600;">${prov}</span>
                <div class="game-best" id="best-${gameId}" style="${bestData ? '' : 'display:none'}">
                  🏆 ${bestData ? `<strong>${scoreStr}</strong>${accStr}` : ''}
                </div>
              </div>
              <button class="apt-btn-start btn-play" data-game="${gameId}">
                Start Practice →
              </button>
            </div>
          </div>`;"""

NEW_CARD = """return `
          <div class="game-card" id="card-${gameId}" data-game="${gameId}">
            <div class="gc-header-block ${cat.bg}">
              <div class="gc-top-row">
                <span class="gc-popular-tag">${cat.tag}</span>
                <span class="gc-watermark">${cfg.icon}</span>
              </div>
              <div class="gc-title-row">
                <span class="gc-card-title-main">${cfg.name}</span>
              </div>
            </div>
            <div class="gc-body-block">
              <div class="gc-body-title">${prov} Assessment</div>
              <span class="difficulty ${diffClass}">${difficultyLabel}</span>
              <p>${cfg.desc}</p>
              <div class="game-best" id="best-${gameId}" style="${bestData ? '' : 'display:none'}">
                ${bestData ? `🏆 Best: <strong>${scoreStr}</strong>${accStr}` : ''}
              </div>
              <button class="btn btn-play" data-game="${gameId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Start Practice
              </button>
            </div>
          </div>`;"""

if OLD_CARD in app:
    app = app.replace(OLD_CARD, NEW_CARD)
    print("[app.js] Card template reverted to original gradient style.")
else:
    print("[app.js] WARNING: New card template not found — searching...")
    idx = app.find("apt-style-card")
    if idx > 0:
        print(f"  apt-style-card found at pos {idx}, context:")
        print(app[max(0,idx-100):idx+300])

with open(APP, "w", encoding="utf-8") as f:
    f.write(app)

# ─────────────────────────────────────────────────────────────────
# 2. games.html — add back desktop hero alongside mobile hero
# ─────────────────────────────────────────────────────────────────
GAMES_HTML = os.path.join(ws, "games.html")
with open(GAMES_HTML, encoding="utf-8") as f:
    html = f.read()

# The current games.html has the dark apt-hero. We need to:
# - Keep it but add class "mobile-only-hero" 
# - Add back the original light desktop hero with class "desktop-only-hero"

OLD_HERO_START = '    <!-- GAME HERO — matches aptitude page style -->\n    <section class="apt-hero game-hero">'
NEW_HERO_BLOCK = """    <!-- DESKTOP HERO (original light style — shown on ≥769px) -->
    <section class="page-hero desktop-only-hero">
      <div class="page-hero-inner" style="max-width: 820px;">
        <div class="page-hero-eyebrow">🚀 Cognitive Training Suite</div>
        <h1 class="page-hero-h1">Practice Your Recruiter Assessments</h1>
        <p class="page-hero-sub" style="max-width: 680px; color: rgba(255,255,255,0.75);">Prepare for the exact cognitive, logic, behavioral, and spatial games used by top global employers. Build your cognitive profile across all major provider formats.</p>
        <div class="page-hero-stats">
          <div class="page-hero-stat">
            <span class="page-hero-stat-num">31</span>
            <span class="page-hero-stat-label">Gamified Assessments</span>
          </div>
          <div class="page-hero-stat-divider"></div>
          <div class="page-hero-stat">
            <span class="page-hero-stat-num">5</span>
            <span class="page-hero-stat-label">Trait Categories</span>
          </div>
          <div class="page-hero-stat-divider"></div>
          <div class="page-hero-stat">
            <span class="page-hero-stat-num">∞</span>
            <span class="page-hero-stat-label">Unlimited Access</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MOBILE HERO (dark apt-style — shown on ≤768px only) -->
    <section class="apt-hero game-hero mobile-only-hero">"""

if OLD_HERO_START in html:
    html = html.replace(OLD_HERO_START, NEW_HERO_BLOCK)
    print("[games.html] Desktop hero added, mobile hero marked.")
else:
    print("[games.html] WARNING: Could not find mobile hero start to inject desktop hero")

with open(GAMES_HTML, "w", encoding="utf-8") as f:
    f.write(html)

# ─────────────────────────────────────────────────────────────────
# 3. CSS — desktop-only / mobile-only toggles + mobile single-col cards
# ─────────────────────────────────────────────────────────────────
STYLE = os.path.join(ws, "style.css")
with open(STYLE, encoding="utf-8") as f:
    style = f.read()

MOBILE_GAME_CSS = """
/* ══════════════════════════════════════════════════════════════
   GAMES PAGE — Desktop/Mobile hero toggle + mobile card overrides
   ══════════════════════════════════════════════════════════════ */

/* Desktop: show light hero, hide dark mobile hero */
.desktop-only-hero { display: block; }
.mobile-only-hero  { display: none;  }

/* Desktop: filter bar in mobile hero hidden */
#game-filter-bar { display: flex; }

@media (max-width: 768px) {
  /* Swap heroes */
  .desktop-only-hero { display: none !important; }
  .mobile-only-hero  { display: block !important; }

  /* Mobile game grid: SINGLE column (1-after-another scroll) */
  .game-grid.grid-3 {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  /* Mobile game card: flat, no gradient split — clean single-col tile */
  .game-card {
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
  }

  /* Compact coloured header */
  .gc-header-block {
    min-height: 60px !important;
    padding: 12px 14px !important;
    border-radius: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .gc-watermark { font-size: 1.6rem; top: auto; right: auto; position: static; opacity: 1; }
  .gc-title-row { margin-top: 0; }
  .gc-card-title-main { font-size: 0.95rem; }
  .gc-popular-tag { font-size: 0.58rem; }
  .gc-top-row { flex-direction: column; align-items: flex-start; gap: 4px; }

  /* Body: hide long description */
  .gc-body-block { padding: 12px 14px 14px; gap: 8px; }
  .gc-body-title { font-size: 0.82rem; margin-bottom: 2px; }
  .game-card p   { display: none; }
  .game-best     { display: none !important; }

  /* Play button full-width */
  .game-card .btn-play {
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.8rem !important;
    padding: 10px 14px !important;
    border-radius: 10px !important;
    margin-top: 4px;
  }

  /* Category section on mobile */
  .game-category-section { padding: 0 12px; }
  .games-categories-wrap { padding: 16px 12px 60px; }
}
"""

style = style.rstrip() + "\n" + MOBILE_GAME_CSS + "\n"
with open(STYLE, "w", encoding="utf-8") as f:
    f.write(style)
print("[style.css] Desktop/mobile toggle CSS added.")

print("\n=== ALL FIXES COMPLETE ===")
