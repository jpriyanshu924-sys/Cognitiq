/* ══════════════════════════════════════════════════════
   Game 7: Signal Stop
   Recruitment equivalent: Pymetrics "Stop Game" (Go/No-Go)
   Measures: Impulse control, reaction time, attention
══════════════════════════════════════════════════════ */
class SignalStopGame {
  constructor(container, cb) {
    this.container=container; this.cb=cb;
    this.score=0; this.hits=0; this.misses=0; this.falseAlarms=0;
    this.rtTimes=[]; this.level=1;
    this.el=null; this.signalTimer=null; this.hideTimer=null;
    this.currentSignal=null; this.signalActive=false;
    this.responded=false;
    this._space=null; this._tapBtn=null;
  }

  start() {
    this._startTime = Date.now();
    this.el=document.createElement('div');
    this.el.className='sig-game';
    this.el.innerHTML=`
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">${this.cb && this.cb.name ? this.cb.name : 'Impulse Control Task'}</span>
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
            <div class="ap-kp-wrapper">
              
              <!-- Clean White Card -->
              <div class="ap-kp-card" id="sig-game-card" style="cursor:pointer">
                
                <!-- Card Header -->
                <div class="ap-kp-header">
                  <div class="ap-kp-title-box">
                    <div class="ap-kp-icon-badge" style="background:#fef2f2; color:#ef4444">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                    </div>
                    <span class="ap-kp-title">${this.cb && this.cb.name ? this.cb.name : 'Signal Stop Challenge'}</span>
                  </div>
                  
                  <div class="ap-kp-status-badge">
                    <span style="color:#ef4444">●</span> LIVE SESSION
                  </div>
                </div>

                <!-- Signal Light Center -->
                <div class="ap-kp-signal-container" style="margin: 40px 0">
                  <div class="ap-kp-signal-circle wait" id="sig-display" style="width:130px; height:130px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 24px; background-color:#e2e8f0">
                    <span style="font-size: 2rem; color: #94a3b8">●</span>
                  </div>
                  
                  <div class="ap-kp-instr-title" id="sig-hint" style="font-size:1.4rem; font-weight:800; color:#1f2937; margin-bottom:6px">Get ready…</div>
                  <div class="ap-kp-instr-sub">
                    Press <span class="ap-kp-key-box">SPACE</span> or <span style="font-weight:700">TAP CARD</span> when green, <span style="color:#ef4444;font-weight:700">HOLD BACK</span> when red.
                  </div>
                </div>

                <!-- Bottom Indicators / Stats -->
                <div class="ap-kp-indicators" style="border-top:1px solid #f3f4f6; padding-top:24px; margin-top:24px; display:grid; grid-template-columns:repeat(3, 1fr); gap:12px">
                  <div style="text-align:center">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Correct</span>
                    <div style="font-size:1.3rem; font-weight:800; color:#059669" id="sig-hits">0</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">Missed</span>
                    <div style="font-size:1.3rem; font-weight:800; color:#d97706" id="sig-miss">0</div>
                  </div>
                  <div style="text-align:center">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.04em">False Alarm</span>
                    <div style="font-size:1.3rem; font-weight:800; color:#dc2626" id="sig-false">0</div>
                  </div>
                </div>

              </div>

            </div>
          </main>
        </div>
      </div>`;
    this.container.appendChild(this.el);

    this._space=e=>{if(e.code==='Space'){e.preventDefault();this._respond();}};
    window.addEventListener('keydown',this._space);

    const card = this.el.querySelector('#sig-game-card');
    card.addEventListener('click', () => this._respond());

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }

