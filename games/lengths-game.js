/* ══════════════════════════════════════════════════════
   Pymetrics Game 7: Lengths Game (Mouth Length)
   Measures: Attention to detail, perceptual learning, reward sensitivity
   Real equivalent: Pymetrics Face/Mouth Lengths Task
   Rules from Playbook & Screenshot:
   - Identify if the face has a LITTLE mouth or a BIG mouth
   - Little mouth: Click "Little Mouth" or press ArrowLeft
   - Big mouth: Click "Big Mouth" or press ArrowRight
   - Probabilistic cash reward on correct answers
══════════════════════════════════════════════════════ */
class LengthsGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; // stored in cents (points)
    this.correct = 0; this.total = 0;
    this.streak = 0; this.level = 1;
    this.bankTotal = 0; // total cash in cents
    this.locked = false; this.el = null;
    this.q = 0; this.totalQuestions = 30;
    this.times = []; this._t0 = 0;
    this._kd = null; this._flashTimer = null;
    this._responseTimeout = null;
    this.gameStartTime = 0;

    // Face / Mouth state
    this.currentMouth = 'little'; // 'little' | 'big'
    this.mouthShown = false;
  }

  start() {
    this.gameStartTime = Date.now();
    this.el = document.createElement('div');
    this.el.className = 'len-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _newRound() {
    this._clearTimers();
    if (this.q >= this.totalQuestions) { this._finish(); return; }
    this.q++;
    this.locked = false;
    this.mouthShown = false;

    // Randomize mouth type for this round
    this.currentMouth = Math.random() < 0.5 ? 'little' : 'big';

    this._render();
    
    // Draw initial face base with mouth hidden/blank
    this._drawFace(true);

    // After brief delay, flash mouth on the face
    setTimeout(() => {
      if (!this.el) return;
      this.mouthShown = true;
      this._drawFace(false);
      this._t0 = Date.now();

      // Flashes face for 450ms, then clears mouth to test memory recall
      const flashDuration = Math.max(300, 600 - this.level * 100);
      this._flashTimer = setTimeout(() => {
        if (!this.el) return;
        this.mouthShown = false;
        this._drawFace(true); // Redraw with blank mouth
      }, flashDuration);

      // 2.5 seconds strict response limit
      this._responseTimeout = setTimeout(() => this._timeoutMiss(), 2500);
    }, 400);
  }

  _drawFace(hideMouth = false) {
    const canvas = document.getElementById('len-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    // Draw Face Base (Sleek Golden Gradient Emoji style)
    const grd = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, 75);
    grd.addColorStop(0, '#ffd166');
    grd.addColorStop(1, '#f7a072');

    ctx.shadowColor = 'rgba(247, 160, 114, 0.25)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Eyes (Slate grey)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx - 22, cy - 14, 6, 0, 2 * Math.PI); // Left Eye
    ctx.arc(cx + 22, cy - 14, 6, 0, 2 * Math.PI); // Right Eye
    ctx.fill();

    // Draw Mouth if not hidden
    if (!hideMouth && this.mouthShown) {
      // Define slight measurement differences based on level:
      // Level 1: Little = 16px, Big = 36px (Difference 20px)
      // Level 2: Little = 20px, Big = 32px (Difference 12px)
      // Level 3: Little = 22px, Big = 28px (Difference 6px)
      let mouthLen = 20;
      if (this.level === 1) {
        mouthLen = this.currentMouth === 'little' ? 16 : 36;
      } else if (this.level === 2) {
        mouthLen = this.currentMouth === 'little' ? 20 : 32;
      } else {
        mouthLen = this.currentMouth === 'little' ? 22 : 28;
      }

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - mouthLen / 2, cy + 26);
      ctx.lineTo(cx + mouthLen / 2, cy + 26);
      ctx.stroke();
    }
  }

  _render() {
    if (!this.el) return;

    const lastRewardObj = this.times.length > 0 ? this.times[this.times.length - 1] : null;
    let rewardText = 'None';
    let rewardColor = '#6b7280';
    if (lastRewardObj) {
      if (lastRewardObj.rewarded) {
        rewardText = `💵 REWARDED! +$0.20`;
        rewardColor = '#059669';
      } else if (lastRewardObj.correct) {
        rewardText = `✓ Correct (No Cash)`;
        rewardColor = '#2563eb';
      } else {
        rewardText = `❌ Incorrect`;
        rewardColor = '#dc2626';
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
            <span class="ap-question-num">Question ${this.q} of ${this.totalQuestions}</span>
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
            <div class="ap-workspace" style="max-width: 1100px">
              
              <div class="ap-blg-grid" style="grid-template-columns: 280px 1fr">
                <!-- Left panel: Performance & Stats -->
                <div class="ap-blg-left">
                  
                  <div class="ap-blg-card">
                    <div class="ap-blg-card-title" style="display:flex; justify-content:space-between; align-items:center">
                      Performance
                      <span class="ap-spin-badge" style="background-color:#eff6ff; color:#2563eb; font-size:0.75rem">Level ${this.level}</span>
                    </div>
                    
                    <div class="ap-blg-metric-group">
                      <span class="ap-blg-lbl">Total Cash Earned</span>
                      <div class="ap-blg-val-green" id="len-total-cash">$${(this.bankTotal / 100).toFixed(2)}</div>
                    </div>
                    
                    <div class="ap-blg-divider"></div>
                    
                    <div class="ap-blg-pop-row">
                      <div>
                        <span class="ap-blg-lbl" style="margin-bottom:2px">Last Result</span>
                        <div class="ap-blg-pop-text" id="len-last-feedback" style="color: ${rewardColor}; font-size:0.85rem">${rewardText}</div>
                      </div>
                      <div class="ap-blg-pop-badge" style="background-color:#dbeafe; color:#1e40af">💵</div>
                    </div>
                  </div>

                  <div class="ap-blg-instructions-card">
                    <div class="ap-blg-instr-title">⚡ Face Length Rules</div>
                    <p class="ap-blg-instr-text" style="font-size: 0.72rem; line-height:1.4">
                      Determine if the mouth length of the face is <strong>LITTLE</strong> or <strong>BIG</strong>. Correct responses may probabilistically trigger cash rewards.
                    </p>
                  </div>

                </div>

                <!-- Right panel: Play Arena -->
                <div class="ap-blg-right-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 480px; position: relative;">
                  
                  <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visual Discrimination</div>
                  <div class="ap-spin-badge" id="len-status-badge" style="align-self:center; margin-bottom: 24px; background-color:#eff6ff; color:#3b22d8">
                    Observe the face mouth length...
                  </div>

                  <!-- Face canvas area -->
                  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 28px;">
                    <canvas id="len-canvas" width="240" height="240" style="background:transparent"></canvas>
                  </div>

                  <!-- Action buttons -->
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; width:100%; max-width:360px;">
                    <button class="btn ap-he-btn-outline" style="margin-top:0; padding:16px 0; font-size:0.95rem !important; cursor:pointer; font-weight:700;" id="len-btn-left" data-type="little">
                      ← Little Mouth
                    </button>
                    <button class="btn ap-he-btn-outline" style="margin-top:0; padding:16px 0; font-size:0.95rem !important; cursor:pointer; font-weight:700;" id="len-btn-right" data-type="big">
                      Big Mouth →
                    </button>
                  </div>

                  <div style="font-size:0.75rem; color:#6b7280; margin-top:24px">
                    Press <span class="ap-kp-key-box">←</span> or <span class="ap-kp-key-box">→</span> arrow keys to answer
                  </div>

                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    document.getElementById('len-btn-left').addEventListener('click', () => this._pick('little'));
    document.getElementById('len-btn-right').addEventListener('click', () => this._pick('big'));

    this._kd = e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); this._pick('little'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this._pick('big'); }
    };
    window.addEventListener('keydown', this._kd);

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _pick(choice) {
    if (this.locked || !this.el) return;
    this.locked = true;
    this._clearTimers();

    const rt = Date.now() - this._t0;
    this.total++;

    const isCorrect = choice === this.currentMouth;
    
    // Probabilistic reward schedule:
    // Correct trials have a 70% chance of paying $0.20
    const rewarded = isCorrect && (Math.random() < 0.7);
    const rewardAmt = rewarded ? 20 : 0; // cents

    if (isCorrect) {
      this.correct++;
      this.streak++;
      this.bankTotal += rewardAmt;
      this.score = this.bankTotal; // Keep points matching banked cents
      if (this.correct % 8 === 0) {
        this.level = Math.min(3, this.level + 1);
      }
      this.times.push({ rt, correct: true, rewarded });
      this.cb.onScore(rewardAmt, this.streak);
      this.cb.onFeedback(true);
    } else {
      this.streak = 0;
      this.times.push({ rt, correct: false, rewarded: false });
      this.cb.onFeedback(false);
    }

    // Render visual feedback
    const statusBadge = document.getElementById('len-status-badge');
    const leftBtn = document.getElementById('len-btn-left');
    const rightBtn = document.getElementById('len-btn-right');

    if (isCorrect) {
      if (statusBadge) {
        statusBadge.textContent = rewarded ? '💵 REWARDED! +$0.20' : '✓ CORRECT!';
        statusBadge.style.color = rewarded ? '#059669' : '#2563eb';
        statusBadge.style.backgroundColor = rewarded ? '#d1fae5' : '#dbeafe';
      }
      const activeBtn = choice === 'little' ? leftBtn : rightBtn;
      if (activeBtn) {
        activeBtn.style.backgroundColor = '#10b981';
        activeBtn.style.borderColor = '#10b981';
        activeBtn.style.color = '#ffffff';
      }
    } else {
      if (statusBadge) {
        statusBadge.textContent = '❌ INCORRECT!';
        statusBadge.style.color = '#dc2626';
        statusBadge.style.backgroundColor = '#fee2e2';
      }
      const activeBtn = choice === 'little' ? leftBtn : rightBtn;
      const correctBtn = choice === 'little' ? rightBtn : leftBtn;
      if (activeBtn) {
        activeBtn.style.backgroundColor = '#ef4444';
        activeBtn.style.borderColor = '#ef4444';
        activeBtn.style.color = '#ffffff';
      }
      if (correctBtn) {
        correctBtn.style.backgroundColor = '#10b981';
        correctBtn.style.borderColor = '#10b981';
        correctBtn.style.color = '#ffffff';
      }
    }

    // Force face redraw to show correct length clearly
    this.mouthShown = true;
    this._drawFace(false);

    // Advance round after brief feedback display
    setTimeout(() => this._newRound(), 1200);
  }

  _timeoutMiss() {
    if (this.locked || !this.el) return;
    this.locked = true;
    this.total++;
    this.streak = 0;
    this.times.push({ rt: 2500, correct: false, rewarded: false });
    this.cb.onFeedback(false);

    const statusBadge = document.getElementById('len-status-badge');
    if (statusBadge) {
      statusBadge.textContent = '❌ TIMEOUT!';
      statusBadge.style.color = '#dc2626';
      statusBadge.style.backgroundColor = '#fee2e2';
    }

    setTimeout(() => this._newRound(), 1200);
  }

  _clearTimers() {
    clearTimeout(this._flashTimer);
    clearTimeout(this._responseTimeout);
  }

  _finish() {
    this._clearTimers();
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this.finished = true;

    const rate = this.total ? (this.correct / this.total) * 100 : 0;
    const totalRt = this.times.reduce((a, b) => a + b.rt, 0);
    const avgTime = this.times.length ? totalRt / this.times.length : 0;

    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">⚖️</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Lengths Game Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Correct Identifications: <strong>${this.correct} / ${this.total}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Total Cash: <strong>$${(this.bankTotal / 100).toFixed(2)}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">$${(this.bankTotal / 100).toFixed(2)}</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: Math.round(rate),
        avgTime: Math.round(avgTime),
        correct: this.correct, total: this.total, level: this.level
      });
    }, 2000);
  }

  timeUp() { this._finish(); }

  destroy() {
    this._clearTimers();
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this.el = null;
  }
}

window.LengthsGame = LengthsGame;
