"""
Inject complete FAQ, CTA, and Footer styles into landing.css and add FAQ accordion JS logic
"""
import os

ws = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

LANDING_CSS = os.path.join(ws, "landing.css")
with open(LANDING_CSS, encoding="utf-8") as f:
    css = f.read()

FAQ_CTA_FOOTER_CSS = """
/* ══════════════════════════════════════════════════════════════
   FAQ SECTION (Base Desktop & Mobile Styles)
   ══════════════════════════════════════════════════════════════ */
.faq-section {
  padding: 80px 24px;
  background: #ffffff;
  position: relative;
}

.faq-grid {
  max-width: 820px;
  margin: 40px auto 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.faq-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.faq-item.active {
  border-color: #818cf8;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.12);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 22px 26px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--fh);
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  transition: background 0.2s;
}

.faq-question:hover {
  background: #f8fafc;
}

.faq-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eff6ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-left: 16px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s, color 0.2s;
}

.faq-item.active .faq-icon {
  transform: rotate(45deg);
  background: #e0e7ff;
  color: #4338ca;
}

.faq-answer {
  padding: 0 26px 24px;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.65;
  display: none;
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
  padding-top: 18px;
}

.faq-item.active .faq-answer {
  display: block;
  animation: fadeIn 0.3s ease;
}

/* ══════════════════════════════════════════════════════════════
   CTA SECTION BANNER
   ══════════════════════════════════════════════════════════════ */
.cta-section {
  padding: 60px 24px;
  background: #ffffff;
}

.cta-inner {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%);
  color: #ffffff;
  border-radius: 28px;
  padding: 64px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  max-width: 1140px;
  margin: 0 auto;
  box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
  pointer-events: none;
  border-radius: 50%;
}

.cta-h2 {
  font-family: var(--fh);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.cta-sub {
  font-size: 1.05rem;
  color: #cbd5e1;
  max-width: 620px;
  margin: 0 auto 36px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 14px;
}

/* ══════════════════════════════════════════════════════════════
   FOOTER SECTION
   ══════════════════════════════════════════════════════════════ */
.site-footer {
  background: #0f172a;
  color: #cbd5e1;
  padding: 72px 24px 36px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-inner {
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 48px;
  flex-wrap: wrap;
  padding-bottom: 48px;
}

.footer-brand {
  max-width: 360px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--fh);
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 14px;
  text-decoration: none;
}

.footer-tagline {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.65;
}

.footer-links {
  display: flex;
  gap: 56px;
  flex-wrap: wrap;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin-bottom: 14px;
}

.footer-link {
  font-size: 0.9rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.15s ease;
}

.footer-link:hover {
  color: #818cf8;
  transform: translateX(2px);
}

.footer-bottom {
  max-width: 1140px;
  margin: 0 auto;
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
  flex-wrap: wrap;
  gap: 12px;
}
"""

css = css.rstrip() + "\n" + FAQ_CTA_FOOTER_CSS + "\n"

with open(LANDING_CSS, "w", encoding="utf-8") as f:
    f.write(css)

print("[landing.css] Added FAQ, CTA, and Footer base CSS.")

# Add FAQ accordion JavaScript into index.html inline before </body>
INDEX_HTML = os.path.join(ws, "index.html")
with open(INDEX_HTML, encoding="utf-8") as f:
    html = f.read()

FAQ_SCRIPT = """
<script>
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    });
  });
</script>
"""

if 'faq-question' not in html or '<script>' not in html or 'faq-item' in html:
    if '</body' in html and 'faq-question' not in html:
        html = html.replace('</body>', FAQ_SCRIPT + '\n</body>')
        print("[index.html] Injected FAQ accordion script.")
    elif '</body>' in html:
        html = html.replace('</body>', FAQ_SCRIPT + '\n</body>')
        print("[index.html] Injected FAQ accordion script.")

with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(html)

print("\n=== STYLING COMPLETE ===")
