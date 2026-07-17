/* ══════════════════════════════════════════════════════
   Pymetrics Game 3: Tower Game (Tower of London)
   Measures: Planning, problem-solving, cognitive flexibility
   Real equivalent: Tower of London / Tower of Hanoi variant
══════════════════════════════════════════════════════ */
class TowerGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.puzzlesSolved = 0; this.level = 1;
    this.el = null; this.state = null; this.target = null;
    this.selected = null; // which peg is selected
    this.moves = 0; this.minMoves = 0;
    this.totalAttempts = 0; this._timers = [];
    this.puzzleSolvedState = false;
  }

  // Pegs: 3 pegs, each is a stack of discs (numbers = sizes, lower=wider)
  // Display: 3 columns, discs drawn as colored rectangles

  start() {
    this.el = document.createElement('div');
    this.el.className = 'tow-game';
    this.container.appendChild(this.el);
    this._newPuzzle();
  }

  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _newPuzzle() {
    // Number of discs scales with level
    const numDiscs = this.level <= 1 ? 3 : this.level <= 2 ? 4 : 5;
    // Create scrambled start state
    this.state = [[], [], []];
    this.target = [[], [], []];

    const discs = Array.from({ length: numDiscs }, (_, i) => i + 1); // 1=small,n=big

    // Start: all discs on peg 0 in order (classic start)
    this.state[0] = [...discs].reverse(); // largest at bottom

    // Target: all discs on peg 2 in order
    this.target[2] = [...discs].reverse();

    // Scramble start: do some random valid moves from classic position
    const scrambleMoves = numDiscs * 3 + Math.floor(Math.random() * 4);
    let cur = [discs.slice().reverse(), [], []];
    for (let i = 0; i < scrambleMoves; i++) {
      const validMoves = [];
      for (let from = 0; from < 3; from++) {
        if (cur[from].length === 0) continue;
        const disc = cur[from][cur[from].length - 1];
        for (let to = 0; to < 3; to++) {
          if (from === to) continue;
          if (cur[to].length === 0 || cur[to][cur[to].length - 1] > disc) {
            validMoves.push({ from, to });
          }
        }
      }
      if (validMoves.length > 0) {
        const mv = validMoves[Math.floor(Math.random() * validMoves.length)];
        cur[mv.to].push(cur[mv.from].pop());
      }
    }
    this.state = cur.map(p => [...p]);

    // Estimate min moves (rough: 2^n - 1 for n discs, but scrambled)
    this.minMoves = numDiscs * 2;
    this.moves = 0;
    this.selected = null;
    this._render();
  }

  _isSolved() {
    return this.target.every((peg, i) =>
      peg.length === this.state[i].length &&
      peg.every((d, j) => d === this.state[i][j])
    );
  }

  _render() {
    if (!this.el) return;

    const progressPct = Math.round((this.puzzlesSolved / 8) * 100);

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Task ${this.puzzlesSolved + 1} of 8</span>
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
            <div class="ap-workspace" style="max-width: 1000px">
              
              <!-- Header Title and Stats -->
              <div class="ap-tow-header-row">
                <div class="ap-tow-title-box">
                  <span class="ap-tow-title">Tower Game</span>
                  <span class="ap-tow-subtitle">Pymetrics Suite: Spatial Problem Solving</span>
                </div>
                
                <div class="ap-tow-stats-row">
                  <div class="ap-tow-stats-card">
                    <div class="ap-tow-stat-col" style="border-right: 1px solid #e5e7eb; padding-right: 20px">
                      <span class="ap-tow-stat-lbl">Moves</span>
                      <span class="ap-tow-stat-val-blue" id="tow-moves-count">${this.moves}</span>
                    </div>
                    <div class="ap-tow-stat-col">
                      <span class="ap-tow-stat-lbl">Target</span>
                      <span class="ap-tow-stat-val-green">${this.minMoves} <span style="font-size:0.72rem; color:#6b7280; font-weight:600">(Max: ${Math.floor(this.minMoves * 1.5)})</span></span>
                    </div>
                  </div>
                  
                  <button class="ap-tow-reset-btn" id="btn-tow-reset" title="Reset Puzzle">⟳</button>
                </div>
              </div>

              <!-- Main Board Card -->
              <div class="ap-tow-main-card" style="position: relative">
                <!-- Mini Target Configuration overlay -->
                <div style="position: absolute; top: 20px; left: 20px; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 10px; background-color: #f8fafc">
                  <div style="font-size: 0.68rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.04em">🎯 Target Orientation</div>
                  <canvas id="tow-target" width="140" height="90"></canvas>
                </div>

                <div class="ap-tow-pegs-container" id="tow-pegs"></div>
              </div>

              <!-- Footer with Info, Progress and Actions -->
              <div class="ap-tow-footer">
                <!-- Instructions -->
                <div class="ap-tow-footer-card">
                  <div style="font-size: 0.78rem; font-weight: 700; color: #1e3a8a; display: flex; align-items: center; gap: 6px; margin-bottom: 6px">
                    <span>ℹ️</span> Instructions
                  </div>
                  <div style="font-size: 0.75rem; color: #4b5563; line-height: 1.4">
                    Move the entire stack to another peg. You can only move one disc at a time, and a larger disc cannot be placed on top of a smaller one.
                  </div>
                </div>

                <!-- Progress -->
                <div class="ap-tow-footer-card" style="align-items: flex-start">
                  <div style="width: 100%; display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 700; color: #6b7280; margin-bottom: 8px; letter-spacing: 0.04em">
                    <span>ASSESSMENT PROGRESS</span>
                    <span style="color: #059669">${progressPct}%</span>
                  </div>
                  <div class="ap-progress-bar-bg" style="width: 100%; height: 8px; background-color: #e5e7eb">
                    <div class="ap-progress-bar-fill" style="width: ${progressPct}%; background-color: #059669"></div>
                  </div>
                </div>

                <!-- Submit Button -->
                <div>
                  <button class="btn ap-tow-btn-submit" id="btn-tow-submit" ${!this.puzzleSolvedState ? 'disabled' : ''}>
                    Submit Task ➔
                  </button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    document.getElementById('btn-tow-reset').addEventListener('click', () => {
      this.moves = 0;
      this.selected = null;
      this.puzzleSolvedState = false;
      this._newPuzzle();
    });

    document.getElementById('btn-tow-submit').addEventListener('click', () => {
      if (this.puzzleSolvedState) {
        this._onSolved();
      }
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }

    this._drawTargetCanvas();
    this._renderPegs();
  }

  _discColor(size, total) {
    const colors = ['#5ae3d4', '#005d50', '#6366f1', '#1e3b8a', '#7c3aed'];
    return colors[(size - 1) % colors.length];
  }

  _drawTargetCanvas() {
    const canvas = document.getElementById('tow-target');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    this._drawPegsOnCanvas(ctx, this.target, canvas.width, canvas.height);
  }

  _drawPegsOnCanvas(ctx, pegs, W, H) {
    ctx.clearRect(0, 0, W, H);
    const maxDiscs = Math.max(...pegs.map(p => p.length), 5);
    const pegW = W / 3;
    const discH = Math.max(6, H / 10);
    const baseY = H - 10;
    const pegX = [W / 6, W / 2, (5 * W) / 6];

    // Base line
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(5, baseY, W - 10, 2);

    pegs.forEach((peg, pi) => {
      // Peg pole
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(pegX[pi] - 1.5, baseY - maxDiscs * (discH + 2) - 5, 3, maxDiscs * (discH + 2) + 5);

      peg.forEach((disc, di) => {
        const maxSize = Math.max(...pegs.flat(), 5);
        const discWidth = 10 + (disc / maxSize) * (pegW - 10);
        const x = pegX[pi] - discWidth / 2;
        const y = baseY - (di + 1) * (discH + 2);

        ctx.fillStyle = this._discColor(disc, maxSize);
        ctx.beginPath();
        ctx.roundRect(x, y, discWidth, discH, 3);
        ctx.fill();
      });
    });
  }

  _renderPegs() {
    const pegsEl = document.getElementById('tow-pegs');
    if (!pegsEl) return;

    pegsEl.innerHTML = '';
    this.state.forEach((peg, pi) => {
      const pegEl = document.createElement('div');
      pegEl.className = 'ap-tow-peg' + (this.selected === pi ? ' tow-peg-selected' : '');
      pegEl.dataset.peg = pi;

      // Pole Wrapper
      const poleWrapper = document.createElement('div');
      poleWrapper.className = 'ap-tow-pole-wrapper';

      const pole = document.createElement('div');
      pole.className = 'ap-tow-pole';
      poleWrapper.appendChild(pole);

      const base = document.createElement('div');
      base.className = 'ap-tow-base';
      poleWrapper.appendChild(base);

      // Discs container
      const discsContainer = document.createElement('div');
      discsContainer.className = 'ap-tow-discs-container';
      
      peg.forEach(disc => {
        const discEl = document.createElement('div');
        discEl.className = 'ap-tow-disc';
        const maxSize = Math.max(...this.state.flat(), 5);
        const widthPct = 25 + (disc / maxSize) * 70;
        
        discEl.style.cssText = `
          width: ${widthPct}%;
          background: ${this._discColor(disc, maxSize)};
          box-shadow: 0 4px 6px ${this._discColor(disc, maxSize)}33;
        `;
        discEl.textContent = disc;
        discsContainer.appendChild(discEl);
      });
      poleWrapper.appendChild(discsContainer);
      pegEl.appendChild(poleWrapper);

      // Peg label
      const lbl = document.createElement('div');
      lbl.className = 'tow-peg-lbl';
      lbl.style.cssText = 'font-weight: 700; color: #4b5563; margin-top: 10px; font-size: 0.88rem';
      lbl.textContent = ['Peg A', 'Peg B', 'Peg C'][pi];
      pegEl.appendChild(lbl);

      pegEl.addEventListener('click', () => this._clickPeg(pi));
      pegsEl.appendChild(pegEl);
    });
  }

  _clickPeg(pi) {
    if (!this.el || this.puzzleSolvedState) return;

    if (this.selected === null) {
      if (this.state[pi].length === 0) return;
      this.selected = pi;
      this._renderPegs();
    } else {
      if (this.selected === pi) {
        this.selected = null;
        this._renderPegs();
        return;
      }
      const disc = this.state[this.selected][this.state[this.selected].length - 1];
      const destTop = this.state[pi].length > 0 ? this.state[pi][this.state[pi].length - 1] : Infinity;

      if (disc < destTop) {
        this.state[pi].push(this.state[this.selected].pop());
        this.moves++;
        this.selected = null;
        this._renderPegs();
        
        const movesEl = document.getElementById('tow-moves-count');
        if (movesEl) movesEl.textContent = this.moves;

        const maxMoves = Math.floor(this.minMoves * 1.5);
        if (this.moves > maxMoves) {
          this.puzzleSolvedState = true;
          this.cb.onFeedback(false);
          
          const headerNum = this.el.querySelector('.ap-question-num');
          if (headerNum) {
            headerNum.textContent = 'TOO MANY MOVES!';
            headerNum.style.color = '#ef4444';
          }
          
          const submitBtn = document.getElementById('btn-tow-submit');
          if (submitBtn) {
            submitBtn.textContent = '❌ Failed (Exceeded Move Limit)';
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = '#ef4444';
          }
          
          setTimeout(() => {
            this.puzzleSolvedState = false;
            this.puzzlesSolved++;
            if (this.puzzlesSolved >= 8) {
              this._finish();
            } else {
              if (this.puzzlesSolved % 2 === 0) this.level = Math.min(3, this.level + 1);
              this._newPuzzle();
            }
          }, 1500);
          return;
        }

        if (this._isSolved()) {
          this.puzzleSolvedState = true;
          const submitBtn = document.getElementById('btn-tow-submit');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = '#059669'; // Green ready state
          }
        }
      } else {
        const pegEls = this.el.querySelectorAll('.ap-tow-peg');
        if (pegEls[pi]) {
          pegEls[pi].style.animation = 'shake .3s ease';
          setTimeout(() => { if (pegEls[pi]) pegEls[pi].style.animation = ''; }, 300);
        }
      }
    }
  }

  _onSolved() {
    this.puzzlesSolved++;
    const efficiency = Math.max(0, 1 - (this.moves - this.minMoves) / Math.max(1, this.minMoves));
    const pts = Math.floor(200 * efficiency) + 100 + this.level * 50;
    this.score += pts;
    this.cb.onScore(pts, this.puzzlesSolved);
    this.cb.onFeedback(true);

    this.puzzleSolvedState = false;

    if (this.puzzlesSolved >= 8) {
      this._finish();
    } else {
      if (this.puzzlesSolved % 2 === 0) this.level = Math.min(3, this.level + 1);
      this._newPuzzle();
    }
  }

  _finish() {
    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🏆</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Tower Game Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Puzzles Solved: <strong>${this.puzzlesSolved}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Total Moves Made: <strong>${this.moves}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: this.puzzlesSolved > 0 ? 85 : 0,
        avgTime: 0,
        correct: this.puzzlesSolved,
        total: 8,
        level: this.level
      });
    }, 2000);
  }

  timeUp() {
    this._finish();
  }

  destroy() {
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}

window.TowerGame = TowerGame;
