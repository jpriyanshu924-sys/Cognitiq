/* ══════════════════════════════════════════════════════
   Pymetrics Game 7: Lengths Game
   Measures: Perceptual accuracy, attention to detail, estimation
   Real equivalent: Pymetrics Lengths / Line Bisection
══════════════════════════════════════════════════════ */
class LengthsGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.times = []; this.level = 1;
    this.locked = false; this.el = null;
    this.q = 0;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'len-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _next() {
    this.q++;
    this.locked = false;
    this._t0 = Date.now();
    const puzzle = this._gen();
    this._cur = puzzle;
    this._render(puzzle);
  }

  _gen() {
    // Game types rotate based on level and question number
    const modes = this.level === 1
      ? ['which-longer', 'which-longer', 'bisect']
      : this.level === 2
        ? ['which-longer', 'bisect', 'estimate', 'triple']
        : ['bisect', 'estimate', 'triple', 'which-longer'];

    const mode = modes[this.q % modes.length];

    if (mode === 'which-longer') {
      // Two lines, which is longer?
      const maxW = 350;
      const minL = 40;
      const diff = this.level === 1 ? 40 : this.level === 2 ? 20 : 10; // harder = closer lengths
      const lenA = minL + Math.floor(Math.random() * (maxW - minL - diff));
      const lenB = lenA + diff + Math.floor(Math.random() * diff * 0.5);
      const swap = Math.random() < 0.5;
      return {
        mode, question: 'Which line is longer?',
        lineA: swap ? lenB : lenA, lineB: swap ? lenA : lenB,
        answer: swap ? 'B' : 'A',
        choices: ['A', 'B']
      };
    } else if (mode === 'bisect') {
      // A line with a mark — is the mark left or right of center?
      const lineLen = 200 + Math.floor(Math.random() * 150);
      const exactCenter = lineLen / 2;
      const offset = (this.level === 1 ? 15 : this.level === 2 ? 8 : 5) + Math.floor(Math.random() * 10);
      const markPos = exactCenter + (Math.random() < 0.5 ? offset : -offset);
      const answer = markPos > exactCenter ? 'Right' : 'Left';
      return {
        mode, question: 'Is the mark left or right of center?',
        lineLen, markPos, answer,
        choices: ['Left', 'Right']
      };
    } else if (mode === 'estimate') {
      // Estimate what % of the canvas width a line covers
      const canvasW = 380;
      const lineLen = 60 + Math.floor(Math.random() * 280);
      const truePct = Math.round((lineLen / canvasW) * 100);
      const options = [truePct];
      while (options.length < 4) {
        const fake = Math.max(5, Math.min(95, truePct + (Math.random() < 0.5 ? -1 : 1) * (5 + Math.floor(Math.random() * 25))));
        if (!options.includes(fake)) options.push(fake);
      }
      options.sort((a, b) => a - b);
      return {
        mode, question: 'What percentage of the bar width does the line cover?',
        lineLen, canvasW, truePct, answer: truePct,
        choices: options
      };
    } else { // triple — which is the odd one out?
      const base = 60 + Math.floor(Math.random() * 200);
      const diff2 = (this.level === 1 ? 40 : 20) + Math.floor(Math.random() * 20);
      const oddIdx = Math.floor(Math.random() * 3);
      const lines = [base, base, base];
      lines[oddIdx] = base + diff2;
      return {
        mode, question: 'Which line is different from the other two?',
        lines, answer: String.fromCharCode(65 + oddIdx),
        choices: ['A', 'B', 'C']
      };
    }
  }

  _render(puzzle) {
    if (!this.el) return;
    const W = 380, H = 60;
    const baseColor = '#3b22d8';

    let canvasHtml = '';
    let choicesHtml = '';

    if (puzzle.mode === 'which-longer') {
      canvasHtml = `
        <canvas id="len-cvs" width="${W}" height="${H + 40}" class="len-canvas" style="background:transparent"></canvas>`;
      choicesHtml = puzzle.choices.map(c =>
        `<button class="btn ap-face-choice-btn len-btn" style="margin-top:0" data-ans="${c}">Line ${c}</button>`
      ).join('');
    } else if (puzzle.mode === 'bisect') {
      canvasHtml = `<canvas id="len-cvs" width="${W}" height="80" class="len-canvas" style="background:transparent"></canvas>`;
      choicesHtml = puzzle.choices.map(c =>
        `<button class="btn ap-face-choice-btn len-btn" style="margin-top:0" data-ans="${c}">${c}</button>`
      ).join('');
    } else if (puzzle.mode === 'estimate') {
      canvasHtml = `<canvas id="len-cvs" width="${W}" height="60" class="len-canvas" style="background:transparent"></canvas>`;
      choicesHtml = puzzle.choices.map(c =>
        `<button class="btn ap-face-choice-btn len-btn" style="margin-top:0" data-ans="${c}">${c}%</button>`
      ).join('');
    } else { // triple
      canvasHtml = `<canvas id="len-cvs" width="${W}" height="100" class="len-canvas" style="background:transparent"></canvas>`;
      choicesHtml = puzzle.choices.map(c =>
        `<button class="btn ap-face-choice-btn len-btn" style="margin-top:0" data-ans="${c}">Line ${c}</button>`
      ).join('');
    }

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
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
          <!-- Main Workspace -->
          <main class="ap-main" style="padding: 24px; width: 100%">
            <div class="ap-workspace" style="max-width: 600px">
              
              <!-- Title and Stats -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">${this.cb && this.cb.name ? this.cb.name : 'Lengths & Estimation'}</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.75rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 400px; justify-content: center; align-items: center; padding: 40px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Visual Estimation</div>
                <div class="ap-spin-badge" style="align-self:center; margin-bottom: 24px; background-color:#eff6ff; color:#3b22d8">
                  ${puzzle.mode === 'which-longer' ? '📏 Compare Lengths' : puzzle.mode === 'bisect' ? '🎯 Line Bisection' : puzzle.mode === 'estimate' ? '📊 Estimate %' : '🔲 Odd One Out'}
                </div>
                
                <div style="font-size:1.15rem; font-weight:800; color:#111827; margin-bottom:24px">${puzzle.question}</div>
                
                <div class="len-display" style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; padding:20px; width:100%; display:flex; align-items:center; justify-content:center; margin-bottom:32px">
                  ${canvasHtml}
                </div>

                <div class="ap-face-choices-grid" style="grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); width:100%">
                  ${choicesHtml}
                </div>
              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Perceptual Accuracy Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Measure and compare lengths, estimate percentages of fill, and find the mid-point of bisected lines as accurately and quickly as you can.
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

    // Draw on canvas
    const canvas = document.getElementById('len-cvs');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawLine = (y, startX, endX, color = baseColor, thick = 4, label = '') => {
      ctx.strokeStyle = color;
      ctx.lineWidth = thick;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(startX, y); ctx.lineTo(endX, y); ctx.stroke();
      if (label) {
        ctx.fillStyle = '#6b7280';
        ctx.font = 'bold 13px "JetBrains Mono",monospace';
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(label, 4, y);
      }
    };

    if (puzzle.mode === 'which-longer') {
      const margin = 30;
      drawLine(25, margin, margin + puzzle.lineA, '#3b22d8', 6, 'A');
      drawLine(65, margin, margin + puzzle.lineB, '#005d50', 6, 'B');
    } else if (puzzle.mode === 'bisect') {
      const margin = 20;
      const lineY = 40;
      const startX = (W - puzzle.lineLen) / 2;
      drawLine(lineY, startX, startX + puzzle.lineLen, baseColor, 4);
      // Mark
      ctx.strokeStyle = '#ea580c'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(puzzle.markPos, lineY - 12); ctx.lineTo(puzzle.markPos, lineY + 12); ctx.stroke();
    } else if (puzzle.mode === 'estimate') {
      const startX = 0;
      ctx.fillStyle = 'rgba(0,0,0,.04)';
      ctx.fillRect(0, 18, W, 24);
      drawLine(30, startX, startX + puzzle.lineLen, '#3b22d8', 18);
    } else { // triple
      const margin = 30;
      puzzle.lines.forEach((len, i) => {
        drawLine(20 + i * 33, margin, margin + len, i === ['A','B','C'].indexOf(puzzle.answer) ? '#ea580c' : '#3b22d8', 6, ['A','B','C'][i]);
      });
    }

    this.el.querySelectorAll('.len-btn').forEach(btn => {
      btn.addEventListener('click', () => this._pick(btn.dataset.ans, puzzle));
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _pick(ans, puzzle) {
    if (this.locked) return;
    this.locked = true;
    const rt = Date.now() - this._t0;
    this.times.push(rt); this.total++;

    const ok = String(ans) === String(puzzle.answer);
    const btns = this.el.querySelectorAll('.len-btn');
    btns.forEach(b => {
      if (String(b.dataset.ans) === String(puzzle.answer)) {
        b.style.backgroundColor = '#10b981';
        b.style.color = '#ffffff';
        b.style.borderColor = '#10b981';
      }
      if (String(b.dataset.ans) === String(ans) && !ok) {
        b.style.backgroundColor = '#ef4444';
        b.style.color = '#ffffff';
        b.style.borderColor = '#ef4444';
      }
    });

    if (ok) {
      this.correct++; this.streak++;
      if (this.correct % 6 === 0) this.level = Math.min(3, this.level + 1);
      const spdBonus = Math.max(0, Math.floor((3000 - rt) / 50));
      const pts = 80 + spdBonus + (this.streak >= 3 ? this.streak * 15 : 0);
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0; this.cb.onFeedback(false);
    }

    setTimeout(() => this._next(), 900);
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

window.LengthsGame = LengthsGame;
