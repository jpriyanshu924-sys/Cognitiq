/* ══════════════════════════════════════════════════════
   Arctic Shores 3: Tickets Game
   Measures: Attention, cognitive flexibility, rule induction
   Based on: Arctic Shores Tickets Game — sorting numbers/colors into Box A/B
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
      { label: '🎫 COLOR RULE', desc: 'Red to Box A, Blue to Box B', key: 'color' },
      { label: '🔢 PARITY RULE', desc: 'Odd to Box A, Even to Box B', key: 'parity' },
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
    const num = 10 + Math.floor(Math.random() * 89); // 2-digit numbers
    const color = Math.random() < 0.5 ? 'red' : 'blue';
    const rule = this.rules[this.ruleIdx % this.rules.length];
    
    let answer;
    if (rule.key === 'color') {
      answer = color === 'red' ? 'Box A' : 'Box B';
    } else {
      answer = num % 2 !== 0 ? 'Box A' : 'Box B';
    }
    const choices = ['Box A', 'Box B'];
    return { num, color, rule, answer, choices };
  }

  _render() {
    if (!this.el) return;
    const rule = this.rules[this.ruleIdx % this.rules.length];
    const isHidden = this.total >= 30;

    let bannerHtml = `<strong>${rule.label}</strong> — ${rule.desc}`;
    let bannerStyle = `background-color:${rule.key==='color'?'#fee2e2':'#e0e7ff'}; color:${rule.key==='color'?'#dc2626':'#3b22d8'}; border:1px solid ${rule.key==='color'?'#fecaca':'#c7d2fe'}`;
    
    if (isHidden) {
      bannerHtml = `<strong>🔒 RULE HIDDEN</strong> — Infer the sorting pattern from box feedback`;
      bannerStyle = `background-color:#f1f5f9; color:#475569; border:1px solid #cbd5e1`;
    }

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Tickets Challenge</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">${this.cb && this.cb.name ? this.cb.name : 'Tickets Game'}</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Sorting Challenge</div>
                <div class="ap-spin-badge" id="asw-rule-tag" style="align-self:center; margin-bottom: 28px; ${bannerStyle}">
                  ${bannerHtml}
                </div>
                
                <!-- Ticket display box -->
                <div class="asw-display" id="asw-display" style="height:140px; display:flex; align-items:center; justify-content:center; margin-bottom:40px">
                  <div class="asw-placeholder" style="color:#cbd5e1">●</div>
                </div>

                <!-- Collection Boxes Grid -->
                <div class="ap-face-choices-grid" id="asw-choices" style="width:100%; max-width:340px; grid-template-columns: 1fr 1fr; gap:16px; margin:0 auto">
                  <!-- Box A & Box B buttons -->
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Tickets sorting rule</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Sort tickets into Box A or Box B. From round 30, the rule description disappears, requiring deduction from correct/incorrect feedback!
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Correct</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669" id="asw-correct-count">${this.correct}</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Streak</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c" id="asw-streak-count">${this.streak}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this._kd = e => {
      if (e.key === '1') this._pick('Box A');
      if (e.key === '2') this._pick('Box B');
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
    // Switch rule: Level 1 (0-10 rounds) every 5, Level 2 (10-30 rounds) every 3, Level 3 (30+ rounds) every 2
    const switchEvery = this.total < 10 ? 5 : this.total < 30 ? 3 : 2;
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
    
    // Update rule badge in case of hidden phase
    const ruleTag = document.getElementById('asw-rule-tag');
    if (ruleTag) {
      const rule = this._cur.rule;
      const isHidden = this.total >= 30;
      if (isHidden) {
        ruleTag.innerHTML = `<strong>🔒 RULE HIDDEN</strong> — Infer the active rule from box feedback`;
        ruleTag.style.backgroundColor = '#f1f5f9';
        ruleTag.style.color = '#475569';
        ruleTag.style.borderColor = '#cbd5e1';
      } else {
        ruleTag.innerHTML = `<strong>${rule.label}</strong> — ${rule.desc}`;
        ruleTag.style.backgroundColor = rule.key==='color'?'#fee2e2':'#e0e7ff';
        ruleTag.style.color = rule.key==='color'?'#dc2626':'#3b22d8';
        ruleTag.style.borderColor = rule.key==='color'?'#fecaca':'#c7d2fe';
      }
    }

    clearTimeout(this._showTimer);
    this._showTimer = setTimeout(() => {
      if (!this.el) return;
      
      // Render ticket visual
      disp.innerHTML = `
        <div class="asw-ticket" style="
          background: ${this._cur.color === 'red' ? 'linear-gradient(135deg, #fee2e2, #f87171)' : 'linear-gradient(135deg, #dbeafe, #60a5fa)'};
          color: #1e293b;
          border: 2px dashed #ffffff;
          border-radius: 8px;
          padding: 18px 36px;
          font-family: var(--fm);
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: 1px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.1);
          display: inline-block;
          text-align: center;
          position: relative;
        ">
          <span style="font-size: 0.68rem; font-weight: 700; display: block; opacity: 0.7; letter-spacing: 2px; margin-bottom: 4px; text-transform: uppercase;">Ticket No.</span>
          #${this._cur.num}
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
    const isHidden = this.total >= 30;

    if (disp) disp.innerHTML = `<div style="font-size:1.6rem; font-weight:800; color:#ea580c">⚡ RULE SWITCH!</div>`;
    if (choicesEl) choicesEl.innerHTML = '';
    
    if (ruleTag) {
      if (isHidden) {
        ruleTag.innerHTML = `<strong>🔒 RULE HIDDEN</strong> — Infer the active rule from box feedback`;
        ruleTag.style.backgroundColor = '#f1f5f9';
        ruleTag.style.color = '#475569';
        ruleTag.style.borderColor = '#cbd5e1';
      } else {
        ruleTag.innerHTML = `<strong>${rule.label}</strong> — ${rule.desc}`;
        ruleTag.style.backgroundColor = rule.key==='color'?'#fee2e2':'#e0e7ff';
        ruleTag.style.color = rule.key==='color'?'#dc2626':'#3b22d8';
        ruleTag.style.borderColor = rule.key==='color'?'#fecaca':'#c7d2fe';
      }
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
      const switchBonus = this.ruleSwitched ? 40 : 0;
      const pts = 70 + spdBonus + switchBonus + (this.streak >= 5 ? this.streak * 8 : 0);
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0; this.cb.onFeedback(false);
    }

    // Update screen stats
    const corrCount = document.getElementById('asw-correct-count');
    const strCount = document.getElementById('asw-streak-count');
    if (corrCount) corrCount.textContent = this.correct;
    if (strCount) strCount.textContent = this.streak;

    setTimeout(() => this._next(), 700);
  }

  timeUp() {
    if (this._kd) window.removeEventListener('keydown', this._kd);
    clearTimeout(this._showTimer);
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
    this.el = null;
  }
}

window.ArcticSwitchGame = ArcticSwitchGame;
