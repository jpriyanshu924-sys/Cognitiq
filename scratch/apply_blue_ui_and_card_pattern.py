"""
Transform games.html and app.js to use the exact blue UI and card pattern from aptitude-test.html
1. Update games.html head to include aptitude.css and simplify body section
2. Update app.js _renderCategories and category filtering to produce apt-card elements
3. Ensure aptitude.css handles responsive apt-grid (3-col desktop, 2-col tablet, 1-col mobile)
"""
import os, re

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# ─────────────────────────────────────────────────────────────────
# 1. games.html
# ─────────────────────────────────────────────────────────────────
GAMES_HTML = os.path.join(ws, "games.html")
with open(GAMES_HTML, encoding="utf-8") as f:
    g_html = f.read()

# Add aptitude.css to head if missing
if 'aptitude.css' not in g_html:
    g_html = g_html.replace(
        '<link rel="stylesheet" href="landing.css?v=2" />',
        '<link rel="stylesheet" href="landing.css?v=2" />\n  <link rel="stylesheet" href="aptitude.css?v=1" />'
    )
    print("[games.html] Added aptitude.css link.")

# Replace hero & container structure in games.html
HERO_REPLACEMENT = """    <!-- BLUE HERO SECTION (matches aptitude test page) -->
    <section class="apt-hero">
      <div class="apt-hero-bg-grid"></div>
      <div class="apt-hero-inner">
        <div class="apt-eyebrow">🚀 GAMIFIED RECRUITMENT ASSESSMENT SUITE</div>
        <h1 class="apt-hero-h1">Gamified Assessment &amp; Recruiter Rounds</h1>
        <p class="apt-hero-sub">Prepare for the exact cognitive, logic, behavioral, and spatial games used by top recruiters like Pymetrics, Arctic Shores, HireVue, and Aon Cut-e.</p>

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
    </section>

    <!-- hidden search input for JS compatibility -->
    <input type="text" id="search-input" style="display:none;" />

    <!-- CARDS GRID CONTAINER -->
    <section class="apt-section-wrap">
      <div class="apt-grid" id="categories-container">
        <!-- Injected dynamically by app.js -->
      </div>
    </section>"""

# Locate existing hero -> categories block in games.html
start_mark = '<!-- PAGE HERO -->'
if start_mark not in g_html:
    start_mark = '<!-- BLUE HERO SECTION'

if start_mark in g_html:
    idx_start = g_html.find(start_mark)
    idx_end = g_html.find('<div class="final-cta"', idx_start)
    if idx_end > 0:
        g_html = g_html[:idx_start] + HERO_REPLACEMENT + "\n\n    " + g_html[idx_end:]
        print("[games.html] Hero and container replaced.")
    else:
        print("[games.html] WARNING: final-cta mark not found.")
else:
    print("[games.html] WARNING: start_mark not found.")

with open(GAMES_HTML, "w", encoding="utf-8") as f:
    f.write(g_html)

# ─────────────────────────────────────────────────────────────────
# 2. app.js
# ─────────────────────────────────────────────────────────────────
APP_JS = os.path.join(ws, "app.js")
with open(APP_JS, encoding="utf-8") as f:
    app = f.read()

