/* ══════════════════════════════════════════════════════
   Game 4: Shape Spinner
   Recruitment equivalent: Pymetrics spatial, Cognify Resemble
   Measures: Mental rotation, spatial visualization
══════════════════════════════════════════════════════ */
class ShapeSpinnerGame {
  constructor(container, cb) {
    this.container=container; this.cb=cb;
    this.q=0; this.correct=0; this.total=0;
    this.score=0; this.streak=0; this.times=[];
    this.level=1; this.locked=false; this.el=null;
  }

  start() {
    this.el=document.createElement('div');
    this.el.className='spin-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
  _shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  _genShape() {
    // Returns array of points (as normalized 0-1 coords relative to center)
    const types=['star5','arrow','bolt','cross','irregular','hexStar'];
    const type=this._rand(types);

    switch(type){
      case 'star5': {
        const pts=[];
        for(let i=0;i<10;i++){
          const a=(Math.PI*2*i/10)-Math.PI/2;
          const r=i%2===0?0.45:0.2;
          pts.push([r*Math.cos(a),r*Math.sin(a)]);
        }
        return {pts,type};
      }
      case 'arrow': return {pts:[[-0.45,0.15],[-0.45,-0.15],[0,-0.15],[0,-0.38],[0.45,0],[0,-0.38],[0,-0.15],[0.45,0],[0,0.38],[0,0.15]],type};
      case 'bolt': return {pts:[[0.1,-0.45],[0.4,-0.45],[-0.1,0.05],[0.2,0.05],[-0.4,0.45],[-0.1,0.45],[0.25,-0.1],[-0.1,-0.1]],type};
      case 'cross': return {pts:[[-0.15,-0.45],[0.15,-0.45],[0.15,-0.15],[0.45,-0.15],[0.45,0.15],[0.15,0.15],[0.15,0.45],[-0.15,0.45],[-0.15,0.15],[-0.45,0.15],[-0.45,-0.15],[-0.15,-0.15]],type};
      case 'hexStar': {
        const pts=[];
        for(let i=0;i<12;i++){
          const a=(Math.PI*2*i/12)-Math.PI/2;
          const r=i%2===0?0.45:0.25;
          pts.push([r*Math.cos(a),r*Math.sin(a)]);
        }
        return {pts,type};
      }
      default: { // irregular pentagon-ish
        const pts=[
          [0,-0.45],[0.42,-0.12],[0.28,0.38],[-0.28,0.38],[-0.42,-0.12]
        ];
        return {pts,type};
      }
    }
  }

  _rotatePts(pts, angleDeg) {
    const a=angleDeg*Math.PI/180;
    return pts.map(([x,y])=>[
      x*Math.cos(a)-y*Math.sin(a),
      x*Math.sin(a)+y*Math.cos(a)
    ]);
  }

  _flipPts(pts, axis) { // 'h' or 'v'
    return axis==='h' ? pts.map(([x,y])=>[-x,y]) : pts.map(([x,y])=>[x,-y]);
  }

  _drawPts(ctx, pts, cx, cy, r, color='#a78bfa', fill=true) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.beginPath();
    pts.forEach(([x,y],i)=>{
      const px=cx+x*r, py=cy+y*r;
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    });
    ctx.closePath();
    if(fill){ctx.fillStyle=color; ctx.fill();}
    ctx.strokeStyle=color; ctx.lineWidth=2; ctx.stroke();
  }

  _gen() {
    const shape=this._genShape();

    // Correct rotation: rotate by a random angle
    const correctAngle = this._rand([45,90,135,180,225,270,315]);
    const correctPts   = this._rotatePts(shape.pts, correctAngle);

    // Wrong options: flipped, different rotation, or both
    const wrongOptions = [];

    // Wrong 1: horizontally flipped + small rotation
    wrongOptions.push(this._flipPts(this._rotatePts(shape.pts,correctAngle+15),'h'));
    // Wrong 2: vertically flipped
    wrongOptions.push(this._flipPts(this._rotatePts(shape.pts,correctAngle),'v'));
    // Wrong 3: different shape rotated
    const otherShape=this._genShape();
    wrongOptions.push(this._rotatePts(otherShape.pts, correctAngle));

    const choices=this._shuffle([correctPts,...wrongOptions]);
    const answerIdx=choices.indexOf(correctPts);

    return {refPts:shape.pts, choices, answerIdx};
  }

