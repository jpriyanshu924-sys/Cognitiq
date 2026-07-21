/* ══════════════════════════════════════════════════════
   Game 1: Pattern Matrix
   Recruitment equivalent: Cognify "Resemble", SHL Matrices
   Measures: Abstract reasoning, inductive logic
   ══════════════════════════════════════════════════════ */
class PatternMatrixGame {
  constructor(container, cb) {
    this.container = container;
    this.cb = cb;
    this.q = 0; this.correct = 0; this.total = 0;
    this.score = 0; this.streak = 0;
    this.times = []; this.level = 1;
    this.locked = false; this.el = null;
    this._roundTimer = null;
    this._roundInterval = null;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'pm-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _next() {
    this.q++;
    this.locked = false;
    this._t0 = Date.now();
    
    // Clear existing round timer & interval
    clearTimeout(this._roundTimer);
    clearInterval(this._roundInterval);

    const puzzle = this._gen();
    this._cur = puzzle;
    this._render(puzzle);
    this._startRoundTimer();
  }

  _rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length-1; i > 0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _startRoundTimer() {
    let timeLeft = 30;
    const timerText = document.getElementById('pm-round-timer');
    if (timerText) timerText.textContent = timeLeft;

    this._roundInterval = setInterval(() => {
      timeLeft--;
      const textEl = document.getElementById('pm-round-timer');
      if (textEl) textEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(this._roundInterval);
        this._handleTimeout();
      }
    }, 1000);
  }

  _handleTimeout() {
    if (this.locked) return;
    this.locked = true;
    this.total++;
    this.streak = 0;
    this.cb.onFeedback(false);

    const choices = this.el.querySelectorAll('.pm-choice');
    choices[this._cur.answerIdx].classList.add('reveal');

    const warning = document.createElement('div');
    warning.style.color = '#ef4444';
    warning.style.fontWeight = '700';
    warning.style.marginTop = '12px';
    warning.textContent = '⏱️ Time out! Skipping...';
    this.el.appendChild(warning);

    setTimeout(() => this._next(), 1500);
  }

  _gen() {
    const shapes = ['circle','triangle','square','diamond','pentagon','hexagon'];
    const colors = ['#a78bfa','#67e8f9','#6ee7b7','#fcd34d','#fca5a5','#f9a8d4','#fb923c'];

    const rulePool = this.level === 1
      ? ['shape-row','color-row']
      : this.level === 2
        ? ['color-col','size-row','count-row','rotation']
        : ['combo','count-row','overlay','rotation'];

    const rule = this._rand(rulePool);
    let cells=[], missingIdx, answer, wrongs = [];

    const s3 = this._shuffle(shapes).slice(0,3);
    const c3 = this._shuffle(colors).slice(0,3);
    const sizes = [22,32,42];

    if (rule === 'shape-row') {
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[r], color:c3[c], size:34, count:1, rotation:0});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[(mr+1)%3], color:c3[mc], size:34, count:1, rotation:0},
        {shape:s3[(mr+2)%3], color:c3[(mc+1)%3], size:34, count:1, rotation:0},
        {shape:s3[mr], color:c3[(mc+2)%3], size:22, count:1, rotation:0},
        {shape:s3[mr], color:c3[mc], size:42, count:1, rotation:90},
        {shape:s3[(mr+1)%3], color:c3[(mc+2)%3], size:34, count:2, rotation:0}
      ];
    } else if (rule === 'color-row') {
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[c], color:c3[r], size:34, count:1, rotation:0});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[mc], color:c3[(mr+1)%3], size:34, count:1, rotation:0},
        {shape:s3[(mc+1)%3], color:c3[mr], size:34, count:1, rotation:0},
        {shape:s3[(mc+2)%3], color:c3[(mr+2)%3], size:34, count:1, rotation:0},
        {shape:s3[mc], color:c3[mr], size:22, count:1, rotation:0},
        {shape:s3[(mc+1)%3], color:c3[(mr+1)%3], size:34, count:2, rotation:0}
      ];
    } else if (rule === 'color-col') {
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[r], color:c3[c], size:34, count:1, rotation:0});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[(mr+1)%3], color:c3[mc], size:34, count:1, rotation:0},
        {shape:s3[mr], color:c3[(mc+1)%3], size:34, count:1, rotation:0},
        {shape:s3[(mr+2)%3], color:c3[(mc+2)%3], size:34, count:1, rotation:0},
        {shape:s3[mr], color:c3[mc], size:42, count:1, rotation:180},
        {shape:s3[(mr+1)%3], color:c3[(mc+1)%3], size:22, count:2, rotation:0}
      ];
    } else if (rule === 'size-row') {
      const baseColor = this._rand(c3);
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[c], color:baseColor, size:sizes[r], count:1, rotation:0});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[mc], color:baseColor, size:sizes[(mr+1)%3], count:1, rotation:0},
        {shape:s3[(mc+1)%3], color:baseColor, size:sizes[mr], count:1, rotation:0},
        {shape:s3[mc], color:c3[(c3.indexOf(baseColor)+1)%3], size:sizes[(mr+2)%3], count:1, rotation:0},
        {shape:s3[(mc+2)%3], color:baseColor, size:sizes[mr], count:2, rotation:90},
        {shape:s3[mc], color:baseColor, size:sizes[mr], count:1, rotation:180}
      ];
    } else if (rule === 'count-row') {
      const baseShape = this._rand(s3), baseColor = this._rand(c3);
      const cnts = [[1,2,3],[2,3,1],[3,1,2]];
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:baseShape, color:baseColor, size:28, count:cnts[r][c], rotation:0});
      missingIdx = Math.floor(Math.random()*9);
      answer = cells[missingIdx];
      wrongs = [
        {...answer, count:(answer.count%3)+1},
        {...answer, count:((answer.count+1)%3)+1},
        {...answer, color:c3[(c3.indexOf(baseColor)+1)%3]},
        {...answer, shape:s3[(s3.indexOf(baseShape)+1)%3]},
        {...answer, rotation:90}
      ];
    } else if (rule === 'rotation') {
      const baseShape = this._rand(s3), baseColor = this._rand(c3);
      const angles = [0, 90, 180];
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:baseShape, color:baseColor, size:34, count:1, rotation:angles[c]});
      missingIdx = Math.floor(Math.random()*9);
      answer = cells[missingIdx];
      wrongs = [
        {...answer, rotation:(answer.rotation+90)%360},
        {...answer, rotation:(answer.rotation+270)%360},
        {...answer, shape:s3[(s3.indexOf(baseShape)+1)%3]},
        {...answer, color:colors[(colors.indexOf(baseColor)+2)%colors.length]},
        {...answer, size:22}
      ];
    } else if (rule === 'overlay') {
      const shapesPool = this._shuffle(shapes);
      const colorsPool = this._shuffle(colors);
      for (let r=0;r<3;r++) {
        const s1 = shapesPool[r], s2 = shapesPool[(r+1)%6];
        const c1 = colorsPool[r], c2 = colorsPool[(r+1)%7];
        cells.push({shape: [s1], color: [c1], size: 38, count: 1, rotation: 0});
        cells.push({shape: [s2], color: [c2], size: 28, count: 1, rotation: 0});
        cells.push({shape: [s1, s2], color: [c1, c2], size: [38, 22], count: 1, rotation: 0});
      }
      missingIdx = Math.floor(Math.random()*9);
      answer = cells[missingIdx];
      const mr = Math.floor(missingIdx/3);
      const wrongShape = shapesPool[(mr+2)%6];
      const correctOverlay = cells[mr*3 + 2];
      wrongs = [
        {shape: [correctOverlay.shape[0]], color: [correctOverlay.color[0]], size: 38, count: 1, rotation: 0},
        {shape: [correctOverlay.shape[0], wrongShape], color: [correctOverlay.color[0], '#ef4444'], size: [38, 22], count: 1, rotation: 0},
        {shape: [wrongShape], color: [correctOverlay.color[0]], size: 38, count: 1, rotation: 0},
        {shape: [correctOverlay.shape[1], correctOverlay.shape[0]], color: [correctOverlay.color[1], correctOverlay.color[0]], size: [28, 38], count: 1, rotation: 45},
        {shape: [correctOverlay.shape[0], correctOverlay.shape[1]], color: [correctOverlay.color[0], correctOverlay.color[1]], size: [38, 22], count: 2, rotation: 0}
      ];
    } else {
      const mx = [
        [{shape:s3[0],color:c3[0]},{shape:s3[1],color:c3[1]},{shape:s3[2],color:c3[2]}],
        [{shape:s3[1],color:c3[2]},{shape:s3[2],color:c3[0]},{shape:s3[0],color:c3[1]}],
        [{shape:s3[2],color:c3[1]},{shape:s3[0],color:c3[2]},{shape:s3[1],color:c3[0]}],
      ];
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({...mx[r][c], size:34, count:1, rotation:0});
      missingIdx = Math.floor(Math.random()*9);
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[(s3.indexOf(answer.shape)+1)%3], color:answer.color, size:34, count:1, rotation:0},
        {shape:answer.shape, color:c3[(c3.indexOf(answer.color)+1)%3], size:34, count:1, rotation:0},
        {shape:s3[(s3.indexOf(answer.shape)+2)%3], color:c3[(c3.indexOf(answer.color)+2)%3], size:34, count:1, rotation:0},
        {shape:answer.shape, color:answer.color, size:22, count:1, rotation:90},
        {shape:s3[(s3.indexOf(answer.shape)+1)%3], color:c3[(c3.indexOf(answer.color)+1)%3], size:34, count:2, rotation:0}
      ];
    }

    cells = cells.map(c => this._normalizeCell(c));
    answer = this._normalizeCell(answer);
    wrongs = wrongs.map(w => this._normalizeCell(w));

    wrongs = wrongs.filter(w => JSON.stringify(w.shape) !== JSON.stringify(answer.shape) || JSON.stringify(w.color) !== JSON.stringify(answer.color) || w.size[0] !== answer.size[0] || w.count !== answer.count || w.rotation !== answer.rotation).slice(0, 5);
    while (wrongs.length < 5) {
      wrongs.push(this._normalizeCell({shape:this._rand(shapes), color:this._rand(colors), size:34, count:answer.count||1, rotation:0}));
    }

    const choices = this._shuffle([answer, ...wrongs]);
    return { cells, missingIdx, answer, choices, answerIdx: choices.indexOf(answer) };
  }

  _normalizeCell(c) {
    return {
      shape: Array.isArray(c.shape) ? c.shape : [c.shape],
      color: Array.isArray(c.color) ? c.color : [c.color],
      size: Array.isArray(c.size) ? c.size : [c.size],
      count: c.count ?? 1,
      rotation: c.rotation ?? 0
    };
  }

  _drawShape(ctx, cell, cx, cy) {
    const {shape, color, size, count=1, rotation=0} = cell;
    const positions = count===1 ? [[0,0]]
      : count===2 ? [[-16,0],[16,0]]
      : [[-18,10],[0,-12],[18,10]];

    ctx.clearRect(0,0,cx*2,cy*2);
    positions.forEach(([px,py]) => {
      for (let i = 0; i < shape.length; i++) {
        const sh = shape[i];
        const col = color[i] || color[0];
        const sz = size[i] || size[0];
        const s = sz/2;

        ctx.save();
        ctx.translate(cx + px, cy + py);
        ctx.rotate((rotation * Math.PI) / 180);

        ctx.fillStyle = col;
        ctx.beginPath();
        switch(sh) {
          case 'circle':
            ctx.arc(0,0,s,0,2*Math.PI); break;
          case 'triangle':
            ctx.moveTo(0,-s); ctx.lineTo(s,s); ctx.lineTo(-s,s); ctx.closePath(); break;
          case 'square':
            ctx.rect(-s,-s,sz,sz); break;
          case 'diamond':
            ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0); ctx.closePath(); break;
          case 'pentagon':
            for(let k=0;k<5;k++){const a=(2*Math.PI*k/5)-Math.PI/2;k===0?ctx.moveTo(s*Math.cos(a),s*Math.sin(a)):ctx.lineTo(s*Math.cos(a),s*Math.sin(a));}ctx.closePath(); break;
          case 'hexagon':
            for(let k=0;k<6;k++){const a=2*Math.PI*k/6;k===0?ctx.moveTo(s*Math.cos(a),s*Math.sin(a)):ctx.lineTo(s*Math.cos(a),s*Math.sin(a));}ctx.closePath(); break;
        }
        ctx.fill();
        ctx.restore();
      }
    });
  }

  _render(puzzle) {
    if (!this.el) return;
    const CS = 98;
    this.el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; max-width:420px; margin: 0 auto 12px">
        <div class="game-q-label" style="margin-bottom:0">Question ${this.q} &nbsp;·&nbsp; Streak 🔥${this.streak}</div>
        <div style="font-size:0.82rem; font-weight:800; color:#ef4444; background:rgba(239,68,68,0.08); padding:4px 10px; border-radius:12px; min-width:80px; text-align:center">
          ⏱️ <span id="pm-round-timer">30</span>s
        </div>
      </div>
      <div class="prog-bar" style="width:100%;max-width:420px;margin:0 auto 20px"><div class="prog-fill" style="width:${Math.min(100,this.correct*8)}%"></div></div>
      <div class="pm-grid" id="pm-grid"></div>
      <p style="font-size:.78rem;color:var(--muted);text-align:center;margin-top:16px">Which option completes the pattern?</p>
      <div class="pm-choices" id="pm-choices" style="display:grid; gap:10px; width:100%; margin-top:12px"></div>`;

    const grid = this.el.querySelector('#pm-grid');
    puzzle.cells.forEach((cell,i) => {
      const div = document.createElement('div');
      div.className = 'pm-cell' + (i===puzzle.missingIdx ? ' missing' : '');
      if (i === puzzle.missingIdx) {
        div.textContent = '?';
      } else {
        const cvs = document.createElement('canvas');
        cvs.width = CS; cvs.height = CS;
        this._drawShape(cvs.getContext('2d'), cell, CS/2, CS/2);
        div.appendChild(cvs);
      }
      grid.appendChild(div);
    });

    const choicesEl = this.el.querySelector('#pm-choices');
    choicesEl.style.gridTemplateColumns = window.innerWidth < 500 ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)';

    const labels = ['A','B','C','D','E','F'];
    labels.forEach((lbl,i) => {
      const btn = document.createElement('div');
      btn.className = 'pm-choice';
      const cvs = document.createElement('canvas');
      cvs.width = CS; cvs.height = CS;
      this._drawShape(cvs.getContext('2d'), puzzle.choices[i], CS/2, CS/2);
      btn.appendChild(cvs);
      const lblEl = document.createElement('span');
      lblEl.className = 'choice-lbl'; lblEl.textContent = lbl;
      btn.appendChild(lblEl);
      btn.addEventListener('click', () => this._pick(i, puzzle));
      choicesEl.appendChild(btn);
    });
  }

  _pick(idx, puzzle) {
    if (this.locked) return;
    this.locked = true;
    clearInterval(this._roundInterval);
    
    const rt = Date.now() - this._t0;
    this.times.push(rt);
    this.total++;

    const ok = idx === puzzle.answerIdx;
    const choices = this.el.querySelectorAll('.pm-choice');

    if (ok) {
      choices[idx].classList.add('ok');
      this.correct++; this.streak++;
      if (this.correct % 5 === 0) this.level = Math.min(3, this.level+1);
      const spd = Math.max(0, Math.floor((5500-rt)/110));
      const str = this.streak >= 3 ? this.streak*25 : 0;
      const pts = 100 + spd + str;
      this.score += pts;
      this.cb.onScore(pts, this.streak);
      this.cb.onFeedback(true);
    } else {
      choices[idx].classList.add('bad');
      choices[puzzle.answerIdx].classList.add('reveal');
      this.streak = 0;
      this.cb.onFeedback(false);
    }
    setTimeout(() => this._next(), 1200);
  }

  timeUp() {
    clearInterval(this._roundInterval);
    this.cb.onEnd({
      score: this.score, accuracy: this.total ? (this.correct/this.total)*100 : 0,
      avgTime: this.times.length ? this.times.reduce((a,b)=>a+b,0)/this.times.length : 0,
      correct: this.correct, total: this.total, level: this.level
    });
  }

  destroy() {
    clearInterval(this._roundInterval);
    this.el = null;
  }
}

window.PatternMatrixGame = PatternMatrixGame;
