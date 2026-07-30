import os

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"
html_files = [f for f in os.listdir(workspace) if f.endswith(".html")]

nav_script_block = """  <script>
    // Navbar scroll shadow
    const lnav = document.getElementById('lnav');
    if (lnav) {
      window.addEventListener('scroll', () => {
        lnav.classList.toggle('lnav-scrolled', window.scrollY > 20);
      });
    }

    // Mobile hamburger menu toggle
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
    }
  </script>
</body>"""

for fname in html_files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    if "lnav-hamburger" in content:
        # Check if hamburger script is already inside
        if "hamburger.addEventListener('click'" not in content:
            content = content.replace("</body>", nav_script_block)
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"[{fname}] Injected mobile menu toggle script.")
        else:
            print(f"[{fname}] Mobile menu script already present.")

print("=== SCRIPT INJECTION COMPLETE ===")
