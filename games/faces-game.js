/* ══════════════════════════════════════════════════════
   Pymetrics Game 9: Faces Game
   Measures: Emotional intelligence, social cognition
   Real equivalent: Pymetrics Faces / Reading the Mind in the Eyes
   Uses SVG-drawn expressive cartoon faces (no real photos needed)
══════════════════════════════════════════════════════ */
class FacesGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.times = []; this.level = 1;
    this.locked = false; this.el = null; this.q = 0;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'faces-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _emotions() {
    return ['Happy', 'Sad', 'Angry', 'Surprised', 'Fearful', 'Disgusted', 'Neutral', 'Contempt', 'Excited', 'Confused'];
  }

  // Generate SVG face for each emotion
  _drawFace(emotion) {
    const e = emotion.toLowerCase();

    // Base face
    const skinColor = '#f5c5a3';
    const hairColor = '#4a3728';

    // Feature parameters per emotion
    const feats = {
      happy:     { mouth: 'smile',     brows: 'neutral',  eyes: 'open',      extra: '' },
      sad:       { mouth: 'frown',     brows: 'sad',      eyes: 'half',      extra: '' },
      angry:     { mouth: 'grimace',   brows: 'angry',    eyes: 'squint',    extra: '' },
      surprised: { mouth: 'open',      brows: 'raised',   eyes: 'wide',      extra: '' },
      fearful:   { mouth: 'open-s',   brows: 'worried',  eyes: 'wide-t',    extra: '' },
      disgusted: { mouth: 'sneer',     brows: 'disgust',  eyes: 'half',      extra: '' },
      neutral:   { mouth: 'line',      brows: 'neutral',  eyes: 'open',      extra: '' },
      contempt:  { mouth: 'smirk',     brows: 'one-up',   eyes: 'lidded',    extra: '' },
      excited:   { mouth: 'big-smile', brows: 'up',       eyes: 'wide-happy',extra: '' },
      confused:  { mouth: 'zigzag',    brows: 'one-up',   eyes: 'squint-l',  extra: '' },
    };
    const f = feats[e] || feats['neutral'];

    const mouthPaths = {
      smile:     `M 75 130 Q 100 148 125 130`,
      frown:     `M 75 140 Q 100 122 125 140`,
      grimace:   `M 72 132 L 78 128 L 90 136 L 100 128 L 110 136 L 122 128 L 128 132`,
      open:      `M 82 130 Q 100 150 118 130 Q 100 138 82 130`,
      'open-s':  `M 88 130 Q 100 145 112 130 Q 100 136 88 130`,
      sneer:     `M 75 133 Q 88 128 100 133 Q 100 143 75 133`,
      line:      `M 80 135 L 120 135`,
      smirk:     `M 80 135 Q 95 130 110 138`,
      'big-smile':`M 70 128 Q 100 155 130 128`,
      zigzag:    `M 80 135 L 90 128 L 100 135 L 110 128 L 120 135`,
    };

    const eyePaths = {
      open:      (cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="11" fill="#2d1b00"/><circle cx="${cx+3}" cy="${cy-3}" r="3" fill="white"/>`,
      half:      (cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="7" fill="#2d1b00"/><circle cx="${cx+3}" cy="${cy-1}" r="2.5" fill="white"/>`,
      wide:      (cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="14" fill="#2d1b00"/><circle cx="${cx+4}" cy="${cy-5}" r="4" fill="white"/>`,
      squint:    (cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="5" fill="#2d1b00"/>`,
      lidded:    (cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="9" fill="#2d1b00"/><circle cx="${cx+3}" cy="${cy-2}" r="3" fill="white"/>`,
      'wide-t':  (cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="14" fill="#2d1b00"/><circle cx="${cx}" cy="${cy-5}" r="5" fill="white"/>`,
      'wide-happy':(cx,cy) => `<ellipse cx="${cx}" cy="${cy}" rx="12" ry="12" fill="#2d1b00"/><circle cx="${cx+4}" cy="${cy-3}" r="3.5" fill="white"/>`,
      'squint-l':(cx,cy,lr) => lr==='L'
        ? `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="5" fill="#2d1b00"/>`
        : `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="11" fill="#2d1b00"/>`,
    };

    const browPaths = {
      neutral:  (cx,cy) => `<path d="M${cx-12} ${cy} Q${cx} ${cy-2} ${cx+12} ${cy}" stroke="#4a3728" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      sad:      (cx,cy) => `<path d="M${cx-12} ${cy-3} Q${cx} ${cy+3} ${cx+12} ${cy-3}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`,
      angry:    (cx,cy,lr) => `<path d="M${cx-12} ${cy+2} Q${cx} ${cy-3} ${cx+12} ${lr==='L'?cy+2:cy}" stroke="#4a3728" stroke-width="3" fill="none"/>`,
      raised:   (cx,cy) => `<path d="M${cx-12} ${cy-6} Q${cx} ${cy-8} ${cx+12} ${cy-6}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`,
      worried:  (cx,cy) => `<path d="M${cx-12} ${cy-4} Q${cx} ${cy} ${cx+12} ${cy-4}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`,
      disgust:  (cx,cy) => `<path d="M${cx-12} ${cy} Q${cx} ${cy-4} ${cx+12} ${cy+2}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`,
      'one-up': (cx,cy,lr) => lr==='L'
        ? `<path d="M${cx-12} ${cy-5} Q${cx} ${cy-7} ${cx+12} ${cy-5}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`
        : `<path d="M${cx-12} ${cy} Q${cx} ${cy-2} ${cx+12} ${cy}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`,
      up:       (cx,cy) => `<path d="M${cx-12} ${cy-7} Q${cx} ${cy-10} ${cx+12} ${cy-7}" stroke="#4a3728" stroke-width="2.5" fill="none"/>`,
    };

    const eyeFn = eyePaths[f.eyes] || eyePaths.open;
    const browFn = browPaths[f.brows] || browPaths.neutral;

    const leftEye  = eyeFn(80, 95, 'L');
    const rightEye = eyeFn(120, 95, 'R');
    const leftBrow  = browFn(80, 76, 'L');
    const rightBrow = browFn(120, 76, 'R');
    const mouthPath = mouthPaths[f.mouth] || mouthPaths.line;

    // Emotion-specific blush / tears
    const extras = {
      happy:   `<ellipse cx="70" cy="110" rx="10" ry="6" fill="rgba(255,150,150,.3)"/><ellipse cx="130" cy="110" rx="10" ry="6" fill="rgba(255,150,150,.3)"/>`,
      sad:     `<line x1="75" y1="102" x2="68" y2="125" stroke="rgba(100,180,255,.6)" stroke-width="2"/><line x1="125" y1="102" x2="132" y2="125" stroke="rgba(100,180,255,.6)" stroke-width="2"/>`,
      excited: `<ellipse cx="68" cy="112" rx="11" ry="7" fill="rgba(255,120,120,.35)"/><ellipse cx="132" cy="112" rx="11" ry="7" fill="rgba(255,120,120,.35)"/>`,
      fearful: `<line x1="75" y1="102" x2="70" y2="118" stroke="rgba(180,200,255,.6)" stroke-width="1.5"/>`,
    };
    const extra = extras[e] || '';

    return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Hair -->
  <ellipse cx="100" cy="75" rx="68" ry="58" fill="${hairColor}"/>
  <!-- Face -->
  <ellipse cx="100" cy="115" rx="60" ry="65" fill="${skinColor}"/>
  <!-- Ears -->
  <ellipse cx="40" cy="115" rx="10" ry="14" fill="${skinColor}"/>
  <ellipse cx="160" cy="115" rx="10" ry="14" fill="${skinColor}"/>
  <!-- Neck -->
  <rect x="82" y="170" width="36" height="22" rx="4" fill="${skinColor}"/>
  <!-- Eyes -->
  ${leftEye}${rightEye}
  <!-- Eyebrows -->
  ${leftBrow}${rightBrow}
  <!-- Nose -->
  <path d="M 100 100 Q 93 118 97 123 Q 100 126 103 123 Q 107 118 100 100" fill="rgba(0,0,0,.12)"/>
  <!-- Mouth -->
  <path d="${mouthPath}" stroke="#c0696e" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <!-- Extras -->
  ${extra}
</svg>`;
  }

  _rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  _shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  _gen() {
    const allEmotions = this._emotions();
    const primary = this._rand(allEmotions);

    // Level 1: 4 very distinct choices
    // Level 2: 4 choices including similar emotions
    // Level 3: more nuanced (e.g., excited vs happy)
    const similar = {
      happy: ['excited'], sad: ['fearful'], angry: ['disgusted'],
      surprised: ['fearful', 'excited'], fearful: ['surprised', 'sad'],
      disgusted: ['angry', 'contempt'], neutral: ['contempt'],
      contempt: ['neutral', 'disgusted'], excited: ['happy', 'surprised'],
      confused: ['surprised', 'neutral']
    };

    let pool = allEmotions.filter(e => e !== primary);
    if (this.level >= 2 && similar[primary.toLowerCase()]) {
      // Include similar ones as distractors
      const sim = similar[primary.toLowerCase()].map(s => s.charAt(0).toUpperCase() + s.slice(1));
      pool = [...new Set([...sim, ...pool])];
    }
    const distractors = this._shuffle(pool).slice(0, 3);
    const choices = this._shuffle([primary, ...distractors]);

    return { primary, choices, answerIdx: choices.indexOf(primary) };
  }

  _next() {
    this.q++;
    this.locked = false;
    this._t0 = Date.now();
    const puzzle = this._gen();
    this._cur = puzzle;
    this._render(puzzle);
  }

  _render(puzzle) {
    if (!this.el) return;
    this.el.innerHTML = `
      <div class="ap-wrapper">
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Question ${this.q}</span>
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
          <main class="ap-main" style="width: 100%">
            <div class="ap-workspace" style="max-width: 1200px">
              <h2 style="font-size:1.8rem;font-weight:800;color:#111827;margin-bottom:8px">Emotional Recognition</h2>
              <p style="font-size:0.88rem;color:#4b5563;margin-bottom:24px">Carefully observe the expression in the image below. Subtle cues in the eyes and mouth will reveal the subject's true emotion.</p>
              
              <div style="font-size:0.88rem;font-weight:600;color:#374151;margin-bottom:8px">Assessment Progress</div>
              <div class="prog-bar" style="width:100%;margin-bottom:24px;background-color:#e5e7eb;height:8px"><div class="prog-fill" style="width:${Math.min(100, (this.q / 15) * 100)}%;background-color:#059669;height:100%"></div></div>

              <div class="ap-face-grid">
                <!-- Left: Face Photo Card with blur focus toggle -->
                <div class="ap-face-left-card">
                  <div class="ap-face-wrapper" style="filter:blur(3px);transition:filter 0.25s;display:flex;align-items:center;justify-content:center" id="face-img-wrap">
                    ${this._drawFace(puzzle.primary)}
                  </div>
                  <button class="ap-face-focus-btn" id="face-focus-btn">🔍 Click to Focus</button>
                </div>

                <!-- Right: Identification Card -->
                <div class="ap-face-right-card">
                  <div class="ap-face-right-title-box">
                    <div>
                      <div class="ap-face-right-title">Identify Emotion</div>
                      <div class="ap-face-right-subtitle">Which of these labels best describes the expression shown?</div>
                    </div>
                  </div>

                  <div class="ap-face-choices-grid" id="faces-choices"></div>

                  <button class="ap-face-submit-btn" id="face-submit-btn" disabled>Submit Answer ➔</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>`;

    const wrap = this.el.querySelector('#face-img-wrap');
    const focusBtn = this.el.querySelector('#face-focus-btn');
    if (wrap && focusBtn) {
      const toggleFocus = () => {
        if (wrap.style.filter === 'none') {
          wrap.style.filter = 'blur(3px)';
          focusBtn.textContent = '🔍 Click to Focus';
        } else {
          wrap.style.filter = 'none';
          focusBtn.textContent = '👁️ Focused';
        }
      };
      focusBtn.addEventListener('click', toggleFocus);
      wrap.addEventListener('click', toggleFocus);
    }

    const choicesEl = this.el.querySelector('#faces-choices');
    let selectedIdx = null;

    puzzle.choices.forEach((em, i) => {
      const btn = document.createElement('button');
      btn.className = 'ap-face-choice-btn';
      btn.textContent = em;
      btn.addEventListener('click', () => {
        if (this.locked) return;
        this.el.querySelectorAll('.ap-face-choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedIdx = i;
        const submitBtn = this.el.querySelector('#face-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.add('ready');
        }
      });
      choicesEl.appendChild(btn);
    });

    const submitBtn = this.el.querySelector('#face-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (selectedIdx !== null) this._pick(selectedIdx, puzzle);
      });
    }

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _pick(idx, puzzle) {
    if (this.locked) return;
    this.locked = true;
    const rt = Date.now() - this._t0;
    this.times.push(rt); this.total++;

    const ok = idx === puzzle.answerIdx;
    const btns = this.el.querySelectorAll('.ap-face-choice-btn');
    
    // Highlight choices
    btns[puzzle.answerIdx].classList.add('correct');
    if (!ok) {
      btns[idx].classList.add('incorrect');
    }

    // Unblur face on choice
    const wrap = this.el.querySelector('#face-img-wrap');
    if (wrap) wrap.style.filter = 'none';

    if (ok) {
      this.correct++; this.streak++;
      if (this.correct % 6 === 0) this.level = Math.min(3, this.level + 1);
      const spdBonus = Math.max(0, Math.floor((4000 - rt) / 50));
      const pts = 100 + spdBonus + (this.streak >= 3 ? this.streak * 20 : 0);
      this.score += pts;
      this.cb.onScore(pts, this.streak);
      this.cb.onFeedback(true);
    } else {
      this.streak = 0;
      this.cb.onFeedback(false);
    }

    setTimeout(() => this._next(), 1200);
  }

  timeUp() {
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: this.times.length ? this.times.reduce((a, b) => a + b, 0) / this.times.length : 0,
      correct: this.correct, total: this.total, level: this.level
    });
  }

  destroy() { this.el = null; }
}

window.FacesGame = FacesGame;
