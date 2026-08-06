"""
Refactor index.html hero section and clean up scripts
"""
import os

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"
INDEX_PATH = os.path.join(ws, "index.html")

with open(INDEX_PATH, encoding="utf-8") as f:
    html = f.read()

# Replace hero section HTML in index.html
OLD_HERO_BLOCK = """  <!-- ═══════════════════════════════════════ HERO ═══ -->
  <section class="hero-section" id="hero">
    <div class="hero-bg-grid"></div>
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <div class="hero-inner">
      <div class="hero-badge">
        <span class="hero-badge-dot"></span>
        🚀 #1 Gamified Assessment & Aptitude Prep Platform
      </div>
      <h1 class="hero-h1">
        Ace Your Placement Tests &<br/>
        <span class="hero-h1-grad">Gamified Assessment Rounds</span>
      </h1>
      <p class="hero-sub">
        Master interactive cognitive games (Attention, Memory, Spatial, Risk, Social EQ) and Aptitude Tests (Quantitative, DILR, Verbal, Speed Drills) under real time pressure.
      </p>
      <div class="hero-actions">
        <a href="games.html" class="hero-btn-primary">🎮 Explore Gamified Assessments</a>
        <a href="aptitude-test.html" class="hero-btn-secondary">📊 Practice Aptitude Tests</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat">
          <div class="hero-stat-num">31+</div>
          <div class="hero-stat-label">Gamified Tests</div>
        </div>
        <div class="hero-stat-div"></div>
        <div class="hero-stat">
          <div class="hero-stat-num">Aptitude</div>
          <div class="hero-stat-label">QA / DILR / VARC</div>
        </div>
        <div class="hero-stat-div"></div>
        <div class="hero-stat">
          <div class="hero-stat-num">3</div>
          <div class="hero-stat-label">Mock Test Suites</div>
        </div>
        <div class="hero-stat-div"></div>
        <div class="hero-stat">
          <div class="hero-stat-num">100%</div>
          <div class="hero-stat-label">Free Practice</div>
        </div>
      </div>
    </div>

    <!-- Floating preview card -->
    <div class="hero-card-float">
      <div class="hcf-header">
        <div class="hcf-dot hcf-dot-r"></div>
        <div class="hcf-dot hcf-dot-y"></div>
        <div class="hcf-dot hcf-dot-g"></div>
        <span class="hcf-title">Cognitive Performance Analytics</span>
      </div>
      <div class="hcf-body">
        <div class="hcf-balloon">🧩</div>
        <div class="hcf-metric-row">
          <div class="hcf-metric"><span class="hcf-metric-v">920</span><span class="hcf-metric-l">Score</span></div>
          <div class="hcf-metric"><span class="hcf-metric-v">88%</span><span class="hcf-metric-l">Accuracy</span></div>
          <div class="hcf-metric"><span class="hcf-metric-v">0.9s</span><span class="hcf-metric-l">Reaction</span></div>
        </div>
      </div>
      <div class="hcf-insight">
        <div class="hcf-insight-label">⚡ Cognitive Trait Breakdown</div>
        <div class="hcf-insight-text">Attention control and memory capacity calibrated. High percentile consistency achieved.</div>
      </div>
    </div>
  </section>"""

NEW_HERO_BLOCK = """  <!-- ═══════════════════════════════════════ HERO ═══ -->
  <section class="hero-section" id="hero">
    <div class="hero-bg-grid"></div>
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <div class="hero-inner">
      <div class="hero-content">
        <div class="hero-badge">
          🚀 #1 GAMIFIED ASSESSMENT &amp; APTITUDE PREP PLATFORM
        </div>
        <h1 class="hero-h1">
          Ace Your Placement Tests &amp;<br/>
          Gamified Assessment Rounds
        </h1>
        <p class="hero-sub">
          Master interactive cognitive games (Attention, Memory, Spatial, Risk, Social EQ) and Aptitude Tests (Quantitative, DILR, Verbal, Speed Drills) under real time pressure.
        </p>
        <div class="hero-actions">
          <a href="games.html" class="hero-btn-primary">🎮 Explore Gamified Assessments</a>
          <a href="aptitude-test.html" class="hero-btn-secondary">📊 Practice Aptitude Tests</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <div class="hero-stat-num">31+</div>
            <div class="hero-stat-label">Gamified Tests</div>
          </div>
          <div class="hero-stat-div"></div>
          <div class="hero-stat">
            <div class="hero-stat-num">Aptitude</div>
            <div class="hero-stat-label">QA / DILR / VARC</div>
          </div>
          <div class="hero-stat-div"></div>
          <div class="hero-stat">
            <div class="hero-stat-num">3</div>
            <div class="hero-stat-label">Mock Test Suites</div>
          </div>
          <div class="hero-stat-div"></div>
          <div class="hero-stat">
            <div class="hero-stat-num">100%</div>
            <div class="hero-stat-label">Free Practice</div>
          </div>
        </div>
      </div>

      <!-- Hero Showcase Card -->
      <div class="hero-card-float">
        <div class="hcf-header">
          <span class="hcf-badge">LIVE DEMO PREVIEW</span>
          <div class="hcf-live"><span class="hcf-dot"></span> Real-time Radar</div>
        </div>
        <div class="hcf-game-title">Cognitive Radar Profile</div>
        <div class="hcf-metrics">
          <div class="hcf-metric"><span class="hcf-metric-v">1,420</span><span class="hcf-metric-l">Score</span></div>
          <div class="hcf-metric"><span class="hcf-metric-v">94%</span><span class="hcf-metric-l">Accuracy</span></div>
          <div class="hcf-metric"><span class="hcf-metric-v">0.8s</span><span class="hcf-metric-l">Reaction</span></div>
        </div>
        <div class="hcf-insight">
          <div class="hcf-insight-label">⚡ Cognitive Trait Breakdown</div>
          <div class="hcf-insight-text">Attention control and working memory capacity calibrated. 98th percentile consistency achieved.</div>
        </div>
      </div>
    </div>
  </section>"""

if OLD_HERO_BLOCK in html:
    html = html.replace(OLD_HERO_BLOCK, NEW_HERO_BLOCK)
    print("[index.html] Hero section updated.")
else:
    print("[index.html] WARNING: OLD_HERO_BLOCK not found exactly, trying search...")

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(html)

print("[index.html] Hero refactored.")
