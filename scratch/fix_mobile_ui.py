import os
import re

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

# 1. Update landing.css
landing_css_path = os.path.join(workspace, "landing.css")
with open(landing_css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Replace navbar responsive section in landing.css
old_nav_responsive = """@media (max-width: 992px) {
  .lnav-search-container {
    width: 140px;
  }
}

@media (max-width: 860px) {
  .lnav-search-container {
    display: none;
  }
  .lnav-links {
    display: none;
  }
}

/* Hamburger (mobile) */
.lnav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}
.lnav-hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #0f172a;
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.lnav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.lnav-hamburger.open span:nth-child(2) { opacity: 0; }
.lnav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile dropdown */
.lnav-mobile {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 12px 24px 16px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}
.lnav-mobile.open { display: flex; }
.lnav-cta-mobile {
  display: inline-flex;
  margin-top: 8px;
  width: max-content;
}

@media (max-width: 768px) {
  .lnav-links, .lnav-cta { display: none; }
  .lnav-hamburger { display: flex; }
}"""

new_nav_responsive = """/* ══════════════════════════════════════════════════════════════
   MOBILE NAVIGATION & RESPONSIVE UN-CRAMPING
   ══════════════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .lnav-links, .lnav-search-container, .lnav-cta {
    display: none !important;
  }
  .lnav-hamburger {
    display: flex !important;
  }
}

.lnav-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 10px;
  cursor: pointer;
  padding: 8px;
  width: 42px;
  height: 42px;
  margin-left: auto;
  transition: background 0.2s, border-color 0.2s;
  z-index: 999;
}
.lnav-hamburger:hover, .lnav-hamburger.open {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.3);
}
.lnav-hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #0f172a;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.lnav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.lnav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.lnav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile dropdown panel */
.lnav-mobile {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
  z-index: 899;
}
.lnav-mobile.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
.lnav-mobile .lnav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.98rem;
  font-weight: 600;
  color: #1e293b;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}
.lnav-mobile .lnav-link:hover, .lnav-mobile .lnav-link.lnav-link-active {
  background: #eff6ff;
  color: #2563eb !important;
  border-color: #bfdbfe;
}
.lnav-cta-mobile {
  display: flex !important;
  justify-content: center;
  margin-top: 12px;
  width: 100% !important;
  padding: 13px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  background: #2563eb;
  color: #ffffff !important;
}

/* Mobile Un-cramping Styles */
@media (max-width: 768px) {
  .hero-section {
    padding: 88px 16px 48px;
    min-height: auto;
  }
  .hero-inner {
    text-align: center;
  }
  .hero-badge {
    margin: 0 auto 16px;
  }
  .hero-h1 {
    font-size: clamp(1.8rem, 6.5vw, 2.5rem);
    line-height: 1.2;
    margin-bottom: 14px;
  }
  .hero-sub {
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0 auto 24px;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  .hero-btn-primary, .hero-btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }
  .hero-stats {
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
  }
  .hero-stat-div {
    display: none;
  }
  .hero-card-float {
    position: static;
    transform: none;
    animation: none;
    width: 100%;
    margin-top: 32px;
  }
  .features-section, .how-section, .faq-section, .apt-section-wrap {
    padding: 48px 16px;
  }
  .tracks-grid, .features-grid, .apt-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .track-card {
    padding: 24px 20px;
  }
  .how-steps {
    flex-direction: column;
    gap: 20px;
  }
  .how-connector {
    display: none;
  }
  .apt-hero {
    padding: 84px 16px 40px;
  }
  .apt-filter-bar {
    gap: 8px;
  }
  .apt-filter-btn {
    flex: 1 1 calc(50% - 8px);
    justify-content: center;
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  .category-header {
    flex-wrap: wrap;
    gap: 12px;
  }
  .category-progress {
    margin-left: 0 !important;
  }
}"""

if old_nav_responsive in css_content:
    css_content = css_content.replace(old_nav_responsive, new_nav_responsive)

with open(landing_css_path, "w", encoding="utf-8") as f:
    f.write(css_content)

print("[landing.css] Updated mobile navigation and responsive layout CSS.")

# 2. Update Hamburger script in all HTML files
html_files = [f for f in os.listdir(workspace) if f.endswith(".html")]

nav_script = """  // Mobile hamburger menu toggle
  const hamburger = document.getElementById('lnav-hamburger');
  const mobileMenu = document.getElementById('lnav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }"""

for fname in html_files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace old hamburger listener script
    old_script_pattern = r'const hamburger = document\.getElementById\(\'lnav-hamburger\'\);[\s\S]*?mobileMenu\.classList\.toggle\(\'open\'\);\s*\}\);?\s*\}'
    
    if re.search(old_script_pattern, content):
        content = re.sub(old_script_pattern, nav_script.strip(), content)
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[{fname}] Updated hamburger toggle script.")
    else:
        print(f"[{fname}] Script pattern not matched or already updated.")

print("=== MOBILE UI FIX COMPLETE ===")
