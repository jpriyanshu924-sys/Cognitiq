/* ══════════════════════════════════════════════════════
   Aon Assessment 4: Motion Challenge
   Measures: Visual attention, multiple object tracking (MOT), concentration
   Based on: Aon smartPredict Motion Challenge
   ══════════════════════════════════════════════════════ */
class MotionTrackGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.level = 1; this.correct = 0; this.total = 0;
    this.el = null; this.canvas = null; this.ctx = null;
    this._timers = [];
    this.dots = [];
    this.numDots = 6;
    this.numTargets = 2;
    this.trackingDuration = 6000; // 6s of movement
    this.state = 'setup'; // 'setup', 'highlight', 'moving', 'guess', 'reveal'
    this.selectedDotIndices = [];
    this.rafId = null;
    this._clickHandler = null;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'motion-game';
    this.container.appendChild(this.el);
    this._setupRound();
  }

  _setupRound() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
    if (this.rafId) cancelAnimationFrame(this.rafId);

    // Dynamic difficulty
    this.numDots = 5 + this.level;
    this.numTargets = Math.min(Math.floor(this.numDots / 2) + 1, 4);
    this.state = 'setup';
    this.selectedDotIndices = [];

    this._render();
    this._initDots();
    this._startHighlight();
  }

  _initDots() {
    const W = 500, H = 350;
    this.dots = [];
    for (let i = 0; i < this.numDots; i++) {
      const isTarget = i < this.numTargets;
      // Ensure starting positions are spaced out with fallback logic to prevent hangs
      let r = 14;
      let x, y, collides;
      let attempts = 0;
      do {
        x = r + Math.random() * (W - 2 * r);
        y = r + Math.random() * (H - 2 * r);
        attempts++;
        const minDist = attempts > 50 ? 25 : 40; // reduce spacing constraints if layout is crowded
        collides = this.dots.some(d => Math.hypot(d.x - x, d.y - y) < minDist);
      } while (collides && attempts < 100);

      // Random velocities
      const speed = 1.6 + this.level * 0.3;
      const angle = Math.random() * 2 * Math.PI;
      this.dots.push({
        x, y, r,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        isTarget,
        id: i
      });
    }
    // Shuffle dots so targets are not just the first elements in array
    this.dots.sort(() => Math.random() - 0.5);
  }

  _startHighlight() {
    this.state = 'highlight';
    this._draw();
    
    const t = setTimeout(() => {
      this._startMoving();
    }, 2500); // 2.5 seconds highlighting targets
    this._timers.push(t);
  }

  _startMoving() {
    this.state = 'moving';
    const startTime = Date.now();

    const loop = () => {
      this._updatePhysics();
      this._draw();

      if (Date.now() - startTime < this.trackingDuration) {
        this.rafId = requestAnimationFrame(loop);
      } else {
        this._startGuess();
      }
    };
    this.rafId = requestAnimationFrame(loop);
  }

  _startGuess() {
    this.state = 'guess';
    this._draw();
    
    const instr = document.getElementById('mt-instruction');
    if (instr) instr.textContent = `Click on the ${this.numTargets} dots you were tracking!`;
  }

  _updatePhysics() {
    const W = 500, H = 350;
    this.dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;

      // Wall bouncing
      if (d.x - d.r < 0) { d.x = d.r; d.vx *= -1; }
      if (d.x + d.r > W) { d.x = W - d.r; d.vx *= -1; }
      if (d.y - d.r < 0) { d.y = d.r; d.vy *= -1; }
      if (d.y + d.r > H) { d.y = H - d.r; d.vy *= -1; }
    });
  }

  _draw() {
    if (!this.ctx) return;
    const W = 500, H = 350;
    this.ctx.clearRect(0, 0, W, H);

    // Draw grid background (subtle dark lines for white container card)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, H); this.ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(W, y); this.ctx.stroke();
    }

    // Draw dots
    this.dots.forEach((d, idx) => {
      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);

      let color = 'rgba(148, 163, 184, 0.8)'; // default gray
      let shadowColor = 'transparent';

      if (this.state === 'highlight') {
        if (d.isTarget) {
          color = '#ea580c'; // Premium amber target color
          shadowColor = 'rgba(234, 88, 12, 0.4)';
        }
      } else if (this.state === 'guess') {
        if (this.selectedDotIndices.includes(idx)) {
          color = '#0284c7'; // Blue selected
          shadowColor = 'rgba(2, 132, 199, 0.4)';
        }
      } else if (this.state === 'reveal') {
        const isSelected = this.selectedDotIndices.includes(idx);
        if (d.isTarget) {
          color = '#10b981'; // Green for target
          shadowColor = 'rgba(16, 185, 129, 0.4)';
        } else if (isSelected) {
          color = '#ef4444'; // Red for wrong selection
          shadowColor = 'rgba(239, 68, 68, 0.4)';
        }
      }

      this.ctx.fillStyle = color;
      this.ctx.shadowColor = shadowColor;
      this.ctx.shadowBlur = shadowColor !== 'transparent' ? 12 : 0;
      this.ctx.fill();
      this.ctx.shadowBlur = 0; // reset shadow

      // Subtle details
      this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
    });
  }

  _handleClick(e) {
    if (this.state !== 'guess') return;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Canvas scaling compensation if styled
    const scaleX = 500 / rect.width;
    const scaleY = 350 / rect.height;
    const x = clickX * scaleX;
    const y = clickY * scaleY;

    // Find clicked dot
    const clickedIdx = this.dots.findIndex(d => Math.hypot(d.x - x, d.y - y) <= d.r + 8);
    if (clickedIdx === -1) return;

    const selIdx = this.selectedDotIndices.indexOf(clickedIdx);
    if (selIdx !== -1) {
      this.selectedDotIndices.splice(selIdx, 1);
    } else if (this.selectedDotIndices.length < this.numTargets) {
      this.selectedDotIndices.push(clickedIdx);
    }

    this._draw();

    if (this.selectedDotIndices.length === this.numTargets) {
      this._evaluateRound();
    }
  }

  _evaluateRound() {
    this.state = 'reveal';
    this._draw();

    // Check how many targets were correctly identified
    let correctCount = 0;
    this.selectedDotIndices.forEach(idx => {
      if (this.dots[idx].isTarget) correctCount++;
    });

    const success = (correctCount === this.numTargets);
    const pts = correctCount * 120 + (success ? 200 : 0);
    this.score += pts;
    this.correct += correctCount;
    this.total += this.numTargets;

    this.cb.onScore(pts, this.level);
    this.cb.onFeedback(success);

    const instr = document.getElementById('mt-instruction');
    if (instr) {
      instr.innerHTML = success 
        ? `<span style="color:#10b981">Perfect! Identified all targets! +${pts} pts</span>`
        : `<span style="color:#ef4444">Identified ${correctCount}/${this.numTargets} targets.</span>`;
    }

    if (success) {
      this.level = Math.min(5, this.level + 1);
    } else {
      this.level = Math.max(1, this.level - 1);
    }

    const t = setTimeout(() => {
      if (this.total >= 10) {
        this._finish();
      } else {
        this._setupRound();
      }
    }, 2000);
    this._timers.push(t);
  }

  _finish() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this._timers.forEach(clearTimeout);
    if (this.canvas && this._clickHandler) {
      this.canvas.removeEventListener('click', this._clickHandler);
    }

    if (this.el) {
      this.el.innerHTML = `
        <div style="text-align:center;padding:40px">
          <div style="font-size:3.5rem;margin-bottom:16px">🎯</div>
          <h3 style="font-family:var(--fh);margin-bottom:12px">Motion Challenge Complete!</h3>
          <p style="color:var(--muted);margin-bottom:8px">Correct Targets Tracked: <strong>${this.correct} / ${this.total}</strong></p>
          <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
        </div>`;
    }

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: this.total ? (this.correct / this.total) * 100 : 0,
        avgTime: 0,
        correct: this.correct,
        total: this.total,
        level: this.level
      });
    }, 2000);
  }

  _render() {
    if (!this.el) return;
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Level ${this.level}</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Motion Challenge</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Multiple Object Tracking (MOT)</span>
                </div>
                <div style="display:flex; gap:16px">
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">TRACKED</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#0284c7">${this.correct}/${this.total}</div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c">${this.score}</div>
                  </div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 420px; justify-content: center; align-items: center; padding: 24px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visual Concentration</div>
                <div class="ap-spin-badge" id="mt-instruction" style="align-self:center; margin-bottom: 20px; background-color:#eff6ff; color:#3b22d8">
                  Memorize the highlighted yellow target dots...
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:12px; width:100%; display:flex; justify-content:center; align-items:center; box-shadow:0 4px 12px rgba(0,0,0,0.02)">
                  <canvas id="mt-canvas" width="500" height="350" style="background:transparent; border-radius:8px; display:block; width:100%; height:auto; max-width:500px"></canvas>
                </div>
              </div>

              <!-- Footer Row with progress bar -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Tracking Instructions</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Watch the highlighted targets. Once they start moving and turn gray, keep track of their locations. Click them when they stop.
                  </div>
                </div>
                <div class="ap-tow-footer-card">
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:#6b7280; margin-bottom:6px; letter-spacing:0.04em">
                    <span>ROUND PROGRESS</span>
                    <span style="color:#059669">${Math.round(Math.min(100, (this.total / 10) * 100))}%</span>
                  </div>
                  <div class="ap-progress-bar-bg" style="width:100%"><div class="ap-progress-bar-fill" style="width:${Math.min(100, (this.total / 10) * 100)}%; background-color:#059669"></div></div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this.canvas = document.getElementById('mt-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this._clickHandler = (e) => this._handleClick(e);
      this.canvas.addEventListener('click', this._clickHandler);
    }
  }

  timeUp() { this._finish(); }
  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this._timers.forEach(clearTimeout);
    if (this.canvas && this._clickHandler) {
      this.canvas.removeEventListener('click', this._clickHandler);
    }
    this.el = null;
  }
}
window.MotionTrackGame = MotionTrackGame;
