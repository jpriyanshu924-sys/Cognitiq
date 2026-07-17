/* ══════════════════════════════════════════════════════
   Game 8: Memory Vault
   Recruitment equivalent: Pymetrics Digit Span
   Measures: Short-term memory, sequence recall, working memory span
══════════════════════════════════════════════════════ */
class MemoryVaultGame {
  constructor(container, cb) {
    this.container=container; this.cb=cb;
    this.score=0; this.lives=3; this.seqLen=3;
    this.level=1; this.roundsWon=0;
    this.sequence=[]; this.input=[];
    this.phase='memorize'; // 'memorize'|'recall'
    this.el=null; this._timers=[];
    this.history=[];
  }

  start() {
    this.el=document.createElement('div');
    this.el.className='mv-game';
    this.container.appendChild(this.el);
    this._newRound();
  }

  _randSeq(len) {
    const arr=[];
    for(let i=0;i<len;i++) arr.push(1+Math.floor(Math.random()*9));
    return arr;
  }

  _newRound() {
    if(!this.el) return;
    this.sequence=this._randSeq(this.seqLen);
    this.input=[];
    this.phase='memorize';
    this._renderMemorize();
  }

  _getShellHTML(centerHTML) {
    const historyList = (this.history || []).slice(-4).reverse().map(h => `
      <div class="ap-mem-recent-item">
        <span>${h.len} Digits</span>
        <span class="ap-mem-recent-status ${h.status === 'Success' ? 'success' : 'failed'}">${h.status}</span>
      </div>
    `).join('');

    return `
      <div class="ap-wrapper">
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Question ${this.roundsWon + 1}</span>
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
          <main class="ap-main" style="padding: 20px; align-items: stretch; justify-content: center">
            <div class="ap-workspace">
              <div class="ap-mem-grid">
                
                <!-- Left: Instructions & Stats Card -->
                <div class="ap-mem-left-card">
                  <div class="ap-mem-left-title">Memory Vault</div>
                  <div class="ap-mem-left-sub">Working Memory Task: Digit Span</div>
                  
                  <div style="display:flex; flex-direction:column; gap:8px; margin-bottom: 24px">
                    <div class="ap-mem-stat-row">
                      <span>🎖️</span>
                      <span>Current Level: <strong>${this.seqLen} Digits</strong></span>
                    </div>
                    <div class="ap-mem-stat-row">
                      <span>❤️</span>
                      <span>Lives: <strong>${'♥'.repeat(this.lives)}${'♡'.repeat(Math.max(0,3-this.lives))}</strong></span>
                    </div>
                    <div class="ap-mem-stat-row">
                      <span>📈</span>
                      <span>Rounds Won: <strong>${this.roundsWon}</strong></span>
                    </div>
                  </div>

                  <div style="background-color:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:12px; font-size:0.75rem; color:#1e40af; margin-top:auto; line-height:1.4">
                    <strong>INSTRUCTIONS</strong><br>
                    Observe the sequence of numbers that appear in the vault. Once it finishes, re-enter the sequence using the keypad.
                  </div>
                </div>

                <!-- Center: Visual Play Area -->
                <div class="ap-mem-center-card">
                  ${centerHTML}
                </div>

                <!-- Right: Profile & Recent Attempts Card -->
                <div class="ap-mem-right-card">
                  <div class="ap-mem-profile-row">
                    <div class="ap-avatar" style="width:36px; height:36px; font-size:0.82rem">CA</div>
                    <div class="ap-mem-profile-info">
                      <div class="ap-mem-profile-name">Candidate Alpha</div>
                      <div class="ap-mem-profile-title">Level 4 Analyst</div>
                    </div>
                  </div>
                  <div style="font-size:0.75rem; color:#4b5563; font-weight:600; margin-top:8px">Cognitive Capacity Load</div>
                  <div class="ap-mem-capacity-bar-bg">
                    <div class="ap-mem-capacity-bar-fill" style="width: 82%"></div>
                  </div>
                  <div style="font-size:0.68rem; color:#6b7280; text-align:right; margin-top:2px">82% Capacity</div>

                  <div class="ap-mem-recent-header">
                    <span>Recent Attempts</span>
                    <span style="font-size:1rem">⏳</span>
                  </div>
                  <div class="ap-mem-recent-list">
                    ${historyList || '<div style="font-size:0.75rem;color:#94a3b8;font-style:italic;text-align:center;padding:12px">No attempts yet</div>'}
                  </div>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>`;
  }

