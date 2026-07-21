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

    // Static array of 10 complex logical syllogisms, conditional logic, and ordering puzzles
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
      },
      {
        premises: [
          "Jane is faster than Sarah.",
          "Sarah is faster than Dave.",
          "Bob is faster than Jane."
        ],
        conclusion: "Bob is faster than Dave.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 0, // Must Be True
        explanation: "Since Bob > Jane, Jane > Sarah, and Sarah > Dave, Bob is transitively faster than Dave (Bob > Jane > Sarah > Dave)."
      },
      {
        premises: [
          "If it rains, John plays chess.",
          "If John plays chess, Mary reads.",
          "Mary is not reading."
        ],
        conclusion: "It is raining.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 2, // Cannot Be True
        explanation: "Since Mary is not reading, John is not playing chess (modus tollens). Since John is not playing chess, it is not raining. Therefore, it is impossible for it to be raining."
      },
      {
        premises: [
          "Most accountants are detail-oriented.",
          "Some detail-oriented people are introverts."
        ],
        conclusion: "Most accountants are introverts.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 1, // Might Be True
        explanation: "While most accountants are detail-oriented, the subset of detail-oriented people who are introverts may or may not overlap with accountants. It is possible but not guaranteed."
      },
      {
        premises: [
          "No athletes are smokers.",
          "All runners are athletes."
        ],
        conclusion: "Some runners are smokers.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 2, // Cannot Be True
        explanation: "Since all runners are athletes, and no athlete is a smoker, it is logically impossible for any runner to be a smoker."
      },
      {
        premises: [
          "Alice is taller than Carol.",
          "David is shorter than Carol.",
          "Betty is taller than David."
        ],
        conclusion: "Betty is taller than Alice.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 1, // Might Be True
        explanation: "We know Alice > Carol > David, and Betty > David. We don't have a direct heights comparison between Betty and Alice or Carol. So Betty might be taller, but it is not certain."
      },
      {
        premises: [
          "All members of Club A are also members of Club B.",
          "No members of Club B are members of Club C."
        ],
        conclusion: "No members of Club A are members of Club C.",
        options: ["Must Be True", "Might Be True", "Cannot Be True"],
        answer: 0, // Must Be True
        explanation: "Club A is a subset of Club B, which has no intersection with Club C. Therefore, Club A cannot intersect with Club C."
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
        
        <div class="ld-choices-grid">
          ${q.options.map((opt, idx) => `
            <button class="btn ld-choice-btn" data-idx="${idx}">${opt}</button>
          `).join('')}
        </div>
        
        <div class="shl-explanation" id="ld-explanation" style="display:none;margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px"></div>
      </div>
      
      <div class="shl-footer" style="display:none;margin-top:20px" id="ld-next-panel">
        <button class="btn btn-primary" id="ld-next-btn">Next Syllogism ➔</button>
      </div>`;

    this.el.querySelectorAll('.ld-choice-btn').forEach(btn => {
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
    const btns = this.el.querySelectorAll('.ld-choice-btn');
    btns.forEach(btn => {
      const idx = parseInt(btn.dataset.idx);
      if (idx === q.answer) {
        btn.classList.add('ld-correct');
      } else if (idx === choiceIdx && !isCorrect) {
        btn.classList.add('ld-wrong');
      }
    });

    if (isCorrect) {
      this.correct++;
      const pts = 200;
      this.score += pts;
      this.cb.onScore(pts, this.qIndex + 1);
      this.cb.onFeedback(true);
    } else {
      this.cb.onFeedback(false);
    }

    // Display explanation
    const exp = this.el.querySelector('#ld-explanation');
    if (exp) {
      exp.innerHTML = `
        <strong style="color:${isCorrect ? '#10b981' : '#ef4444'}">${isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}</strong>
        <p style="margin-top:6px;font-size:0.8rem;color:var(--muted);line-height:1.5">${q.explanation}</p>`;
      exp.style.display = 'block';
    }

    const footer = this.el.querySelector('#ld-next-panel');
    if (footer) {
      footer.style.display = 'flex';
      footer.querySelector('#ld-next-btn').onclick = () => {
        this.qIndex++;
        this._showQuestion();
      };
    }
  }

  _finish() {
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: 0,
      correct: this.correct,
      total: this.total,
      level: 3
    });
  }

  timeUp() {
    this._finish();
  }

  destroy() {
    this.el = null;
  }
}

window.LogicDeductionGame = LogicDeductionGame;
