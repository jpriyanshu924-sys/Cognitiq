/* ══════════════════════════════════════════════════════
   HireVue 2: Flashback
   Measures: Visual working memory, sequential recall
   Based on: HireVue Flashback — remember shapes in sequence
══════════════════════════════════════════════════════ */
class FlashbackGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.level = 1;
    this.el = null; this._timers = [];
    this.seq = []; this.userSeq = []; this.phase = 'show';
    this.seqLen = 3;
    this.ITEMS = [
      { id:'circle',   icon:'⭕', label:'Circle'   },
      { id:'star',     icon:'⭐', label:'Star'     },
      { id:'heart',    icon:'❤️', label:'Heart'     },
      { id:'diamond',  icon:'💎', label:'Diamond'  },
      { id:'moon',     icon:'🌙', label:'Moon'     },
      { id:'lightning',icon:'⚡', label:'Lightning' },
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'fb-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _newRound() {
    this.total++;
    this.userSeq = [];
    this.phase = 'show';
    const poolSize = this.level === 1 ? 4 : this.level === 2 ? 5 : 6;
    const pool = this.ITEMS.slice(0, poolSize);
    this.seq = Array.from({length: this.seqLen}, () => pool[Math.floor(Math.random() * pool.length)]);
    this._showSequence();
  }

  _showSequence() {
    if (!this.el) return;
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Round ${this.total}</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Flashback</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visual Memory</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 28px; background-color:#eff6ff; color:#3b22d8">
                  Watch the Sequence
                </div>
                
                <!-- Large Sequence Display Box -->
                <div class="fb-display" id="fb-display" style="background:#f8fafc; border:1.5px dashed #bfdbfe; border-radius:16px; padding:32px; width:100%; max-width:240px; aspect-ratio:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; margin-bottom:32px; box-shadow:0 4px 12px rgba(59,34,216,0.02)">
                  <div class="fb-big" style="font-size:4rem; line-height:1">👁️</div>
                </div>

                <!-- Sequence Tracker dots -->
                <div class="fb-seq-track" id="fb-seq-track" style="display:flex; gap:12px; justify-content:center; margin-bottom:20px">
                  ${this.seq.map((_,i) => `<div class="fb-dot" id="fb-dot-${i}" style="width:28px; height:28px; border-radius:50%; border:2px solid #cbd5e1; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; color:#6b7280"></div>`).join('')}
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Sequential Memory Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Watch the sequence of items carefully. Remember the order, and then select them in that exact sequence.
                  </div>
                </div>
                <div class="ap-tow-footer-card" style="display:flex; flex-direction:row; justify-content:space-around; align-items:center">
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Correct</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669">${this.correct}</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.68rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Sequence length</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#ea580c">${this.seqLen}</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    let i = 0;
    const showNext = () => {
      if (!this.el || i >= this.seq.length) {
        // Done showing — switch to recall
        const t2 = setTimeout(() => {
          this.phase = 'recall';
          this._renderRecall();
        }, 600);
        this._timers.push(t2);
        return;
      }
      const item = this.seq[i];
      const disp = document.getElementById('fb-display');
      const dot = document.getElementById(`fb-dot-${i}`);
      if (disp) {
        disp.innerHTML = `
          <div class="fb-big" style="font-size:4rem; line-height:1; animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)">${item.icon}</div>
          <div class="fb-item-label" style="font-size:0.9rem; font-weight:700; color:#374151">${item.label}</div>`;
      }
      if (dot) {
        dot.style.backgroundColor = '#3b22d8';
        dot.style.color = '#ffffff';
        dot.style.borderColor = '#3b22d8';
        dot.textContent = i + 1;
      }
      i++;
      const interval = Math.max(600, 1200 - this.level * 100);
      const t = setTimeout(showNext, interval);
      this._timers.push(t);
    };
    const t = setTimeout(showNext, 400);
    this._timers.push(t);

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _renderRecall() {
    if (!this.el) return;
    const poolSize = this.level === 1 ? 4 : this.level === 2 ? 5 : 6;
    const pool = this.ITEMS.slice(0, poolSize);
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Recall Phase</span>
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
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Flashback</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visual Memory</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 28px; background-color:#fff7ed; color:#ea580c; border:1px solid #ffedd5">
                  Recall Sequence
                </div>
                
                <div style="font-size:1.15rem; font-weight:800; color:#111827; margin-bottom:24px">Reproduce the sequence in order:</div>

                <!-- User input track -->
                <div class="fb-seq-track" style="display:flex; gap:12px; justify-content:center; margin-bottom:32px">
                  ${this.seq.map((_,i) => {
                    const picked = this.userSeq[i];
                    return `
                    <div class="fb-dot ${picked ? 'fb-dot-filled' : ''}" style="width:52px; height:52px; border-radius:12px; border:2px solid ${picked?'#3b22d8':'#cbd5e1'}; background:${picked?'#eff6ff':'#ffffff'}; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:1.5rem; font-weight:700; color:#3b22d8">
                      ${picked ? picked.icon : i+1}
                    </div>`;
                  }).join('')}
                </div>

                <!-- Choices grid -->
                <div class="fb-choices" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; width:100%; max-width:380px; margin-bottom:28px">
                  ${pool.map(item => {
                    return `
                    <button class="btn ap-face-choice-btn fb-choice" style="margin-top:0; padding:12px 6px; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer;" data-id="${item.id}">
                      <span style="font-size:1.8rem; line-height:1">${item.icon}</span>
                      <span style="font-size:0.75rem; color:#4b5563; font-weight:600">${item.label}</span>
                    </button>`;
                  }).join('')}
                </div>

                <!-- Submit Button -->
                ${this.userSeq.length === this.seqLen ? `
                  <button class="btn ap-tow-btn-submit" id="fb-submit" style="width:100%; max-width:240px; margin:0">
                    ✓ Confirm Sequence
                  </button>` : ''}
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Sequential Memory Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Watch the sequence of items carefully. Remember the order, and then select them in that exact sequence.
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

    this.el.querySelectorAll('.fb-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.userSeq.length >= this.seqLen) return;
        const item = this.ITEMS.find(it => it.id === btn.dataset.id);
        if (item) { this.userSeq.push(item); this._renderRecall(); }
      });
    });
    document.getElementById('fb-submit')?.addEventListener('click', () => this._evaluate());

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _evaluate() {
    const allCorrect = this.seq.every((item, i) => this.userSeq[i]?.id === item.id);
    const partialCorrect = this.seq.filter((item, i) => this.userSeq[i]?.id === item.id).length;
    const acc = partialCorrect / this.seq.length;

    if (allCorrect) {
      this.correct++; this.streak++;
      if (this.correct % 3 === 0) { this.seqLen++; if (this.seqLen > 4 + this.level) this.level = Math.min(3, this.level + 1); }
      const pts = 150 + this.seqLen * 30 + this.streak * 20;
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0;
      if (this.seqLen > 3) this.seqLen--;
      this.score += Math.floor(acc * 50);
      this.cb.onFeedback(false);
    }
    const t = setTimeout(() => this._newRound(), 800);
    this._timers.push(t);
  }

  timeUp() {
    this._timers.forEach(clearTimeout);
    if (this.el) {
      this.el.innerHTML = `
        <div style="text-align:center;padding:40px">
          <div style="font-size:3.5rem;margin-bottom:16px">👁️</div>
          <h3 style="font-family:var(--fh);margin-bottom:12px">Flashback Complete!</h3>
          <p style="color:var(--muted);margin-bottom:8px">Correct sequences: <strong>${this.correct} / ${this.total}</strong></p>
          <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
        </div>`;
    }
    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: this.total ? (this.correct / this.total) * 100 : 0,
        avgTime: 0,
        correct: this.correct,
        total: this.total,
        level: this.level
      });
    }, 2000);
  }
  destroy() { this._timers.forEach(clearTimeout); this.el = null; }
}
window.FlashbackGame = FlashbackGame;