  _renderMemorize() {
    if(!this.el) return;
    
    const centerHTML = `
      <div class="ap-mem-prog-top">
        <div class="ap-mem-prog-top-fill" id="ap-mem-prog-fill" style="width:0%"></div>
      </div>
      <div class="ap-mem-visual-container">
        <div class="ap-mem-clock-icon">
          <div style="font-size: 5rem; font-weight: 800; color: #4f46e5; transition: opacity 0.15s; opacity: 0" id="mv-seq-active"></div>
          <div class="ap-mem-clock-hand" id="ap-clock-hand"></div>
        </div>
        <div class="ap-mem-status-text" id="mv-phase">Memorising sequence...</div>
      </div>`;

    this.el.innerHTML = this._getShellHTML(centerHTML);

    const activeEl = this.el.querySelector('#mv-seq-active');
    const hand = this.el.querySelector('#ap-clock-hand');
    const fill = this.el.querySelector('#ap-mem-prog-fill');

    // Trigger exit button binding
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }

    // Flash each item in turn - dynamically faster at higher lengths
    let idx=0;
    const showDuration = Math.max(250, 550 - (this.seqLen - 3) * 60);
    const stepInterval = Math.max(350, 750 - (this.seqLen - 3) * 70);
    const totalTime = this.sequence.length * stepInterval + 600;
    const startTime = Date.now();

