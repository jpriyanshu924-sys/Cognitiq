/* ══════════════════════════════════════════════════════════════
   APTITUDE.JS — Interactive Placement & Corporate Aptitude Test Engine
   ══════════════════════════════════════════════════════════════ */

const APTITUDE_DATA = {
  qa: {
    title: "Quantitative Aptitude (QA)",
    desc: "Master Arithmetic, Algebra, Geometry, and Number Systems for top corporate placements.",
    icon: "📊",
    questions: [
      {
        id: "qa1",
        q: "A train running at a speed of 72 km/h crosses a pole in 9 seconds. What is the length of the train?",
        options: ["140 m", "160 m", "180 m", "200 m"],
        answer: 2,
        explanation: "Speed in m/s = 72 × (5/18) = 20 m/s. Distance = Speed × Time = 20 m/s × 9 s = 180 metres."
      },
      {
        id: "qa2",
        q: "If log₂ x + log₄ x + log₁₆ x = 21/4, what is the value of x?",
        options: ["8", "16", "32", "64"],
        answer: 0,
        explanation: "log₄ x = (1/2)log₂ x and log₁₆ x = (1/4)log₂ x. Sum = log₂ x (1 + 1/2 + 1/4) = 7/4 log₂ x = 21/4. Thus log₂ x = 3 ⟹ x = 2³ = 8."
      },
      {
        id: "qa3",
        q: "A sum of money doubles itself at compound interest in 15 years. It will become eight times itself in:",
        options: ["30 years", "45 years", "60 years", "75 years"],
        answer: 1,
        explanation: "Amount becomes 2x in 15 years. Since (2³) = 8x, required time = 3 × 15 = 45 years."
      },
      {
        id: "qa4",
        q: "In a class of 60 students, the ratio of boys to girls is 3:2. If 10 boys leave and 5 girls join, what is the new ratio?",
        options: ["2:3", "1:1", "13:17", "26:29"],
        answer: 3,
        explanation: "Initial boys = (3/5)×60 = 36, girls = 24. After changes: Boys = 26, Girls = 29. New ratio = 26:29."
      }
    ]
  },
  dilr: {
    title: "Data Interpretation & Logical Reasoning (DILR)",
    desc: "Solve matrix puzzles, chart caselets, and seating arrangement challenges.",
    icon: "📈",
    questions: [
      {
        id: "dilr1",
        q: "Five friends A, B, C, D, E sit around a circular table facing center. A is right of B, E is left of B, C is between D and E. Who is to the immediate right of C?",
        options: ["A", "B", "D", "E"],
        answer: 3,
        explanation: "Circular order clockwise starting from B: B ➔ A ➔ D ➔ C ➔ E. The person to the immediate right of C is E."
      },
      {
        id: "dilr2",
        q: "A company's revenue increased by 20% in Year 1 and decreased by 15% in Year 2. Net percentage change is:",
        options: ["+2%", "+5%", "-2%", "+4%"],
        answer: 0,
        explanation: "Net change = 20 - 15 - (20 × 15)/100 = 5 - 3 = +2% increase."
      },
      {
        id: "dilr3",
        q: "In a code language, 'CAT' is coded as 24 and 'DOG' as 26. How is 'PIG' coded?",
        options: ["32", "30", "36", "34"],
        answer: 0,
        explanation: "Sum of alphabet positions: P(16) + I(9) + G(7) = 32."
      }
    ]
  },
  varc: {
    title: "Verbal Ability & Reading Comprehension (VARC)",
    desc: "Enhance critical reasoning, para jumbles, and high-speed vocabulary precision.",
    icon: "📚",
    questions: [
      {
        id: "varc1",
        q: "Identify the grammatically correct sentence:",
        options: [
          "Neither of the two candidates have submitted their resume.",
          "Neither of the two candidates has submitted his resume.",
          "Neither of the two candidates were present.",
          "Neither candidate have responded."
        ],
        answer: 1,
        explanation: "'Neither' is singular and takes a singular verb ('has') and singular pronoun ('his' or 'their' singular)."
      },
      {
        id: "varc2",
        q: "Choose the word most OPPOSITE in meaning to 'EPHEMERAL':",
        options: ["Transient", "Permanent", "Fleeting", "Evanescent"],
        answer: 1,
        explanation: "'Ephemeral' means lasting a very short time. Its antonym is 'Permanent'."
      }
    ]
  },
  speed: {
    title: "Speed Mental Math Drills",
    desc: "Rapid-fire calculation sprints to sharpen mental math speed for time-pressured recruitment tests.",
    icon: "⚡",
    questions: [
      {
        id: "sp1",
        q: "What is 15% of 480?",
        options: ["64", "72", "80", "84"],
        answer: 1,
        explanation: "10% of 480 = 48. 5% = 24. Total 15% = 48 + 24 = 72."
      },
      {
        id: "sp2",
        q: "What is 27 × 11?",
        options: ["287", "297", "307", "317"],
        answer: 1,
        explanation: "Shortcut: Keep 2 and 7 on ends, sum (2+7=9) in middle ➔ 297."
      },
      {
        id: "sp3",
        q: "What is 18² - 12²?",
        options: ["180", "160", "140", "200"],
        answer: 0,
        explanation: "a² - b² = (a-b)(a+b) = (18-12)(18+12) = 6 × 30 = 180."
      }
    ]
  }
};

