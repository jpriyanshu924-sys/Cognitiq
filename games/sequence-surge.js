/* ══════════════════════════════════════════════════════
   Game 2: Sequence Surge
   Recruitment equivalent: Arctic Shores, HireVue sequences
   Measures: Logical deduction, fluid intelligence
══════════════════════════════════════════════════════ */
class SequenceSurgeGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.q=0; this.correct=0; this.total=0;
    this.score=0; this.streak=0; this.times=[];
    this.level=1; this.locked=false; this.el=null;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'ss-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  _shuffle(arr) {
    const a=[...arr];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  }

  _gen() {
    const rules = this.level===1
      ? ['arith','arith','double']
      : this.level===2
        ? ['arith','fib','square','double']
        : ['fib','prime','square','cube','alt-arith'];

    const rule = this._rand(rules);
    let seq=[], answer, ruleLabel;

    if (rule === 'arith') {
      const start = Math.floor(Math.random()*8)+1;
      const step  = this._rand([2,3,4,5,7,-2,-3]);
      seq = [0,1,2,3,4].map(i => start + i*step);
      answer = start + 5*step;
      ruleLabel = `+${step}`;
    } else if (rule === 'double') {
      const start = this._rand([1,2,3]);
      seq = [0,1,2,3,4].map(i => start * Math.pow(2,i));
      answer = start * Math.pow(2,5);
      ruleLabel = '×2';
    } else if (rule === 'fib') {
      const a=1, b=this._rand([1,2,3]);
      let arr=[a,b];
      for(let i=2;i<6;i++) arr.push(arr[i-1]+arr[i-2]);
      seq=arr.slice(0,5); answer=arr[5];
      ruleLabel = 'Fibonacci';
    } else if (rule === 'square') {
      const off = Math.floor(Math.random()*3);
      seq = [1,2,3,4,5].map(i => (i+off)*(i+off));
      answer = (6+off)*(6+off);
      ruleLabel = 'n²';
    } else if (rule === 'cube') {
      seq = [1,2,3,4,5].map(i => i*i*i);
      answer = 216;
      ruleLabel = 'n³';
    } else if (rule === 'prime') {
      const primes=[2,3,5,7,11,13,17,19,23,29];
      const start=Math.floor(Math.random()*4);
      seq=primes.slice(start,start+5); answer=primes[start+5];
      ruleLabel='Primes';
    } else { // alt-arith
      const a=this._rand([2,3,4]), b=this._rand([1,2,3,5]);
      seq=[];
      let cur=this._rand([4,6,8,10]);
      for(let i=0;i<5;i++){seq.push(cur); cur+=(i%2===0?a:b);}
      answer=cur; ruleLabel=`+${a}/+${b}`;
    }

    // Build 4 choices
    const delta = Math.abs(answer)*0.2 || 3;
    const wrongs = this._shuffle([
      answer + Math.ceil(delta),
      answer - Math.ceil(delta),
      answer + Math.ceil(delta*2),
      answer - Math.ceil(delta*1.5),
    ].filter(w => w !== answer)).slice(0,3);

    const choices = this._shuffle([answer, ...wrongs]);
    return { seq, answer, ruleLabel, choices, answerIdx: choices.indexOf(answer) };
  }

  _render(puzzle) {
    if (!this.el) return;
    this.el.innerHTML = `
      <div class="game-q-label">Question ${this.q} &nbsp;·&nbsp; Streak 🔥${this.streak}</div>
      <div class="prog-bar" style="width:100%;max-width:500px"><div class="prog-fill" style="width:${Math.min(100,this.correct*7)}%"></div></div>
      <div class="ss-display" id="ss-disp"></div>
      <p style="font-size:.78rem;color:var(--muted)">What comes next in the sequence?</p>
      <div class="ss-choices" id="ss-choices"></div>`;

    const disp = this.el.querySelector('#ss-disp');
    puzzle.seq.forEach((n,i) => {
      if (i > 0) {
        const arr = document.createElement('span');
        arr.className='ss-arrow'; arr.textContent='→';
        disp.appendChild(arr);
      }
      const item = document.createElement('div');
      item.className='ss-item'; item.textContent=n;
      // Stagger animation
      setTimeout(()=>item.classList.add('lit'), i*80);
      disp.appendChild(item);
    });
    const arrFinal = document.createElement('span');
    arrFinal.className='ss-arrow'; arrFinal.textContent='→';
    disp.appendChild(arrFinal);
    const q = document.createElement('div');
    q.className='ss-q'; q.textContent='?';
    disp.appendChild(q);

    const choicesEl = this.el.querySelector('#ss-choices');
    puzzle.choices.forEach((val,i) => {
      const btn = document.createElement('button');
      btn.className='ss-choice'; btn.textContent=val;
      btn.addEventListener('click', () => this._pick(i, puzzle));
      choicesEl.appendChild(btn);
    });
  }

  _next() {
    this.q++; this.locked=false; this._t0=Date.now();
    const p=this._gen(); this._cur=p; this._render(p);
  }

  _pick(idx, puzzle) {
    if (this.locked) return;
    this.locked=true;
    const rt=Date.now()-this._t0; this.times.push(rt); this.total++;
    const ok=idx===puzzle.answerIdx;
    const btns=this.el.querySelectorAll('.ss-choice');
    if (ok) {
      btns[idx].classList.add('ok');
      this.correct++; this.streak++;
      if(this.correct%5===0) this.level=Math.min(3,this.level+1);
      const spd=Math.max(0,Math.floor((5000-rt)/100));
      const str=this.streak>=3?this.streak*20:0;
      const pts=100+spd+str; this.score+=pts;
      this.cb.onScore(pts,this.streak); this.cb.onFeedback(true);
    } else {
      btns[idx].classList.add('bad');
      btns[puzzle.answerIdx].classList.add('ok');
      this.streak=0; this.cb.onFeedback(false);
    }
    setTimeout(()=>this._next(),1100);
  }

  timeUp() {
    this.cb.onEnd({
      score:this.score, accuracy:this.total?(this.correct/this.total)*100:0,
      avgTime:this.times.length?this.times.reduce((a,b)=>a+b,0)/this.times.length:0,
      correct:this.correct, total:this.total, level:this.level
    });
  }

  destroy() { this.el=null; }
}

window.SequenceSurgeGame = SequenceSurgeGame;
