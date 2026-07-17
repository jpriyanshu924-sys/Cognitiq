/* ══════════════════════════════════════════════════════
   SHL Interactive 3: Scenario Judge
   Measures: Situational judgment, behavioral fit, workplace reasoning
   Based on: SHL Scenario Games / Situational Judgment Tests (SJT)
   ══════════════════════════════════════════════════════ */
class ScenarioJudgeGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.qIndex = 0;
    this.el = null;
    this.hasAnswered = false;

    this.scenarios = [
      {
        text: "You are leading a project that is behind schedule. The client is unhappy and demands an immediate update. Your team is already working overtime and feeling burnt out.",
        responses: [
          { id: 'A', text: "Agree to the client's demanding deadline and ask the team to push through the burnout.", val: 2 }, // Medium-Low
          { id: 'B', text: "Meet with the client, explain the delay honestly, present a realistic revised timeline, and protect team workload.", val: 4 }, // Best
          { id: 'C', text: "Delegate the client communication to a junior team member to avoid conflict while you focus on execution.", val: 1 }, // Worst
          { id: 'D', text: "Ask the team to skip quality check protocols so the deliverables can be completed on the original schedule.", val: 1.5 } // Bad
        ],
        explanation: "Empathetic leadership, direct client management, and realistic planning (Response B) represent the best approach. Avoiding conflict or sacrificing quality (Response C/D) are worst."
      },
      {
        text: "A colleague on your project team is consistently missing deadlines, which is starting to delay your own progress. You have a good working relationship with them.",
        responses: [
          { id: 'A', text: "Go directly to your line manager and report the colleague's poor performance.", val: 2 },
          { id: 'B', text: "Speak to the colleague privately, express your concerns empathetically, and offer to help resolve their blockers.", val: 4 }, // Best
          { id: 'C', text: "Ignore the issue, hoping it improves, while working late to cover their workload.", val: 1.5 },
          { id: 'D', text: "Confront them publicly during a team standup to pressure them into working faster.", val: 1 } // Worst
        ],
        explanation: "Direct, empathetic Peer-to-peer communication (Response B) is the recommended first step. Public confrontation (Response D) destroys team trust and is highly ineffective."
      },
      {
        text: "You have just noticed a critical error in a financial report that has already been submitted to senior leadership. It was caused by a formula mistake you made.",
        responses: [
          { id: 'A', text: "Immediately notify your manager of the error, explain the correct figures, and apologize.", val: 4 }, // Best
          { id: 'B', text: "Quietly correct the source template and hope nobody notices the error in the submitted copy.", val: 2 },
          { id: 'C', text: "Blame software glitches or database latency for the miscalculation if anyone asks.", val: 1 }, // Worst
          { id: 'D', text: "Recall/delete the file from the shared folder without explanation and re-upload a fixed version.", val: 1.5 }
        ],
        explanation: "Accountability and transparent communication (Response A) are paramount in professional settings. Deception or blame-shifting (Response C) is unacceptable."
      }
    ];

    this.currentOrder = [];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'sjt-game';
    this.container.appendChild(this.el);
    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIndex >= this.scenarios.length) {
      this._finish();
      return;
    }

    this.hasAnswered = false;
    const s = this.scenarios[this.qIndex];
    // Create copy of responses to let player rearrange
    this.currentOrder = [...s.responses];
    this._render(s);
  }

  _render(s) {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="sjt-header">
        <div class="sjt-stat"><span class="sjt-l">Scenario</span><span class="sjt-v" style="color:var(--violet-l)">${this.qIndex + 1}/${this.scenarios.length}</span></div>
        <div class="sjt-stat"><span class="sjt-l">Score</span><span class="sjt-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.qIndex) / this.scenarios.length * 100}%"></div></div>
      
      <div class="sjt-workspace">
        <div class="sjt-scenario-card">
          <h3>💼 Workplace Dilemma</h3>
          <p class="sjt-scenario-text">${s.text}</p>
        </div>
        
        <div class="sjt-sorting-area">
          <div class="sjt-label">Rearrange the actions below from <strong>Most Effective (Top)</strong> to <strong>Least Effective (Bottom)</strong>:</div>
          <div class="sjt-list" id="sjt-list">
            ${this.currentOrder.map((resp, idx) => `
              <div class="sjt-item-card" data-idx="${idx}">
                <div class="sjt-item-rank">${idx + 1}</div>
                <div class="sjt-item-text">${resp.text}</div>
                <div class="sjt-item-moves">
                  <button class="btn btn-sm btn-icon sjt-move-up" ${idx === 0 ? 'disabled' : ''}>▲</button>
                  <button class="btn btn-sm btn-icon sjt-move-down" ${idx === 3 ? 'disabled' : ''}>▼</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="sjt-explanation" id="sjt-explanation" style="display:none;margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px"></div>
      </div>
      
      <div class="sjt-footer">
        <button class="btn btn-primary btn-lg" id="sjt-submit-btn">Submit Order ➔</button>
        <button class="btn btn-primary btn-lg" id="sjt-next-btn" style="display:none">Next Scenario ➔</button>
      </div>`;

    this._bindEvents();
  }

  _bindEvents() {
    this.el.querySelectorAll('.sjt-move-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.sjt-item-card');
        const idx = parseInt(card.dataset.idx);
        if (idx > 0) this._swap(idx, idx - 1);
      });
    });

    this.el.querySelectorAll('.sjt-move-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.sjt-item-card');
        const idx = parseInt(card.dataset.idx);
        if (idx < 3) this._swap(idx, idx + 1);
      });
    });

    const submitBtn = this.el.querySelector('#sjt-submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', () => this._submit());
  }

  _swap(i, j) {
    const temp = this.currentOrder[i];
    this.currentOrder[i] = this.currentOrder[j];
    this.currentOrder[j] = temp;
    this._render(this.scenarios[this.qIndex]);
  }

  _submit() {
    this.hasAnswered = true;
    this.total++;

    const s = this.scenarios[this.qIndex];
    
    // Calculate scoring
    // Perfect order score: 400. Subtract points for rank distance.
    // Optimal order would be sorted by val descending.
    const optimal = [...s.responses].sort((a, b) => b.val - a.val);
    
    let penalty = 0;
    this.currentOrder.forEach((resp, idx) => {
      const optimalIdx = optimal.findIndex(o => o.id === resp.id);
      penalty += Math.abs(idx - optimalIdx);
    });

    // Max penalty is typically 8 (e.g. reversing best-worst)
    const pts = Math.max(50, 300 - (penalty * 30));
    this.score += pts;
    this.correct += (penalty === 0 ? 1 : 0); // Perfect matches counted as correct

    this.cb.onScore(pts, this.qIndex + 1);
    this.cb.onFeedback(penalty <= 2);

    // Render results
    const listEl = document.getElementById('sjt-list');
    listEl.innerHTML = this.currentOrder.map((resp, idx) => {
      const optimalIdx = optimal.findIndex(o => o.id === resp.id);
      let diffColor = 'var(--muted)';
      if (optimalIdx === idx) diffColor = 'var(--emerald)';
      else if (Math.abs(idx - optimalIdx) >= 2) diffColor = 'var(--red)';
      
      return `
        <div class="sjt-item-card sjt-readonly-card">
          <div class="sjt-item-rank" style="background:${diffColor}">${idx + 1}</div>
          <div class="sjt-item-text">${resp.text}</div>
          <div class="sjt-item-opt-rank">Should be: #${optimalIdx + 1}</div>
        </div>`;
    }).join('');

    const expEl = this.el.querySelector('#sjt-explanation');
    if (expEl) {
      expEl.style.display = 'block';
      expEl.innerHTML = `<strong>Feedback:</strong> ${s.explanation}`;
    }

    this.el.querySelector('#sjt-submit-btn').style.display = 'none';
    const nextBtn = this.el.querySelector('#sjt-next-btn');
    nextBtn.style.display = 'block';
    nextBtn.addEventListener('click', () => {
      this.qIndex++;
      this._showQuestion();
    });
  }

  _finish() {
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: 0,
      correct: this.correct,
      total: this.total,
      level: 1
    });
  }

  timeUp() { this._finish(); }
  destroy() {
    this.el = null;
  }
}
window.ScenarioJudgeGame = ScenarioJudgeGame;
