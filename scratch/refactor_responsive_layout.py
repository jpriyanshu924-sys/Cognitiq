"""
Refactor style.css and landing.css to fix:
1. Laptop layout for gamified assessment tests (fits screen size: 3-col on desktop >=1100px, 2-col on laptop/tablet 769-1099px).
2. Mobile layout (<= 768px): 1-col stack, user scrolls down one card after another.
3. Card content uniformity: 100% identical HTML & content across all interfaces (including description <p>, tags, badges, buttons).
"""
import os

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"
STYLE_PATH = os.path.join(ws, "style.css")

with open(STYLE_PATH, encoding="utf-8") as f:
    style_content = f.read()

# 1. Fix line 1128 media query where .grid-3 was forced to 1fr at 960px
OLD_960_RULE = """@media(max-width: 960px) {
  .grid-3  { grid-template-columns: 1fr; }"""

NEW_960_RULE = """@media(max-width: 960px) {
  .grid-3  { grid-template-columns: repeat(2, 1fr); }"""

if OLD_960_RULE in style_content:
    style_content = style_content.replace(OLD_960_RULE, NEW_960_RULE)
    print("[style.css] Fixed 960px grid-3 rule.")

# 2. Trim tail of style.css starting from line 4292 (or marker "MOBILE GAME-STYLE")
tail_marker = "/* ══════════════════════════════════════════════════════════════\n   MOBILE GAME-STYLE"
if tail_marker in style_content:
    cutoff = style_content.find(tail_marker)
    style_content = style_content[:cutoff]
    print("[style.css] Cut off old tail.")
else:
    # try alternate marker
    tail_marker2 = "/* ── Single-column game grid"
    if tail_marker2 in style_content:
        cutoff = style_content.find(tail_marker2)
        style_content = style_content[:cutoff]
        print("[style.css] Cut off old tail using alternate marker.")

# 3. Append clean, unified responsive layout CSS
CLEAN_RESPONSIVE_CSS = """
/* ══════════════════════════════════════════════════════════════
   UNIFIED GAMIFIED ASSESSMENTS LAYOUT & RESPONSIVE CARDS
   ══════════════════════════════════════════════════════════════ */

/* Laptop / Desktop Layout Container */
.categories {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 36px 24px 80px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.category {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,.02);
}

.game-grid, .grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

/* Laptops & Tablets (769px to 1099px) */
@media (max-width: 1099px) and (min-width: 769px) {
  .categories {
    padding: 28px 20px 60px;
  }
  .game-grid, .grid-3 {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 18px !important;
  }
}

/* Mobile Layout (<= 768px): 1-column stack, scroll down card by card */
@media (max-width: 768px) {
  .categories {
    padding: 18px 12px 60px;
    gap: 24px;
  }
  .category {
    padding: 16px 14px;
    border-radius: 16px;
  }

  /* Single Column Stack */
  .game-grid, .grid-3 {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  /* Mobile Game Card - Identical Content, Scaled for Touch */
  .game-card {
    border-radius: 16px;
  }

  .gc-header-block {
    padding: 18px 16px 14px;
    min-height: 92px;
  }

  .gc-card-title-main {
    font-size: 1.2rem;
    line-height: 1.25;
  }

  .gc-watermark {
    font-size: 2.6rem;
  }

  .gc-body-block {
    padding: 16px;
    gap: 10px;
  }

  .gc-body-title {
    font-size: 1.05rem;
  }

  /* Description: FULLY VISIBLE ON ALL INTERFACES */
  .game-card p {
    display: block !important;
    font-size: 0.82rem;
    color: #475569;
    line-height: 1.5;
    margin: 2px 0 6px;
  }

  .difficulty {
    font-size: 0.65rem;
    padding: 3px 10px;
  }

  .game-best {
    display: block !important;
    font-size: 0.78rem;
  }

  .game-card .btn-play, .btn-play {
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 0.88rem !important;
    font-weight: 700 !important;
    padding: 12px 16px !important;
    border-radius: 10px !important;
    margin-top: 4px;
  }
}
"""

style_content = style_content.rstrip() + "\n" + CLEAN_RESPONSIVE_CSS + "\n"

with open(STYLE_PATH, "w", encoding="utf-8") as f:
    f.write(style_content)

print("[style.css] Clean responsive layout written.")
