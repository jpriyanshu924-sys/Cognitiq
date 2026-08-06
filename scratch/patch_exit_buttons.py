"""
Audit and fix exit button rendering and event handlers across all 26 game modules and app.js
"""
import os, re

games_dir = 'games'
files = sorted([f for f in os.listdir(games_dir) if f.endswith('.js')])

print(f"Auditing and patching exit buttons in {len(files)} games...")

patched_count = 0

for f in files:
    path = os.path.join(games_dir, f)
    with open(path, encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    modified = False
    
    # Standard exit button listener pattern
    # Replace old `if (window.CIQ) window.CIQ._exitGame();` with robust handler
    old_listener_pattern = r"if\s*\(\s*window\.CIQ\s*\)\s*window\.CIQ\._exitGame\(\)\s*;"
    new_listener = "if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }"
    
    if re.search(old_listener_pattern, content):
        content = re.sub(old_listener_pattern, new_listener, content)
        modified = True
        
    # Ensure event listener is bound if #ap-exit-btn is present but listener missing (e.g., motion-track.js)
    if '#ap-exit-btn' in content and 'addEventListener' in content and 'onExit' not in content and 'CIQ' not in content:
        # Inject listener binding in _render
        bind_code = """
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.cb && this.cb.onExit) { this.cb.onExit(); } else if (window._app) { window._app._exitGame(); } else if (window.CIQ) { window.CIQ._exitGame(); }
      });
    }"""
        # Find where _render binds buttons or ends
        if 'document.getElementById(' in content:
            idx = content.find('document.getElementById(')
            content = content[:idx] + bind_code + "\n\n    " + content[idx:]
            modified = True

    if modified:
        with open(path, 'w', encoding='utf-8') as fp:
            fp.write(content)
        patched_count += 1
        print(f"Patched listener in: {f}")

print(f"\nDone! Patched {patched_count} game files.")
