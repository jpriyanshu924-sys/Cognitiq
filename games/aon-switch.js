/* ══════════════════════════════════════════════════════
   Aon Assessment 1: Switch Task
   Measures: Deductive logic, cognitive switching, sustained attention
   Based on: Aon Cut-e SwitchChallenge — letter/number dual-rule classification
══════════════════════════════════════════════════════ */
class AonSwitchGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.times = []; this.level = 1;
    this.locked = false; this.el = null; this._t0 = 0;
    this._kd = null; this._nextTimer = null;
    this.VOWELS = new Set('AEIOU');
    this.trialsSinceSwitch = 0;
    this.switchEvery = 5;
    this.ruleKey = 'letter'; // 'letter' or 'number'
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'aos-game';
    this.container.appendChild(this.el);
    this._renderShell();
    this._next();
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
            <span class="ap-question-num">Round ${this.total + 1}</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Switch Challenge</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Dual-Rule Classification</div>
                <div id="aos-rule" style="display:contents">
                  ${this._ruleBanner()}
                </div>
                
                <!-- Stimulus Box -->
                <div class="aos-box" id="aos-box" style="height:120px; display:flex; align-items:center; justify-content:center; margin-bottom:40px">
                  <div class="aos-placeholder" style="color:#cbd5e1; font-size:3rem">…</div>
                </div>

                <!-- Choices Grid -->
                <div class="ap-face-choices-grid" id="aos-choices" style="width:100%; max-width:340px; grid-template-columns: 1fr 1fr; gap:16px; margin:0 auto">
                  <!-- Dynamic buttons -->
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Switch Task Instructions</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Classify using either the letter or number rule depending on the active badge. Use key [A] for left and [L] for right.
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
      if (e.key.toLowerCase() === 'a') this._pick('left');
      if (e.key.toLowerCase() === 'l') this._pick('right');
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

  _ruleBanner() {
    const isLetter = this.ruleKey === 'letter';
    return `
      <div class="ap-spin-badge" style="align-self:center; margin-bottom: 28px; background-color:${isLetter?'#e0e7ff':'#fff7ed'}; color:${isLetter?'#3b22d8':'#ea580c'}; border:1px solid ${isLetter?'#c7d2fe':'#ffedd5'}">
        <strong>${isLetter ? '📝 LETTER RULE' : '🔢 NUMBER RULE'}</strong> — ${isLetter ? 'Is it a Vowel or Consonant?' : 'Is it Odd or Even?'}
      </div>`;
  }

  _gen() {
    if (this.ruleKey === 'letter') {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const ch = letters[Math.floor(Math.random() * letters.length)];
      const isVowel = this.VOWELS.has(ch);
      return { stimulus: ch, answer: isVowel ? 'Vowel' : 'Consonant', choices: ['Vowel', 'Consonant'], bgColor: '#3b22d8' };
    } else {
      const num = 1 + Math.floor(Math.random() * 9);
      const isOdd = num % 2 !== 0;
      return { stimulus: String(num), answer: isOdd ? 'Odd' : 'Even', choices: ['Odd', 'Even'], bgColor: '#ea580c' };
    }
  }

  _next() {
    if (!this.el) return;
    this.trialsSinceSwitch++;
    this.switchEvery = this.level === 1 ? 5 : this.level === 2 ? 3 : 2;

    if (this.trialsSinceSwitch > this.switchEvery) {
      this.ruleKey = this.ruleKey === 'letter' ? 'number' : 'letter';
      this.trialsSinceSwitch = 0;
      // Flash rule change
      const box = document.getElementById('aos-box');
      const rule = document.getElementById('aos-rule');
      if (box) box.innerHTML = '<div style="font-size:1.6rem; font-weight:800; color:#ea580c">⚡ SWITCH RULE!</div>';
      if (rule) rule.innerHTML = this._ruleBanner();
      const choices = document.getElementById('aos-choices');
      if (choices) choices.innerHTML = '';
      clearTimeout(this._nextTimer);
      this._nextTimer = setTimeout(() => this._next(), 900);
      return;
    }

    this.locked = false;
    this._cur = this._gen();

    const box = document.getElementById('aos-box');
    const choicesEl = document.getElementById('aos-choices');
    const ruleEl = document.getElementById('aos-rule');
    if (!box || !choicesEl) return;
    if (ruleEl) ruleEl.innerHTML = this._ruleBanner();

    box.innerHTML = `<div class="aos-stimulus" style="font-size:7rem; font-weight:800; color:${this._cur.bgColor}; font-family:var(--fm); height:120px; display:flex; align-items:center; justify-content:center">${this._cur.stimulus}</div>`;
    choicesEl.innerHTML = '';
    this._cur.choices.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn ap-face-choice-btn aos-btn';
      btn.style.marginTop = '0';
      btn.style.padding = '14px 0';
      btn.textContent = `[${i===0?'A':'L'}] ${ch}`;
      btn.addEventListener('click', () => this._pick(i === 0 ? 'left' : 'right'));
      choicesEl.appendChild(btn);
    });
    this._t0 = Date.now();
  }

  _pick(side) {
    if (this.locked || !this._cur || !this.el) return;
    this.locked = true;
    const chosen = side === 'left' ? this._cur.choices[0] : this._cur.choices[1];
    const rt = Date.now() - this._t0;
    this.times.push(rt); this.total++;
    const ok = chosen === this._cur.answer;

    const btns = this.el.querySelectorAll('.aos-btn');
    btns.forEach(b => {
      if (b.textContent.includes(this._cur.answer)) {
        b.style.backgroundColor = '#10b981';
        b.style.borderColor = '#10b981';
        b.style.color = '#ffffff';
      } else if (b.textContent.includes(chosen) && !ok) {
        b.style.backgroundColor = '#ef4444';
        b.style.borderColor = '#ef4444';
        b.style.color = '#ffffff';
      }
    });

    if (ok) {
      this.correct++; this.streak++;
      if (this.correct % 10 === 0) this.level = Math.min(3, this.level + 1);
      const spdBonus = Math.max(0, Math.floor((2000 - rt) / 25));
      const switchBonus = this.trialsSinceSwitch <= 2 ? 50 : 0;
      const pts = 80 + spdBonus + switchBonus + (this.streak >= 5 ? this.streak * 8 : 0);
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0; this.cb.onFeedback(false);
    }
    clearTimeout(this._nextTimer);
    this._nextTimer = setTimeout(() => this._next(), 700);
  }

  timeUp() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this.cb.onEnd({ score: this.score, accuracy: this.total?(this.correct/this.total)*100:0, avgTime: this.times.length?this.times.reduce((a,b)=>a+b,0)/this.times.length:0, correct: this.correct, total: this.total, level: this.level });
  }
  destroy() { if (this._kd) window.removeEventListener('keydown', this._kd); clearTimeout(this._nextTimer); this.el = null; }
}
window.AonSwitchGame = AonSwitchGame;
