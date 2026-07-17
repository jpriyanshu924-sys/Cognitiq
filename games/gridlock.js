/* ══════════════════════════════════════════════════════
   Aon Assessment 2: Gridlock
   Measures: Planning, spatial reasoning, strategic thinking
   Based on: Aon smartPredict Gridlock (sliding block puzzle)
   ══════════════════════════════════════════════════════ */
class GridlockGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.level = 1; this.moves = 0;
    this.el = null; this._timers = [];
    this.selectedBlockIdx = null;

    // 6x6 grid. Red block (target) is index 0. Goal: get red block to row 2, col 4-5 (ends at exit)
    this.levels = [
      {
        blocks: [
          { r: 2, c: 1, len: 2, dir: 'H', type: 'red', id: 0 },
          { r: 1, c: 3, len: 2, dir: 'V', type: 'cyan', id: 1 },
          { r: 4, c: 1, len: 3, dir: 'H', type: 'emerald', id: 2 },
        ]
      },
      {
        blocks: [
          { r: 2, c: 0, len: 2, dir: 'H', type: 'red', id: 0 },
          { r: 0, c: 2, len: 3, dir: 'V', type: 'cyan', id: 1 },
          { r: 3, c: 2, len: 2, dir: 'H', type: 'emerald', id: 2 },
          { r: 2, c: 4, len: 2, dir: 'V', type: 'violet', id: 3 },
        ]
      },
      {
        blocks: [
          { r: 2, c: 1, len: 2, dir: 'H', type: 'red', id: 0 },
          { r: 0, c: 0, len: 2, dir: 'V', type: 'amber', id: 1 },
          { r: 0, c: 3, len: 3, dir: 'V', type: 'cyan', id: 2 },
          { r: 4, c: 3, len: 2, dir: 'H', type: 'emerald', id: 3 },
          { r: 1, c: 4, len: 2, dir: 'H', type: 'violet', id: 4 },
          { r: 3, c: 5, len: 2, dir: 'V', type: 'pink', id: 5 },
        ]
      },
      {
        blocks: [
          { r: 2, c: 0, len: 2, dir: 'H', type: 'red', id: 0 },
          { r: 0, c: 2, len: 2, dir: 'V', type: 'cyan', id: 1 },
          { r: 0, c: 3, len: 2, dir: 'H', type: 'amber', id: 2 },
          { r: 1, c: 4, len: 3, dir: 'V', type: 'violet', id: 3 },
          { r: 4, c: 0, len: 3, dir: 'H', type: 'emerald', id: 4 },
          { r: 3, c: 3, len: 2, dir: 'V', type: 'pink', id: 5 },
        ]
      },
      {
        blocks: [
          { r: 2, c: 1, len: 2, dir: 'H', type: 'red', id: 0 },
          { r: 0, c: 2, len: 2, dir: 'H', type: 'amber', id: 1 },
          { r: 1, c: 2, len: 2, dir: 'V', type: 'cyan', id: 2 },
          { r: 0, c: 4, len: 3, dir: 'V', type: 'violet', id: 3 },
          { r: 3, c: 0, len: 3, dir: 'V', type: 'pink', id: 4 },
          { r: 4, c: 1, len: 3, dir: 'H', type: 'emerald', id: 5 },
          { r: 3, c: 4, len: 2, dir: 'H', type: 'yellow', id: 6 },
        ]
      }
    ];

    this.currentBlocks = [];
    this._kd = null;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'gridlock-game';
    this.container.appendChild(this.el);
    this._loadLevel();

    this._kd = e => {
      if (this.selectedBlockIdx === null) return;
      if (e.key === 'ArrowLeft') this._moveBlock(this.selectedBlockIdx, 0, -1);
      if (e.key === 'ArrowRight') this._moveBlock(this.selectedBlockIdx, 0, 1);
      if (e.key === 'ArrowUp') this._moveBlock(this.selectedBlockIdx, -1, 0);
      if (e.key === 'ArrowDown') this._moveBlock(this.selectedBlockIdx, 1, 0);
    };
    window.addEventListener('keydown', this._kd);
  }

  _loadLevel() {
    const lvlIdx = Math.min(this.level - 1, this.levels.length - 1);
    // Deep copy level blocks
    this.currentBlocks = JSON.parse(JSON.stringify(this.levels[lvlIdx].blocks));
    this.selectedBlockIdx = null;
    this.moves = 0;
    this._render();
  }

  _render() {
    if (!this.el) return;

    // Create 6x6 grid structure
    let gridHTML = '';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        // Exit is at row 2, col 5
        const isExit = (r === 2 && c === 5);
        gridHTML += `<div class="gl-cell ${isExit ? 'gl-exit-cell' : ''}" data-r="${r}" data-c="${c}">
          ${isExit ? '<div class="gl-exit-label" style="font-size:0.55rem; font-weight:800; color:#ef4444; width:100%; text-align:center">EXIT ➔</div>' : ''}
        </div>`;
      }
    }

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Level ${this.level} of ${this.levels.length}</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Gridlock</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Planning & Spatial Rotation</span>
                </div>
                <div style="display:flex; gap:16px">
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">MOVES</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#0284c7">${this.moves}</div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c">${this.score}</div>
                  </div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 420px; justify-content: center; align-items: center; padding: 24px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Sliding Block Puzzle</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 20px; background-color:#eff6ff; color:#3b22d8">
                  Get the red block to the exit
                </div>

                <div class="gl-board-container" style="margin-bottom:20px; background: #f1f5f9; border-radius:16px; padding:12px; box-shadow:inset 0 2px 8px rgba(0,0,0,0.05)">
                  <div class="gl-board" style="position:relative; width:300px; height:300px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; border:2px solid #cbd5e1">
                    <div class="gl-grid-bg" style="display:grid; grid-template-columns:repeat(6, 1fr); grid-template-rows:repeat(6, 1fr); width:100%; height:100%">
                      ${gridHTML}
                    </div>
                    <div class="gl-blocks-layer" id="gl-blocks" style="position:absolute; inset:0"></div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="ap-action-btns" style="display:flex; justify-content:center; gap:12px; width:100%; max-width:320px">
                  <button class="btn ap-btn-skip" id="gl-restart-lvl" style="flex:1; margin:0">🔄 Reset Level</button>
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Gridlock Instructions</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Click any vehicle/block, then click the directional arrows (or use Keyboard Arrow Keys) to slide it.
                  </div>
                </div>
                <div class="ap-tow-footer-card">
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:#6b7280; margin-bottom:6px; letter-spacing:0.04em">
                    <span>LEVEL PROGRESS</span>
                    <span style="color:#059669">${Math.round(((this.level - 1) / this.levels.length) * 100)}%</span>
                  </div>
                  <div class="ap-progress-bar-bg" style="width:100%"><div class="ap-progress-bar-fill" style="width:${((this.level - 1) / this.levels.length) * 100}%; background-color:#059669"></div></div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    document.getElementById('gl-restart-lvl').addEventListener('click', () => this._loadLevel());

    this._renderBlocks();

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _renderBlocks() {
    const container = document.getElementById('gl-blocks');
    if (!container) return;
    container.innerHTML = '';

    this.currentBlocks.forEach((b, idx) => {
      const el = document.createElement('div');
      el.className = `gl-block gl-block-${b.type} ${this.selectedBlockIdx === idx ? 'gl-selected' : ''}`;
      
      // Calculate positions in percentages for responsiveness
      const cellSize = 100 / 6;
      el.style.top = `${b.r * cellSize}%`;
      el.style.left = `${b.c * cellSize}%`;
      if (b.dir === 'H') {
        el.style.width = `${b.len * cellSize}%`;
        el.style.height = `${cellSize}%`;
      } else {
        el.style.width = `${cellSize}%`;
        el.style.height = `${b.len * cellSize}%`;
      }

      el.innerHTML = `
        <div class="gl-block-inner">
          ${b.type === 'red' ? '🚗' : '📦'}
          ${this.selectedBlockIdx === idx ? `
            <div class="gl-block-arrows">
              ${b.dir === 'H' ? `
                <div class="gl-arrow gl-arrow-left">◀</div>
                <div class="gl-arrow gl-arrow-right">▶</div>
              ` : `
                <div class="gl-arrow gl-arrow-up">▲</div>
                <div class="gl-arrow gl-arrow-down">▼</div>
              `}
            </div>
          ` : ''}
        </div>`;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectedBlockIdx = idx;
        this._renderBlocks();
      });

      // Arrow clicks
      if (this.selectedBlockIdx === idx) {
        const leftArr = el.querySelector('.gl-arrow-left');
        const rightArr = el.querySelector('.gl-arrow-right');
        const upArr = el.querySelector('.gl-arrow-up');
        const downArr = el.querySelector('.gl-arrow-down');

        if (leftArr) leftArr.addEventListener('click', (ev) => { ev.stopPropagation(); this._moveBlock(idx, 0, -1); });
        if (rightArr) rightArr.addEventListener('click', (ev) => { ev.stopPropagation(); this._moveBlock(idx, 0, 1); });
        if (upArr) upArr.addEventListener('click', (ev) => { ev.stopPropagation(); this._moveBlock(idx, -1, 0); });
        if (downArr) downArr.addEventListener('click', (ev) => { ev.stopPropagation(); this._moveBlock(idx, 1, 0); });
      }

      container.appendChild(el);
    });
  }

  _checkCollision(blockIdx, newR, newC) {
    const target = this.currentBlocks[blockIdx];
    // Out of bounds checks
    if (newR < 0 || newC < 0) return true;
    if (target.dir === 'H') {
      if (newC + target.len > 6 || newR >= 6) return true;
    } else {
      if (newR + target.len > 6 || newC >= 6) return true;
    }

    // Collision with other blocks
    for (let i = 0; i < this.currentBlocks.length; i++) {
      if (i === blockIdx) continue;
      const b = this.currentBlocks[i];

      // Get cells occupied by block b
      const bCells = [];
      for (let k = 0; k < b.len; k++) {
        bCells.push(b.dir === 'H' ? { r: b.r, c: b.c + k } : { r: b.r + k, c: b.c });
      }

      // Get cells occupied by target block at new position
      const tCells = [];
      for (let k = 0; k < target.len; k++) {
        tCells.push(target.dir === 'H' ? { r: newR, c: newC + k } : { r: newR + k, c: newC });
      }

      // Intersection check
      const collision = tCells.some(tc => bCells.some(bc => tc.r === bc.r && tc.c === bc.c));
      if (collision) return true;
    }

    return false;
  }

  _moveBlock(idx, dr, dc) {
    const b = this.currentBlocks[idx];
    if (b.dir === 'H' && dr !== 0) return; // horizontal blocks can't move vertically
    if (b.dir === 'V' && dc !== 0) return; // vertical blocks can't move horizontally

    const newR = b.r + dr;
    const newC = b.c + dc;

    if (!this._checkCollision(idx, newR, newC)) {
      b.r = newR;
      b.c = newC;
      this.moves++;
      this._renderBlocks();
      this._checkWin();
    }
  }

  _checkWin() {
    const red = this.currentBlocks[0];
    // Red block is horizontal, goal is to get it to row 2, col 4 (ends at col 5)
    if (red.r === 2 && red.c === 4) {
      // Level cleared!
      const pts = Math.max(100, 500 - (this.moves * 10)) * this.level;
      this.score += pts;
      this.cb.onScore(pts, this.level);
      this.cb.onFeedback(true);

      const container = document.getElementById('gl-blocks');
      if (container) {
        container.innerHTML = `<div class="gl-win-message">🎉 LEVEL ${this.level} SOLVED!</div>`;
      }

      const t = setTimeout(() => {
        if (this.level < this.levels.length) {
          this.level++;
          this._loadLevel();
        } else {
          this._finish();
        }
      }, 1500);
      this._timers.push(t);
    }
  }

  _finish() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this.cb.onEnd({
      score: this.score,
      accuracy: 100,
      avgTime: 0,
      correct: this.level,
      total: this.levels.length,
      level: this.level
    });
  }

  timeUp() { this._finish(); }
  destroy() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}
window.GridlockGame = GridlockGame;
