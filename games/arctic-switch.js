/* ══════════════════════════════════════════════════════
   Arctic Shores 3: Switch Challenge
   Measures: Cognitive flexibility, task-switching, working memory
   Based on: Arctic Shores Switch Challenge — alternating rule sets
══════════════════════════════════════════════════════ */
class ArcticSwitchGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.times = []; this.level = 1;
    this.locked = false; this.el = null;
    this.ruleIdx = 0; // alternates 0/1
    this.ruleSwitched = false;
    this._kd = null; this._showTimer = null;
    // Two alternating rules
    this.rules = [
      { label: '🔴 COLOR RULE', desc: 'Is it RED or BLUE?', key: 'color' },
      { label: '🔢 NUMBER RULE', desc: 'Is it ODD or EVEN?', key: 'parity' },
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'asw-game';
    this.container.appendChild(this.el);
    this._render();
    setTimeout(() => this._next(), 800);
  }

  _gen() {
    const num = 1 + Math.floor(Math.random() * 9);
    const color = Math.random() < 0.5 ? 'red' : 'blue';
    const rule = this.rules[this.ruleIdx % this.rules.length];
    let answer, choices;
    if (rule.key === 'color') {
      answer = color === 'red' ? 'Red' : 'Blue';
      choices = ['Red', 'Blue'];
    } else {
      answer = num % 2 === 0 ? 'Even' : 'Odd';
      choices = ['Odd', 'Even'];
    }
    return { num, color, rule, answer, choices };
  }

  _render() {
    if (!this.el) return;
    const rule = this.rules[this.ruleIdx % this.rules.length];
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Switch Challenge</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">${this.cb && this.cb.name ? this.cb.name : 'Switch Challenge'}</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Task Switching</div>
                <div class="ap-spin-badge" id="asw-rule-tag" style="align-self:center; margin-bottom: 28px; background-color:${rule.key==='color'?'#fee2e2':'#e0e7ff'}; color:${rule.key==='color'?'#dc2626':'#3b22d8'}; border:1px solid ${rule.key==='color'?'#fecaca':'#c7d2fe'}">
                  <strong>${rule.label}</strong> — ${rule.desc}
                </div>
                
                <!-- Number/Color Display -->
                <div class="asw-display" id="asw-display" style="font-size:6.5rem; font-weight:800; font-family:var(--fm); height:120px; display:flex; align-items:center; justify-content:center; margin-bottom:40px">
                  <div class="asw-placeholder" style="color:#cbd5e1">●</div>
                </div>

                <!-- Choices Grid -->
                <div class="ap-face-choices-grid" id="asw-choices" style="width:100%; max-width:340px; grid-template-columns: 1fr 1fr; gap:16px; margin:0 auto">
                  <!-- Dynamic button creation -->
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Cognitive Flexibility Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Respond according to the active rule badge. Watch out for rapid switches between Color and Parity!
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Correct</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669">${this.correct}</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Streak</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c">${this.streak}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this._kd = e => {
      if (e.key === '1') this._pick(this._cur?.choices[0]);
      if (e.key === '2') this._pick(this._cur?.choices[1]);
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
    // Switch rule based on level: L1 every 5, L2 every 3, L3 every 2
    const switchEvery = this.level === 1 ? 5 : this.level === 2 ? 3 : 2;
    if (this.total > 0 && this.total % switchEvery === 0 && !this.ruleSwitched) {
      this.ruleSwitched = true;
      this.ruleIdx++;
      this._showRuleSwitch();
      return;
    }
    this.ruleSwitched = false;

    this.locked = false;
    this._cur = this._gen();
    this._t0 = Date.now();

    const disp = document.getElementById('asw-display');
    if (!disp) return;

    // Flash blank
    disp.innerHTML = '<div class="asw-placeholder" style="color:#cbd5e1">●</div>';
    clearTimeout(this._showTimer);
    this._showTimer = setTimeout(() => {
      if (!this.el) return;
      disp.innerHTML = `
        <div class="asw-number" style="color:${this._cur.color === 'red' ? '#ef4444' : '#3b82f6'}; font-weight:800">
          ${this._cur.num}
        </div>`;

      const choicesEl = document.getElementById('asw-choices');
      if (choicesEl) {
        choicesEl.innerHTML = '';
        this._cur.choices.forEach((ch, i) => {
          const btn = document.createElement('button');
          btn.className = 'btn ap-face-choice-btn asw-btn';
          btn.style.marginTop = '0';
          btn.style.padding = '14px 0';
          btn.textContent = `[${i+1}] ${ch}`;
          btn.addEventListener('click', () => this._pick(ch));
          choicesEl.appendChild(btn);
        });
      }
      this._t0 = Date.now();
    }, 150);
  }

  _showRuleSwitch() {
    const disp = document.getElementById('asw-display');
    const ruleTag = document.getElementById('asw-rule-tag');
    const choicesEl = document.getElementById('asw-choices');
    const rule = this.rules[this.ruleIdx % this.rules.length];
    if (disp) disp.innerHTML = `<div style="font-size:1.6rem; font-weight:800; color:#ea580c">⚡ RULE SWITCH!</div>`;
    if (choicesEl) choicesEl.innerHTML = '';
    if (ruleTag) {
      ruleTag.innerHTML = `<strong>${rule.label}</strong> — ${rule.desc}`;
      ruleTag.style.backgroundColor = rule.key==='color'?'#fee2e2':'#e0e7ff';
      ruleTag.style.color = rule.key==='color'?'#dc2626':'#3b22d8';
      ruleTag.style.borderColor = rule.key==='color'?'#fecaca':'#c7d2fe';
    }
    this._showTimer = setTimeout(() => this._next(), 900);
  }

  _pick(choice) {
    if (this.locked || !this._cur || !this.el) return;
    this.locked = true;
    const rt = Date.now() - this._t0;
    this.times.push(rt); this.total++;

    const ok = choice === this._cur.answer;
    const btns = this.el.querySelectorAll('.asw-btn');
    btns.forEach(b => {
      if (b.textContent.includes(this._cur.answer)) {
        b.style.backgroundColor = '#10b981';
        b.style.color = '#ffffff';
        b.style.borderColor = '#10b981';
      } else if (b.textContent.includes(choice) && !ok) {
        b.style.backgroundColor = '#ef4444';
        b.style.color = '#ffffff';
        b.style.borderColor = '#ef4444';
      }
    });

    if (ok) {
      this.correct++; this.streak++;
      if (this.correct % 10 === 0) this.level = Math.min(3, this.level + 1);
      const spdBonus = Math.max(0, Math.floor((1500 - rt) / 20));
      const switchBonus = this.total % (this.level===1?5:this.level===2?3:2) === 0 ? 40 : 0;
      const pts = 70 + spdBonus + switchBonus + (this.streak >= 5 ? this.streak * 8 : 0);
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0; this.cb.onFeedback(false);
    }
    setTimeout(() => this._next(), 700);
  }

  timeUp() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    clearTimeout(this._showTimer);
    this.cb.onEnd({ score: this.score, accuracy: this.total ? (this.correct/this.total)*100 : 0, avgTime: this.times.length ? this.times.reduce((a,b)=>a+b,0)/this.times.length : 0, correct: this.correct, total: this.total, level: this.level });
  }
  destroy() { if (this._kd) window.removeEventListener('keydown', this._kd); clearTimeout(this._showTimer); this.el = null; }
}
window.ArcticSwitchGame = ArcticSwitchGame;