  _render(puzzle) {
    if(!this.el) return;
    const S=160, CS=100;
    this.el.innerHTML=`
      <div class="ap-wrapper">
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Question ${this.q} of 12</span>
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
              <h2 style="font-size:1.8rem;font-weight:800;color:#111827;margin-bottom:8px">Spatial Rotation</h2>
              <p style="font-size:0.88rem;color:#4b5563;margin-bottom:24px">Identify the option on the right that represents a valid 3D rotation of the target shape. Beware of mirrored or reflected versions.</p>
              
              <div class="ap-spin-grid">
                <div class="ap-spin-left-card">
                  <span class="ap-spin-badge">🎯 TARGET SHAPE</span>
                  <div class="ap-spin-ref-box">
                    <canvas id="spin-ref-cvs" width="${S}" height="${S}"></canvas>
                  </div>
                  <div class="ap-spin-ref-sub">Analyze the orientation and depth carefully.</div>
                </div>
                
                <div class="ap-spin-right-grid" id="spin-choices"></div>
              </div>

              <div class="ap-bottom-actions">
                <div class="ap-progress-label">
                  <span>Overall Progress</span>
                  <div class="ap-progress-bar-bg">
                    <div class="ap-progress-bar-fill" style="width:${Math.min(100, (this.q / 12) * 100)}%"></div>
                  </div>
                  <span style="font-size:0.75rem;color:#4b5563">${Math.round(Math.min(100, (this.q / 12) * 100))}% Completed</span>
                </div>
                <div class="ap-action-btns">
                  <button class="btn ap-btn-skip" id="spin-skip-btn">Skip Question</button>
                  <button class="btn ap-btn-confirm" id="spin-confirm-btn" disabled>Confirm Answer ➔</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>`;

    const refCvs=this.el.querySelector('#spin-ref-cvs');
    this._drawPts(refCvs.getContext('2d'), puzzle.refPts, S/2, S/2, S*0.42, '#2563eb');

    const choicesEl=this.el.querySelector('#spin-choices');
    let selectedIdx = null;

    ['A','B','C','D'].forEach((lbl,i)=>{
      const btn=document.createElement('div');
      btn.className='ap-spin-option-card';
      btn.dataset.idx = i;
      
      const cvs=document.createElement('canvas');
      cvs.width=CS; cvs.height=CS;
      this._drawPts(cvs.getContext('2d'), puzzle.choices[i], CS/2, CS/2, CS*0.4, '#1f2937');
      btn.appendChild(cvs);
      
      const lblEl=document.createElement('div');
      lblEl.className='ap-spin-option-lbl'; lblEl.textContent=lbl;
      btn.appendChild(lblEl);
      
      btn.addEventListener('click',()=>{
        if (this.locked) return;
        this.el.querySelectorAll('.ap-spin-option-card').forEach(c => c.classList.remove('selected'));
        btn.classList.add('selected');
        selectedIdx = i;
        const confirmBtn = this.el.querySelector('#spin-confirm-btn');
        if (confirmBtn) confirmBtn.disabled = false;
      });
      choicesEl.appendChild(btn);
    });

    const confirmBtn = this.el.querySelector('#spin-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (selectedIdx !== null) this._pick(selectedIdx, puzzle);
      });
    }

    const skipBtn = this.el.querySelector('#spin-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this._next();
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

  _next() {
    this.q++; this.locked=false; this._t0=Date.now();
    const p=this._gen(); this._render(p);
  }

  _pick(idx, puzzle) {
    if(this.locked) return;
    this.locked=true;
    const rt=Date.now()-this._t0; this.times.push(rt); this.total++;
    const ok=idx===puzzle.answerIdx;
    const btns=this.el.querySelectorAll('.ap-spin-option-card');
    if(ok){
      btns[idx].classList.add('correct');
      this.correct++; this.streak++;
      if(this.correct%5===0) this.level=Math.min(3,this.level+1);
      const pts=100+Math.max(0,Math.floor((5000-rt)/100))+(this.streak>=3?this.streak*20:0);
      this.score+=pts; this.cb.onScore(pts,this.streak); this.cb.onFeedback(true);
    } else {
      btns[idx].classList.add('incorrect');
      btns[puzzle.answerIdx].classList.add('correct');
      this.streak=0; this.cb.onFeedback(false);
    }
    setTimeout(()=>this._next(),1150);
  }

  timeUp() {
    this.cb.onEnd({
      score:this.score, accuracy:this.total?(this.correct/this.total)*100:0,
      avgTime:this.times.length?this.times.reduce((a,b)=>a+b,0)/this.times.length:0,
      correct:this.correct, total:this.total, level:this.level
    });
  }

  destroy(){this.el=null;}
}

window.ShapeSpinnerGame = ShapeSpinnerGame;
