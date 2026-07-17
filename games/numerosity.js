/* ══════════════════════════════════════════════════════
   HireVue 1: Numerosity
   Measures: Numerical reasoning, mental arithmetic, working memory
   Based on: HireVue Numerosity — click number combos that sum to target
══════════════════════════════════════════════════════ */
class NumerosityGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.level = 1; this.el = null; this._timers = [];
    this.target = 0; this.bubbles = []; this.selected = new Set();
    this.runningSum = 0;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'num-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _newRound() {
    this.total++;
    this.selected = new Set();
    this.runningSum = 0;

    const maxN = this.level === 1 ? 9 : this.level === 2 ? 15 : 20;
    const numBubbles = this.level === 1 ? 6 : this.level === 2 ? 8 : 10;

    // Generate bubbles with at least one valid combination
    const answerCount = 2 + Math.floor(Math.random() * 2); // 2-3 numbers sum to target
    const answerNums = Array.from({length: answerCount}, () => 1 + Math.floor(Math.random() * maxN));
    this.target = answerNums.reduce((a, b) => a + b, 0);

    // Fill remaining bubbles with random numbers
    const extra = Array.from({length: numBubbles - answerCount}, () => 1 + Math.floor(Math.random() * maxN));
    const allNums = [...answerNums, ...extra].sort(() => Math.random() - 0.5);

    this.bubbles = allNums.map((n, i) => ({ id: i, val: n }));
    this._render();
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
              
              <!-- Header Info -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Numerosity</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Mental Math</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 28px; background-color:#eff6ff; color:#3b22d8">
                  Add up to Target
                </div>
                
                <!-- Target Display -->
                <div style="display:flex; gap:24px; align-items:center; justify-content:center; margin-bottom:28px">
                  <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:12px 24px; text-align:center">
                    <span style="font-size:0.72rem; font-weight:700; color:#1e3a8a; display:block; margin-bottom:2px">TARGET</span>
                    <span style="font-size:2.2rem; font-weight:800; color:#1e3a8a; font-family:var(--fm)">${this.target}</span>
                  </div>
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 24px; text-align:center; min-width:110px">
                    <span style="font-size:0.72rem; font-weight:700; color:#6b7280; display:block; margin-bottom:2px">YOUR SUM</span>
                    <span style="font-size:2.2rem; font-weight:800; color:#3b22d8; font-family:var(--fm)" id="num-sum">${this.runningSum}</span>
                  </div>
                </div>

                <!-- Bubbles Grid -->
                <div class="num-bubbles" id="num-bubbles" style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-bottom:28px; max-width:380px">
                  ${this.bubbles.map(b => {
                    const sel = this.selected.has(b.id);
                    return `
                    <button class="num-bubble" data-id="${b.id}" style="width:56px; height:56px; border-radius:50%; border:2px solid ${sel?'#3b22d8':'#cbd5e1'}; background:${sel?'#3b22d8':'#ffffff'}; font-size:1.15rem; font-weight:700; color:${sel?'#ffffff':'#374151'}; cursor:pointer; transition:all 0.15s; font-family:var(--fm)">
                      ${b.val}
                    </button>`;
                  }).join('')}
                </div>

                <!-- Submit Button -->
                <button class="btn ap-tow-btn-submit" id="num-submit" style="width:100%; max-width:240px; margin:0" ${this.runningSum === 0 || this.selected.size < 2 ? 'disabled' : ''}>
                  ✓ Submit Sum
                </button>
                
                <div style="font-size:0.75rem; color:#6b7280; margin-top:20px">
                  Select 2 or more numbers to reach the target sum.
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Numerical Reasoning Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Select any combinations that sum exactly to the target value. Accuracy and speed determine score bonuses.
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

    this.el.querySelectorAll('.num-bubble').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const bubble = this.bubbles.find(b => b.id === id);
        if (!bubble) return;
        if (this.selected.has(id)) {
          this.selected.delete(id);
          this.runningSum -= bubble.val;
          btn.style.backgroundColor = '#ffffff';
          btn.style.color = '#374151';
          btn.style.borderColor = '#cbd5e1';
        } else {
          this.selected.add(id);
          this.runningSum += bubble.val;
          btn.style.backgroundColor = '#3b22d8';
          btn.style.color = '#ffffff';
          btn.style.borderColor = '#3b22d8';
        }
        
        // Update dynamic values directly to prevent flicker
        const sumEl = document.getElementById('num-sum');
        if (sumEl) {
          sumEl.textContent = this.runningSum;
          sumEl.style.color = this.runningSum === this.target ? '#10b981' : this.runningSum > this.target ? '#ef4444' : '#3b22d8';
        }
        
        const submitBtn = document.getElementById('num-submit');
        if (submitBtn) {
          submitBtn.disabled = this.runningSum === 0 || this.selected.size < 2;
        }
      });
    });

    document.getElementById('num-submit')?.addEventListener('click', () => {
      if (this.runningSum === this.target && this.selected.size >= 2) {
        this.correct++; this.streak++;
        if (this.correct % 5 === 0) this.level = Math.min(3, this.level + 1);
        const pts = 100 + (this.selected.size - 2) * 30 + this.streak * 15 + this.level * 20;
        this.score += pts;
        this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
      } else {
        this.streak = 0; this.cb.onFeedback(false);
      }
      const t = setTimeout(() => this._newRound(), 600);
      this._timers.push(t);
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  timeUp() { this._timers.forEach(clearTimeout); this.cb.onEnd({ score: this.score, accuracy: this.total ? (this.correct/this.total)*100 : 0, avgTime: 0, correct: this.correct, total: this.total, level: this.level }); }
  destroy() { this._timers.forEach(clearTimeout); this.el = null; }
}
window.NumerosityGame = NumerosityGame;
