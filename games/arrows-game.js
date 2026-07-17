/* ══════════════════════════════════════════════════════
   Pymetrics / Arctic Shores: Arrows Game
   Measures: Cognitive flexibility, attention control, task-switching
   Pymetrics: Color-based direction rule switching (Blue=Same, Red=Opposite)
   Arctic Shores: Flanker Task (ignore vertical distractors around center arrow)
══════════════════════════════════════════════════════ */
class ArrowsGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.times = []; this.level = 1;
    this.locked = false; this.el = null;
    this._kd = null; this._showTimer = null;
    this._responseTimeout = null;
    this.gameStartTime = 0;

    // Detect game mode from callback name
    const name = (this.cb && this.cb.name) ? this.cb.name : 'Arrows';
    this.isColorRuleMode = !name.toLowerCase().includes('direction');
    
    // Color-Rule mode state
    this.activeRule = 'same'; // 'same' | 'opposite'
    this.trialsSinceSwitch = 0;
  }

  start() {
    this.gameStartTime = Date.now();
    this.el = document.createElement('div');
    this.el.className = 'arr-game';
    this.container.appendChild(this.el);
    this._render();
    setTimeout(() => this._next(), 600);
  }

  _rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  _gen() {
    const centerDir = this._rand(['left', 'right']);

    if (this.isColorRuleMode) {
      // Pymetrics Mode: Rule switches periodically every 6 trials
      this.trialsSinceSwitch++;
      if (this.trialsSinceSwitch >= 6) {
        this.trialsSinceSwitch = 0;
        this.activeRule = this.activeRule === 'same' ? 'opposite' : 'same';
        this._flashRuleSwitched();
      }
      return { arrows: [centerDir], centerDir, rule: this.activeRule, congruent: true };
    } else {
      // Arctic Shores Mode: Flanker Task (center focus, vertical distractors)
      const flankerDir = this.level >= 2
        ? (Math.random() < 0.5 ? centerDir : (centerDir === 'left' ? 'right' : 'left'))
        : centerDir;

      const numFlankers = 2;
      const arrows = [];
      for (let i = 0; i < numFlankers; i++) arrows.push(flankerDir);
      arrows.push(centerDir); // center
      for (let i = 0; i < numFlankers; i++) arrows.push(flankerDir);

      const congruent = centerDir === flankerDir;
      return { arrows, centerDir, congruent };
    }
  }

  _arrowChar(dir) { return dir === 'left' ? '←' : '→'; }

  _flashRuleSwitched() {
    const flashEl = document.createElement('div');
    flashEl.style.cssText = `
      position: absolute;
      top: 30%; left: 50%; transform: translate(-50%, -50%);
      background: rgba(15, 23, 42, 0.95);
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 1.1rem;
      z-index: 1000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      pointer-events: none;
      animation: ruleFlash 0.8s ease-out forwards;
    `;
    flashEl.textContent = '⚡ RULE SWITCHED!';
    
    // Inject style keyframes if not present
    if (!document.getElementById('rule-flash-style')) {
      const style = document.createElement('style');
      style.id = 'rule-flash-style';
      style.textContent = `
        @keyframes ruleFlash {
          0% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -60%) scale(0.95); }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.el.appendChild(flashEl);
    setTimeout(() => flashEl.remove(), 800);
  }

  _render() {
    if (!this.el) return;
    const title = (this.cb && this.cb.name) ? this.cb.name : (this.isColorRuleMode ? 'Arrows Game' : 'Arrow Directions');
    const instructionHtml = this.isColorRuleMode
      ? `Observe the card background color rule:
         <div style="margin-top: 8px; font-size: 0.85rem;">
           <span style="background:#eff6ff; color:#1e3a8a; padding:3px 8px; border-radius:4px; border:1px solid #bfdbfe; font-weight:700">BLUE card</span>: Click arrow direction
           <span style="background:#fef2f2; color:#991b1b; padding:3px 8px; border-radius:4px; border:1px solid #fecaca; margin-left:8px; font-weight:700">RED card</span>: Click OPPOSITE direction
         </div>`
      : `Which way does the <span style="color:#3b22d8; font-weight:700">CENTRE</span> arrow point? Ignore vertical distractors.`;

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">${title}</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">${title}</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong id="arr-level-val">${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.75rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)" id="arr-score-val">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" id="arr-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center; transition: all 0.3s ease;">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Attention Switch</div>
                <div class="ap-spin-badge" id="arr-type" style="align-self:center; margin-bottom: 28px">—</div>
                
                <div style="font-size:1.05rem; font-weight:700; color:#111827; margin-bottom:24px; line-height:1.5;" id="arr-instructions">${instructionHtml}</div>
                
                <div class="arr-display" id="arr-display" style="font-size:4.5rem; letter-spacing:8px; font-weight:800; margin-bottom:40px; height:80px; display:flex; align-items:center; justify-content:center">
                  <span class="arr-placeholder" style="color:#cbd5e1">●</span>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; width:100%; max-width:320px; margin:0 auto">
                  <button class="btn ap-he-btn-outline" style="margin-top:0; padding:16px 0; font-size:1.1rem !important; cursor:pointer;" id="arr-left" data-dir="left">← Left</button>
                  <button class="btn ap-he-btn-outline" style="margin-top:0; padding:16px 0; font-size:1.1rem !important; cursor:pointer;" id="arr-right" data-dir="right">Right →</button>
                </div>

                <div style="font-size:0.75rem; color:#6b7280; margin-top:28px">
                  Press <span class="ap-kp-key-box">←</span> or <span class="ap-kp-key-box">→</span> arrow keys to answer
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Selective Attention Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    ${this.isColorRuleMode ? 'Blue cards require matching the arrow direction. Red cards require pressing the opposite direction.' : 'Focus solely on the middle arrow. Conflicting arrows on the side (incongruent) will test your cognitive control.'}
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Correct</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669" id="arr-correct-count">${this.correct}</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Streak</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c" id="arr-streak-count">${this.streak}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    document.getElementById('arr-left').addEventListener('click', () => this._pick('left'));
    document.getElementById('arr-right').addEventListener('click', () => this._pick('right'));

    this._kd = e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); this._pick('left'); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this._pick('right'); }
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

  _next() {
    if (!this.el) return;
    this.locked = false;
    const puzzle = this._gen();
    this._cur = puzzle;
    this._t0 = Date.now();

    const cardEl = document.getElementById('arr-card');
    const disp = document.getElementById('arr-display');
    const typeTag = document.getElementById('arr-type');
    if (!disp) return;

    // Flash blank first, then show arrows
    disp.innerHTML = '<span class="arr-placeholder" style="color:#cbd5e1">●</span>';
    disp.className = 'arr-display arr-blank';

    // Style card background for Color-Rule mode
    if (this.isColorRuleMode && cardEl) {
      if (puzzle.rule === 'same') {
        cardEl.style.backgroundColor = '#eff6ff'; // blue shade
        cardEl.style.borderColor = '#bfdbfe';
      } else {
        cardEl.style.backgroundColor = '#fef2f2'; // red shade
        cardEl.style.borderColor = '#fecaca';
      }
    }

    const elapsed = (Date.now() - this.gameStartTime) / 1000;
    const flashDelay = Math.max(300, (2005 - this.level * 300) - Math.floor(elapsed / 15) * 180);

    clearTimeout(this._showTimer);
    this._showTimer = setTimeout(() => {
      if (!this.el) return;

      if (this.isColorRuleMode) {
        // Single central arrow
        const dir = puzzle.centerDir;
        disp.innerHTML = `<span class="arr-arrow" style="color:#3b22d8; font-weight:800; text-shadow:0 4px 12px rgba(59,34,216,0.2)">${this._arrowChar(dir)}</span>`;
      } else {
        // Flanker sequence
        disp.innerHTML = puzzle.arrows.map((dir, i) => {
          const isCenter = i === Math.floor(puzzle.arrows.length / 2);
          return `<span class="arr-arrow" style="color:${isCenter ? '#3b22d8' : '#cbd5e1'}; font-weight:800; text-shadow:${isCenter ? '0 4px 12px rgba(59,34,216,0.2)' : 'none'}">${this._arrowChar(dir)}</span>`;
        }).join('');
      }
      
      disp.className = 'arr-display arr-showing';
      this._t0 = Date.now(); // start timing from when arrows appear

      // Start response timeout: decreases from 1350ms down to 600ms
      const timeoutLimit = Math.max(600, 1350 - Math.floor(elapsed / 15) * 150);
      clearTimeout(this._responseTimeout);
      this._responseTimeout = setTimeout(() => {
        this._timeoutMiss();
      }, timeoutLimit);
    }, flashDelay);

    if (typeTag) {
      if (this.isColorRuleMode) {
        typeTag.textContent = puzzle.rule === 'same' ? '✓ Same Direction' : '⚡ Opposite Direction';
        typeTag.style.color = puzzle.rule === 'same' ? '#2563eb' : '#dc2626';
        typeTag.style.backgroundColor = puzzle.rule === 'same' ? '#dbeafe' : '#fee2e2';
      } else {
        typeTag.textContent = puzzle.congruent ? '✓ Congruent' : '⚡ Incongruent';
        typeTag.style.color = puzzle.congruent ? '#059669' : '#ea580c';
        typeTag.style.backgroundColor = puzzle.congruent ? '#ecfdf5' : '#fff7ed';
      }
    }

    // Reset button states
    ['arr-left', 'arr-right'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.className = 'btn ap-he-btn-outline';
        btn.style.borderColor = '';
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }
    });
  }

  _pick(dir) {
    if (this.locked || !this._cur || !this.el) return;
    this.locked = true;
    clearTimeout(this._responseTimeout);

    const rt = Date.now() - this._t0;
    this.times.push(rt);
    this.total++;

    // Determine correct choice direction
    let correctDir = this._cur.centerDir;
    if (this.isColorRuleMode && this._cur.rule === 'opposite') {
      correctDir = this._cur.centerDir === 'left' ? 'right' : 'left';
    }

    const ok = dir === correctDir;
    const btnId = dir === 'left' ? 'arr-left' : 'arr-right';
    const correctId = correctDir === 'left' ? 'arr-left' : 'arr-right';

    const btn = document.getElementById(btnId);
    const correctBtn = document.getElementById(correctId);

    if (ok) {
      if (btn) {
        btn.style.backgroundColor = '#10b981';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#10b981';
      }
      this.correct++; this.streak++;
      if (this.correct % 8 === 0) this.level = Math.min(3, this.level + 1);

      const ruleBonus = (this.isColorRuleMode && this._cur.rule === 'opposite') || (!this.isColorRuleMode && !this._cur.congruent) ? 30 : 0;
      const spdBonus = Math.max(0, Math.floor((1200 - rt) / 15));
      const strBonus = this.streak >= 5 ? this.streak * 10 : 0;
      const pts = 60 + spdBonus + ruleBonus + strBonus;
      this.score += pts;
      this.cb.onScore(pts, this.streak);
      this.cb.onFeedback(true);
    } else {
      if (btn) {
        btn.style.backgroundColor = '#ef4444';
        btn.style.color = '#ffffff';
        btn.style.borderColor = '#ef4444';
      }
      if (correctBtn) {
        correctBtn.style.backgroundColor = '#10b981';
        correctBtn.style.color = '#ffffff';
        correctBtn.style.borderColor = '#10b981';
      }
      this.streak = 0;
      this.cb.onFeedback(false);
    }

    // Update header stats
    const corrEl = document.getElementById('arr-correct-count');
    const strEl = document.getElementById('arr-streak-count');
    const scoreEl = document.getElementById('arr-score-val');
    const lvlEl = document.getElementById('arr-level-val');
    if (corrEl) corrEl.textContent = this.correct;
    if (strEl) strEl.textContent = this.streak;
    if (scoreEl) scoreEl.textContent = this.score;
    if (lvlEl) lvlEl.textContent = this.level;

    setTimeout(() => this._next(), 900);
  }

  _timeoutMiss() {
    if (this.locked || !this.el) return;
    this.locked = true;
    this.total++;
    this.streak = 0;
    this.cb.onFeedback(false);

    // Visual feedback for timeout
    const disp = document.getElementById('arr-display');
    if (disp) {
      disp.innerHTML = '<span style="color:#ef4444; font-size:1.8rem; font-weight:800; letter-spacing:0">TIMEOUT!</span>';
    }

    // Update stats
    const strEl = document.getElementById('arr-streak-count');
    if (strEl) strEl.textContent = this.streak;

    setTimeout(() => this._next(), 900);
  }

  timeUp() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    clearTimeout(this._showTimer);
    clearTimeout(this._responseTimeout);
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: this.times.length ? this.times.reduce((a, b) => a + b, 0) / this.times.length : 0,
      correct: this.correct, total: this.total, level: this.level
    });
  }

  destroy() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    clearTimeout(this._showTimer);
    clearTimeout(this._responseTimeout);
    this.el = null;
  }
}

window.ArrowsGame = ArrowsGame;
