/* ══════════════════════════════════════════════════════
   Game 6: Number Dash
   Recruitment equivalent: Cognify "Numbubbles"
   Measures: Numerical reasoning, working memory, speed
══════════════════════════════════════════════════════ */
class NumberDashGame {
  constructor(container, cb) {
    this.container=container; this.cb=cb;
    this.score=0; this.combos=0; this.level=1;
    this.targets=0; this.el=null;

    this.W=440; this.H=480;
    this.falling=[]; this.collector={x:this.W/2, w:60, h:16};
    this.target=0; this.current=0;
    this.speed=1.2; this.spawnRate=120;
    this.frame=0; this.animId=null;
    this._keys={left:false,right:false};
    this._kd=null; this._ku=null; this._tap=null;
  }

  start() {
    this._startTime = Date.now();
    this.el=document.createElement('div');
    this.el.className='nd-game';
    this.target=this._newTarget();
    this.el.innerHTML=`
      <div class="nd-target">
        <span class="nd-tlabel">TARGET</span>
        <span class="nd-tnum" id="nd-tnum">${this.target}</span>
        <span class="nd-cur" id="nd-cur">= 0</span>
      </div>
      <canvas id="dash-canvas" width="${this.W}" height="${this.H}"></canvas>
      <div class="nd-keys">
        <span class="nd-key"><span class="key-b">A</span><span class="key-b">◄</span> Move Left</span>
        <span class="nd-key">Move Right <span class="key-b">►</span><span class="key-b">D</span></span>
      </div>`;

    this.container.appendChild(this.el);
    this.canvas=document.getElementById('dash-canvas');
    this.ctx=this.canvas.getContext('2d');

    this._kd=e=>{if(['ArrowLeft','a','A'].includes(e.key))this._keys.left=true; if(['ArrowRight','d','D'].includes(e.key))this._keys.right=true; e.key==='ArrowLeft'||e.key==='ArrowRight'?e.preventDefault():null;};
    this._ku=e=>{if(['ArrowLeft','a','A'].includes(e.key))this._keys.left=false; if(['ArrowRight','d','D'].includes(e.key))this._keys.right=false;};
    window.addEventListener('keydown',this._kd);
    window.addEventListener('keyup',this._ku);

    // Touch controls
    this._tap=e=>{
      const rect=this.canvas.getBoundingClientRect();
      const tx=e.touches[0].clientX-rect.left;
      if(tx<this.W/2){this._keys.left=true;this._keys.right=false;}
      else{this._keys.right=true;this._keys.left=false;}
    };
    const _te=()=>{this._keys.left=false;this._keys.right=false;};
    this.canvas.addEventListener('touchstart',this._tap);
    this.canvas.addEventListener('touchend',_te);

    this._loop();
  }

  _newTarget() {
    const ranges=[[5,15],[10,25],[15,40]];
    const [lo,hi]=ranges[Math.min(this.level-1,2)];
    return lo+Math.floor(Math.random()*(hi-lo+1));
  }

  _spawnNumber() {
    const maxVal=Math.min(9, Math.ceil(this.target/2));
    const val=1+Math.floor(Math.random()*maxVal);
    const x=20+Math.random()*(this.W-40);
    const elapsed = (Date.now() - this._startTime) / 1000;
    const timeSpeedFactor = 1.0 + (elapsed / 45.0);
    this.falling.push({x, y:-20, val, speed:(this.speed+(Math.random()*0.5)) * timeSpeedFactor});
  }

