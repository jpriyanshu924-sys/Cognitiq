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
    const puzzle = this._gen();
    this._cur = puzzle;
    this._render(puzzle);
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

  _gen() {
    const shapes = ['circle','triangle','square','diamond','pentagon','hexagon'];
    const colors = ['#a78bfa','#67e8f9','#6ee7b7','#fcd34d','#fca5a5','#f9a8d4','#fb923c'];

    const rulePool = this.level === 1
      ? ['shape-row','color-row']
      : this.level === 2
        ? ['shape-row','color-col','size-row','count-row']
        : ['combo','count-row','size-col','combo'];

    const rule = this._rand(rulePool);
    let cells=[], missingIdx, answer, wrongs;

    const s3 = this._shuffle(shapes).slice(0,3);
    const c3 = this._shuffle(colors).slice(0,3);
    const sizes = [22,32,42];

    if (rule === 'shape-row') {
      // Each row: same shape; columns vary by color cycling
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[r], color:c3[c], size:34, count:1});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[(mr+1)%3], color:c3[mc], size:34, count:1},
        {shape:s3[(mr+2)%3], color:c3[(mc+1)%3], size:34, count:1},
        {shape:s3[mr], color:c3[(mc+2)%3], size:22, count:1},
      ];
    } else if (rule === 'color-row') {
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[c], color:c3[r], size:34, count:1});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[mc], color:c3[(mr+1)%3], size:34, count:1},
        {shape:s3[(mc+1)%3], color:c3[mr], size:34, count:1},
        {shape:s3[(mc+2)%3], color:c3[(mr+2)%3], size:34, count:1},
      ];
    } else if (rule === 'color-col') {
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[r], color:c3[c], size:34, count:1});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[(mr+1)%3], color:c3[mc], size:34, count:1},
        {shape:s3[mr], color:c3[(mc+1)%3], size:34, count:1},
        {shape:s3[(mr+2)%3], color:c3[(mc+2)%3], size:34, count:1},
      ];
    } else if (rule === 'size-row') {
      const baseColor = this._rand(c3);
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[c], color:baseColor, size:sizes[r], count:1});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[mc], color:baseColor, size:sizes[(mr+1)%3], count:1},
        {shape:s3[(mc+1)%3], color:baseColor, size:sizes[mr], count:1},
        {shape:s3[mc], color:c3[(c3.indexOf(baseColor)+1)%3], size:sizes[(mr+2)%3], count:1},
      ];
    } else if (rule === 'size-col') {
      const baseColor = this._rand(c3);
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:s3[r], color:baseColor, size:sizes[c], count:1});
      missingIdx = Math.floor(Math.random()*9);
      const mr=Math.floor(missingIdx/3), mc=missingIdx%3;
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[mr], color:baseColor, size:sizes[(mc+1)%3], count:1},
        {shape:s3[(mr+1)%3], color:baseColor, size:sizes[mc], count:1},
        {shape:s3[mr], color:c3[1], size:sizes[(mc+2)%3], count:1},
      ];
    } else if (rule === 'count-row') {
      const baseShape = this._rand(s3), baseColor = this._rand(c3);
      const cnts = [[1,2,3],[2,3,1],[3,1,2]];
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({shape:baseShape, color:baseColor, size:28, count:cnts[r][c]});
      missingIdx = Math.floor(Math.random()*9);
      answer = cells[missingIdx];
      wrongs = [
        {...answer, count:(answer.count%3)+1},
        {...answer, count:((answer.count+1)%3)+1},
        {...answer, color:c3[(c3.indexOf(baseColor)+1)%3]},
      ];
    } else { // combo: latin-square of shape × color
      const mx = [
        [{shape:s3[0],color:c3[0]},{shape:s3[1],color:c3[1]},{shape:s3[2],color:c3[2]}],
        [{shape:s3[1],color:c3[2]},{shape:s3[2],color:c3[0]},{shape:s3[0],color:c3[1]}],
        [{shape:s3[2],color:c3[1]},{shape:s3[0],color:c3[2]},{shape:s3[1],color:c3[0]}],
      ];
      for (let r=0;r<3;r++) for (let c=0;c<3;c++) cells.push({...mx[r][c], size:34, count:1});
      missingIdx = Math.floor(Math.random()*9);
      answer = cells[missingIdx];
      wrongs = [
        {shape:s3[(s3.indexOf(answer.shape)+1)%3], color:answer.color, size:34, count:1},
        {shape:answer.shape, color:c3[(c3.indexOf(answer.color)+1)%3], size:34, count:1},
        {shape:s3[(s3.indexOf(answer.shape)+2)%3], color:c3[(c3.indexOf(answer.color)+2)%3], size:34, count:1},
      ];
    }

    // De-dupe wrongs
    wrongs = wrongs.filter(w => JSON.stringify(w) !== JSON.stringify(answer)).slice(0,3);
    while (wrongs.length < 3) {
      wrongs.push({shape:this._rand(shapes), color:this._rand(colors), size:34, count:answer.count||1});
    }

    const choices = this._shuffle([answer, ...wrongs]);
    return { cells, missingIdx, answer, choices, answerIdx: choices.indexOf(answer) };
  }

  _drawShape(ctx, cell, cx, cy) {
    const {shape, color, size, count=1} = cell;
    const positions = count===1 ? [[cx,cy]]
      : count===2 ? [[cx-13,cy],[cx+13,cy]]
      : [[cx-16,cy+8],[cx,cy-12],[cx+16,cy+8]];

    ctx.fillStyle = color;
    positions.forEach(([px,py]) => {
      ctx.beginPath();
      const s = size/2;
      switch(shape) {
        case 'circle':
          ctx.arc(px,py,s,0,2*Math.PI); break;
        case 'triangle':
          ctx.moveTo(px,py-s); ctx.lineTo(px+s,py+s); ctx.lineTo(px-s,py+s); ctx.closePath(); break;
        case 'square':
          ctx.rect(px-s,py-s,size,size); break;
        case 'diamond':
          ctx.moveTo(px,py-s); ctx.lineTo(px+s,py); ctx.lineTo(px,py+s); ctx.lineTo(px-s,py); ctx.closePath(); break;
        case 'pentagon':
          for(let i=0;i<5;i++){const a=(2*Math.PI*i/5)-Math.PI/2;i===0?ctx.moveTo(px+s*Math.cos(a),py+s*Math.sin(a)):ctx.lineTo(px+s*Math.cos(a),py+s*Math.sin(a));}ctx.closePath(); break;
        case 'hexagon':
          for(let i=0;i<6;i++){const a=2*Math.PI*i/6;i===0?ctx.moveTo(px+s*Math.cos(a),py+s*Math.sin(a)):ctx.lineTo(px+s*Math.cos(a),py+s*Math.sin(a));}ctx.closePath(); break;
      }
      ctx.fill();
    });
  }

  _render(puzzle) {
    if (!this.el) return;
    const CS = 98;
    this.el.innerHTML = `
      <div class="game-q-label">Question ${this.q} &nbsp;·&nbsp; Streak 🔥${this.streak}</div>
      <div class="prog-bar" style="width:100%;max-width:420px"><div class="prog-fill" style="width:${Math.min(100,this.correct*8)}%"></div></div>
      <div class="pm-grid" id="pm-grid"></div>
      <p style="font-size:.78rem;color:var(--muted)">Which option completes the pattern?</p>
      <div class="pm-choices" id="pm-choices"></div>`;

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
    ['A','B','C','D'].forEach((lbl,i) => {
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
    this.cb.onEnd({
      score: this.score, accuracy: this.total ? (this.correct/this.total)*100 : 0,
      avgTime: this.times.length ? this.times.reduce((a,b)=>a+b,0)/this.times.length : 0,
      correct: this.correct, total: this.total, level: this.level
    });
  }

  destroy() { this.el = null; }
}

window.PatternMatrixGame = PatternMatrixGame;