# Update _renderCategories() to generate apt-card elements
NEW_RENDER_CATEGORIES = """  _renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const s = this.state.scores;

    const TRAIT_CATEGORIES = {
      1: { name: 'Attention & Focus', icon: '🏹', desc: 'Inhibiting distractions and maintaining persistent focus', games: ['arrows-game', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop'], tag: 'Attention' },
      2: { name: 'Working Memory & Speed', icon: '🧠', desc: 'Holding, updating and manipulating sequential data', games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets'], tag: 'Memory' },
      3: { name: 'Spatial Reasoning & Planning', icon: '📐', desc: 'Mentally rotating shapes, sequencing moves and generator logic', games: ['shape-spinner', 'pipe-puzzle', 'gridlock', 'tower-game', 'power-generators'], tag: 'Spatial' },
      4: { name: 'Risk Calibration & Decision Making', icon: '🧩', desc: 'Assessing trade-offs under high-uncertainty rules', games: ['balloon-game', 'cards-game', 'hard-easy-game', 'money-exchange'], tag: 'Decision' },
      5: { name: 'Social, Emotional & Interpersonal', icon: '🤝', desc: 'Reading expressions and resolving workplace scenarios', games: ['faces-game', 'inbox-triage'], tag: 'Social' }
    };

    let allGames = [];
    Object.keys(TRAIT_CATEGORIES).forEach(catId => {
      const cat = TRAIT_CATEGORIES[catId];
      cat.games.forEach(gameId => {
        allGames.push({ catId, cat, gameId });
      });
    });

    container.innerHTML = allGames.map(({ catId, cat, gameId }) => {
      const cfg = GAME_CONFIG[gameId];
      if (!cfg) return '';
      const bestData = (s[gameId]?.best ?? s[gameId]);
      const scoreStr = bestData ? `${bestData.score.toLocaleString()} pts` : '';
      const accStr = bestData ? ` · ${Math.round(bestData.accuracy)}% acc` : '';
      
      let difficultyLabel = 'Easy';
      let diffClass = 'diff-easy';
      if (cfg.difficulty === 'medium') { difficultyLabel = 'Medium'; diffClass = 'diff-medium'; }
      else if (cfg.difficulty === 'hard') { difficultyLabel = 'Hard'; diffClass = 'diff-hard'; }

      const prov = cfg.provider || 'Recruiter Assessment';

      return `
        <div class="apt-card game-card game-card-item" id="card-${gameId}" data-game="${gameId}" data-catid="${catId}">
          <div>
            <div class="apt-card-top">
              <div class="apt-card-icon">${cfg.icon}</div>
              <span class="apt-card-badge">${cat.tag}</span>
            </div>
            <h3 class="apt-card-title">${cfg.name}</h3>
            <p class="apt-card-desc">${cfg.desc}</p>
          </div>
          <div>
            <div class="apt-card-meta">
              <span>⏱ 3 Mins</span>
              <span>🎯 ${prov}</span>
              <span class="difficulty ${diffClass}">${difficultyLabel}</span>
            </div>
            <div class="game-best" id="best-${gameId}" style="${bestData ? 'margin-bottom:12px;' : 'display:none;'}">
              ${bestData ? `🏆 Best: <strong>${scoreStr}</strong>${accStr}` : ''}
            </div>
            <button class="apt-btn-start btn-play" data-game="${gameId}">
              Start Practice →
            </button>
          </div>
        </div>`;
    }).join('');
  }"""

# Replace _renderCategories in app.js
idx_func = app.find('_renderCategories() {')
if idx_func > 0:
    # Find matching end of method (next method or class end)
    idx_next_func = app.find('/* ── DASHBOARD UPDATE', idx_func)
    if idx_next_func < 0:
      idx_next_func = app.find('_updateDashboard()', idx_func)
    if idx_next_func > 0:
        app = app[:idx_func] + NEW_RENDER_CATEGORIES + "\n\n  " + app[idx_next_func:]
        print("[app.js] Replaced _renderCategories method.")

# Update Filter Listener in app.js
OLD_FILTER_BIND = """    // Category filter buttons in game hero
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

NEW_FILTER_BIND = """    // Category filter buttons in game hero
    const filterBar = document.getElementById('game-filter-bar');
    if (filterBar) {
      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.apt-filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.apt-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.game-card-item').forEach(card => {
          if (cat === 'all' || card.dataset.catid === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }"""

if OLD_FILTER_BIND in app:
    app = app.replace(OLD_FILTER_BIND, NEW_FILTER_BIND)
    print("[app.js] Updated filter button event listener for game cards.")

with open(APP_JS, "w", encoding="utf-8") as f:
    f.write(app)

# ─────────────────────────────────────────────────────────────────
# 3. aptitude.css — ensure responsive apt-grid layout
# ─────────────────────────────────────────────────────────────────
APT_CSS = os.path.join(ws, "aptitude.css")
with open(APT_CSS, encoding="utf-8") as f:
    apt = f.read()

# Add explicit mobile 1-column rule for .apt-grid if needed
if '@media (max-width: 768px)' not in apt:
    apt_mobile = """
/* Mobile Responsive for apt-grid */
@media (max-width: 768px) {
  .apt-section-wrap {
    padding: 24px 16px 60px;
  }
  .apt-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
  .apt-card {
    padding: 20px 16px;
    border-radius: 16px;
  }
  .apt-card-title {
    font-size: 1.15rem;
  }
  .apt-card-desc {
    font-size: 0.84rem;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  .apt-card-meta {
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
    padding-top: 12px;
  }
}
"""
    apt = apt.rstrip() + "\n" + apt_mobile
    print("[aptitude.css] Added mobile 1-column rule.")

with open(APT_CSS, "w", encoding="utf-8") as f:
    f.write(apt)

print("\n=== BLUE THEME & CARD PATTERN APPLIED ===")
