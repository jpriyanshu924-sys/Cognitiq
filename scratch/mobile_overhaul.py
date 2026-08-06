"""
Mobile Game-Style Overhaul
Injects / replaces the mobile CSS blocks in landing.css and aptitude.css
"""
import os, re

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# ─── 1. landing.css ─────────────────────────────────────────────────────────

LANDING = os.path.join(ws, "landing.css")
with open(LANDING, encoding="utf-8") as f:
    css = f.read()

# Remove the previous @media(max-width:768px) block that was added earlier
# (between lines 373-455) and the compact-600px block at the very end
OLD_768 = re.compile(
    r"@media\s*\(max-width:\s*768px\)\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}\s*\n"
    r"\s*/\* ════.*?HERO SECTION",
    re.DOTALL
)

# ─── replacement mobile block ────────────────────────────────────────────────
MOBILE_CSS = r"""/* ══════════════════════════════════════════════════════════════
   MOBILE-GAME RESPONSIVE  (≤ 768 px)
   ══════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {

  /* ── Navbar: compact 52px strip ── */
  .lnav-inner {
    height: 52px;
    padding: 0 12px;
    gap: 6px;
  }
  .lnav-logo-svg { width: 24px; height: 24px; }
  .lnav-logo-text { font-size: 0.95rem; }

  /* profile pill → avatar-only circle */
  .lnav-profile-btn {
    padding: 4px 7px;
    gap: 4px;
    border-radius: 20px;
  }
  .lnav-profile-btn > span:not(.lnav-online-dot):not(.lnav-avatar-text) {
    display: none !important;
  }

  /* mobile dropdown pinned below 52px bar */
  .lnav-mobile { top: 52px; }

  /* ── Hero: ultra-compact ── */
  .hero-section {
    padding: 68px 16px 28px;
    min-height: auto;
    align-items: flex-start;
  }
  .hero-inner { text-align: center; max-width: 100%; }
  .hero-badge  { margin: 0 auto 10px; font-size: 0.72rem; padding: 5px 12px; }
  .hero-h1 {
    font-size: clamp(1.55rem, 6vw, 2rem);
    line-height: 1.15;
    margin-bottom: 10px;
    letter-spacing: -0.02em;
  }
  .hero-sub {
    font-size: 0.82rem;
    line-height: 1.55;
    margin: 0 auto 16px;
    color: #475569;
    max-width: 320px;
  }

  /* CTA buttons – full width, same height */
  .hero-actions { flex-direction: column; gap: 8px; width: 100%; }
  .hero-btn-primary, .hero-btn-secondary {
    width: 100%; justify-content: center;
    padding: 12px 20px; font-size: 0.9rem;
  }
  .hero-btn-primary { border-radius: 14px; }
  .hero-btn-secondary { border-radius: 14px; }

  /* stats – 3-up inline micro strip */
  .hero-stats { gap: 8px; justify-content: center; margin-top: 16px; }
  .hero-stat-num { font-size: 1.1rem; }
  .hero-stat-label { font-size: 0.65rem; }
  .hero-stat-div { display: none; }

  /* hide the floating card on mobile */
  .hero-card-float { display: none; }

  /* ── Section spacing: tighter ── */
  .features-section,
  .how-section,
  .faq-section,
  .section-wrap { padding: 32px 14px 40px; }

  .section-tag  { font-size: 0.7rem; margin-bottom: 8px; }
  .section-h2   { font-size: 1.35rem; margin-bottom: 8px; }
  .section-sub  { font-size: 0.82rem; margin-bottom: 24px; }

  /* ── Tracks – 2 compact game-style cards ── */
  .tracks-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 20px;
  }
  .track-card {
    padding: 18px 14px;
    border-radius: 16px;
    gap: 10px;
  }
  .track-card-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    font-size: 1.4rem;
  }
  .track-card-title { font-size: 0.9rem; }
  .track-card-desc  { font-size: 0.76rem; line-height: 1.4; }
  .track-card-cta   { font-size: 0.78rem; padding: 8px 14px; margin-top: 8px; }
  .track-tag { font-size: 0.62rem; padding: 3px 8px; }

  /* ── Features: 2-col grid ── */
  .features-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .feature-card {
    padding: 16px 12px;
    border-radius: 14px;
    gap: 8px;
  }
  .feature-icon { font-size: 1.3rem; margin-bottom: 6px; }
  .feature-title { font-size: 0.82rem; }
  .feature-desc  { font-size: 0.72rem; line-height: 1.4; }

  /* ── How-it-works: vertical stack ── */
  .how-steps { flex-direction: column; gap: 12px; }
  .how-connector { display: none; }
  .how-step {
    padding: 18px 16px;
    border-radius: 16px;
    text-align: left;
    flex-direction: row;
    align-items: flex-start;
    gap: 14px;
  }
  .how-step-num {
    width: 36px; height: 36px;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .how-step-title { font-size: 0.88rem; }
  .how-step-desc  { font-size: 0.76rem; line-height: 1.4; }

  /* ── FAQ: compact ── */
  .faq-question { font-size: 0.88rem; padding: 14px 18px; }
  .faq-answer   { font-size: 0.8rem; }

  /* ── Footer: single column ── */
  .site-footer { padding: 36px 16px 20px; }
  .footer-inner {
    flex-direction: column;
    gap: 24px;
  }
  .footer-brand { max-width: 100%; }
  .footer-tagline { font-size: 0.8rem; }
  .footer-links { display: none; }         /* hide link cols on mobile */
  .footer-bottom { font-size: 0.72rem; margin-top: 20px; }

  /* ── Aptitude filter bar: 2×2 grid ── */
  .apt-section-wrap { padding: 16px 12px 48px; }
  .apt-filter-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 20px;
  }
  .apt-filter-btn {
    padding: 8px 10px;
    font-size: 0.76rem;
    border-radius: 10px;
    justify-content: center;
  }

  /* ── Aptitude cards: 2-col game grid ── */
  .apt-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }
  .apt-card {
    padding: 14px 12px;
    border-radius: 16px;
    gap: 0;
  }
  .apt-card-icon {
    width: 36px; height: 36px;
    font-size: 1.1rem;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .apt-card-badge { font-size: 0.6rem; padding: 2px 7px; }
  .apt-card-title { font-size: 0.82rem; margin-bottom: 4px; }
  .apt-card-desc  { font-size: 0.72rem; line-height: 1.35; margin-bottom: 12px; }
  .apt-card-meta  { font-size: 0.68rem; gap: 8px; padding-top: 10px; margin-bottom: 12px; }
  .apt-btn-start  { font-size: 0.78rem; padding: 9px 12px; border-radius: 10px; }

  /* ── Game cards on games.html: 2-col ── */
  .game-grid,
  .games-grid,
  [class*="game-grid"] {
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
  }
  .game-card,
  [class*="game-card"] {
    padding: 14px 12px !important;
    border-radius: 16px !important;
  }

  /* ── Category headers: tight ── */
  .category-section { padding: 18px 14px 0; }
  .category-header  { margin-bottom: 10px; flex-wrap: wrap; gap: 6px; }
  .category-title   { font-size: 0.88rem; }
  .category-progress,
  .progress-badge   { font-size: 0.7rem; padding: 3px 10px; }

  /* ── Mock test cards ── */
  .mock-grid,
  [class*="mock-grid"] {
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
  }
}

/* ── Extra-small phones (≤ 390 px) ── */
@media (max-width: 390px) {
  .hero-h1  { font-size: 1.4rem; }
  .hero-sub { font-size: 0.78rem; }
  .tracks-grid,
  .features-grid,
  .apt-grid { grid-template-columns: 1fr; }
  .apt-filter-bar { grid-template-columns: 1fr 1fr; }
}

/* ══════════════════════════════════════════════════════════════
   HERO SECTION (Landing)
   ══════════════════════════════════════════════════════════════ */
"""

