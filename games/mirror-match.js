/* ══════════════════════════════════════════════════════
   Game 5: Mirror Match
   Recruitment equivalent: Saville Assessment, Aon Cut-e
   Measures: Reflection recognition, spatial awareness
══════════════════════════════════════════════════════ */
class MirrorMatchGame {
  constructor(container, cb) {
    this.container=container; this.cb=cb;
    this.q=0; this.correct=0; this.total=0;
    this.score=0; this.streak=0; this.times=[];
    this.level=1; this.locked=false; this.el=null;
  }

  start() {
    this.el=document.createElement('div');
    this.el.className='mm-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
  _shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  _genGrid(rows,cols,density=0.45) {
    // Generate a binary grid with some structure
    const grid=Array.from({length:rows},()=>Array(cols).fill(0));

    // Random pattern with density
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      grid[r][c]=Math.random()<density?1:0;
    }

    // Make sure it's not all zeros or all ones
    grid[0][0]=1; grid[rows-1][cols-1]=1;
    return grid;
  }

  _mirrorH(grid) { return grid.map(row=>[...row].reverse()); }
  _mirrorV(grid) { return [...grid].reverse().map(row=>[...row]); }
  _mirrorD(grid) { // diagonal (transpose + flip)
    const rows=grid.length, cols=grid[0].length;
    return Array.from({length:cols},(_,c)=>Array.from({length:rows},(_,r)=>grid[r][c]));
  }

  _mutateGrid(grid) {
    // Randomly flip 2-3 cells to create a plausible wrong answer
    const g=grid.map(r=>[...r]);
    const changes=2+Math.floor(Math.random()*2);
    for(let i=0;i<changes;i++){
      const r=Math.floor(Math.random()*g.length);
      const c=Math.floor(Math.random()*g[0].length);
      g[r][c]=1-g[r][c];
    }
    return g;
  }

  _drawGrid(ctx, grid, cellSize, color='#a78bfa', bgColor='rgba(255,255,255,.04)') {
    const rows=grid.length, cols=grid[0].length;
    const W=cols*cellSize, H=rows*cellSize;
    ctx.clearRect(0,0,W+2,H+2);

    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
      const x=c*cellSize, y=r*cellSize;
      if(grid[r][c]){
        ctx.fillStyle=color;
        ctx.shadowColor=color; ctx.shadowBlur=4;
        ctx.beginPath();
        ctx.roundRect(x+1,y+1,cellSize-2,cellSize-2,3);
        ctx.fill();
        ctx.shadowBlur=0;
      } else {
        ctx.fillStyle=bgColor;
        ctx.fillRect(x+1,y+1,cellSize-2,cellSize-2);
      }
    }
  }

  _gen() {
    const gridSize=this.level<=1?5:this.level<=2?6:7;
    const axis=this._rand(['horizontal','vertical','diagonal']);
    const refGrid=this._genGrid(gridSize,gridSize);

    // Correct mirror
    let correctGrid;
    if(axis==='horizontal') correctGrid=this._mirrorH(refGrid);
    else if(axis==='vertical') correctGrid=this._mirrorV(refGrid);
    else correctGrid=this._mirrorH(this._mirrorV(refGrid));

    // Wrong options
    const w1=this._mutateGrid(correctGrid);
    const w2=axis==='horizontal' ? this._mirrorV(refGrid) : this._mirrorH(refGrid);
    const w3=this._mutateGrid(this._mirrorH(refGrid));

    const choices=this._shuffle([correctGrid,w1,w2,w3]);
    return {refGrid, choices, answerIdx:choices.indexOf(correctGrid), axis};
  }

  _render(puzzle) {
    if(!this.el) return;
    const CS=this.level<=1?28:this.level<=2?24:21;
    const gridSize=puzzle.refGrid.length;
    const refW=gridSize*CS, refH=gridSize*CS;

    this.el.innerHTML=`
      <div class="game-q-label">Question ${this.q} &nbsp;·&nbsp; Streak 🔥${this.streak}</div>
      <div class="prog-bar" style="width:100%;max-width:500px"><div class="prog-fill" style="width:${Math.min(100,this.correct*8)}%"></div></div>
      <div class="mm-axis-tag">Mirror axis: <strong>${puzzle.axis}</strong></div>
      <div class="mm-ref">
        <div class="mm-refl">Reference Pattern</div>
        <canvas id="mm-ref-cvs" width="${refW}" height="${refH}" style="border-radius:8px;border:1px solid rgba(255,255,255,.08)"></canvas>
      </div>
      <p style="font-size:.78rem;color:var(--muted)">Which option is the correct <strong>${puzzle.axis}</strong> mirror of the reference?</p>
      <div class="mm-choices" id="mm-choices"></div>`;

    const refCvs=this.el.querySelector('#mm-ref-cvs');
    this._drawGrid(refCvs.getContext('2d'), puzzle.refGrid, CS, '#a78bfa');

    const choicesEl=this.el.querySelector('#mm-choices');
    ['A','B','C','D'].forEach((lbl,i)=>{
      const btn=document.createElement('div');
      btn.className='mm-choice';
      const cvs=document.createElement('canvas');
      cvs.width=refW; cvs.height=refH;
      this._drawGrid(cvs.getContext('2d'), puzzle.choices[i], CS, '#67e8f9');
      btn.appendChild(cvs);
      const lblEl=document.createElement('span');
      lblEl.className='mm-clbl'; lblEl.textContent=lbl;
      btn.appendChild(lblEl);
      btn.addEventListener('click',()=>this._pick(i,puzzle));
      choicesEl.appendChild(btn);
    });
  }

  _next(){
    this.q++; this.locked=false; this._t0=Date.now();
    const p=this._gen(); this._render(p);
  }

  _pick(idx, puzzle) {
    if(this.locked) return;
    this.locked=true;
    const rt=Date.now()-this._t0; this.times.push(rt); this.total++;
    const ok=idx===puzzle.answerIdx;
    const btns=this.el.querySelectorAll('.mm-choice');
    if(ok){
      btns[idx].classList.add('ok');
      this.correct++; this.streak++;
      if(this.correct%5===0) this.level=Math.min(3,this.level+1);
      const pts=100+Math.max(0,Math.floor((5000-rt)/100))+(this.streak>=3?this.streak*20:0);
      this.score+=pts; this.cb.onScore(pts,this.streak); this.cb.onFeedback(true);
    } else {
      btns[idx].classList.add('bad');
      btns[puzzle.answerIdx].classList.add('ok');
      this.streak=0; this.cb.onFeedback(false);
    }
    setTimeout(()=>this._next(),1150);
  }

  timeUp(){
    this.cb.onEnd({
      score:this.score, accuracy:this.total?(this.correct/this.total)*100:0,
      avgTime:this.times.length?this.times.reduce((a,b)=>a+b,0)/this.times.length:0,
      correct:this.correct, total:this.total, level:this.level
    });
  }

  destroy(){this.el=null;}
}

window.MirrorMatchGame = MirrorMatchGame;
