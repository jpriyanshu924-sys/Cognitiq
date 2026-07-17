/* ══════════════════════════════════════════════════════
   HireVue 3: Pathfinder
   Measures: Planning, spatial reasoning, problem-solving
   Based on: HireVue Pathfinder — connect path through waypoints
══════════════════════════════════════════════════════ */
class PathfinderGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.solved = 0; this.level = 1;
    this.el = null; this._timers = [];
    this.grid = []; this.path = []; this.gridSize = 5;
    this.start = null; this.end = null; this.walls = new Set();
    this.waypoints = []; this.waypointsVisited = new Set();
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'pf-game';
    this.container.appendChild(this.el);
    this._newPuzzle();
  }

  _key(r, c) { return `${r},${c}`; }
  _inBounds(r, c) { return r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize; }

  _newPuzzle() {
    this.gridSize = this.level <= 1 ? 5 : 6;
    this.path = [];
    this.waypointsVisited = new Set();
    this.walls = new Set();

    // Place start at top-left, end at bottom-right
    this.start = { r: 0, c: 0 };
    this.end   = { r: this.gridSize - 1, c: this.gridSize - 1 };

    // Random waypoints
    const numWP = 1 + this.level;
    this.waypoints = [];
    const candidates = [];
    for (let r = 0; r < this.gridSize; r++)
      for (let c = 0; c < this.gridSize; c++)
        if (!((r === 0 && c === 0) || (r === this.gridSize-1 && c === this.gridSize-1)))
          candidates.push({r, c});
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    this.waypoints = candidates.slice(0, numWP);

    // Random walls (avoid start, end, waypoints)
    const forbidden = new Set([this._key(0,0), this._key(this.gridSize-1, this.gridSize-1), ...this.waypoints.map(w => this._key(w.r, w.c))]);
    const numWalls = 3 + this.level * 2;
    let wallCount = 0;
    for (const cand of candidates.slice(numWP)) {
      if (wallCount >= numWalls) break;
      if (!forbidden.has(this._key(cand.r, cand.c))) {
        this.walls.add(this._key(cand.r, cand.c));
        wallCount++;
      }
    }

    this.path = [this.start];
    this._render();
  }

  _render() {
    if (!this.el) return;
    const G = this.gridSize;
    const pathSet = new Set(this.path.map(p => this._key(p.r, p.c)));
    const lastCell = this.path[this.path.length - 1];

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Puzzle ${this.solved + 1}</span>
          </div>
          <div class="ap-header-right">
            <div class="ap-timer-box">
              <span class="ap-timer-icon">⏱</span>
              <span class="ap-timer-val" id="ap-timer-val">—</span>
            </div>
            <button class="btn ap-exit-btn" id="ap-exit-btn">Save & Exit</button>
          </div>
        </header>

        <div class="ap-body">
          <!-- Main Workspace -->
          <main class="ap-main" style="padding: 24px; width: 100%">
            <div class="ap-workspace" style="max-width: 600px">
              
              <!-- Header Info -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Pathfinder</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Planning & Spatial Reasoning</span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 420px; justify-content: center; align-items: center; padding: 32px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Map Connectivity</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 20px; background-color:#eff6ff; color:#3b22d8">
                  Connect waypoints to end
                </div>
                
                <div style="font-size:0.88rem; font-weight:600; color:#4b5563; margin-bottom:20px">
                  Start at 🟢, collect all waypoints, and end at 🔴
                </div>
                
                <!-- Pathfinder Grid Container -->
                <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:16px; margin-bottom:24px; width:100%; max-width:340px; display:flex; justify-content:center; align-items:center">
                  <div class="pf-grid" style="grid-template-columns:repeat(${G},1fr); gap:6px; width:100%; display:grid" id="pf-grid">
                    ${Array.from({length: G*G}, (_, i) => {
                      const r = Math.floor(i/G), c = i%G;
                      const k = this._key(r, c);
                      const isStart = r===this.start.r && c===this.start.c;
                      const isEnd   = r===this.end.r   && c===this.end.c;
                      const isWall  = this.walls.has(k);
                      const isPath  = pathSet.has(k);
                      const isWP    = this.waypoints.some(w => w.r===r && w.c===c);
                      const isWPVisited = this.waypointsVisited.has(k);
                      const isLast  = lastCell && r===lastCell.r && c===lastCell.c;
                      
                      let cellStyles = 'aspect-ratio:1; border-radius:8px; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; font-size:1.2rem; cursor:pointer; background:#ffffff; transition:all 0.15s;';
                      if (isWall) {
                        cellStyles += 'background-color:#334155; border-color:#334155; cursor:not-allowed;';
                      } else if (isStart) {
                        cellStyles += 'border-color:#10b981; background-color:#ecfdf5; box-shadow:0 0 8px rgba(16,185,129,0.2);';
                      } else if (isEnd) {
                        cellStyles += 'border-color:#ef4444; background-color:#fef2f2; box-shadow:0 0 8px rgba(239,68,68,0.2);';
                      } else if (isWPVisited) {
                        cellStyles += 'background-color:#ecfdf5; border-color:#10b981; color:#10b981; font-weight:700;';
                      } else if (isWP) {
                        cellStyles += 'background-color:#fffbeb; border-color:#f59e0b;';
                      } else if (isPath) {
                        cellStyles += 'background-color:#eff6ff; border-color:#bfdbfe; font-weight:700; color:#3b22d8;';
                      }
                      
                      if (isLast) {
                        cellStyles += 'border-color:#3b22d8; border-width:2px; box-shadow:0 0 8px rgba(59,34,216,0.3);';
                      }
                      
                      const icon = isStart ? '🟢' : isEnd ? '🔴' : isWall ? '' : isWPVisited ? '✅' : isWP ? '⭐' : isPath ? '•' : '';
                      return `<div style="${cellStyles}" class="pf-cell" data-r="${r}" data-c="${c}">${icon}</div>`;
                    }).join('')}
                  </div>
                </div>

                <!-- Actions -->
                <div class="ap-action-btns" style="display:flex; justify-content:center; gap:12px; width:100%; max-width:340px">
                  <button class="btn ap-btn-skip" id="pf-undo" style="flex:1; margin:0">↩ Undo</button>
                  <button class="btn ap-btn-skip" id="pf-reset" style="flex:1; margin:0">🔄 Reset</button>
                  <button class="btn ap-btn-confirm" id="pf-submit" style="flex:1.5; margin:0" ${this._canSubmit() ? '' : 'disabled'}>✓ Submit</button>
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Pathfinder Instructions</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Click adjacent blocks to extend the path. Every waypoint must be visited before submitting.
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Solved</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669">${this.solved}</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Waypoints</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c">${this.waypointsVisited.size}/${this.waypoints.length}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this.el.querySelectorAll('.pf-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const r = parseInt(cell.dataset.r), c = parseInt(cell.dataset.c);
        this._step(r, c);
      });
    });
    document.getElementById('pf-undo')?.addEventListener('click', () => { if (this.path.length > 1) { const removed = this.path.pop(); this.waypointsVisited.delete(this._key(removed.r, removed.c)); this._render(); } });
    document.getElementById('pf-reset')?.addEventListener('click', () => { this.path = [this.start]; this.waypointsVisited.clear(); this._render(); });
    document.getElementById('pf-submit')?.addEventListener('click', () => this._submit());

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _step(r, c) {
    const last = this.path[this.path.length - 1];
    if (!this._inBounds(r, c)) return;
    if (this.walls.has(this._key(r, c))) return;
    // Must be adjacent
    const dr = Math.abs(r - last.r), dc = Math.abs(c - last.c);
    if (dr + dc !== 1) return;
    // Check already in path
    if (this.path.some(p => p.r === r && p.c === c)) return;
    this.path.push({r, c});
    // Check waypoint
    const wpKey = this._key(r, c);
    if (this.waypoints.some(w => w.r === r && w.c === c)) this.waypointsVisited.add(wpKey);
    this._render();
  }

  _canSubmit() {
    const last = this.path[this.path.length - 1];
    return last && last.r === this.end.r && last.c === this.end.c && this.waypointsVisited.size === this.waypoints.length;
  }

  _submit() {
    if (!this._canSubmit()) return;
    this.solved++;
    const efficiency = Math.max(0.3, 1 - (this.path.length - (this.gridSize * 2)) / (this.gridSize * 2));
    const pts = Math.floor(200 * efficiency) + this.waypoints.length * 80 + this.level * 50;
    this.score += pts;
    this.cb.onScore(pts, this.solved);
    this.cb.onFeedback(true);
    if (this.solved % 2 === 0) this.level = Math.min(3, this.level + 1);
    const t = setTimeout(() => this._newPuzzle(), 1000);
    this._timers.push(t);
  }

  timeUp() { this._timers.forEach(clearTimeout); this.cb.onEnd({ score: this.score, accuracy: this.solved > 0 ? 80 : 0, avgTime: 0, correct: this.solved, total: this.solved + 1, level: this.level }); }
  destroy() { this._timers.forEach(clearTimeout); this.el = null; }
}
window.PathfinderGame = PathfinderGame;
