import os
import re

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# 1. Update landing.css
landing_css_path = os.path.join(workspace, "landing.css")
with open(landing_css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Add / update .lnav-right-group and mobile profile avatar collapse
mobile_header_css = """
/* Navbar Right Group & Mobile Collapsing */
.lnav-right-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .lnav-inner {
    padding: 0 12px;
    gap: 8px;
  }
  .lnav-logo-text {
    font-size: 1.05rem;
  }
  /* On mobile phones, collapse text inside profile button so it fits side-by-side with hamburger */
  .lnav-profile-btn {
    padding: 5px 8px;
    gap: 5px;
  }
  .lnav-profile-btn > span:not(.lnav-online-dot):not(.lnav-avatar-text) {
    display: none !important;
  }
}
"""

if ".lnav-right-group" not in css:
    css += mobile_header_css

with open(landing_css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("[landing.css] Added .lnav-right-group and mobile compact header CSS.")

# 2. Update HTML files navbar markup
html_files = [f for f in os.listdir(workspace) if f.endswith(".html")]

for fname in html_files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern to replace actions + hamburger with .lnav-right-group
    old_actions_pattern = r'<div class="lnav-actions">[\s\S]*?</div>\s*<button class="lnav-hamburger" id="lnav-hamburger" aria-label="Open menu">\s*<span></span><span></span><span></span>\s*</button>'

    new_right_group = """<div class="lnav-right-group">
        <a href="games.html" class="lnav-cta">Start Free →</a>
        <button type="button" class="lnav-profile-btn" id="btn-header-profile" aria-label="Account Profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>Sign In</span>
        </button>
        <button type="button" class="lnav-hamburger" id="lnav-hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>"""

    if re.search(old_actions_pattern, content):
        content = re.sub(old_actions_pattern, new_right_group, content)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[{fname}] Updated navbar right group markup.")
    else:
        print(f"[{fname}] Pattern already updated or not found.")

print("=== HEADER FIX COMPLETE ===")
