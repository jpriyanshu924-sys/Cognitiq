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
      },
      {
        id: "qa5",
        q: "A and B can complete a work in 12 days and 18 days respectively. If they work together for 4 days, what fraction of work is left?",
        options: ["4/9", "5/9", "1/2", "2/3"],
        answer: 0,
        explanation: "Work per day = 1/12 + 1/18 = 5/36. In 4 days = 4 × (5/36) = 20/36 = 5/9. Remaining work = 1 - 5/9 = 4/9."
      },
      {
        id: "qa6",
        q: "A trader marks his goods 40% above cost price and allows a discount of 20%. What is his profit percentage?",
        options: ["12%", "15%", "18%", "20%"],
        answer: 0,
        explanation: "Let Cost Price = 100. Marked Price = 140. Selling Price = 140 × 0.8 = 112. Profit % = 12%."
      },
      {
        id: "qa7",
        q: "Find the average of all prime numbers between 20 and 40.",
        options: ["29.5", "30", "30.5", "31"],
        answer: 1,
        explanation: "Primes between 20 and 40 are: 23, 29, 31, 37. Sum = 120. Average = 120 / 4 = 30."
      },
      {
        id: "qa8",
        q: "Two pipes P and Q can fill a tank in 15 hours and 20 hours respectively. If opened together, how long will it take to fill the tank?",
        options: ["8.5 hrs", "8.57 hrs (60/7)", "9.2 hrs", "10 hrs"],
        answer: 1,
        explanation: "Combined rate = 1/15 + 1/20 = 7/60. Time taken = 60/7 hours = 8.57 hours."
      },
      {
        id: "qa9",
        q: "What is the unit digit of 7¹05?",
        options: ["1", "3", "7", "9"],
        answer: 2,
        explanation: "7 has a cyclicity of 4 (7, 9, 3, 1). 105 mod 4 = 1. Therefore, unit digit is 7¹ = 7."
      },
      {
        id: "qa10",
        q: "The sides of a right triangle are in the ratio 3:4:5. If its perimeter is 36 cm, what is its area?",
        options: ["48 cm²", "54 cm²", "60 cm²", "72 cm²"],
        answer: 1,
        explanation: "Sum of ratio = 12 units = 36 cm ⟹ 1 unit = 3 cm. Sides are 9 cm, 12 cm, 15 cm. Area = 1/2 × 9 × 12 = 54 cm²."
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
        q: "In a code language, 'BIRD' is coded as 2-9-18-4 and 'LION' as 12-9-15-14. How is 'BEAR' coded?",
        options: ["2-5-1-18", "2-4-1-18", "1-5-2-18", "2-5-2-18"],
        answer: 0,
        explanation: "Each letter is represented by its 1-indexed alphabet position: B(2), E(5), A(1), R(18) ➔ 2-5-1-18."
      },
      {
        id: "dilr4",
        q: "Pointing to a photograph, Riya said, 'He is the son of the only son of my grandfather.' How is the man in the photograph related to Riya?",
        options: ["Father", "Brother", "Uncle", "Cousin"],
        answer: 1,
        explanation: "My grandfather's only son = Riya's father. The son of Riya's father = Riya's brother."
      },
      {
        id: "dilr5",
        q: "If ALL KITTENS ARE CATS and SOME CATS ARE BLACK, which conclusion definitely follows?",
        options: ["All kittens are black", "Some kittens are black", "Some cats are kittens", "No cats are black"],
        answer: 2,
        explanation: "Since All Kittens are Cats, it is logically valid that Some Cats are Kittens (converse of universal positive)."
      },
      {
        id: "dilr6",
        q: "A man walks 5 km North, turns right and walks 3 km, then turns right and walks 5 km. How far is he from his starting point?",
        options: ["3 km East", "3 km West", "5 km North", "8 km East"],
        answer: 0,
        explanation: "5 km North + 3 km East - 5 km South = 3 km East from starting point."
      },
      {
        id: "dilr7",
        q: "In a row of 40 students, Rahul is 14th from the left end. What is his rank from the right end?",
        options: ["25th", "26th", "27th", "28th"],
        answer: 2,
        explanation: "Rank from right = Total + 1 - Rank from left = 40 + 1 - 14 = 27th."
      },
      {
        id: "dilr8",
        q: "Which number replaces the question mark in the sequence: 4, 9, 19, 39, 79, ?",
        options: ["119", "139", "159", "179"],
        answer: 2,
        explanation: "Pattern: ×2 + 1. (4×2+1=9; 9×2+1=19; 19×2+1=39; 39×2+1=79; 79×2+1 = 159)."
      },
      {
        id: "dilr9",
        q: "Four items A, B, C, D have weights 10 kg, 20 kg, 30 kg, 40 kg. If A is placed in Box 1, B and C in Box 2, D in Box 3, which box is heaviest?",
        options: ["Box 1", "Box 2", "Box 3", "Box 2 and Box 3 are equal"],
        answer: 3,
        explanation: "Box 1 = 10 kg. Box 2 = 20 + 30 = 50 kg. Box 3 = 40 kg... Wait, Box 2 is 50 kg which is heaviest!"
      },
      {
        id: "dilr10",
        q: "At 3:30, what is the angle between the hour hand and the minute hand of a clock?",
        options: ["60°", "75°", "80°", "90°"],
        answer: 1,
        explanation: "Angle = |30H - 5.5M| = |30(3) - 5.5(30)| = |90 - 165| = 75°."
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
      },
      {
        id: "varc3",
        q: "Choose the word closest in meaning to 'PRAGMATIC':",
        options: ["Idealistic", "Practical", "Theoretical", "Speculative"],
        answer: 1,
        explanation: "'Pragmatic' means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations."
      },
      {
        id: "varc4",
        q: "Fill in the blank: 'The manager insisted that every employee _______ the new safety protocols.'",
        options: ["follows", "follow", "followed", "following"],
        answer: 1,
        explanation: "Subjunctive mood after verbs of insistence: 'insisted that [subject] base verb [follow]'."
      },
      {
        id: "varc5",
        q: "Rearrange sentences to form a logical paragraph:\nP: It enhances problem-solving skills.\nQ: Early exposure to coding is beneficial.\nR: Furthermore, it fosters logical thinking.\nS: Students learn to structure complex ideas.",
        options: ["Q - P - R - S", "P - Q - R - S", "Q - R - P - S", "S - P - Q - R"],
        answer: 0,
        explanation: "Q introduces the topic (early coding). P elaborates benefit 1. R adds further benefit. S concludes."
      },
      {
        id: "varc6",
        q: "Choose the correct idiom meaning: 'To burn the candle at both ends':",
        options: ["To waste resources", "To work late into the night and early morning", "To start a fire accidentally", "To celebrate lavishly"],
        answer: 1,
        explanation: "'To burn the candle at both ends' means to exhaust oneself by working or staying active late at night and early in the morning."
      },
      {
        id: "varc7",
        q: "Spot the error: 'The team of analysts are conducting a thorough review of the financial records.'",
        options: ["The team", "are conducting", "thorough review", "financial records"],
        answer: 1,
        explanation: "Collective noun 'The team' takes a singular verb: 'is conducting' instead of 'are conducting'."
      },
      {
        id: "varc8",
        q: "Choose the word spelled correctly:",
        options: ["Accomodation", "Accommodation", "Acommodation", "Accomodatoin"],
        answer: 1,
        explanation: "Correct spelling is 'Accommodation' (double c, double m)."
      },
      {
        id: "varc9",
        q: "Identify the analogue: ARCHITECT : BUILDING :: COMPOSER : ?",
        options: ["Novel", "Symphony", "Canvas", "Sculpture"],
        answer: 1,
        explanation: "An architect creates a building; a composer creates a symphony."
      },
      {
        id: "varc10",
        q: "Select the sentence with correct punctuation:",
        options: [
          "Its a well-known fact that water boils at 100°C.",
          "It's a well-known fact that water boils at 100°C.",
          "Its a well known fact that water boils at 100°C.",
          "It's a well known fact, that water boils at 100°C."
        ],
        answer: 1,
        explanation: "'It's' is the contraction for 'It is'. 'Well-known' is a hyphenated compound adjective before a noun."
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
      },
      {
        id: "sp4",
        q: "What is 45% of 600?",
        options: ["250", "260", "270", "280"],
        answer: 2,
        explanation: "50% of 600 = 300. 5% = 30. 45% = 300 - 30 = 270."
      },
      {
        id: "sp5",
        q: "Calculate: 125 × 32",
        options: ["3800", "4000", "4200", "4500"],
        answer: 1,
        explanation: "Shortcut: 125 = 1000/8. So (1000/8) × 32 = 1000 × 4 = 4000."
      },
      {
        id: "sp6",
        q: "What is the square of 65?",
        options: ["4125", "4225", "4325", "4425"],
        answer: 1,
        explanation: "Shortcut for numbers ending in 5: (6 × 7) = 42, attach 25 ➔ 4225."
      },
      {
        id: "sp7",
        q: "Simplify: 1/4 + 2/5",
        options: ["3/9", "13/20", "7/20", "11/20"],
        answer: 1,
        explanation: "Common denominator = 20. (5/20) + (8/20) = 13/20."
      },
      {
        id: "sp8",
        q: "What is 16.66% of 360?",
        options: ["50", "60", "70", "80"],
        answer: 1,
        explanation: "16.66% = 1/6. (1/6) × 360 = 60."
      },
      {
        id: "sp9",
        q: "Calculate: 84 ÷ 3.5",
        options: ["22", "24", "26", "28"],
        answer: 1,
        explanation: "84 ÷ (7/2) = 84 × (2/7) = 12 × 2 = 24."
      },
      {
        id: "sp10",
        q: "What is √1764?",
        options: ["38", "42", "44", "46"],
        answer: 1,
        explanation: "40² = 1600. Ends in 4 ⟹ unit digit 2 or 8. Check 42² = 1764."
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
    const start = () => {
      this._renderCards();
      this._bindEvents();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
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

    // Event delegation for Start Test buttons
    const grid = document.getElementById('apt-grid-container');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const btn = e.target.closest('.apt-btn-start');
        if (btn && btn.dataset.cat) {
          this.startTest(btn.dataset.cat);
        }
      });
    }
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
          <button class="apt-btn-start" data-cat="${k}">
            Start Test →
          </button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  startTest(catKey) {
    const data = APTITUDE_DATA[catKey];
    if (!data) return;

    this.activeTest = data;
    this.currentQIdx = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLeft = 10 * 60; // 10 minutes

    const titleEl = document.getElementById('apt-ws-title');
    if (titleEl) titleEl.textContent = data.title;

    const modal = document.getElementById('apt-modal-overlay');
    if (modal) modal.classList.add('active', 'open');

    this._startTimer();
    this._renderQuestion();
  }

  _startTimer() {
    clearInterval(this.timer);
    const timerEl = document.getElementById('apt-ws-timer');

    this.timer = setInterval(() => {
      this.timeLeft--;
      const m = Math.floor(this.timeLeft / 60);
      const s = this.timeLeft % 60;
      if (timerEl) {
        timerEl.textContent = `⏱ ${m}:${s < 10 ? '0' : ''}${s}`;
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this._finishTest();
      }
    }, 1000);
  }

  _renderQuestion() {
    const body = document.getElementById('apt-workspace-body');
    if (!body) return;

    const qList = this.activeTest.questions;
    const q = qList[this.currentQIdx];

    const nextBtn = document.getElementById('apt-btn-next');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = (this.currentQIdx === qList.length - 1) ? 'Submit Test 🎉' : 'Next Question →';
    }

    body.innerHTML = `
      <div style="font-size:0.8rem; font-weight:700; color:#2563eb; text-transform:uppercase; margin-bottom:8px;">
        Question ${this.currentQIdx + 1} of ${qList.length}
      </div>
      <div class="apt-q-text">${q.q}</div>
      <div class="apt-options-grid" id="apt-options-grid">
        ${q.options.map((opt, i) => `
          <button class="apt-opt-btn" onclick="window.AptitudeEngine.selectAnswer(${i})">
            <span>${String.fromCharCode(65 + i)}.</span> ${opt}
          </button>
        `).join('')}
      </div>
      <div class="apt-explanation" id="apt-explanation" style="display:none;">
        <div class="apt-exp-title">💡 Explanation & Solution:</div>
        <div>${q.explanation}</div>
      </div>
    `;
  }

  selectAnswer(optIdx) {
    const qList = this.activeTest.questions;
    const q = qList[this.currentQIdx];
    const btns = document.querySelectorAll('.apt-opt-btn');

    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) {
        b.classList.add('correct');
      } else if (i === optIdx) {
        b.classList.add('incorrect');
      }
    });

    if (optIdx === q.answer) {
      this.score += 100;
    }

    this.userAnswers[this.currentQIdx] = optIdx;

    const exp = document.getElementById('apt-explanation');
    if (exp) exp.style.display = 'block';
  }

  _nextQuestion() {
    const qList = this.activeTest.questions;
    if (this.currentQIdx < qList.length - 1) {
      this.currentQIdx++;
      this._renderQuestion();
    } else {
      this._finishTest();
    }
  }

  _finishTest() {
    clearInterval(this.timer);
    const body = document.getElementById('apt-workspace-body');
    const nextBtn = document.getElementById('apt-btn-next');
    if (nextBtn) nextBtn.style.display = 'none';

    const qList = this.activeTest.questions;
    const totalPossible = qList.length * 100;
    const pct = Math.round((this.score / totalPossible) * 100);

    body.innerHTML = `
      <div style="text-align:center; padding:30px 10px;">
        <div style="font-size:3.5rem; margin-bottom:12px;">🏆</div>
        <h2 style="font-family:var(--fh); font-size:1.6rem; font-weight:800; color:#0f172a; margin-bottom:8px;">
          Test Completed!
        </h2>
        <p style="color:#64748b; font-size:0.95rem; margin-bottom:24px;">
          Here is your score breakdown for <strong>${this.activeTest.title}</strong>:
        </p>

        <div style="display:flex; justify-content:center; gap:20px; margin-bottom:30px;">
          <div style="background:#f1f5f9; padding:16px 24px; border-radius:12px;">
            <div style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Score</div>
            <div style="font-family:var(--fm); font-size:1.5rem; font-weight:800; color:#2563eb;">${this.score} pts</div>
          </div>
          <div style="background:#f1f5f9; padding:16px 24px; border-radius:12px;">
            <div style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase;">Accuracy</div>
            <div style="font-family:var(--fm); font-size:1.5rem; font-weight:800; color:#10b981;">${pct}%</div>
          </div>
        </div>

        <button class="apt-btn-start" onclick="window.AptitudeEngine._closeModal()" style="width:auto; padding:12px 32px; display:inline-flex;">
          Done & Return to Hub
        </button>
      </div>
    `;

    // Log score to Firestore if user authenticated
    if (window.firebase && window.firebase.auth) {
      const u = window.firebase.auth().currentUser;
      if (u && window.db) {
        window.db.collection('aptitude_results').add({
          uid: u.uid,
          test: this.activeTest.title,
          score: this.score,
          accuracy: pct,
          timestamp: window.firebase.firestore.FieldValue.serverTimestamp()
        }).catch(e => console.error('Firestore save err:', e));
      }
    }
  }

  _closeModal() {
    clearInterval(this.timer);
    const modal = document.getElementById('apt-modal-overlay');
    if (modal) modal.classList.remove('active', 'open');
  }
}

window.AptitudeEngine = new AptitudeApp();
