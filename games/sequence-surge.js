/* ══════════════════════════════════════════════════════
   Arctic Shores 2: Sequence Game
   Measures: Spatial working memory, attention filter, visuospatial recall
   Based on: Arctic Shores "Sequence" game — Simon-says tile pattern replication with decoys
══════════════════════════════════════════════════════ */
class SequenceSurgeGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.level = 1; this.lives = 3;
    this.el = null; this._timers = [];

    this.seqLen = 3;
    this.pattern = []; // array of cell indices {index, isDecoy}
    this.userPicks = [];
    this.gridSize = 4; // 4x4 grid (16 tiles)
    this.phase = 'show'; // 'show' | 'recall' | 'feedback'
    this.playbackIdx = 0;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'ss-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _newRound() {
    this._clearTimers();
    if (this.lives <= 0) { this._finish(); return; }
    
    this.total++;
    this.phase = 'show';
    this.userPicks = [];
    this.playbackIdx = 0;

    // Grid size 4x4 (16 cells)
    const totalCells = this.gridSize * this.gridSize;

    // Generate a true sequence of indices
    const truePattern = [];
    for (let i = 0; i < this.seqLen; i++) {
      truePattern.push(Math.floor(Math.random() * totalCells));
    }

    // Interleave decoy steps for Level 2 & 3
    // Decoys are extra icons that light up but are NOT part of the true sequence
    this.pattern = truePattern.map(idx => ({ index: idx, isDecoy: false }));

    if (this.level >= 2) {
      // Add 1 decoy
      const decoyIdx = Math.floor(Math.random() * totalCells);
      const insertAt = 1 + Math.floor(Math.random() * (this.pattern.length - 1));
      this.pattern.splice(insertAt, 0, { index: decoyIdx, isDecoy: true });
    }

    if (this.level >= 3) {
      // Add a second decoy
      const decoyIdx2 = Math.floor(Math.random() * totalCells);
      const insertAt2 = 1 + Math.floor(Math.random() * (this.pattern.length - 1));
      this.pattern.splice(insertAt2, 0, { index: decoyIdx2, isDecoy: true });
    }

    this._render();
    const t = setTimeout(() => this._playSequence(), 1000);
    this._timers.push(t);
  }

  _playSequence() {
    if (!this.el || this.playbackIdx >= this.pattern.length) {
      // End of sequence presentation -> Switch to user recall phase
      this.phase = 'recall';
      const statusEl = document.getElementById('ss-status');
      if (statusEl) {
        statusEl.textContent = 'REPLICATE PATTERN';
        statusEl.style.color = '#3b22d8';
      }
      this._enableGridClicks();
      return;
    }

    const step = this.pattern[this.playbackIdx];
    const cellEl = document.getElementById(`ss-tile-${step.index}`);
    
    if (cellEl) {
      // Light up the cell
      if (step.isDecoy) {
        // Decoy lights up in RED/ORANGE
        cellEl.style.backgroundColor = '#ef4444';
        cellEl.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.8)';
      } else {
        // True sequence lights up in GREEN
        cellEl.style.backgroundColor = '#10b981';
        cellEl.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.8)';
      }

      // Turn off cell after duration
      const t1 = setTimeout(() => {
        cellEl.style.backgroundColor = '';
        cellEl.style.boxShadow = '';
        this.playbackIdx++;
        
        // Brief gap between flashes
        const t2 = setTimeout(() => this._playSequence(), 300);
        this._timers.push(t2);
      }, 550);
      this._timers.push(t1);
    }
  }

  _enableGridClicks() {
    const tiles = this.el.querySelectorAll('.ss-tile');
    tiles.forEach(tile => {
      tile.style.cursor = 'pointer';
      tile.addEventListener('click', () => this._handleTileClick(parseInt(tile.dataset.id)));
    });
  }

  _handleTileClick(id) {
    if (this.phase !== 'recall' || !this.el) return;

    // Flash clicked tile briefly in blue
    const tileEl = document.getElementById(`ss-tile-${id}`);
    if (tileEl) {
      tileEl.style.backgroundColor = '#3b22d8';
      setTimeout(() => {
        if (tileEl) {
          tileEl.style.backgroundColor = '';
        }
      }, 250);
    }

    this.userPicks.push(id);

    // Get only the true sequence indices (filtering out decoys)
    const trueSequence = this.pattern.filter(p => !p.isDecoy).map(p => p.index);

    // Check correctness so far
    const stepIdx = this.userPicks.length - 1;
    if (this.userPicks[stepIdx] !== trueSequence[stepIdx]) {
      // Mistake!
      this._handleFailure();
      return;
    }

    if (this.userPicks.length === trueSequence.length) {
      // Replicated successfully!
      this._handleSuccess();
    }
  }

  _handleSuccess() {
    this.phase = 'feedback';
    this.correct++;
    this.streak++;
    this.score += 100 + this.seqLen * 25 + this.level * 40;
    this.seqLen = Math.min(10, this.seqLen + 1);

    if (this.streak >= 3) {
      this.level = Math.min(3, this.level + 1);
    }

    this.cb.onScore(100 + this.seqLen * 25, this.streak);
    this.cb.onFeedback(true);

    const statusEl = document.getElementById('ss-status');
    if (statusEl) {
      statusEl.textContent = '✓ CORRECT!';
      statusEl.style.color = '#10b981';
    }

    const t = setTimeout(() => this._newRound(), 1200);
    this._timers.push(t);
  }

  _handleFailure() {
    this.phase = 'feedback';
    this.lives--;
    this.streak = 0;
    this.seqLen = Math.max(3, this.seqLen - 1);

    this.cb.onFeedback(false);

    const statusEl = document.getElementById('ss-status');
    if (statusEl) {
      statusEl.textContent = '❌ WRONG SEQUENCE!';
      statusEl.style.color = '#ef4444';
    }

    // Flash true sequence in red/orange on screen
    const trueSequence = this.pattern.filter(p => !p.isDecoy).map(p => p.index);
    trueSequence.forEach(idx => {
      const tile = document.getElementById(`ss-tile-${idx}`);
      if (tile) {
        tile.style.backgroundColor = 'rgba(239, 68, 68, 0.4)';
      }
    });

    const t = setTimeout(() => {
      trueSequence.forEach(idx => {
        const tile = document.getElementById(`ss-tile-${idx}`);
        if (tile) tile.style.backgroundColor = '';
      });
      this._newRound();
    }, 1500);
    this._timers.push(t);
  }

  _render() {
    if (!this.el) return;
    const progressPct = Math.min(100, Math.round((this.correct / 15) * 100));

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Sequence Memory</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Sequence Game</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 480px; justify-content: center; align-items: center; padding: 30px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visual Pattern Replication</div>
                <div class="ap-spin-badge" id="ss-status" style="align-self:center; margin-bottom: 24px; background-color:#eff6ff; color:#3b22d8">
                  MEMORISING SEQUENCE...
                </div>

                <!-- 4x4 Grid of Tiles -->
                <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:20px; width:100%; max-width:320px; display:flex; justify-content:center; align-items:center; margin:0 auto 24px">
                  <div class="ss-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; width:100%">
                    ${Array.from({length: 16}, (_, i) => `
                      <div class="ss-tile" id="ss-tile-${i}" data-id="${i}" style="
                        aspect-ratio:1;
                        background-color:#ffffff;
                        border:2px solid #e2e8f0;
                        border-radius:8px;
                        transition:all 0.15s ease;
                      "></div>`).join('')}
                  </div>
                </div>

                <div style="font-size:0.78rem; color:#6b7280; max-width:400px; margin:0 auto">
                  ${this.level >= 2 
                    ? '⚠️ <strong style="color:#ef4444">DECOY WARNING</strong>: Ignore any <strong style="color:#ef4444">RED</strong> flashes! Replicate only the <strong style="color:#10b981">GREEN</strong> sequence.' 
                    : 'Watch the highlighted tiles and repeat the pattern in the exact same order.'}
                </div>
              </div>

              <!-- Footer info -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Simon-says Sequence Game</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Measures visuospatial capacity and selective attention. Distractor tiles will flash to test your concentration.
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Lives</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#dc2626">${this.lives} / 3</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Length</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#3b22d8">${this.seqLen}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _clearTimers() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
  }

  _finish() {
    this._clearTimers();
    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🏆</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Sequence Game Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Correct Replications: <strong>${this.correct}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: this.total ? (this.correct / this.total) * 100 : 0,
        avgTime: 0,
        correct: this.correct, total: this.total, level: this.level
      });
    }, 2000);
  }

  timeUp() {
    this._finish();
  }

  destroy() {
    this._clearTimers();
    this.el = null;
  }
}

window.SequenceSurgeGame = SequenceSurgeGame;
