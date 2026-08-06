"""
Redesign games.html to match aptitude test page style:
1. games.html - replace page-hero + page-controls with dark apt-hero + filter tabs
2. app.js - change card template to full-width single-col apt-style; add filter logic
3. landing.css - add game-hero dark CSS
"""
import os, re

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# ─────────────────────────────────────────────────────────────────
# 1. games.html — replace light hero + controls
# ─────────────────────────────────────────────────────────────────
GAMES_HTML = os.path.join(ws, "games.html")
with open(GAMES_HTML, encoding="utf-8") as f:
    html = f.read()

OLD_HERO = """    <!-- PAGE HERO -->
    <section class="page-hero">
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
            <span class="page-hero-stat-num">3</span>
            <span class="page-hero-stat-label">Assessment Suites</span>
          </div>
          <div class="page-hero-stat-divider"></div>
          <div class="page-hero-stat">
            <span class="page-hero-stat-num">∞</span>
            <span class="page-hero-stat-label">Unlimited Access</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Page specific filters and controls -->
    <div class="page-controls">
      <!-- Left Side: Search Bar -->
      <div class="lnav-search-container" style="margin: 0; flex: 1; max-width: 320px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lnav-search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="search-input" class="lnav-search-input" placeholder="Filter games..." />
      </div>
    </div>"""

NEW_HERO = """    <!-- GAME HERO — matches aptitude page style -->
    <section class="apt-hero game-hero">
      <div class="apt-hero-bg-grid"></div>
      <div class="apt-hero-inner">
        <div class="apt-eyebrow">🎮 Cognitive Assessment Suite</div>
        <h1 class="apt-hero-h1">Practice Your Recruiter Assessments</h1>
        <p class="apt-hero-sub">Prepare for the exact cognitive, logic, behavioral, and spatial games used by top global employers. Build your cognitive profile across all major provider formats.</p>

        <!-- Category Filter Tabs -->
        <div class="apt-filter-bar" id="game-filter-bar">
          <button class="apt-filter-btn active" data-cat="all">⚡ All Games</button>
          <button class="apt-filter-btn" data-cat="1">🏹 Attention &amp; Focus</button>
          <button class="apt-filter-btn" data-cat="2">🧠 Memory &amp; Speed</button>
          <button class="apt-filter-btn" data-cat="3">📐 Spatial Reasoning</button>
          <button class="apt-filter-btn" data-cat="4">🧩 Risk &amp; Decision</button>
          <button class="apt-filter-btn" data-cat="5">🤝 Social &amp; EQ</button>
        </div>
      </div>
    </section>"""

if OLD_HERO in html:
    html = html.replace(OLD_HERO, NEW_HERO)
    print("[games.html] Hero + controls replaced.")
else:
    print("[games.html] WARNING: Old hero not found exactly, trying partial match...")
    # Try without whitespace sensitivity
    idx1 = html.find("<!-- PAGE HERO -->")
    idx2 = html.find("</div>", html.find("<!-- Page specific filters"))
    # find end of the page-controls div
    idx2 = html.find("</div>", idx2) + 6
    if idx1 > 0 and idx2 > idx1:
        html = html[:idx1] + NEW_HERO + html[idx2:]
        print("[games.html] Replaced via index.")
    else:
        print("[games.html] ERROR: Could not replace hero!")

# Also remove the hidden search input that's no longer in the page-controls area
# but keep the id="search-input" elsewhere if used by JS
# We'll add it as a hidden input below the hero

with open(GAMES_HTML, "w", encoding="utf-8") as f:
    f.write(html)

# ─────────────────────────────────────────────────────────────────
# 2. app.js — update card template and add filter logic
# ─────────────────────────────────────────────────────────────────
APP = os.path.join(ws, "app.js")
with open(APP, encoding="utf-8") as f:
    app = f.read()

# 2a. Replace card grid class from grid-3 → single col (remove grid class)
OLD_GRID = '<div class="game-grid grid-3">'
NEW_GRID = '<div class="game-grid game-grid-single" id="game-grid-cat-${catId}">'
if OLD_GRID in app:
    app = app.replace(OLD_GRID, NEW_GRID)
    print("[app.js] Grid class updated.")
else:
    print("[app.js] WARNING: grid-3 not found")

# 2b. Update card template to full-width apt-style (the new style was already set)
# Check if apt-style-card is already there from previous fix
if 'apt-style-card' in app:
    print("[app.js] apt-style-card template already present.")
else:
    print("[app.js] WARNING: apt-style-card not found in template")

# 2c. Update category section wrapper to show/hide based on filter
# Wrap each category in a section with data-catid attribute
OLD_CAT_DIV = "return `\n        <div class=\"category cat-${catId}\">"
NEW_CAT_DIV = "return `\n        <div class=\"category cat-${catId} game-category-section\" data-catid=\"${catId}\">"
if OLD_CAT_DIV in app:
    app = app.replace(OLD_CAT_DIV, NEW_CAT_DIV)
    print("[app.js] Category section updated with data-catid.")
