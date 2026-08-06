"""
Comprehensive inspection and fix script for exit button & teardown across all 26 game modules
"""
import os, re

games_dir = 'games'
files = sorted([f for f in os.listdir(games_dir) if f.endswith('.js')])

print(f"Comprehensive Audit of {len(files)} game files...\n")

patched_count = 0

for f in files:
    path = os.path.join(games_dir, f)
    with open(path, encoding='utf-8', errors='ignore') as fp:
        content = fp.read()
    
    modified = False

    # 1. Ensure `this.cb = cb || {};` in constructor
    if 'this.cb = cb;' not in content and 'this.cb = cb ||' not in content:
        # replace constructor(container, cb) {
        if 'constructor(container, cb)' in content:
            content = content.replace(
                'constructor(container, cb) {',
                'constructor(container, cb) {\n    this.cb = cb || {};'
            )
            modified = True
            print(f"  [constructor] Saved this.cb in {f}")

    # 2. Robust exit button click handler logic
    exit_handler_code = """
    const exitBtn = this.el.querySelector('#ap-exit-btn, .ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.cb && typeof this.cb.onExit === 'function') {
          this.cb.onExit();
        } else if (window._app) {
          window._app._exitGame();
        } else if (window.CIQ) {
          window.CIQ._exitGame();
        }
      });
    }"""

    # 3. Ensure destroy() cleans up element from parentNode
    if 'destroy()' in content:
        idx_destroy = content.find('destroy() {')
        if idx_destroy != -1:
            idx_end = content.find('}', idx_destroy)
            destroy_body = content[idx_destroy:idx_end+1]
            if 'parentNode' not in destroy_body and 'remove()' not in destroy_body:
                new_destroy_body = destroy_body.replace(
                    'this.el = null;',
                    'if (this.el && this.el.parentNode) { this.el.parentNode.removeChild(this.el); }\n    this.el = null;'
                )
                if new_destroy_body != destroy_body:
                    content = content.replace(destroy_body, new_destroy_body)
                    modified = True
                    print(f"  [destroy] Added DOM node cleanup in {f}")

    # 4. Check exit button HTML presence
    if 'ap-exit-btn' not in content and 'Save & Exit' not in content and 'exit-btn' not in content:
        print(f"  [WARNING] {f} has no exit button in HTML!")
    
    if modified:
        with open(path, 'w', encoding='utf-8') as fp:
            fp.write(content)
        patched_count += 1

print(f"\nCompleted audit & cleanup for {patched_count} game files.")