  _loop() {
    this.frame++;

    // Move collector
    const spd=6;
    if(this._keys.left)  this.collector.x=Math.max(this.collector.w/2, this.collector.x-spd);
    if(this._keys.right) this.collector.x=Math.min(this.W-this.collector.w/2, this.collector.x+spd);

    // Spawn
    const elapsed = (Date.now() - this._startTime) / 1000;
    const timeSpeedFactor = 1.0 + (elapsed / 45.0);
    const spawnInterval = Math.max(18, Math.round((this.spawnRate - this.level * 15) / timeSpeedFactor));
    if(this.frame%spawnInterval===0) this._spawnNumber();

    // Update falling
    const collY=this.H-40;
    this.falling=this.falling.filter(f=>{
      f.y+=f.speed;
      if(f.y>this.H+20) return false; // off-screen

      // Collect
      if(f.y>collY-20 && f.y<collY+20 && Math.abs(f.x-this.collector.x)<this.collector.w/2+10){
        this.current+=f.val;
        document.getElementById('nd-cur').textContent=`= ${this.current}`;

        if(this.current===this.target){
          // Hit!
          this.targets++; this.combos++;
          const pts=100+this.combos*25+this.level*50;
          this.score+=pts;
          this.cb.onScore(pts,this.combos);
          this.cb.onFeedback(true);
          this.target=this._newTarget();
          this.current=0;
          this.falling=[];
          if(this.targets%3===0) this.level=Math.min(3,this.level+1);
          const tnEl=document.getElementById('nd-tnum');
          if(tnEl) tnEl.textContent=this.target;
          const curEl=document.getElementById('nd-cur');
          if(curEl) curEl.textContent='= 0';
        } else if(this.current>this.target){
          // Bust
          this.current=0; this.combos=0;
          this.cb.onFeedback(false);
          const curEl=document.getElementById('nd-cur');
          if(curEl){curEl.textContent='BUST! → 0'; setTimeout(()=>{if(curEl)curEl.textContent='= 0';},600);}
        }
        return false;
      }
      return true;
    });

    this._draw();
    this.animId=requestAnimationFrame(()=>this._loop());
  }

  _draw() {
    const {ctx,W,H}=this;
    ctx.clearRect(0,0,W,H);

    // Background grid
    ctx.strokeStyle='rgba(255,255,255,.04)';
    ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

    // Collector
    const cx=this.collector.x, cw=this.collector.w, ch=this.collector.h;
    const collY=H-40;
    const g=ctx.createLinearGradient(cx-cw/2,collY,cx+cw/2,collY);
    g.addColorStop(0,'#7c3aed'); g.addColorStop(0.5,'#a78bfa'); g.addColorStop(1,'#7c3aed');
    ctx.fillStyle=g;
    ctx.shadowColor='#a78bfa'; ctx.shadowBlur=16;
    ctx.beginPath();
    ctx.roundRect(cx-cw/2, collY-ch/2, cw, ch, 6);
    ctx.fill();
    ctx.shadowBlur=0;

    // Progress bar on collector
    const pct=this.current/this.target;
    ctx.fillStyle='rgba(255,255,255,.15)';
    ctx.beginPath(); ctx.roundRect(cx-cw/2,collY-ch/2,cw,ch,6); ctx.fill();
    if(pct>0){
      const barG=ctx.createLinearGradient(cx-cw/2,0,cx+cw/2,0);
      barG.addColorStop(0,'#10b981'); barG.addColorStop(1,'#06b6d4');
      ctx.fillStyle=barG;
      ctx.beginPath(); ctx.roundRect(cx-cw/2,collY-ch/2,cw*pct,ch,6); ctx.fill();
    }

    // Falling numbers
    this.falling.forEach(f=>{
      const hue=f.val>7?'#ef4444':f.val>4?'#f59e0b':'#67e8f9';
      // Circle
      ctx.fillStyle=hue+'22';
      ctx.strokeStyle=hue;
      ctx.lineWidth=2;
      ctx.shadowColor=hue; ctx.shadowBlur=10;
      ctx.beginPath(); ctx.arc(f.x,f.y,22,0,2*Math.PI);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur=0;

      // Number
      ctx.fillStyle='#fff';
      ctx.font='bold 18px "JetBrains Mono",monospace';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(f.val,f.x,f.y);
    });

    // Bottom line
    ctx.strokeStyle='rgba(124,58,237,.4)';
    ctx.lineWidth=2;
    ctx.setLineDash([6,4]);
    ctx.beginPath(); ctx.moveTo(0,H-28); ctx.lineTo(W,H-28); ctx.stroke();
    ctx.setLineDash([]);
  }

  timeUp() {
    if(this.animId) cancelAnimationFrame(this.animId);
    this.cb.onEnd({
      score:this.score, accuracy:this.targets>0?100:0, avgTime:0,
      correct:this.targets, total:this.targets+1, level:this.level
    });
  }

  destroy() {
    if(this.animId) cancelAnimationFrame(this.animId);
    if(this._kd) window.removeEventListener('keydown',this._kd);
    if(this._ku) window.removeEventListener('keyup',this._ku);
    this.el=null;
  }
}

window.NumberDashGame = NumberDashGame;
