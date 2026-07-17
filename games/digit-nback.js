/* ══════════════════════════════════════════════════════
   Aon Assessment 3: Digit Challenge (N-back)
   Measures: Working memory, processing speed, cognitive control
   Based on: Aon smartPredict Digit Challenge (N-back task)
   ══════════════════════════════════════════════════════ */
class DigitNBackGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.level = 1; // N-back value (N = 1, 2, or 3)
    this.history = [];
    this.el = null;
    this._timers = [];
    this._kd = null;
    this.currentDigit = null;
    this.isMatch = false;
    this.userMatched = false;
    this.trialDuration = 1400; // ms per digit (starting value)
    this.trialCount = 0;
    this.maxTrials = 40;
    this.hasResponded = false;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'nback-game';
    this.container.appendChild(this.el);
    this._renderShell();
    this._startInstructions();
  }

  _renderShell() {
    if (!this.el) return;
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num" id="nb-level-val">${this.level}-Back</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Digit Challenge</h2>
                  <span style="font-size:0.85rem; color:#4b5563">N-Back Working Memory</span>
                </div>
                <div style="display:flex; gap:16px">
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">PROGRESS</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#0284c7" id="nb-prog-val">0/${this.maxTrials}</div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c" id="nb-score-val">${this.score}</div>
                  </div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Memory Match</div>
                <div class="ap-spin-badge" id="nb-badge" style="align-self:center; margin-bottom: 24px; background-color:#eff6ff; color:#3b22d8">
                  ${this.level}-Back Match
                </div>
                
                <!-- Digit Display / Instruction box -->
                <div class="nb-nback-box" id="nb-box" style="width:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:180px; margin-bottom:28px">
                  <div class="nb-instructions">
                    <p style="font-size:0.88rem; color:#4b5563; line-height:1.6; max-width:340px; margin: 0 auto 20px">
                      Remember the sequence of digits. Click <strong>MATCH</strong> (or press <strong>SPACE</strong>) if the digit matches the one shown <strong><span id="nb-instr-n">${this.level}</span> step(s) ago</strong>.
                    </p>
                    <button class="btn ap-btn-confirm" id="nb-start-btn" style="margin: 0 auto">Start Game</button>
                  </div>
                </div>

                <!-- Match Control -->
                <div class="nb-controls" style="display:none; width:100%; justify-content:center" id="nb-control-panel">
                  <button class="btn ap-tow-btn-submit" id="nb-match-click" style="width:100%; max-width:240px; margin:0">MATCH [SPACE]</button>
                </div>
              </div>

              <!-- Footer Row with progress bar -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ N-Back Rules</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    For 1-Back, match current to immediate previous. For 2-Back, match current to 2 steps previous.
                  </div>
                </div>
                <div class="ap-tow-footer-card">
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:#6b7280; margin-bottom:6px; letter-spacing:0.04em">
                    <span>ROUND PROGRESS</span>
                    <span style="color:#059669" id="nb-prog-lbl">0%</span>
                  </div>
                  <div class="ap-progress-bar-bg" style="width:100%"><div class="ap-progress-bar-fill" id="nb-prog-fill" style="width:0%; background-color:#059669"></div></div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    document.getElementById('nb-start-btn').addEventListener('click', () => {
      document.getElementById('nb-control-panel').style.display = 'flex';
      this._startTrialLoop();
    });

    this._kd = e => {
      if (e.code === 'Space') {
        e.preventDefault();
        this._handleMatchInput();
      }
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

  _startInstructions() {}

  _startTrialLoop() {
    this.history = [];
    this.trialCount = 0;
    this._nextTrial();
  }

  _nextTrial() {
    if (this.trialCount >= this.maxTrials) {
      this._finish();
      return;
    }

    this.trialCount++;
    this.hasResponded = false;
    this.userMatched = false;

    // Update progress elements
    document.getElementById('nb-prog-val').textContent = `${this.trialCount}/${this.maxTrials}`;
    document.getElementById('nb-prog-fill').style.width = `${(this.trialCount / this.maxTrials) * 100}%`;
    const progLbl = document.getElementById('nb-prog-lbl');
    if (progLbl) progLbl.textContent = `${Math.round((this.trialCount / this.maxTrials) * 100)}%`;

    // Adjust N-Back Level based on accuracy/streak
    if (this.streak >= 6 && this.level < 3) {
      this.level++;
      this.streak = 0;
      this._showLevelSwitchAlert();
      return;
    } else if (this.streak <= -3 && this.level > 1) {
      this.level--;
      this.streak = 0;
      this._showLevelSwitchAlert();
      return;
    }

    document.getElementById('nb-level-val').textContent = `${this.level}-Back`;

    // Generate next digit
    let digit;
    const matchChance = 0.35;
    if (this.history.length >= this.level && Math.random() < matchChance) {
      digit = this.history[this.history.length - this.level];
    } else {
      do {
        digit = Math.floor(Math.random() * 9) + 1;
      } while (this.history.length >= this.level && digit === this.history[this.history.length - this.level] && Math.random() > 0.1);
    }

    this.currentDigit = digit;
    this.history.push(digit);

    // Determine if it is a match
    if (this.history.length > this.level) {
      const prevVal = this.history[this.history.length - 1 - this.level];
      this.isMatch = (digit === prevVal);
    } else {
      this.isMatch = false;
    }

    // Display digit
    const box = document.getElementById('nb-box');
    if (box) {
      box.innerHTML = `<div class="nb-digit-display" style="font-size:7rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${digit}</div>`;
      box.className = 'nb-nback-box nb-active-display';
    }

    // Reset button style
    const matchBtn = document.getElementById('nb-match-click');
    if (matchBtn) {
      matchBtn.style.backgroundColor = '';
      matchBtn.style.borderColor = '';
      matchBtn.style.color = '';
      matchBtn.onclick = () => this._handleMatchInput();
    }

    // Trial duration timer: dynamically speeds up based on streak down to 800ms
    const speedFactor = Math.max(0, Math.min(5, this.streak > 0 ? this.streak : 0));
    const currentDuration = Math.max(800, 1400 - speedFactor * 120);
    const t = setTimeout(() => {
      this._evaluateTrialEnd();
    }, currentDuration);
    this._timers.push(t);
  }

  _showLevelSwitchAlert() {
    const box = document.getElementById('nb-box');
    if (box) {
      box.innerHTML = `<div class="nb-switch-alert" style="font-size:1.6rem; font-weight:800; color:#ea580c">⚡ SHIFTING TO ${this.level}-BACK!</div>`;
    }
    const badge = document.getElementById('nb-badge');
    if (badge) {
      badge.textContent = `${this.level}-Back Match`;
    }
    const t = setTimeout(() => this._nextTrial(), 1200);
    this._timers.push(t);
  }

  _handleMatchInput() {
    if (this.hasResponded || this.history.length <= this.level) return;
    this.hasResponded = true;
    this.userMatched = true;

    const matchBtn = document.getElementById('nb-match-click');
    if (this.isMatch) {
      matchBtn.style.backgroundColor = '#10b981';
      matchBtn.style.borderColor = '#10b981';
      matchBtn.style.color = '#ffffff';
      this.correct++;
      this.streak = Math.max(1, this.streak + 1);
      const pts = 100 * this.level + (this.streak * 5);
      this.score += pts;
      this.cb.onScore(pts, this.streak);
      this.cb.onFeedback(true);
      document.getElementById('nb-score-val').textContent = this.score;
    } else {
      matchBtn.style.backgroundColor = '#ef4444';
      matchBtn.style.borderColor = '#ef4444';
      matchBtn.style.color = '#ffffff';
      this.streak = Math.min(-1, this.streak - 1);
      this.cb.onFeedback(false);
    }
  }

  _evaluateTrialEnd() {
    if (this.isMatch && !this.userMatched) {
      this.streak = Math.min(-1, this.streak - 1);
      this.cb.onFeedback(false);
    }
    if (!this.isMatch && !this.userMatched) {
      this.correct++;
    }

    this.total++;
    const box = document.getElementById('nb-box');
    if (box) {
      box.className = 'nb-nback-box';
      box.innerHTML = `<div class="nb-digit-blank" style="font-size:6rem; color:#cbd5e1; font-weight:800">·</div>`;
    }

    const t = setTimeout(() => this._nextTrial(), 300);
    this._timers.push(t);
  }

  _finish() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this._timers.forEach(clearTimeout);
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: 0,
      correct: this.correct,
      total: this.total,
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
window.DigitNBackGame = DigitNBackGame;
