/* ══════════════════════════════════════════════════════
   Pymetrics / Arctic Shores: Arrows Game
   Measures: Cognitive flexibility, attention control, task-switching
   Rules from Playbook:
   - Blue/Black arrows: Indicate direction of the center arrow
   - Red arrows: Indicate direction of the side (flanker) arrows
   - Strict 2-second response limit per trial
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
    // Center arrow direction
    const centerDir = this._rand(['left', 'right']);
    // Flanker direction (sometimes congruent, sometimes incongruent)
    const congruent = Math.random() < 0.5;
    const flankerDir = congruent ? centerDir : (centerDir === 'left' ? 'right' : 'left');

    // Arrow color: blue or red
    const color = Math.random() < 0.5 ? 'blue' : 'red';

    // 5 arrows (1 center and 4 flankers)
    const arrows = [flankerDir, flankerDir, centerDir, flankerDir, flankerDir];

    return { arrows, centerDir, flankerDir, color, congruent };
  }

  _arrowChar(dir) { return dir === 'left' ? '←' : '→'; }

  _render() {
    if (!this.el) return;
    const title = 'Arrows Game';
    const instructionHtml = `
      <div style="font-size: 0.9rem; line-height: 1.6; text-align: left; max-width: 460px; margin: 0 auto 16px; background: rgba(0,0,0,0.02); padding: 12px; border-radius: 8px;">
        <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#2563eb;"></span>
          <span><strong>Blue arrows</strong>: Indicate direction of the <strong>center</strong> arrow.</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#dc2626;"></span>
          <span><strong>Red arrows</strong>: Indicate direction of the <strong>side</strong> arrows.</span>
        </div>
      </div>
    `;

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Arrows Test</span>
          </div>
          <div class="ap-header-right">
            <div class="ap-timer-box">
              <span class="ap-timer-icon">⏱</span>
              <span class="ap-timer-val" id="ap-timer-val">2.0s</span>
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
                <div class="ap-spin-badge" id="arr-type" style="align-self:center; margin-bottom: 24px;">—</div>
                
                <div id="arr-instructions">${instructionHtml}</div>
                
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
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4;">
                    If the arrows are blue, match the center arrow. If red, match the side arrows. Watch out for the strict 2-second timeout!
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

    // Style card background color subtly based on the rule type
    if (cardEl) {
      if (puzzle.color === 'blue') {
        cardEl.style.backgroundColor = '#f8fafc'; // Neutral slate
        cardEl.style.borderColor = '#cbd5e1';
      } else {
        cardEl.style.backgroundColor = '#fdf2f8'; // Subtle pink/red tint
        cardEl.style.borderColor = '#fbcfe8';
      }
    }

    const elapsed = (Date.now() - this.gameStartTime) / 1000;
    const flashDelay = Math.max(250, 400 - Math.floor(elapsed / 15) * 50); // fast visual pacing

    clearTimeout(this._showTimer);
    this._showTimer = setTimeout(() => {
      if (!this.el) return;

      // Draw all 5 arrows with the correct color
      const arrowColor = puzzle.color === 'blue' ? '#2563eb' : '#dc2626';
      disp.innerHTML = puzzle.arrows.map((dir, i) => {
        const isTarget = puzzle.color === 'blue' ? (i === 2) : (i !== 2);
        const weight = isTarget ? '800' : '600';
        return `<span class="arr-arrow" style="color:${arrowColor}; font-weight:${weight}; font-size:4rem; margin:0 4px; display:inline-block;">${this._arrowChar(dir)}</span>`;
      }).join('');
      
      disp.className = 'arr-display arr-showing';
      this._t0 = Date.now();

      // Start response timeout: strict 2.0s limit, scaling down to 800ms for high difficulty
      const timeoutLimit = Math.max(800, 2000 - Math.floor(elapsed / 15) * 150);
      let timeLeft = timeoutLimit;

      const timerVal = document.getElementById('ap-timer-val');
      if (timerVal) {
        timerVal.textContent = (timeLeft / 1000).toFixed(1) + 's';
        timerVal.style.color = '';
      }

      clearTimeout(this._responseTimeout);
      const tick = () => {
        if (this.locked || !this.el) return;
        timeLeft -= 100;
        if (timerVal) {
          timerVal.textContent = Math.max(0, (timeLeft / 1000)).toFixed(1) + 's';
          if (timeLeft <= 600) {
            timerVal.style.color = '#ef4444';
            timerVal.style.fontWeight = '800';
          }
        }
        if (timeLeft <= 0) {
          this._timeoutMiss();
        } else {
          this._responseTimeout = setTimeout(tick, 100);
        }
      };
      this._responseTimeout = setTimeout(tick, 100);
    }, flashDelay);

    if (typeTag) {
      typeTag.textContent = puzzle.color === 'blue' ? '🎯 Target: CENTER Arrow' : '🎯 Target: SIDE Arrows';
      typeTag.style.color = puzzle.color === 'blue' ? '#2563eb' : '#dc2626';
      typeTag.style.backgroundColor = puzzle.color === 'blue' ? '#dbeafe' : '#fee2e2';
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
    const correctDir = this._cur.color === 'blue' ? this._cur.centerDir : this._cur.flankerDir;

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

      const ruleBonus = !this._cur.congruent ? 30 : 0;
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

    setTimeout(() => this._next(), 800);
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
