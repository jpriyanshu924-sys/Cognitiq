import os
import re

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# 1. Update aptitude.js to ensure Start Test works reliably
aptitude_js_path = os.path.join(workspace, "aptitude.js")
with open(aptitude_js_path, "r", encoding="utf-8") as f:
    apt_code = f.read()

# Fix _init() in AptitudeApp
old_init = """  _init() {
    document.addEventListener('DOMContentLoaded', () => {
      this._renderCards();
      this._bindEvents();
    });
  }"""

new_init = """  _init() {
    const start = () => {
      this._renderCards();
      this._bindEvents();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }"""

if old_init in apt_code:
    apt_code = apt_code.replace(old_init, new_init)

# Fix click binding in _renderCards & event listener fallback
old_render = """      card.innerHTML = `
        <div>
          <div class="apt-card-top">
            <div class="apt-card-icon">${data.icon}</div>
            <span class="apt-card-badge">${data.questions.length} Questions</span>
          </div>
          <h3 class="apt-card-title">${data.title}</h3>
          <p class="apt-card-desc">${data.desc}</p>
        </div>
        <div>
          <div class="apt-card-meta">
            <span>⏱ 10 Mins</span>
            <span>🎯 Placement Standard</span>
          </div>
          <button class="apt-btn-start" onclick="window.AptitudeEngine.startTest('${k}')">
            Start Test →
          </button>
        </div>
      `;"""

new_render = """      card.innerHTML = `
        <div>
          <div class="apt-card-top">
            <div class="apt-card-icon">${data.icon}</div>
            <span class="apt-card-badge">${data.questions.length} Questions</span>
          </div>
          <h3 class="apt-card-title">${data.title}</h3>
          <p class="apt-card-desc">${data.desc}</p>
        </div>
        <div>
          <div class="apt-card-meta">
            <span>⏱ 10 Mins</span>
            <span>🎯 Placement Standard</span>
          </div>
          <button class="apt-btn-start" data-cat="${k}">
            Start Test →
          </button>
        </div>
      `;"""

if old_render in apt_code:
    apt_code = apt_code.replace(old_render, new_render)

# Add click event listener to grid container in _bindEvents
old_bind = """    const nextBtn = document.getElementById('apt-btn-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this._nextQuestion());
  }"""

new_bind = """    const nextBtn = document.getElementById('apt-btn-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this._nextQuestion());

    // Event delegation for Start Test buttons
    const grid = document.getElementById('apt-grid-container');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.apt-btn-start');
        if (btn && btn.dataset.cat) {
          this.startTest(btn.dataset.cat);
        }
      });
    }
  }"""

if old_bind in apt_code:
    apt_code = apt_code.replace(old_bind, new_bind)

with open(aptitude_js_path, "w", encoding="utf-8") as f:
    f.write(apt_code)

print("[aptitude.js] Updated initialization and click event delegation.")

# 2. Reorder Navigation Links across all HTML files
html_files = [f for f in os.listdir(workspace) if f.endswith(".html")]

for fname in html_files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace Desktop links order: Gamified Assessments ➔ Aptitude Tests ➔ Mock Tests ➔ Free Tips
    # Regex replacement for lnav-links block
    def replace_lnav_links(match):
        is_games = 'lnav-link-active' if 'games.html' in match.group(0) and 'Gamified' in match.group(0) else ''
        is_apt = 'lnav-link-active' if 'aptitude-test.html' in match.group(0) and 'active' in match.group(0) else ''
        is_mock = 'lnav-link-active' if 'mock-test.html' in match.group(0) and 'active' in match.group(0) else ''
        is_tips = 'lnav-link-active' if 'tips.html' in match.group(0) and 'active' in match.group(0) else ''

        # Re-determine active page based on file name
        g_active = ' lnav-link-active' if fname == 'games.html' else ''
        a_active = ' lnav-link-active' if fname == 'aptitude-test.html' else ''
        m_active = ' lnav-link-active' if fname == 'mock-test.html' else ''
        t_active = ' lnav-link-active' if fname == 'tips.html' else ''

        return f'''<div class="lnav-links">
        <a href="games.html" class="lnav-link{g_active}">Gamified Assessments</a>
        <a href="aptitude-test.html" class="lnav-link{a_active}">Aptitude Tests</a>
        <a href="mock-test.html" class="lnav-link{m_active}">Mock Tests</a>
        <a href="tips.html" class="lnav-link{t_active}">Free Tips</a>
      </div>'''

    content = re.sub(r'<div class="lnav-links">[\s\S]*?</div>', replace_lnav_links, content)

    # Replace Mobile links order
    def replace_mobile_links(match):
        g_active = ' lnav-link-active' if fname == 'games.html' else ''
        a_active = ' lnav-link-active' if fname == 'aptitude-test.html' else ''
        m_active = ' lnav-link-active' if fname == 'mock-test.html' else ''
        t_active = ' lnav-link-active' if fname == 'tips.html' else ''

        return f'''<div class="lnav-mobile" id="lnav-mobile">
      <a href="games.html" class="lnav-link{g_active}">Gamified Assessments</a>
      <a href="aptitude-test.html" class="lnav-link{a_active}">Aptitude Tests</a>
      <a href="mock-test.html" class="lnav-link{m_active}">Mock Tests</a>
      <a href="tips.html" class="lnav-link{t_active}">Free Tips</a>
      <a href="games.html" class="lnav-cta lnav-cta-mobile">Start Free →</a>
    </div>'''

    content = re.sub(r'<div class="lnav-mobile" id="lnav-mobile">[\s\S]*?</div>', replace_mobile_links, content)

    # Replace Footer links order
    def replace_footer_links(match):
        return f'''<div class="footer-col">
          <div class="footer-col-title">Platform</div>
          <a href="games.html" class="footer-link">Gamified Assessments</a>
          <a href="aptitude-test.html" class="footer-link">Aptitude Tests</a>
          <a href="mock-test.html" class="footer-link">Mock Tests</a>
          <a href="tips.html" class="footer-link">Free Tips</a>
        </div>'''

    content = re.sub(r'<div class="footer-col">\s*<div class="footer-col-title">Platform</div>[\s\S]*?</div>', replace_footer_links, content)

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"[{fname}] Reordered header & footer links.")

print("=== REORDERING AND FIX COMPLETE ===")