else:
    print("[app.js] WARNING: Category div pattern not found")

# 2d. Add filter binding after _bind() is called
# Find the search input binding to inject filter button binding after it
OLD_SEARCH_BIND = """    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this._filterGames(query);
      });
    }"""

NEW_SEARCH_BIND = """    // Search input (hidden but still functional)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this._filterGames(query);
      });
    }

    // Category filter buttons in game hero
    const filterBar = document.getElementById('game-filter-bar');
    if (filterBar) {
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.apt-filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.apt-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.game-category-section').forEach(section => {
          if (cat === 'all' || section.dataset.catid === cat) {
            section.style.display = '';
          } else {
            section.style.display = 'none';
          }
        });
      });
    }"""

if OLD_SEARCH_BIND in app:
    app = app.replace(OLD_SEARCH_BIND, NEW_SEARCH_BIND)
    print("[app.js] Category filter binding added.")
else:
    print("[app.js] WARNING: Search bind pattern not found")

with open(APP, "w", encoding="utf-8") as f:
    f.write(app)

# ─────────────────────────────────────────────────────────────────
# 3. style.css — add game-grid-single and card CSS
# ─────────────────────────────────────────────────────────────────
STYLE = os.path.join(ws, "style.css")
with open(STYLE, encoding="utf-8") as f:
    style = f.read()

GAME_SINGLE_CSS = """
/* ── Single-column game grid (apt-style layout) ── */
.game-grid-single {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

/* Full-width apt-style game card */
.game-grid-single .apt-style-card {
  flex-direction: row;
  align-items: stretch;
  gap: 0;
  padding: 0;
  border-radius: 20px;
  display: flex;
}

/* Left accent stripe by category */
.game-grid-single .apt-style-card .card-stripe {
  width: 6px;
  border-radius: 20px 0 0 20px;
  flex-shrink: 0;
}

/* Main card body */
.game-grid-single .apt-style-card .card-body {
  flex: 1;
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.game-grid-single .apt-style-card .apt-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.game-grid-single .apt-style-card .apt-card-title {
  font-family: var(--fh);
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.25;
}

.game-grid-single .apt-style-card .apt-card-desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 16px;
  flex: 1;
  display: block !important; /* always show on full-width */
}

.game-grid-single .apt-style-card .apt-card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 14px;
}

.game-grid-single .apt-style-card .apt-btn-start {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 13px 20px;
  font-family: var(--fi);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.game-grid-single .apt-style-card .apt-btn-start:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(79,70,229,0.4);
}

/* Category section spacing */
.game-category-section {
  padding: 0 24px;
  margin-bottom: 8px;
}
.game-category-section .category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 0 14px;
}
.game-category-section .category-title {
  font-family: var(--fh);
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

/* sections container wrapper */
.categories {
  max-width: 780px;
  margin: 0 auto;
}

/* Mobile: revert to compact single col */
@media (max-width: 768px) {
  .game-category-section { padding: 0 12px; }
  .game-grid-single { gap: 12px; }
  .game-grid-single .apt-style-card { flex-direction: column; }
  .game-grid-single .apt-style-card .card-stripe {
    width: auto; height: 5px;
    border-radius: 16px 16px 0 0;
  }
  .game-grid-single .apt-style-card .card-body { padding: 16px 16px 14px; }
  .game-grid-single .apt-style-card .apt-card-title { font-size: 0.95rem; }
  .game-grid-single .apt-style-card .apt-card-desc { font-size: 0.78rem; }
  .game-grid-single .apt-style-card .apt-btn-start { padding: 11px 16px; font-size: 0.82rem; }
}
"""

# Append to end of style.css before last newline
style = style.rstrip() + "\n" + GAME_SINGLE_CSS + "\n"
with open(STYLE, "w", encoding="utf-8") as f:
    f.write(style)
print("[style.css] Game single-col CSS added.")

# ─────────────────────────────────────────────────────────────────
# 4. Update app.js card template to include card-stripe and card-body
# ─────────────────────────────────────────────────────────────────
with open(APP, encoding="utf-8") as f:
    app = f.read()

OLD_CARD = """return `
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

NEW_CARD = r"""return `
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

if OLD_CARD in app:
    app = app.replace(OLD_CARD, NEW_CARD)
    print("[app.js] Card template updated with card-stripe + card-body.")
else:
    print("[app.js] WARNING: Card template not found exactly")
    # Try to find and print context
    idx = app.find('gc-icon-pill')
    print(f"  gc-icon-pill at pos: {idx}")
    print(f"  Context: {app[max(0,idx-100):idx+200]}")

with open(APP, "w", encoding="utf-8") as f:
    f.write(app)

print("\n=== REDESIGN COMPLETE ===")
