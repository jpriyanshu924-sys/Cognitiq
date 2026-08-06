"""
Fix exit buttons across all games and add universal click listener in app.js
1. Update feature-unlock.js, inbox-triage.js, motion-track.js, pattern-matrix.js, pipe-puzzle.js, arrows-game.js
2. Add global capture-phase event handler in app.js
"""
import os, re

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# 1. Update feature-unlock.js
FU_PATH = os.path.join(ws, "games", "feature-unlock.js")
with open(FU_PATH, encoding="utf-8") as f:
    fu = f.read()

if 'ap-exit-btn' not in fu:
    fu = fu.replace(
        '<div class="fu-header">',
        '<div class="fu-header">\n        <button class="btn ap-exit-btn" id="ap-exit-btn" style="padding:4px 10px; font-size:0.75rem;">Save &amp; Exit</button>'
    )
    bind_fu = """
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }
      });
    }"""
    fu = fu.replace("this.el.querySelector('#fu-clear')", bind_fu + "\n    this.el.querySelector('#fu-clear')")
    with open(FU_PATH, "w", encoding="utf-8") as f:
        f.write(fu)
    print("[feature-unlock.js] Added exit button and handler.")

# 2. Update inbox-triage.js
IT_PATH = os.path.join(ws, "games", "inbox-triage.js")
with open(IT_PATH, encoding="utf-8") as f:
    it = f.read()

if 'ap-exit-btn' not in it:
    it = it.replace(
        '<div class="it-header">',
        '<div class="it-header">\n        <button class="btn ap-exit-btn" id="ap-exit-btn" style="padding:4px 10px; font-size:0.75rem; margin-right:12px;">Save &amp; Exit</button>'
    )
    bind_it = """
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }
      });
    }"""
    it = it.replace("this.el.querySelectorAll('.it-email-item')", bind_it + "\n    this.el.querySelectorAll('.it-email-item')")
    with open(IT_PATH, "w", encoding="utf-8") as f:
        f.write(it)
    print("[inbox-triage.js] Added exit button and handler.")

# 3. Update motion-track.js
MT_PATH = os.path.join(ws, "games", "motion-track.js")
with open(MT_PATH, encoding="utf-8") as f:
    mt = f.read()

if 'onExit' not in mt and '_exitGame' not in mt:
    bind_mt = """
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }
      });
    }"""
    mt = mt.replace("this.canvas = document.getElementById('mt-canvas');", bind_mt + "\n    this.canvas = document.getElementById('mt-canvas');")
    with open(MT_PATH, "w", encoding="utf-8") as f:
        f.write(mt)
    print("[motion-track.js] Added exit button handler.")

# 4. Update pattern-matrix.js
PM_PATH = os.path.join(ws, "games", "pattern-matrix.js")
with open(PM_PATH, encoding="utf-8") as f:
    pm = f.read()

if 'ap-exit-btn' not in pm:
    pm = pm.replace(
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; max-width:420px; margin: 0 auto 12px">',
        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; max-width:420px; margin: 0 auto 12px">\n        <button class="btn ap-exit-btn" id="ap-exit-btn" style="padding:4px 10px; font-size:0.75rem;">Save &amp; Exit</button>'
    )
    bind_pm = """
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }
      });
    }"""
    pm = pm.replace("const grid = this.el.querySelector('#pm-grid');", bind_pm + "\n    const grid = this.el.querySelector('#pm-grid');")
    with open(PM_PATH, "w", encoding="utf-8") as f:
        f.write(pm)
    print("[pattern-matrix.js] Added exit button and handler.")

# 5. Update pipe-puzzle.js
PP_PATH = os.path.join(ws, "games", "pipe-puzzle.js")
with open(PP_PATH, encoding="utf-8") as f:
    pp = f.read()

if 'ap-exit-btn' not in pp:
    pp = pp.replace(
        '<div class="pp-info">',
        '<div class="pp-info">\n        <button class="btn ap-exit-btn" id="ap-exit-btn" style="padding:4px 10px; font-size:0.75rem; float:right; margin-bottom:8px;">Save &amp; Exit</button>'
    )
    bind_pp = """
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }
      });
    }"""
    pp = pp.replace("const grid=this.el.querySelector('#pp-grid');", bind_pp + "\n    const grid=this.el.querySelector('#pp-grid');")
    with open(PP_PATH, "w", encoding="utf-8") as f:
        f.write(pp)
    print("[pipe-puzzle.js] Added exit button and handler.")

# 6. Update app.js to add universal capture-phase exit click handler
APP_PATH = os.path.join(ws, "app.js")
with open(APP_PATH, encoding="utf-8") as f:
    app = f.read()

UNIVERSAL_EXIT_LISTENER = """
// Universal capture-phase listener for any Exit button click across all games
document.addEventListener('click', (e) => {
  const exitBtn = e.target.closest('#ap-exit-btn, .ap-exit-btn, #btn-exit-game, .btn-exit-game, [data-action="exit"]');
  if (exitBtn) {
    e.preventDefault();
    e.stopPropagation();
    if (window._app) {
      window._app._exitGame();
    } else if (window.CIQ) {
      window.CIQ._exitGame();
    }
  }
}, true);
"""

if 'Universal capture-phase listener' not in app:
    app = app.replace(
        "window.addEventListener('DOMContentLoaded', () => { window._app = window.CIQ = new CampusPlayApp(); });",
        UNIVERSAL_EXIT_LISTENER + "\nwindow.addEventListener('DOMContentLoaded', () => { window._app = window.CIQ = new CampusPlayApp(); });"
    )
    with open(APP_PATH, "w", encoding="utf-8") as f:
        f.write(app)
    print("[app.js] Added universal capture-phase exit click listener.")

print("\n=== ALL EXIT BUTTON FIXES COMPLETE ===")
