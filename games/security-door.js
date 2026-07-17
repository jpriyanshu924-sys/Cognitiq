/* ══════════════════════════════════════════════════════
   Arctic Shores 2: Security Door Game
   Measures: Reaction time, focus, self-control, pattern matching
   Based on: Arctic Shores "Security Door" combination-lock dial
══════════════════════════════════════════════════════ */
class SecurityDoorGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.roundsSolved = 0; this.totalRounds = 20;
    this.level = 1; this.el = null; this._timers = [];
    this.locked = false;

    // Current lock combination code
    this.combinationLength = 3;
    this.targetCode = [];
    this.currentCodeIdx = 0; // which digit we are matching now

    // Rotation state
    this.angle = 0; // current selector angle in radians
    this.speed = 0.05; // radians per frame
    this.targetNumber = 0; // current number to match (0-9)
    this.isRunning = false;
    this._animId = null;

    // Numbers layout positions (0-9 evenly spaced around 360 degrees)
    // 0 is at top (-PI/2), then clockwise
    this.dialNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'sd-game';
    this.container.appendChild(this.el);
    this._newCode();
    this._render();
    this._startDial();
  }

  _newCode() {
    this.combinationLength = this.level === 1 ? 3 : this.level === 2 ? 4 : 5;
    this.targetCode = Array.from({length: this.combinationLength}, () => Math.floor(Math.random() * 10));
    this.currentCodeIdx = 0;
    this.targetNumber = this.targetCode[this.currentCodeIdx];
    
    // Vary speed based on level and progress
    const baseSpeed = 0.04 + this.level * 0.015;
    this.speed = baseSpeed + (Math.random() < 0.5 ? 0.015 : -0.01);
  }

  _startDial() {
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      this.angle += this.speed;
      if (this.angle >= Math.PI * 2) {
        this.angle -= Math.PI * 2;
      }
      this._drawDial();
      this._animId = requestAnimationFrame(loop);
    };
    this._animId = requestAnimationFrame(loop);
  }

  _stopDial() {
    this.isRunning = false;
    cancelAnimationFrame(this._animId);
  }

  _drawDial() {
    const canvas = document.getElementById('sd-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const radius = Math.min(W, H) / 2 - 30;

    ctx.clearRect(0, 0, W, H);

    // Draw Lock Outer Ring
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Dial Plate
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw inner safe handle circle
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Numbers 0-9
    ctx.font = '700 20px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    this.dialNumbers.forEach((num) => {
      // Angle for this number
      const numAngle = -Math.PI / 2 + (num * Math.PI * 2) / 10;
      const nx = cx + Math.cos(numAngle) * (radius - 28);
      const ny = cy + Math.sin(numAngle) * (radius - 28);

      const isTarget = num === this.targetNumber;

      if (isTarget) {
        // Highlight active target number
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(nx, ny, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#475569';
      }

      ctx.fillText(num, nx, ny);
    });

    // Draw Rotating Selector Pin
    const sx = cx + Math.cos(this.angle) * (radius - 50);
    const sy = cy + Math.sin(this.angle) * (radius - 50);

    // Indicator line
    ctx.strokeStyle = '#3b22d8';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Selector Knob
    ctx.fillStyle = '#3b22d8';
    ctx.beginPath();
    ctx.arc(sx, sy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Center handle spindle
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  _render() {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Task ${this.roundsSolved + 1} of ${this.totalRounds}</span>
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
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Security Door</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Current Level: <strong>${this.level}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 480px; justify-content: center; align-items: center; padding: 30px; margin-bottom: 24px; text-align:center">
                
                <div style="font-size:0.72rem; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px">Combination Lock</div>
                <div class="ap-spin-badge" id="sd-status-badge" style="align-self:center; margin-bottom: 16px; background-color:#eff6ff; color:#3b22d8">
                  Unlock the Security Code
                </div>

                <!-- Unlocking Code Slots -->
                <div style="display:flex; gap:10px; justify-content:center; margin-bottom:20px" id="sd-code-slots">
                  ${this.targetCode.map((val, idx) => {
                    const matched = idx < this.currentCodeIdx;
                    const active = idx === this.currentCodeIdx;
                    return `
                    <div style="
                      width: 50px; height: 50px; 
                      border-radius: 8px; 
                      border: 2px solid ${active ? '#3b22d8' : '#e2e8f0'};
                      background: ${matched ? '#10b981' : active ? '#eff6ff' : '#ffffff'};
                      color: ${matched ? '#ffffff' : active ? '#3b22d8' : '#64748b'};
                      font-size: 1.4rem; font-weight: 800;
                      display: flex; align-items: center; justify-content: center;
                      font-family: var(--fm);
                    ">
                      ${matched ? val : active ? '?' : ''}
                    </div>`;
                  }).join('')}
                </div>

                <!-- Canvas safe Dial -->
                <div style="position:relative; width:300px; height:300px; margin: 0 auto 20px;">
                  <canvas id="sd-canvas" width="300" height="300" style="cursor:pointer"></canvas>
                </div>

                <!-- Trigger Button -->
                <button class="btn ap-btn-confirm" id="btn-sd-stop" style="width:100%; max-width:240px; margin:0">
                  🔓 STOP DIAL [Space]
                </button>
                
                <p style="font-size:0.75rem; color:#6b7280; margin-top:14px">
                  Time your button press exactly when the line rotates over the <span style="color:#ef4444; font-weight:700">RED</span> target number.
                </p>
              </div>

              <!-- Footer info -->
              <div style="display:grid; grid-template-columns: 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Safe Decryption rules</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Mistakes force a full lock reset, restarting that code from digit 1. Keep a cool head under varying rotation speeds.
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    // Click handler for stop
    const stopBtn = this.el.querySelector('#btn-sd-stop');
    stopBtn?.addEventListener('click', () => this._handleStopPress());
    document.getElementById('sd-canvas')?.addEventListener('click', () => this._handleStopPress());

    // Keyboard space handler
    this._kd = (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this._handleStopPress();
      }
    };
    window.addEventListener('keydown', this._kd);

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _handleStopPress() {
    if (this.locked || !this.isRunning) return;
    this.locked = true;
    this._stopDial();

    // Determine current number pointing to based on current selector angle
    // Standard angle goes from -PI/2 to 3/2 PI. Convert to 0-9
    let angleNormalized = this.angle + Math.PI / 2;
    if (angleNormalized < 0) angleNormalized += Math.PI * 2;
    if (angleNormalized >= Math.PI * 2) angleNormalized -= Math.PI * 2;
    
    // Find the number index
    const decimalIndex = (angleNormalized / (Math.PI * 2)) * 10;
    const roundedIndex = Math.round(decimalIndex) % 10;
    const pointedNumber = this.dialNumbers[roundedIndex];

    const isMatch = pointedNumber === this.targetNumber;

    // Show temporary stopped highlight
    this._drawDial();

    const badge = document.getElementById('sd-status-badge');
    const slots = document.getElementById('sd-code-slots');

    if (isMatch) {
      this.currentCodeIdx++;
      
      // Update slots HTML directly
      if (slots) {
        slots.innerHTML = this.targetCode.map((val, idx) => {
          const matched = idx < this.currentCodeIdx;
          const active = idx === this.currentCodeIdx;
          return `
          <div style="
            width: 50px; height: 50px; 
            border-radius: 8px; 
            border: 2px solid ${active ? '#3b22d8' : '#e2e8f0'};
            background: ${matched ? '#10b981' : active ? '#eff6ff' : '#ffffff'};
            color: ${matched ? '#ffffff' : active ? '#3b22d8' : '#64748b'};
            font-size: 1.4rem; font-weight: 800;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--fm);
          ">
            ${matched ? val : active ? '?' : ''}
          </div>`;
        }).join('');
      }

      if (this.currentCodeIdx >= this.combinationLength) {
        // Code fully matched!
        this.roundsSolved++;
        this.correct++;
        if (this.roundsSolved % 5 === 0) this.level = Math.min(3, this.level + 1);

        const pts = 200 + this.level * 50;
        this.score += pts;
        this.cb.onScore(pts, this.roundsSolved);
        this.cb.onFeedback(true);

        if (badge) {
          badge.textContent = '🔓 CODE UNLOCKED!';
          badge.style.backgroundColor = '#ecfdf5';
          badge.style.color = '#059669';
        }

        const t = setTimeout(() => {
          if (this.roundsSolved >= this.totalRounds) {
            this._finish();
          } else {
            this._newCode();
            this._render();
            this.locked = false;
            this._startDial();
          }
        }, 1200);
        this._timers.push(t);
      } else {
        // Advance to next digit
        this.targetNumber = this.targetCode[this.currentCodeIdx];
        if (badge) {
          badge.textContent = `✓ DIGIT ${this.currentCodeIdx} ACCEPTED!`;
          badge.style.backgroundColor = '#ecfdf5';
          badge.style.color = '#059669';
        }
        const t = setTimeout(() => {
          this.locked = false;
          this._startDial();
        }, 800);
        this._timers.push(t);
      }
    } else {
      // WRONG PRESS: reset code progress back to 0!
      this.currentCodeIdx = 0;
      this.targetNumber = this.targetCode[0];
      
      this.cb.onFeedback(false);

      if (badge) {
        badge.textContent = '❌ CODE RESET! Mistimed dial';
        badge.style.backgroundColor = '#fef2f2';
        badge.style.color = '#ef4444';
      }

      if (slots) {
        slots.innerHTML = this.targetCode.map((val, idx) => {
          const active = idx === 0;
          return `
          <div style="
            width: 50px; height: 50px; 
            border-radius: 8px; 
            border: 2px solid ${active ? '#3b22d8' : '#e2e8f0'};
            background: ${active ? '#eff6ff' : '#ffffff'};
            color: ${active ? '#3b22d8' : '#64748b'};
            font-size: 1.4rem; font-weight: 800;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--fm);
          ">
            ${active ? '?' : ''}
          </div>`;
        }).join('');
      }

      const t = setTimeout(() => {
        this.locked = false;
        this._startDial();
      }, 1000);
      this._timers.push(t);
    }
  }

  _finish() {
    this._stopDial();
    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🔓</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Security Door Unlocked!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Codes Completed: <strong>${this.roundsSolved}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: 100,
        avgTime: 0,
        correct: this.roundsSolved, total: this.totalRounds, level: this.level
      });
    }, 2000);
  }

  timeUp() {
    this._finish();
  }

  destroy() {
    this._stopDial();
    if (this._kd) window.removeEventListener('keydown', this._kd);
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}

window.SecurityDoorGame = SecurityDoorGame;
