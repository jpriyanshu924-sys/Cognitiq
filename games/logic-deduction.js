/* ══════════════════════════════════════════════════════
   Sova Assessment 1: Logic Deduction
   Measures: Deductive reasoning, logical thinking, analytical skills
   Based on: Sova Cognitive Ability - Logical Reasoning / Syllogisms
   ══════════════════════════════════════════════════════ */
class LogicDeductionGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.qIndex = 0;
    this.el = null;
    this.hasAnswered = false;

    this.questions = [
      {
        premises: [
          "All software developers use computers.",
          "No computer users are illiterate.",
          "Some illiterate people are painters."
        ],
        conclusion: "No software developer is illiterate.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 0, // Must Be True
        explanation: "All developers use computers, and no computer user is illiterate. Therefore, it is impossible for a developer to be illiterate."
      },
      {
        premises: [
          "All managers are employees.",
          "No manager is a part-time worker.",
          "Some managers are designers."
        ],
        conclusion: "Some part-time workers are designers.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 1, // Might Be True
        explanation: "No manager is part-time, but some managers are designers. A designer who is NOT a manager could theoretically work part-time. Hence, it might be true."
      },
      {
        premises: [
          "All laptops have batteries.",
          "No battery is permanent.",
          "Some laptops are expensive."
        ],
        conclusion: "Some expensive laptops have permanent parts.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 1, // Might Be True
        explanation: "No battery is permanent, but a laptop has other parts (screws, screen, etc.) which could be permanent. Therefore, this statement is possible but not guaranteed."
      },
      {
        premises: [
          "All managers are employees.",
          "No manager is a part-time worker."
        ],
        conclusion: "Some software leads (who are all managers) are part-time workers.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 2, // Cannot Be True
        explanation: "All software leads are managers, and no manager is a part-time worker. Therefore, no software lead can be a part-time worker."
      }
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'logic-deduct-game';
    this.container.appendChild(this.el);
    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIndex >= this.questions.length) {
      this._finish();
      return;
    }

    this.hasAnswered = false;
    const q = this.questions[this.qIndex];
    this._render(q);
  }

  _render(q) {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="ld-header">
        <div class="ld-stat"><span class="ld-l">Puzzle</span><span class="ld-v" style="color:var(--violet-l)">${this.qIndex + 1}/${this.questions.length}</span></div>
        <div class="ld-stat"><span class="ld-l">Score</span><span class="ld-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.qIndex) / this.questions.length * 100}%"></div></div>
      
      <div class="ld-workspace">
        <div class="ld-puzzle-card">
          <h4>📌 Premises</h4>
          <ul class="ld-premises-list">
            ${q.premises.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
        
        <div class="ld-conclusion-card">
          <h4>🔎 Evaluate Conclusion</h4>
          <p class="ld-conclusion-text">"${q.conclusion}"</p>
        </div>
        
        <div class="ld-choices-row" id="ld-choices">
          ${q.options.map((opt, idx) => `
            <button class="btn ld-opt-btn" data-idx="${idx}">${opt}</button>
          `).join('')}
        </div>
        
        <div class="ld-explanation" id="ld-explanation" style="display:none;margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px"></div>
      </div>
      
      <div class="ld-footer" style="display:none;margin-top:20px" id="ld-next-panel">
        <button class="btn btn-primary" id="ld-next-btn">Next Puzzle ➔</button>
      </div>`;

    this.el.querySelectorAll('.ld-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        this._pickAnswer(idx);
      });
    });
  }

  _pickAnswer(choiceIdx) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    this.total++;

    const q = this.questions[this.qIndex];
    const isCorrect = (choiceIdx === q.answer);

    // Highlight choices
    const btns = this.el.querySelectorAll('.ld-opt-btn');
    btns.forEach(btn => {
      const idx = parseInt(btn.dataset.idx);
      if (idx === q.answer) {
        btn.classList.add('ld-opt-correct');
      } else if (idx === choiceIdx && !isCorrect) {
        btn.classList.add('ld-opt-wrong');
      }
    });

    if (isCorrect) {
      this.correct++;
      const pts = 250;
      this.score += pts;
      this.cb.onScore(pts, this.qIndex + 1);
      this.cb.onFeedback(true);
    } else {
      this.cb.onFeedback(false);
    }

    const expEl = this.el.querySelector('#ld-explanation');
    if (expEl) {
      expEl.style.display = 'block';
      expEl.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${q.explanation}`;
    }

    const nextPanel = this.el.querySelector('#ld-next-panel');
    if (nextPanel) {
      nextPanel.style.display = 'flex';
      const nextBtn = this.el.querySelector('#ld-next-btn');
      if (nextBtn) nextBtn.addEventListener('click', () => {
        this.qIndex++;
        this._showQuestion();
      });
    }
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
window.LogicDeductionGame = LogicDeductionGame;