# Replace old 768px block + the separator comment
css_new = re.sub(
    r"@media\s*\(max-width:\s*768px\)\s*\{[\s\S]*?\}\s*\n\s*/\* [═]+\s*\n\s*HERO SECTION",
    MOBILE_CSS,
    css,
    count=1
)

if css_new == css:
    print("[landing.css] WARNING: primary replacement pattern not found – appending block instead")
    css_new = css + "\n" + MOBILE_CSS
else:
    print("[landing.css] Primary mobile block replaced successfully.")

# Also strip the old 600px block at the end (duplicate compact rules)
css_new = re.sub(
    r"\n@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\}\s*\n?$",
    "\n",
    css_new
)

with open(LANDING, "w", encoding="utf-8") as f:
    f.write(css_new)

print("[landing.css] Done.")

# ─── 2. aptitude.css – update the 640px block ────────────────────────────────

APT = os.path.join(ws, "aptitude.css")
with open(APT, encoding="utf-8") as f:
    apt = f.read()

OLD_APT_MQ = "@media (max-width: 640px) {\n  .apt-hero { padding: 60px 16px 40px; }\n  .apt-grid { grid-template-columns: 1fr; }\n  .apt-workspace-card { max-height: 95vh; border-radius: 16px; }\n}"

NEW_APT_MQ = """@media (max-width: 640px) {
  .apt-hero {
    padding: 60px 12px 24px;
  }
  .apt-hero-h1 { font-size: clamp(1.4rem, 5.5vw, 1.9rem); }
  .apt-hero-sub { font-size: 0.82rem; line-height: 1.5; }
  .apt-eyebrow { font-size: 0.68rem; padding: 4px 10px; }

  /* workspace modal: full-screen bottom sheet */
  .apt-modal-overlay {
    align-items: flex-end;
    padding: 0;
  }
  .apt-workspace-card {
    max-height: 92vh;
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 100%;
  }
  .apt-workspace-header { padding: 14px 18px; }
  .apt-ws-title { font-size: 0.9rem; }
  .apt-ws-timer { font-size: 0.78rem; padding: 4px 10px; }
  .apt-workspace-body  { padding: 16px 18px; }
  .apt-q-text { font-size: 0.9rem; line-height: 1.5; }
  .apt-options-grid { gap: 8px; margin-top: 14px; }
  .apt-opt-btn {
    padding: 11px 14px;
    font-size: 0.82rem;
    border-radius: 12px;
  }
  .apt-workspace-footer { padding: 12px 18px; }
  .apt-btn-start { font-size: 0.8rem; padding: 9px 18px; }
}"""

if OLD_APT_MQ in apt:
    apt = apt.replace(OLD_APT_MQ, NEW_APT_MQ)
    print("[aptitude.css] Replaced 640px block.")
else:
    apt = apt.rstrip() + "\n\n" + NEW_APT_MQ + "\n"
    print("[aptitude.css] Appended 640px block.")

with open(APT, "w", encoding="utf-8") as f:
    f.write(apt)

print("\n=== MOBILE OVERHAUL COMPLETE ===")