class AptitudeApp {
  constructor() {
    this.currentCat = 'all';
    this.activeTest = null;
    this.currentQIdx = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timer = null;
    this.timeLeft = 0;
    this._init();
  }

  _init() {
    document.addEventListener('DOMContentLoaded', () => {
      this._renderCards();
      this._bindEvents();
    });
  }

  _bindEvents() {
    // Filter tabs
    document.querySelectorAll('.apt-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.apt-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCat = btn.dataset.cat;
        this._renderCards();
      });
    });

    // Modal controls
    const closeBtn = document.getElementById('apt-ws-close');
    if (closeBtn) closeBtn.addEventListener('click', () => this._closeModal());

    const nextBtn = document.getElementById('apt-btn-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this._nextQuestion());
  }

  _renderCards() {
    const grid = document.getElementById('apt-grid-container');
    if (!grid) return;

    grid.innerHTML = '';
    const keys = Object.keys(APTITUDE_DATA);

    keys.forEach(k => {
      if (this.currentCat !== 'all' && this.currentCat !== k) return;
      const data = APTITUDE_DATA[k];

      const card = document.createElement('div');
      card.className = 'apt-card';
      card.innerHTML = `
        <div>
          <div class="apt-card-top">
            <div class="apt-card-icon">${data.icon}</div>
            <span class="apt-card-badge">${data.questions.length} Questions</span>
          </div>
          <h3 class="apt-card-title">${data.title}</h3>
          <p class="apt-card-desc">${data.desc}</p>
        </div>
        <div>
          <div class="apt-card-meta">
            <span>⏱ 10 Mins</span>
            <span>🎯 Placement Standard</span>
          </div>
          <button class="apt-btn-start" onclick="window.AptitudeEngine.startTest('${k}')">
            Start Test →
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  startTest(key) {
    this.activeTest = APTITUDE_DATA[key];
    if (!this.activeTest) return;

    this.currentQIdx = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLeft = 600; // 10 mins

    document.getElementById('apt-modal-overlay').classList.add('active');
    document.getElementById('apt-ws-title').textContent = this.activeTest.title;
    
    this._startTimer();
    this._renderQuestion();
  }

  _startTimer() {
    clearInterval(this.timer);
    this._updateTimerDisplay();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this._updateTimerDisplay();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this._finishTest();
      }
    }, 1000);
  }

  _updateTimerDisplay() {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    const el = document.getElementById('apt-ws-timer');
    if (el) el.textContent = `⏱ ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  _renderQuestion() {
    const q = this.activeTest.questions[this.currentQIdx];
    const body = document.getElementById('apt-workspace-body');
    const exp = document.getElementById('apt-explanation-box');
    if (exp) exp.classList.remove('active');

    body.innerHTML = `
      <div class="apt-q-num">Question ${this.currentQIdx + 1} of ${this.activeTest.questions.length}</div>
      <div class="apt-q-text">${q.q}</div>
      <div class="apt-options-grid">
        ${q.options.map((opt, i) => `
          <button class="apt-opt-btn" onclick="window.AptitudeEngine.selectAnswer(${i})">
            <span class="apt-opt-lbl">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="apt-explanation-box" id="apt-explanation-box">
        <strong>💡 Solution & Explanation:</strong><br>${q.explanation}
      </div>
    `;

    document.getElementById('apt-btn-next').textContent = (this.currentQIdx === this.activeTest.questions.length - 1) ? 'Finish Test →' : 'Next Question →';
    document.getElementById('apt-btn-next').style.display = 'none';
  }

  selectAnswer(idx) {
    const q = this.activeTest.questions[this.currentQIdx];
    const btns = document.querySelectorAll('.apt-opt-btn');

    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('correct');
      if (i === idx && i !== q.answer) b.classList.add('incorrect');
    });

    if (idx === q.answer) this.score += 100;
    this.userAnswers.push({ qId: q.id, selected: idx, correct: idx === q.answer });

    const exp = document.getElementById('apt-explanation-box');
    if (exp) exp.classList.add('active');

    document.getElementById('apt-btn-next').style.display = 'inline-flex';
  }

  _nextQuestion() {
    this.currentQIdx++;
    if (this.currentQIdx >= this.activeTest.questions.length) {
      this._finishTest();
    } else {
      this._renderQuestion();
    }
  }

  _finishTest() {
    clearInterval(this.timer);
    const body = document.getElementById('apt-workspace-body');
    const total = this.activeTest.questions.length;
    const correctCount = this.userAnswers.filter(a => a.correct).length;
    const acc = Math.round((correctCount / total) * 100);

    body.innerHTML = `
      <div style="text-align:center; padding: 24px 0;">
        <div style="font-size: 3.5rem; margin-bottom: 16px;">🏆</div>
        <h2 style="font-family:var(--fh); font-size: 1.8rem; font-weight:800; color:#0f172a; margin-bottom: 8px;">Test Completed!</h2>
        <p style="color:#64748b; font-size:0.95rem; margin-bottom: 28px;">${this.activeTest.title}</p>
        
        <div style="display:flex; justify-content:space-around; background:#f8fafc; border-radius:16px; padding:20px; max-width:480px; margin: 0 auto 28px;">
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase;">Score</div>
            <div style="font-family:var(--fm); font-size:1.5rem; font-weight:800; color:#4f46e5;">${this.score}</div>
          </div>
          <div style="width:1px; background:#e2e8f0;"></div>
          <div>
            <div style="font-size:0.75rem; font-weight:700; color:#94a3b8; text-transform:uppercase;">Accuracy</div>
            <div style="font-family:var(--fm); font-size:1.5rem; font-weight:800; color:#10b981;">${acc}%</div>
          </div>
        </div>

        <button class="apt-btn-start" style="max-width: 240px; margin: 0 auto;" onclick="window.AptitudeEngine._closeModal()">
          Close & Return Hub
        </button>
      </div>
    `;

    document.getElementById('apt-btn-next').style.display = 'none';

    // Log result to Firestore if available
    if (typeof isFirebaseReady !== 'undefined' && isFirebaseReady && db) {
      db.collection('aptitude_results').add({
        candidateId: localStorage.getItem('ciq_candidate_id') || 'CP-Anon',
        testTitle: this.activeTest.title,
        score: this.score,
        accuracy: acc,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(e => console.error(e));
    }
  }

  _closeModal() {
    clearInterval(this.timer);
    document.getElementById('apt-modal-overlay').classList.remove('active');
  }
}

window.AptitudeEngine = new AptitudeApp();
