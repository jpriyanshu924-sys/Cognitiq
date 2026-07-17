/* ══════════════════════════════════════════════════════
   SHL Interactive 2: Verify Inductive
   Measures: Inductive reasoning, abstract pattern recognition
   Based on: SHL Verify Interactive Inductive Assessment (Shape Sequences)
   ══════════════════════════════════════════════════════ */
class VerifyInductiveGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.qIndex = 0;
    this.el = null;
    this.hasAnswered = false;

    // Pattern data
    // Shapes rendered using SVG snippets
    this.questions = [
      {
        text: "Identify the pattern in the sequence and choose the correct shape that fills the missing [ ? ] slot.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="12" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="22" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="32" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="25" y="25" width="50" height="50" rx="4" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="42" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="22" fill="var(--red)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="12" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`
        ],
        answer: 1, // index 1 (radius 42)
        explanation: "The shape size (circle radius) increases progressively in each step: 12px ➔ 22px ➔ 32px ➔ 42px. The color and shape remain constant."
      },
      {
        text: "Determine the rule of rotation and fill the missing [ ? ] slot.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(0 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(45 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(90 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(180 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(135 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(270 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--emerald)" transform="rotate(135 50 50)" stroke="white" stroke-width="1.5"/></svg>`
        ],
        answer: 1, // index 1 (rotate 135 deg)
        explanation: "The arrow rotates clockwise by 45 degrees in each step (0° ➔ 45° ➔ 90° ➔ 135°)."
      },
      {
        text: "Analyze the sequence of symbols to find the logical missing link.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 90,85 10,85" fill="var(--amber)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="15" y="15" width="70" height="70" rx="6" fill="var(--pink)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 90,85 10,85" fill="var(--amber)" stroke="white" stroke-width="2"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 90,85 10,85" fill="var(--pink)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="15" y="15" width="70" height="70" rx="6" fill="var(--pink)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="35" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="15" y="15" width="70" height="70" rx="6" fill="var(--amber)" stroke="white" stroke-width="2"/></svg>`
        ],
        answer: 1, // index 1 (pink square)
        explanation: "The pattern alternates between an amber triangle and a pink square (Triangle ➔ Square ➔ Triangle ➔ Square)."
      },
      {
        text: "Analyze the count patterns and find the correct option to fill the slot.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="35" cy="50" r="10" fill="var(--emerald)"/><circle cx="65" cy="50" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="30" r="10" fill="var(--emerald)"/><circle cx="30" cy="70" r="10" fill="var(--emerald)"/><circle cx="70" cy="70" r="10" fill="var(--emerald)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="30" r="10" fill="var(--red)"/><circle cx="30" cy="70" r="10" fill="var(--red)"/><circle cx="70" cy="70" r="10" fill="var(--red)"/><circle cx="50" cy="50" r="10" fill="var(--red)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="30" cy="30" r="10" fill="var(--emerald)"/><circle cx="70" cy="30" r="10" fill="var(--emerald)"/><circle cx="30" cy="70" r="10" fill="var(--emerald)"/><circle cx="70" cy="70" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="30" cy="30" r="10" fill="var(--emerald)"/><circle cx="70" cy="30" r="10" fill="var(--emerald)"/><circle cx="30" cy="70" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="20" y="20" width="60" height="60" rx="4" fill="var(--emerald)"/></svg>`
        ],
        answer: 1, // index 1 (4 emerald dots)
        explanation: "The quantity of green circles increases by 1 in each step (1 ➔ 2 ➔ 3 ➔ 4 circles). The shape and color remain green."
      }
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'shl-ind-game';
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
      <div class="shl-header">
        <div class="shl-stat"><span class="shl-l">Pattern</span><span class="shl-v" style="color:var(--violet-l)">${this.qIndex + 1}/${this.questions.length}</span></div>
        <div class="shl-stat"><span class="shl-l">Score</span><span class="shl-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.qIndex) / this.questions.length * 100}%"></div></div>
      
      <div class="vi-workspace">
        <div class="vi-question-instruction">${q.text}</div>
        
        <div class="vi-sequence-row">
          ${q.sequence.map((svg, i) => `
            <div class="vi-sequence-card">
              ${svg}
              <div class="vi-step-label">Step ${i + 1}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="vi-choices-label">Choose the matching option:</div>
        <div class="vi-choices-grid" id="vi-choices">
          ${q.options.map((opt, idx) => `
            <button class="vi-choice-card" data-idx="${idx}">
              <div class="vi-choice-letter">${String.fromCharCode(65 + idx)}</div>
              <div class="vi-choice-shape">${opt}</div>
            </button>
          `).join('')}
        </div>
        
        <div class="shl-explanation" id="vi-explanation" style="display:none;margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px"></div>
      </div>
      
      <div class="shl-footer" style="display:none;margin-top:20px" id="vi-next-panel">
        <button class="btn btn-primary" id="vi-next-btn">Next Pattern ➔</button>
      </div>`;

    this.el.querySelectorAll('.vi-choice-card').forEach(btn => {
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
    const btns = this.el.querySelectorAll('.vi-choice-card');
    btns.forEach(btn => {
      const idx = parseInt(btn.dataset.idx);
      if (idx === q.answer) {
        btn.classList.add('vi-correct');
      } else if (idx === choiceIdx && !isCorrect) {
        btn.classList.add('vi-wrong');
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

    // Show explanation
    const expEl = this.el.querySelector('#vi-explanation');
    if (expEl) {
      expEl.style.display = 'block';
      expEl.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${q.explanation}`;
    }

    // Show next button
    const nextPanel = this.el.querySelector('#vi-next-panel');
    if (nextPanel) {
      nextPanel.style.display = 'flex';
      const nextBtn = this.el.querySelector('#vi-next-btn');
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
window.VerifyInductiveGame = VerifyInductiveGame;