    // Progress bar animation
    const animateProg = () => {
      if (!this.el || this.phase !== 'memorize') return;
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / totalTime) * 100);
      if (fill) fill.style.width = `${pct}%`;
      if (pct < 100) {
        const frame = requestAnimationFrame(animateProg);
        this._timers.push(frame);
      }
    };
    animateProg();

    const flashNext=()=>{
      if(!this.el) return;
      if(idx<this.sequence.length){
        const val = this.sequence[idx];
        if (activeEl) {
          activeEl.textContent = val;
          activeEl.style.opacity = 1;
        }
        if (hand) {
          hand.style.transform = `rotate(${(idx / this.sequence.length) * 360}deg)`;
        }
        idx++;
        
        const t1 = setTimeout(() => {
          if (activeEl) activeEl.style.opacity = 0;
        }, showDuration);
        this._timers.push(t1);

        const t2 = setTimeout(flashNext, stepInterval);
        this._timers.push(t2);
      } else {
        if (activeEl) activeEl.textContent = '';
        const t = setTimeout(() => this._startRecall(), 400);
        this._timers.push(t);
      }
    };

    const t=setTimeout(flashNext, 600);
    this._timers.push(t);
  }

  _startRecall() {
    if(!this.el) return;
    this.phase='recall';
    this.input=[];

    const centerHTML = `
      <div class="ap-mem-visual-container" style="width:100%; max-width:320px">
        <div style="font-size:0.95rem; font-weight:700; color:#374151; margin-bottom:12px; text-align:center">Recall Phase</div>
        <div class="mv-seq" id="mv-recall-seq" style="margin-bottom:20px; justify-content:center"></div>
        <div class="mv-pad" id="mv-pad" style="margin-bottom:12px"></div>
        <div id="mv-progress" style="font-size:.78rem;color:var(--subtle);text-align:center">Entered: 0 / ${this.seqLen}</div>
      </div>`;

    this.el.innerHTML = this._getShellHTML(centerHTML);

    // Trigger exit button binding
    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }

    // Show answer slots
    const recallSeq=this.el.querySelector('#mv-recall-seq');
    this.sequence.forEach((_,i) => {
      const item=document.createElement('div');
      item.className='mv-item hidden';
      item.id=`mv-ans-${i}`;
      recallSeq.appendChild(item);
    });

    // Number pad 1-9 + clear
    const pad=this.el.querySelector('#mv-pad');
    for(let n=1;n<=9;n++){
      const btn=document.createElement('button');
      btn.className='mv-btn'; btn.textContent=n;
      btn.addEventListener('click',()=>this._enterDigit(n));
      pad.appendChild(btn);
    }
    // Clear button
    const clr=document.createElement('button');
    clr.className='mv-btn'; clr.textContent='⌫'; clr.style.gridColumn='span 2';
    clr.addEventListener('click',()=>this._clearLast());
    pad.appendChild(clr);

    // Also allow keyboard
    this._kd=e=>{
      const n=parseInt(e.key);
      if(n>=1&&n<=9) this._enterDigit(n);
      if(e.key==='Backspace') this._clearLast();
    };
    window.addEventListener('keydown',this._kd);

    // Start 10-second ticking recall timer
    this._startRecallTimer();
  }

  _startRecallTimer() {
    this._clearRecallTimer();
    let timeLeft = 10000;
    const timerVal = document.getElementById('ap-timer-val');
    if (timerVal) {
      timerVal.textContent = (timeLeft / 1000).toFixed(1) + 's';
      timerVal.style.color = '';
    }

    const tick = () => {
      if (this.phase !== 'recall' || !this.el) return;
      timeLeft -= 100;
      if (timerVal) {
        timerVal.textContent = Math.max(0, (timeLeft / 1000)).toFixed(1) + 's';
        if (timeLeft <= 3000) {
          timerVal.style.color = '#ef4444';
          timerVal.style.fontWeight = '800';
        } else {
          timerVal.style.color = '';
          timerVal.style.fontWeight = '';
        }
      }
      if (timeLeft <= 0) {
        this._recallTimeout();
      } else {
        this._recallTimer = setTimeout(tick, 100);
      }
    };
    this._recallTimer = setTimeout(tick, 100);
  }

  _clearRecallTimer() {
    clearTimeout(this._recallTimer);
  }

  _recallTimeout() {
    this._clearRecallTimer();
    if(this._kd) window.removeEventListener('keydown',this._kd);
    this.lives--;
    this.history.push({ len: this.seqLen, status: 'Failed' });
    this.seqLen = Math.max(3, this.seqLen - 1); // adaptive staircase: decrease length on incorrect/timeout
    this.cb.onFeedback(false);

    const prog = document.getElementById('mv-progress');
    if (prog) {
      prog.textContent = 'TIMEOUT!';
      prog.style.color = '#ef4444';
      prog.style.fontWeight = '800';
    }

    if(this.lives<=0){
      this._showGameOver();
      return;
    }
    const t=setTimeout(()=>this._newRound(), 1200);
    this._timers.push(t);
  }

  _enterDigit(n) {
    if(!this.el || this.phase!=='recall') return;
    if(this.input.length>=this.sequence.length) return;

    const pos=this.input.length;
    this.input.push(n);

    // Show in slot
    const slot=document.getElementById(`mv-ans-${pos}`);
    if(slot){
      slot.textContent=n;
      slot.classList.remove('hidden');
      if(n===this.sequence[pos]) slot.classList.add('correct-in');
      else slot.classList.add('wrong-in');
    }

    const prog=document.getElementById('mv-progress');
    if(prog) prog.textContent=`Entered: ${this.input.length} / ${this.sequence.length}`;

    if(this.input.length===this.sequence.length) {
      this._clearRecallTimer();
      const t=setTimeout(()=>this._evaluate(), 500);
      this._timers.push(t);
    }
  }

  _clearLast() {
    if(!this.el||this.phase!=='recall') return;
    if(this.input.length===0) return;
    const pos=this.input.length-1;
    this.input.pop();
    const slot=document.getElementById(`mv-ans-${pos}`);
    if(slot){ slot.textContent=''; slot.className='mv-item hidden'; }
    const prog=document.getElementById('mv-progress');
    if(prog) prog.textContent=`Entered: ${this.input.length} / ${this.sequence.length}`;
  }

  _evaluate() {
    if(!this.el) return;
    this._clearRecallTimer();
    if(this._kd) window.removeEventListener('keydown',this._kd);

    const correct=this.sequence.every((v,i)=>v===this.input[i]);

    if(correct){
      this.roundsWon++;
      this.history.push({ len: this.seqLen, status: 'Success' });
      this.seqLen=Math.min(12, this.seqLen+1); // adaptive staircase: increase length on success
      const pts=150+this.seqLen*50;
      this.score+=pts;
      this.cb.onScore(pts, this.seqLen);
      this.cb.onFeedback(true);
      if(this.seqLen>4) this.level=Math.min(3,Math.floor((this.seqLen-3)/2)+1);
    } else {
      this.lives--;
      this.history.push({ len: this.seqLen, status: 'Failed' });
      this.seqLen=Math.max(3, this.seqLen-1); // adaptive staircase: decrease length on incorrect
      this.cb.onFeedback(false);
      if(this.lives<=0){
        this._showGameOver();
        return;
      }
    }

    const t=setTimeout(()=>this._newRound(), 1200);
    this._timers.push(t);
  }

  _showGameOver() {
    if(!this.el) return;
    this._clearRecallTimer();
    this.el.innerHTML=`
      <div style="text-align:center;padding:40px">
        <div style="font-size:3rem;margin-bottom:16px">🔐</div>
        <h3 style="font-family:var(--fh);margin-bottom:8px">Vault Locked!</h3>
        <p style="color:var(--muted);margin-bottom:20px">You reached sequence length <strong>${this.seqLen}</strong></p>
        <div style="font-family:var(--fm);font-size:2rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(()=>{
      this.cb.onEnd({
        score:this.score, accuracy:this.roundsWon>0?(this.roundsWon/(this.roundsWon+3))*100:0,
        avgTime:0, correct:this.roundsWon, total:this.roundsWon+this.lives, level:this.level
      });
    }, 2000);
  }

  timeUp() {
    this._clearRecallTimer();
    this._timers.forEach(clearTimeout);
    if(this._kd) window.removeEventListener('keydown',this._kd);
    this.cb.onEnd({
      score:this.score, accuracy:this.roundsWon>0?70:0, avgTime:0,
      correct:this.roundsWon, total:this.roundsWon+1, level:this.level
    });
  }

  destroy() {
    this._clearRecallTimer();
    this._timers.forEach(clearTimeout);
    if(this._kd) window.removeEventListener('keydown',this._kd);
    this.el=null;
  }
}

window.MemoryVaultGame = MemoryVaultGame;
