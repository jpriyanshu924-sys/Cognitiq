/* ══════════════════════════════════════════════════════
   Pymetrics Game 5: Hard or Easy Task
   Measures: Effort, motivation, risk/reward calibration
   Real equivalent: Effort Discounting Task
══════════════════════════════════════════════════════ */
class HardEasyGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.round = 0; this.totalRounds = 10;
    this.level = 1; this.choices = []; // log decisions
    this.el = null; this.taskPhase = false; this.locked = false;
    this._timers = [];
    this.motivation = 60;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'he-game';
    this.container.appendChild(this.el);
    this._nextRound();
  }

  _nextRound() {
    if (this.round >= this.totalRounds) { this._finish(); return; }
    this.round++;
    this.locked = false;
    this._showChoice();
  }

  _showChoice() {
    if (!this.el) return;

    // Generate two options with varying effort/reward trade-offs (scaled to pts)
    const easyReward = 100 + Math.floor(Math.random() * 200);
    const hardReward = easyReward * 3 + Math.floor(Math.random() * 400);
    const easyEffort = 10 + Math.floor(Math.random() * 10);
    const hardEffort = 40 + Math.floor(Math.random() * 20);

    const motivationStatus = this.motivation >= 75 ? 'High' : this.motivation >= 40 ? 'Medium' : 'Low';

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Decision Round ${this.round} of ${this.totalRounds}</span>
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
            <div class="ap-he-container">
              
              <!-- Header Title Block -->
              <div class="ap-he-title-block">
                <span class="ap-he-main-title">Effort vs Reward</span>
                <p class="ap-he-main-sub">Evaluate your current capacity. Choose a task based on the effort you are willing to expend versus the potential reward gain.</p>
              </div>

              <!-- Motivation Card -->
              <div class="ap-he-state-card">
                <div class="ap-he-state-header">
                  <span class="ap-he-state-title">Current State / Motivation Level</span>
                  <span class="ap-he-state-val" style="color: ${this.motivation >= 75 ? '#005d50' : this.motivation >= 40 ? '#2563eb' : '#dc2626'}">${motivationStatus}</span>
                </div>
                <div class="ap-he-mot-bar-bg">
                  <div class="ap-he-mot-bar-fill" style="width: ${this.motivation}%; background-color: ${this.motivation >= 75 ? '#005d50' : this.motivation >= 40 ? '#3b22d8' : '#ef4444'}"></div>
                </div>
                <div class="ap-he-state-labels">
                  <span>Fatigued</span>
                  <span>Driven</span>
                </div>
              </div>

              <!-- Choice Grid -->
              <div class="ap-he-grid">
                
                <!-- Easy Task Card -->
                <div class="ap-he-card">
                  <div class="ap-he-icon-box easy">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5.5 5.5 0 0 0 12.5 2.5C9.5 2.5 7 5 7 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/></svg>
                  </div>
                  
                  <span class="ap-he-card-title">Easy Task</span>
                  <span class="ap-he-tag easy">Safe Choice</span>
                  
                  <div class="ap-he-row" style="margin-top: auto">
                    <span>Potential Reward</span>
                    <span class="ap-he-val-blue">${easyReward} pts</span>
                  </div>
                  
                  <div class="ap-he-row">
                    <span>Required Effort</span>
                    <span class="ap-he-val-bold">${easyEffort} clicks</span>
                  </div>
                  
                  <button class="btn ap-he-btn-outline" data-diff="easy" data-reward="${easyReward}" data-effort="${easyEffort}">
                    Select Task
                  </button>
                </div>

                <!-- Hard Task Card -->
                <div class="ap-he-card">
                  <span class="ap-he-badge-top-right">BONUS +10%</span>
                  
                  <div class="ap-he-icon-box hard">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4.5 16.5c-1.5 1.26-2 3-2 3s1.74-.5 3-2L19.5 3.5a2.12 2.12 0 0 0-3-3L4.5 16.5zM13 5l6 6M9 9l6 6M6.5 11.5l6 6M9 15h3M9 15v3"/></svg>
                  </div>
                  
                  <span class="ap-he-card-title">Hard Task</span>
                  <span class="ap-he-tag hard">High Growth</span>
                  
                  <div class="ap-he-row" style="margin-top: auto">
                    <span>Potential Reward</span>
                    <span class="ap-he-val-orange">${hardReward} pts</span>
                  </div>
                  
                  <div class="ap-he-row">
                    <span>Required Effort</span>
                    <span class="ap-he-val-bold">${hardEffort} clicks</span>
                  </div>
                  
                  <button class="btn ap-he-btn-solid" data-diff="hard" data-reward="${hardReward}" data-effort="${hardEffort}">
                    Accept Challenge
                  </button>
                </div>

              </div>

            </div>
          </main>
        </div>
      </div>`;

    this.el.querySelectorAll('.btn').forEach(opt => {
      opt.addEventListener('click', (e) => {
        if (this.locked) return;
        this.locked = true;
        
        const diff = opt.dataset.diff;
        if (!diff) return; // Ignore Save & Exit button clicks
        
        const reward = parseInt(opt.dataset.reward);
        const effort = parseInt(opt.dataset.effort);
        
        // Update Motivation level
        if (diff === 'hard') {
          this.motivation = Math.min(100, this.motivation + 10);
        } else {
          this.motivation = Math.max(10, this.motivation - 8);
        }

        this.choices.push({ diff, reward, effort, round: this.round });
        this._runTask(diff, reward, effort);
      });
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _runTask(diff, reward, effort) {
    if (!this.el) return;
    let pressed = 0;
    const startTime = Date.now();

    const updateUI = () => {
      const pct = (pressed / effort) * 100;
      const progEl = document.getElementById('he-task-prog');
      const countEl = document.getElementById('he-task-count');
      if (progEl) progEl.style.width = `${pct}%`;
      if (countEl) countEl.textContent = `${pressed} / ${effort}`;
    };

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Performing Round ${this.round}</span>
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
              <div class="ap-kp-card" id="he-press-btn" style="min-height: 520px; max-width: 500px">
                
                <!-- Card Header -->
                <div class="ap-kp-header">
                  <span class="ap-kp-title">${diff === 'hard' ? '💪 Hard Challenge' : '😌 Easy Challenge'}</span>
                  <div class="ap-kp-status-badge" style="background-color:#fff7ed;color:#ea580c">
                    Reward: ${reward} pts
                  </div>
                </div>

                <!-- Signal Light Center -->
                <div class="ap-kp-signal-container" style="margin-bottom: 20px">
                  <div class="ap-kp-signal-circle go" style="width: 140px; height: 140px; margin-bottom: 24px">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  </div>
                  
                  <div class="ap-kp-instr-title" style="font-size: 1.25rem">Mash SPACE as fast as you can!</div>
                  <div class="ap-kp-instr-sub" style="margin-bottom: 20px">
                    Required: <span class="ap-kp-key-box">${effort} clicks</span>
                  </div>
                </div>

                <!-- Click Progress -->
                <div style="width: 100%; display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: 700; color: #6b7280; margin-bottom: 8px; letter-spacing: 0.04em">
                  <span>CLICK PROGRESS</span>
                  <span style="color: #3b22d8" id="he-task-count">0 / ${effort}</span>
                </div>
                <div class="ap-progress-bar-bg" style="width: 100%; height: 8px; background-color: #e5e7eb; margin-bottom: 20px">
                  <div class="ap-progress-bar-fill" id="he-task-prog" style="width: 0%; background-color: #3b22d8; transition: width 0.1s"></div>
                </div>

                <div style="font-size:0.75rem; color:#6b7280; text-align:center">Tap anywhere on the card or press SPACE to click</div>

              </div>

            </div>
          </main>
        </div>
      </div>`;

    const doPress = () => {
      if (pressed >= effort || !this.el) return;
      pressed++;
      updateUI();
      
      const circle = this.el.querySelector('.ap-kp-signal-circle');
      if (circle) {
        circle.style.transform = 'scale(0.94)';
        setTimeout(() => { if (circle) circle.style.transform = ''; }, 80);
      }

      if (pressed >= effort) {
        this._completeTask(reward, diff, Date.now() - startTime);
      }
    };

    const kd = e => { if (e.code === 'Space') { e.preventDefault(); doPress(); } };
    window.addEventListener('keydown', kd);
    document.getElementById('he-press-btn')?.addEventListener('click', doPress);

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }

    // Store cleanup
    this._taskKd = kd;
    this._taskCleanup = () => window.removeEventListener('keydown', kd);
  }

  _completeTask(reward, diff, timeTaken) {
    if (this._taskCleanup) this._taskCleanup();
    const pts = reward;
    this.score += pts;
    this.cb.onScore(pts, this.round);
    this.cb.onFeedback(true);

    if (!this.el) return;
    
    this.el.innerHTML = `
      <div style="text-align:center;padding:60px">
        <div style="font-size:3.5rem;margin-bottom:16px">💰</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px;color:#059669">+${reward} pts earned!</h3>
        <p style="color:var(--muted);margin-top:8px">Completed in ${(timeTaken / 1000).toFixed(1)}s</p>
      </div>`;

    const t = setTimeout(() => this._nextRound(), 1200);
    this._timers.push(t);
  }

  _finish() {
    const hardChosen = this.choices.filter(c => c.diff === 'hard').length;
    const effortScore = Math.round((hardChosen / Math.max(1, this.choices.length)) * 100);

    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">⚡</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Effort Task Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Hard tasks chosen: <strong>${hardChosen}/${this.totalRounds}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Effort score: <strong>${effortScore}%</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score, accuracy: effortScore,
        avgTime: 0, correct: hardChosen, total: this.totalRounds, level: this.level
      });
    }, 2000);
  }

  timeUp() {
    this._timers.forEach(clearTimeout);
    if (this._taskCleanup) this._taskCleanup();
    this._finish();
  }

  destroy() {
    this._timers.forEach(clearTimeout);
    if (this._taskCleanup) this._taskCleanup();
    this.el = null;
  }
}

window.HardEasyGame = HardEasyGame;


