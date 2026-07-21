/* ══════════════════════════════════════════════════════
   Pymetrics Game 1: Balloon Game (BART)
   Measures: Risk tolerance, impulsivity, decision-making
   Real equivalent: Balloon Analogue Risk Task
   Rules from Playbook:
   - Each pump earns $0.05
   - Goal is to collect money before balloon explodes
   - Redesigned 3-column UI matching Screenshot 3
══════════════════════════════════════════════════════ */
class BalloonGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.round = 0; this.totalRounds = 40;
    this.pumps = 0; this.banked = 0; this.popped = 0;
    this.bankTotal = 0; // stored in cents (points)
    this.currentEarnings = 0; // stored in cents (points)
    this.popAt = 0; this.level = 1;
    this.el = null; this._animId = null;
    this.balloonR = 40; this.targetR = 0; this.animating = false;
    this.pumpHistory = []; // for behavioral profile
    this.finished = false;
    this._actionTimer = null;
    this.gameStartTime = 0;
    this.balloonColor = 'blue';
  }

  start() {
    this.gameStartTime = Date.now();
    this.el = document.createElement('div');
    this.el.className = 'balloon-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _newRound() {
    this._clearActionTimer();
    if (this.round >= this.totalRounds) { this._finish(); return; }
    this.round++;
    this.pumps = 0;
    this.currentEarnings = 0;
    this.balloonR = 40;
    this.animating = false;

    // Pick balloon color randomly
    const colors = ['red', 'blue', 'gold'];
    this.balloonColor = colors[Math.floor(Math.random() * colors.length)];

    // Set pop rate based on color:
    // Red: early pops (avg ~10.5 pumps, range 1-20)
    // Blue: medium pops (avg ~17.5 pumps, range 5-30)
    // Gold: late pops (avg ~32.5 pumps, range 10-55)
    if (this.balloonColor === 'red') {
      this.popAt = 1 + Math.floor(Math.random() * 20);
    } else if (this.balloonColor === 'blue') {
      this.popAt = 5 + Math.floor(Math.random() * 25);
    } else {
      this.popAt = 10 + Math.floor(Math.random() * 45);
    }

    this._render();
    this._updateButtonsState(false, true);
    this._startActionTimer();
  }

  _startActionTimer() {
    this._clearActionTimer();
    const limit = Math.max(1800, 3500 - (this.round * 45)); // shrinks down to 1.8s in final rounds
    let timeLeft = limit;
    
    const timerVal = document.getElementById('ap-timer-val');
    if (timerVal) {
      timerVal.textContent = (timeLeft / 1000).toFixed(1) + 's';
      timerVal.style.color = '';
    }
    
    const tick = () => {
      if (this.animating || this.finished || !this.el) return;
      timeLeft -= 100;
      if (timerVal) {
        timerVal.textContent = Math.max(0, (timeLeft / 1000)).toFixed(1) + 's';
        if (timeLeft <= 1000) {
          timerVal.style.color = '#ef4444';
          timerVal.style.fontWeight = '800';
        } else {
          timerVal.style.color = '';
          timerVal.style.fontWeight = '';
        }
      }
      if (timeLeft <= 0) {
        this._actionTimeout();
      } else {
        this._actionTimer = setTimeout(tick, 100);
      }
    };
    this._actionTimer = setTimeout(tick, 100);
  }

  _clearActionTimer() {
    clearTimeout(this._actionTimer);
  }

  _actionTimeout() {
    this._clearActionTimer();
    // Auto-pop due to timeout
    this.pumps = Math.max(this.pumps, this.popAt); 
    this._animatePop();
  }

  _updateButtonsState(isPumpDisabled, isBankDisabled) {
    const pumpBtn = document.getElementById('blg-pump');
    const bankBtn = document.getElementById('blg-bank');
    
    if (pumpBtn) {
      pumpBtn.disabled = isPumpDisabled;
      if (isPumpDisabled) {
        pumpBtn.style.backgroundColor = '#cbd5e1';
        pumpBtn.style.boxShadow = 'none';
        pumpBtn.style.cursor = 'not-allowed';
      } else {
        pumpBtn.style.backgroundColor = '#4cd3e3';
        pumpBtn.style.boxShadow = '0 6px 12px rgba(76,211,227,0.3)';
        pumpBtn.style.cursor = 'pointer';
      }
    }

    if (bankBtn) {
      bankBtn.disabled = isBankDisabled;
      if (isBankDisabled) {
        bankBtn.style.backgroundColor = '#cbd5e1';
        bankBtn.style.boxShadow = 'none';
        bankBtn.style.cursor = 'not-allowed';
      } else {
        bankBtn.style.backgroundColor = '#43aa8b';
        bankBtn.style.boxShadow = '0 6px 12px rgba(67,170,139,0.3)';
        bankBtn.style.cursor = 'pointer';
      }
    }
  }

  _render() {
    if (!this.el) return;
    
    const lastPopObj = this.pumpHistory.length > 0 ? this.pumpHistory[this.pumpHistory.length - 1] : null;
    let lastPopVal = 'None';
    if (lastPopObj) {
      const displayAmt = (lastPopObj.pumps * 0.05).toFixed(2);
      lastPopVal = lastPopObj.popped 
        ? `${lastPopObj.pumps} pumps (Popped: -$${displayAmt})`
        : `${lastPopObj.pumps} pumps (Collected: +$${displayAmt})`;
    }

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Question ${this.round} of ${this.totalRounds}</span>
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
            <div class="ap-workspace" style="max-width: 1200px">
              
              <div class="ap-blg-grid" style="grid-template-columns: 280px 1fr">
                <!-- Left panel: Stats & Instructions -->
                <div class="ap-blg-left">
                  
                  <!-- Performance Card -->
                  <div class="ap-blg-card">
                    <div class="ap-blg-card-title" style="display:flex; justify-content:space-between; align-items:center">
                      Performance
                      <span class="ap-spin-badge" style="background-color:${this.balloonColor==='red'?'#fee2e2':this.balloonColor==='blue'?'#dbeafe':'#fef3c7'}; color:${this.balloonColor==='red'?'#dc2626':this.balloonColor==='blue'?'#2563eb':'#b45309'}; text-transform:capitalize; font-size:0.75rem">${this.balloonColor}</span>
                    </div>
                    
                    <div class="ap-blg-metric-group">
                      <span class="ap-blg-lbl">Current Potential</span>
                      <div class="ap-blg-val-blue" id="blg-earn">$${(this.currentEarnings / 100).toFixed(2)}</div>
                    </div>
                    
                    <div class="ap-blg-metric-group">
                      <span class="ap-blg-lbl">Total Earned</span>
                      <div class="ap-blg-val-green" id="blg-total">$${(this.bankTotal / 100).toFixed(2)}</div>
                    </div>
                    
                    <div class="ap-blg-divider"></div>
                    
                    <div class="ap-blg-pop-row">
                      <div>
                        <span class="ap-blg-lbl" style="margin-bottom:2px">Last Pop</span>
                        <div class="ap-blg-pop-text" id="blg-last-pop" style="color: #b91c1c; font-size:0.78rem;">${lastPopVal}</div>
                      </div>
                      <div class="ap-blg-pop-badge">💥</div>
                    </div>
                  </div>

                  <!-- Instructions Card -->
                  <div class="ap-blg-instructions-card">
                    <div class="ap-blg-instr-title">⚡ BALLOON PATTERNS</div>
                    <p class="ap-blg-instr-text">
                      Balloon colors have different thresholds! Red balloons pop early, Blue are average, and Gold balloons can be pumped much further.
                    </p>
                  </div>

                </div>

                <!-- Right panel: Redesigned Game Arena matching Screenshot 3 -->
                <div class="ap-blg-right-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 480px; position: relative;">
                  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 600px; gap: 20px; margin: auto 0;">
                    
                    <!-- Left Column: PUMP button and $0.05 badge -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1;">
                      <div style="background-color: #4cd3e3; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; min-width: 80px; text-align: center; box-shadow: 0 2px 4px rgba(76,211,227,0.2);">
                        $0.05
                      </div>
                      <button class="btn" id="blg-pump" style="
                        width: 100px; height: 100px; border-radius: 50% !important;
                        background-color: #4cd3e3; color: #ffffff;
                        font-weight: 700 !important; font-size: 1rem !important;
                        border: none; cursor: pointer;
                        box-shadow: 0 6px 12px rgba(76,211,227,0.3);
                        display: flex; align-items: center; justify-content: center;
                        transition: transform 0.1s, background-color 0.2s;
                        margin: 0;
                      ">
                        PUMP
                      </button>
                    </div>

                    <!-- Center Column: Balloon Canvas -->
                    <div style="display: flex; align-items: center; justify-content: center; flex: 2; position: relative;">
                      <canvas id="blg-canvas" width="280" height="340" style="background:transparent"></canvas>
                    </div>

                    <!-- Right Column: COLLECT button and current earnings badge -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1;">
                      <div id="blg-potential-badge" style="background-color: #43aa8b; color: #ffffff; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 0.9rem; min-width: 80px; text-align: center; box-shadow: 0 2px 4px rgba(67,170,139,0.2); transition: background-color 0.2s;">
                        $0.00
                      </div>
                      <button class="btn" id="blg-bank" disabled style="
                        width: 100px; height: 100px; border-radius: 50% !important;
                        background-color: #43aa8b; color: #ffffff;
                        font-weight: 700 !important; font-size: 1rem !important;
                        border: none; cursor: pointer;
                        box-shadow: 0 6px 12px rgba(67,170,139,0.3);
                        display: flex; align-items: center; justify-content: center;
                        transition: transform 0.1s, background-color 0.2s;
                        margin: 0;
                      ">
                        COLLECT
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    document.getElementById('blg-pump').addEventListener('click', () => this._pump());
    document.getElementById('blg-bank').addEventListener('click', () => this._bank());

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }

    this._drawBalloon(false, false);
  }

  _drawBalloon(popped = false, justBanked = false) {
    const canvas = document.getElementById('blg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2 - 25;
    ctx.clearRect(0, 0, W, H);

    // Rope
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(cx, cy + this.balloonR + 2); ctx.lineTo(cx, H - 20); ctx.stroke();

    if (popped) {
      // Explosion
      ctx.font = '85px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('💥', cx, cy);
      return;
    }
    if (justBanked) {
      ctx.font = '65px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('💰', cx, cy);
      return;
    }

    // Balloon radial gradient based on color
    let color0 = 'rgba(125, 115, 255, 0.95)';
    let color5 = 'rgba(59, 34, 216, 0.9)';
    let color1 = 'rgba(40, 22, 150, 0.85)';
    let shadowColor = 'rgba(59, 34, 216, 0.18)';
    
    if (this.balloonColor === 'red') {
      color0 = 'rgba(254, 202, 202, 0.95)';
      color5 = 'rgba(239, 68, 68, 0.9)';
      color1 = 'rgba(185, 28, 28, 0.85)';
      shadowColor = 'rgba(239, 68, 68, 0.18)';
    } else if (this.balloonColor === 'blue') {
      color0 = 'rgba(191, 219, 254, 0.95)';
      color5 = 'rgba(59, 130, 246, 0.9)';
      color1 = 'rgba(29, 78, 216, 0.85)';
      shadowColor = 'rgba(59, 130, 246, 0.18)';
    } else if (this.balloonColor === 'gold') {
      color0 = 'rgba(253, 230, 138, 0.95)';
      color5 = 'rgba(245, 158, 11, 0.9)';
      color1 = 'rgba(180, 83, 9, 0.85)';
      shadowColor = 'rgba(245, 158, 11, 0.18)';
    }

    const grd = ctx.createRadialGradient(cx - this.balloonR * 0.25, cy - this.balloonR * 0.25, 2, cx, cy, this.balloonR);
    grd.addColorStop(0, color0);
    grd.addColorStop(0.5, color5);
    grd.addColorStop(1, color1);

    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx, cy, this.balloonR, 0, 2 * Math.PI);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Shine highlight
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    ctx.beginPath();
    ctx.ellipse(cx - this.balloonR * 0.28, cy - this.balloonR * 0.3, this.balloonR * 0.22, this.balloonR * 0.14, -0.5, 0, 2 * Math.PI);
    ctx.fill();

    // Knot
    ctx.fillStyle = color1;
    ctx.beginPath(); ctx.arc(cx, cy + this.balloonR - 2, 5, 0, 2 * Math.PI); ctx.fill();
  }

  _pump() {
    if (this.animating || this.finished) return;
    this._clearActionTimer();
    this.pumps++;
    
    // Each pump adds exactly $0.05 (5 points)
    this.currentEarnings = this.pumps * 5;
    this.targetR = Math.min(100, 40 + this.pumps * 3.0); // clean visual bounds inside smaller canvas

    // Update potential badges
    const earnEl = document.getElementById('blg-earn');
    if (earnEl) earnEl.textContent = `$${(this.currentEarnings / 100).toFixed(2)}`;
    
    const potentialBadge = document.getElementById('blg-potential-badge');
    if (potentialBadge) potentialBadge.textContent = `$${(this.currentEarnings / 100).toFixed(2)}`;

    this._updateButtonsState(false, false);

    // Check pop BEFORE animating
    if (this.pumps >= this.popAt) {
      this.animating = true;
      this._animatePop();
      return;
    }

    // Animate growth
    this.animating = true;
    const grow = () => {
      if (!this.el) return;
      if (this.balloonR < this.targetR) {
        this.balloonR += 2;
        this._drawBalloon();
        requestAnimationFrame(grow);
      } else {
        this.balloonR = this.targetR;
        this._drawBalloon();
        this.animating = false;
        this._startActionTimer();
      }
    };
    grow();
  }

  _animatePop() {
    this._clearActionTimer();
    this._drawBalloon(true, false);
    this.popped++;
    
    // Record pop history with color
    this.pumpHistory.push({ pumps: this.pumps, popped: true, color: this.balloonColor });
    
    const lastPopEl = document.getElementById('blg-last-pop');
    if (lastPopEl) {
      const displayAmt = (this.pumps * 0.05).toFixed(2);
      lastPopEl.textContent = `${this.pumps} pumps (Popped: -$${displayAmt})`;
    }

    this.currentEarnings = 0;
    this.cb.onFeedback(false);

    const earnEl = document.getElementById('blg-earn');
    if (earnEl) earnEl.innerHTML = `$0.00 <span style="font-size:0.75rem; color:#ef4444;">(Popped!)</span>`;

    const potentialBadge = document.getElementById('blg-potential-badge');
    if (potentialBadge) potentialBadge.textContent = `$0.00`;

    this._updateButtonsState(true, true);

    setTimeout(() => {
      this.animating = false;
      this._newRound();
    }, 1500);
  }

  _bank() {
    if (this.animating || this.pumps === 0 || this.finished) return;
    this._clearActionTimer();
    this.bankTotal += this.currentEarnings;
    this.score = this.bankTotal;
    this.pumpHistory.push({ pumps: this.pumps, popped: false, earned: this.currentEarnings, color: this.balloonColor });
    
    const lastPopEl = document.getElementById('blg-last-pop');
    if (lastPopEl) {
      const displayAmt = (this.currentEarnings / 100).toFixed(2);
      lastPopEl.textContent = `${this.pumps} pumps (Collected: +$${displayAmt})`;
    }

    this.cb.onScore(this.currentEarnings, this.round);
    this.cb.onFeedback(true);

    this._drawBalloon(false, true);
    
    const totalEl = document.getElementById('blg-total');
    if (totalEl) totalEl.textContent = `$${(this.bankTotal / 100).toFixed(2)}`;

    const potentialBadge = document.getElementById('blg-potential-badge');
    if (potentialBadge) potentialBadge.textContent = `$0.00`;

    this._updateButtonsState(true, true);
    this.banked++;

    setTimeout(() => this._newRound(), 1000);
  }

  _finish() {
    this._clearActionTimer();
    this.finished = true;
    const avgPumps = this.pumpHistory.length > 0
      ? this.pumpHistory.reduce((a, b) => a + b.pumps, 0) / this.pumpHistory.length : 0;
    const popRate = this.popped / this.totalRounds;

    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🎈</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Balloon Game Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Avg pumps per balloon: <strong>${avgPumps.toFixed(1)}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Pop rate: <strong>${Math.round(popRate * 100)}%</strong> &nbsp;|&nbsp; Banked: <strong>$${(this.bankTotal / 100).toFixed(2)}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">$${(this.bankTotal / 100).toFixed(2)}</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: Math.round((1 - popRate) * 100),
        avgTime: Math.round(avgPumps * 10) * 100,
        correct: this.banked, total: this.totalRounds, level: this.level
      });
    }, 2000);
  }

  timeUp() { this._finish(); }
  destroy() { 
    this._clearActionTimer();
    this.el = null; 
  }
}

window.BalloonGame = BalloonGame;