    setTimeout(()=>this._nextSignal(), 1200);
  }

  _nextSignal() {
    if(!this.el) return;

    // Randomise: 70% go, 30% no-go
    this.currentSignal = Math.random()<0.70 ? 'go' : 'stop';
    this.responded=false;
    this._t0=Date.now();

    const disp=this.el.querySelector('#sig-display');
    const hint=this.el.querySelector('#sig-hint');
    if(!disp||!hint) return;

    const goSvg = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 2px 8px rgba(16,185,129,0.3))"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const stopSvg = `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 2px 8px rgba(239,68,68,0.3))"><path d="M18 8A2 2 0 1 1 22 8v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L9 15V4a2 2 0 1 1 4 0v7M14 3a2 2 0 0 1 4 0v8"/></svg>`;

    disp.className='ap-kp-signal-circle ' + (this.currentSignal==='go' ? 'go' : 'stop');
    disp.innerHTML=this.currentSignal==='go' ? goSvg : stopSvg;
    disp.style.backgroundColor = this.currentSignal==='go' ? '#10b981' : '#ef4444';
    hint.textContent=this.currentSignal==='go' ? 'PRESS!' : 'HOLD BACK!';
    this.signalActive=true;

    // Duration: 600-1000ms depending on level, scaled by time speed factor
    const elapsed = (Date.now() - this._startTime) / 1000;
    const timeSpeedFactor = 1.0 + (elapsed / 40.0);
    const duration=(1200-this.level*150)/timeSpeedFactor;
    this.hideTimer=setTimeout(()=>this._hideSignal(), duration);
  }

  _hideSignal() {
    if(!this.el) return;
    const disp=this.el.querySelector('#sig-display');
    const hint=this.el.querySelector('#sig-hint');

    if(this.signalActive && !this.responded) {
      if(this.currentSignal==='go'){
        // Missed a go signal
        this.misses++;
        this._updateStats();
        this.cb.onFeedback(false);
      }
      // If no-go and not pressed: correct (no action = correct)
      else {
        this.hits++;
        const pts=80;
        this.score+=pts;
        this.cb.onScore(pts, this.hits);
        this._updateStats();
        this.cb.onFeedback(true);
      }
    }

    this.signalActive=false;
    const idleSvg = `<span style="font-size: 2rem; color: #94a3b8">●</span>`;
    if(disp){
      disp.className='ap-kp-signal-circle wait';
      disp.innerHTML=idleSvg;
      disp.style.backgroundColor='#e2e8f0';
    }
    if(hint) hint.textContent='…';

    // Gap: 400-900ms, scaled by time speed factor
    const elapsed = (Date.now() - this._startTime) / 1000;
    const timeSpeedFactor = 1.0 + (elapsed / 40.0);
    const gap=(400+Math.random()*500)/timeSpeedFactor;
    this.signalTimer=setTimeout(()=>this._nextSignal(), gap);
  }

  _respond() {
    if(!this.el) return;
    if(this.responded) return;
    this.responded=true;

    const rt=Date.now()-this._t0;

    if(!this.signalActive){
      // Pressed when no signal → false alarm
      this.falseAlarms++;
      this.score=Math.max(0,this.score-30);
      this._updateStats();
      this.cb.onFeedback(false);
      return;
    }

    if(this.currentSignal==='go'){
      // Correct go response
      this.rtTimes.push(rt);
      this.hits++;
      const speedBonus=Math.max(0,Math.floor((800-rt)/10));
      const pts=80+speedBonus;
      this.score+=pts;
      this.cb.onScore(pts, this.hits);
      this._updateStats();
      this.cb.onFeedback(true);
    } else {
      // False alarm on red
      this.falseAlarms++;
      this.score=Math.max(0,this.score-50);
      this._updateStats();
      this.cb.onFeedback(false);
    }
  }

  _updateStats() {
    const h=this.el.querySelector('#sig-hits');
    const m=this.el.querySelector('#sig-miss');
    const f=this.el.querySelector('#sig-false');
    if(h) h.textContent=this.hits;
    if(m) m.textContent=this.misses;
    if(f) f.textContent=this.falseAlarms;
  }

  timeUp() {
    clearTimeout(this.signalTimer); clearTimeout(this.hideTimer);
    const total=this.hits+this.misses+this.falseAlarms;
    const acc=total>0?(this.hits/total)*100:0;
    const avgRt=this.rtTimes.length?this.rtTimes.reduce((a,b)=>a+b,0)/this.rtTimes.length:0;
    this.cb.onEnd({score:this.score, accuracy:acc, avgTime:avgRt, correct:this.hits, total, level:this.level});
  }

  destroy() {
    clearTimeout(this.signalTimer); clearTimeout(this.hideTimer);
    if(this._space) window.removeEventListener('keydown',this._space);
    this.el=null;
  }
}

window.SignalStopGame = SignalStopGame;
