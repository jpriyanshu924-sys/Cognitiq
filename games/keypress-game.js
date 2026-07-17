/* ══════════════════════════════════════════════════════
   Pymetrics Game 4: Keypress Game
   Measures: Impulsivity, inhibition, following instructions
   Real equivalent: Pymetrics Keypress / Sustained Attention
══════════════════════════════════════════════════════ */
class KeypressGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.presses = 0; this.level = 1;
    this.phase = 'go'; // 'go' | 'stop' | 'wait'
    this.phaseStart = 0; this.el = null;
    this._kd = null; this._phases = []; this._phaseIdx = 0;
    this._phaseTimer = null; this._frameId = null;
    this.totalPresses = 0; this.correctPresses = 0; this.wrongPresses = 0;
    this.pressTimes = []; this.finished = false;
  }

  start() {
    this._startTime = Date.now();
    this.el = document.createElement('div');
    this.el.className = 'kp-game';
    this.container.appendChild(this.el);

    // Build phase schedule: alternating GO and STOP phases
    this._buildPhases();
    this._render();
    setTimeout(() => this._runPhases(), 1000);
  }

  _buildPhases() {
    // Mix of press-as-fast-as-you-can (GO) and stop (NO-GO) phases
    const schedule = [];
    for (let i = 0; i < 8; i++) {
      schedule.push({ type: 'go', dur: 2000 + Math.random() * 1500 });
      if (i < 7) schedule.push({ type: 'stop', dur: 800 + Math.random() * 700 });
    }
    this._phases = schedule;
    this._phaseIdx = 0;
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
            <span class="ap-question-num">Sustained Attention Task</span>
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
            <div class="ap-kp-wrapper">
              
              <!-- Clean White Card -->
              <div class="ap-kp-card" id="kp-game-card">
                
                <!-- Card Header -->
                <div class="ap-kp-header">
                  <div class="ap-kp-title-box">
                    <div class="ap-kp-icon-badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    </div>
                    <span class="ap-kp-title">Keypress Challenge</span>
                  </div>
                  
                  <div class="ap-kp-status-badge">
                    <span style="color:#10b981">●</span> LIVE SESSION
                  </div>
                </div>

                <!-- Signal Light Center -->
                <div class="ap-kp-signal-container">
                  <div class="ap-kp-signal-circle" id="kp-signal-circle">
                    <!-- Icon inserted dynamically -->
                  </div>
                  
                  <div class="ap-kp-instr-title" id="kp-instr-title">Wait for Signal...</div>
                  <div class="ap-kp-instr-sub" id="kp-instr-sub">
                    Press <span class="ap-kp-key-box">SPACE</span> when green, <span style="color:#ef4444;font-weight:700">WAIT</span> when red.
                  </div>
                </div>

                <!-- Bottom Indicators -->
                <div class="ap-kp-indicators">
                  <div class="ap-kp-ind-item" id="kp-ind-press">
                    <div class="ap-kp-ind-circle press">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <span class="ap-kp-ind-lbl press">Press</span>
                  </div>
                  
                  <div class="ap-kp-ind-item" id="kp-ind-wait">
                    <div class="ap-kp-ind-circle wait">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A2 2 0 1 1 22 8v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L9 15V4a2 2 0 1 1 4 0v7M14 3a2 2 0 0 1 4 0v8"/></svg>
                    </div>
                    <span class="ap-kp-ind-lbl wait">Wait</span>
                  </div>
                </div>

              </div>

            </div>
          </main>
        </div>
      </div>`;

    this._kd = e => {
      if (e.code === 'Space') { e.preventDefault(); this._press(); }
    };
    window.addEventListener('keydown', this._kd);
    
    // Tap/click triggers press
    document.getElementById('kp-game-card')?.addEventListener('click', () => this._press());

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from triggering a press
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _runPhases() {
    if (this._phaseIdx >= this._phases.length || this.finished || !this.el) {
      this._finish();
      return;
    }

    const phase = this._phases[this._phaseIdx];
    this.phase = phase.type;
    this.phaseStart = Date.now();
    this._updateSignal();

    const elapsed = (Date.now() - this._startTime) / 1000;
    const timeSpeedFactor = 1.0 + (elapsed / 20.0);
    const duration = phase.dur / timeSpeedFactor;

    this._phaseTimer = setTimeout(() => {
      this._phaseIdx++;
      this._runPhases();
    }, duration);
  }

  _updateSignal() {
    const circle = document.getElementById('kp-signal-circle');
    const title = document.getElementById('kp-instr-title');
    const sub = document.getElementById('kp-instr-sub');
    const pressInd = document.getElementById('kp-ind-press');
    const waitInd = document.getElementById('kp-ind-wait');
    if (!circle || !title || !sub) return;

    if (this.phase === 'go') {
      circle.className = 'ap-kp-signal-circle go';
      circle.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
      title.textContent = 'GO! PRESS NOW!';
      title.style.color = '#10b981';
      sub.innerHTML = `Press <span class="ap-kp-key-box">SPACE</span> as fast as you can.`;
      
      if (pressInd) pressInd.classList.add('active');
      if (waitInd) waitInd.classList.remove('active');
    } else {
      circle.className = 'ap-kp-signal-circle stop';
      circle.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L9 15V4a2 2 0 1 1 4 0v7M14 3a2 2 0 0 1 4 0v8"></path>
        </svg>`;
      title.textContent = 'STOP! DO NOT PRESS!';
      title.style.color = '#ef4444';
      sub.innerHTML = `<span style="color:#ef4444;font-weight:700">WAIT</span> until the signal changes.`;
      
      if (waitInd) waitInd.classList.add('active');
      if (pressInd) pressInd.classList.remove('active');
    }
  }

  _press() {
    if (!this.el || this.finished) return;
    this.totalPresses++;
    this.presses++;
    const rt = Date.now() - this.phaseStart;

    // Small scale feedback animation on press
    const circle = document.getElementById('kp-signal-circle');
    if (circle) {
      circle.style.transform = 'scale(0.95)';
      setTimeout(() => { if (circle) circle.style.transform = ''; }, 100);
    }

    if (this.phase === 'go') {
      this.correctPresses++;
      this.pressTimes.push(rt);
      const spd = Math.max(0, Math.floor((800 - rt) / 8));
      const pts = 5 + spd;
      this.score += pts;
      this.cb.onScore(pts, 0);
    } else {
      // Wrong press during STOP
      this.wrongPresses++;
      this.score = Math.max(0, this.score - 40);
      this.cb.onFeedback(false);
    }
  }

  _finish() {
    this.finished = true;
    clearTimeout(this._phaseTimer);
    if (this._frameId) cancelAnimationFrame(this._frameId);
    const acc = this.totalPresses > 0 ? (this.correctPresses / this.totalPresses) * 100 : 0;
    const avgRt = this.pressTimes.length > 0 ? this.pressTimes.reduce((a, b) => a + b, 0) / this.pressTimes.length : 0;

    if (!this.el) return;
    
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">⌨️</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Keypress Challenge Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Correct Presses: <strong>${this.correctPresses}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Accuracy: <strong>${Math.round(acc)}%</strong> &nbsp;|&nbsp; Avg RT: <strong>${Math.round(avgRt)}ms</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score, accuracy: acc, avgTime: avgRt,
        correct: this.correctPresses, total: this.totalPresses, level: this.level
      });
    }, 2000);
  }

  timeUp() {
    this._finish();
  }

  destroy() {
    clearTimeout(this._phaseTimer);
    if (this._frameId) cancelAnimationFrame(this._frameId);
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this.el = null;
  }
}

window.KeypressGame = KeypressGame;
