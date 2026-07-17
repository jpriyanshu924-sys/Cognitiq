/* ══════════════════════════════════════════════════════
   Arctic Shores 4: Grid Memory Challenge
   Measures: Spatial working memory, visuospatial recall
   Based on: Arctic Shores spatial grid memory mechanics
══════════════════════════════════════════════════════ */
class GridMemoryGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.level = 1; this.phase = 'show'; // show | recall
    this.el = null; this._timers = []; this._animId = null;
    this.pattern = []; this.userPicks = []; this.gridSize = 4;
    this.patternSize = 4;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'gm-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _newRound() {
    this.total++;
    this.phase = 'show';
    this.userPicks = [];
    this.gridSize = this.level <= 1 ? 4 : this.level === 2 ? 5 : 5;
    this.patternSize = 3 + this.level + Math.floor(this.correct / 3);
    const totalCells = this.gridSize * this.gridSize;
    const indices = Array.from({length: totalCells}, (_,i) => i);
    // Shuffle and pick patternSize cells
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    this.pattern = indices.slice(0, Math.min(this.patternSize, totalCells));
    this._showPattern();
  }

  _showPattern() {
    if (!this.el) return;
    const showDur = Math.max(1200, 2500 - this.level * 400);
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Round ${this.total}</span>
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
              
              <!-- Title and Stats -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Grid Memory</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visuospatial Recall</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 24px; background-color:#eff6ff; color:#3b22d8">
                  Memorize & Recall
                </div>
                
                <div style="font-size:1.15rem; font-weight:800; color:#111827; margin-bottom:24px" id="gm-instr">
                  <span style="color:#3b22d8">Memorise</span> the highlighted cells!
                </div>
                
                <!-- Dotted grid box holding cells -->
                <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:24px; width:100%; max-width:320px; display:flex; justify-content:center; align-items:center; margin-bottom:28px">
                  <div class="gm-grid" id="gm-grid" style="grid-template-columns:repeat(${this.gridSize},1fr); gap:8px; width:100%; display:grid"></div>
                </div>

              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Spatial Memory Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Remember the location of the lit grid blocks. After they disappear, click the blocks to recall.
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Correct</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669">${this.correct}</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Streak</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c">${this.streak}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this._renderGrid(true);

    const t = setTimeout(() => {
      if (!this.el) return;
      this.phase = 'recall';
      const instr = document.getElementById('gm-instr');
      if (instr) instr.innerHTML = `<span style="color:#ea580c">Recall</span> — click the cells you saw`;
      this._renderGrid(false);
    }, showDur);
    this._timers.push(t);

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _renderGrid(showPattern) {
    const grid = document.getElementById('gm-grid');
    if (!grid || !this.el) return;
    const total = this.gridSize * this.gridSize;
    grid.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'gm-cell';
      cell.style.cssText = 'aspect-ratio:1; border:1.5px solid #cbd5e1; border-radius:8px; cursor:pointer; background:#ffffff; transition:all 0.15s';
      const isPattern = this.pattern.includes(i);
      const isPicked = this.userPicks.includes(i);
      
      if (showPattern && isPattern) {
        cell.style.backgroundColor = '#3b22d8';
        cell.style.borderColor = '#3b22d8';
      }
      if (!showPattern && isPicked) {
        cell.style.backgroundColor = '#3b22d8';
        cell.style.borderColor = '#3b22d8';
      }
      
      cell.dataset.idx = i;
      if (!showPattern) {
        cell.addEventListener('click', () => this._pick(i));
      }
      grid.appendChild(cell);
    }
    if (!showPattern) {
      // Add submit button
      const sub = document.createElement('button');
      sub.className = 'btn ap-tow-btn-submit gm-submit';
      sub.id = 'gm-submit';
      sub.style.gridColumn = `1 / -1`;
      sub.style.margin = '14px 0 0 0';
      sub.style.padding = '12px 0';
      sub.textContent = `✓ Submit (${this.userPicks.length}/${this.pattern.length})`;
      sub.addEventListener('click', () => this._submit());
      grid.appendChild(sub);
    }
  }

  _pick(idx) {
    if (this.phase !== 'recall' || !this.el) return;
    if (this.userPicks.includes(idx)) {
      this.userPicks = this.userPicks.filter(i => i !== idx);
    } else {
      if (this.userPicks.length < this.pattern.length) {
        this.userPicks.push(idx);
      }
    }
    this._renderGrid(false);
  }

  _submit() {
    const hits = this.userPicks.filter(i => this.pattern.includes(i)).length;
    const falsePos = this.userPicks.filter(i => !this.pattern.includes(i)).length;
    const acc = Math.max(0, hits - falsePos) / this.pattern.length;

    // Show correct pattern
    const grid = document.getElementById('gm-grid');
    if (grid) {
      grid.querySelectorAll('.gm-cell').forEach(cell => {
        const idx = parseInt(cell.dataset.idx);
        if (this.pattern.includes(idx)) {
          cell.style.backgroundColor = '#10b981';
          cell.style.borderColor = '#10b981';
        }
        if (this.userPicks.includes(idx) && !this.pattern.includes(idx)) {
          cell.style.backgroundColor = '#ef4444';
          cell.style.borderColor = '#ef4444';
        }
      });
    }

    if (acc >= 0.8) {
      this.correct++; this.streak++;
      if (this.correct % 4 === 0) this.level = Math.min(3, this.level + 1);
      const pts = Math.floor(acc * 200) + this.level * 40 + (this.streak >= 3 ? this.streak * 20 : 0);
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0; this.cb.onFeedback(false);
    }

    const t = setTimeout(() => this._newRound(), 1400);
    this._timers.push(t);
  }

  timeUp() {
    this._timers.forEach(clearTimeout);
    this.cb.onEnd({ score: this.score, accuracy: this.total ? (this.correct/this.total)*100 : 0, avgTime: 0, correct: this.correct, total: this.total, level: this.level });
  }
  destroy() { this._timers.forEach(clearTimeout); this.el = null; }
}
window.GridMemoryGame = GridMemoryGame;
