/* ══════════════════════════════════════════════════════
   HireVue 4: Shapedance
   Measures: 3D spatial reasoning, mental rotation
   Based on: HireVue Shapedance — identify valid cube rotation
══════════════════════════════════════════════════════ */
class ShapedanceGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.streak = 0; this.times = []; this.level = 1;
    this.locked = false; this.el = null; this._t0 = 0;
  }

  // Each cube face is a colored square. We represent a cube as 6 face colors.
  // Faces: [Top, Bottom, Front, Back, Left, Right]
  _randomCube() {
    const palette = ['#ef4444','#f59e0b','#10b981','#3b82f6','#7c3aed','#ec4899','#fff','#1e293b'];
    const faces = palette.slice().sort(() => Math.random() - 0.5).slice(0, 6);
    return faces; // [T, Bo, F, Ba, L, R]
  }

  // Apply a rotation to face array — rotations: rotX, rotY, rotZ (90° each)
  _rotX(f) { return [f[2], f[3], f[1], f[0], f[4], f[5]]; } // tilt forward: T→Front→Bo→Back
  _rotY(f) { return [f[0], f[1], f[4], f[5], f[3], f[2]]; } // spin left: F→Right→Ba→Left
  _rotZ(f) { return [f[5], f[4], f[2], f[3], f[0], f[1]]; } // roll: T→Right→Bo→Left

  _applyRotations(faces, rots) {
    let f = [...faces];
    for (const r of rots) f = r(f);
    return f;
  }

  _drawCube(ctx, faces, x, y, size, label = '') {
    const h = size * 0.55; // hex perspective height
    const w = size;
    // Simple isometric cube: top, right, left
    const [T, ,F, ,L, R] = faces;

    // Left face
    ctx.beginPath();
    ctx.moveTo(x,     y + h/2);
    ctx.lineTo(x - w/2, y + h);
    ctx.lineTo(x - w/2, y + h*1.5);
    ctx.lineTo(x,     y + h);
    ctx.closePath();
    ctx.fillStyle = L; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1; ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(x,     y + h/2);
    ctx.lineTo(x + w/2, y + h);
    ctx.lineTo(x + w/2, y + h*1.5);
    ctx.lineTo(x,     y + h);
    ctx.closePath();
    ctx.fillStyle = R; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1; ctx.stroke();

    // Top face
    ctx.beginPath();
    ctx.moveTo(x,     y);
    ctx.lineTo(x + w/2, y + h/2);
    ctx.lineTo(x,     y + h);
    ctx.lineTo(x - w/2, y + h/2);
    ctx.closePath();
    ctx.fillStyle = T; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1; ctx.stroke();

    if (label) {
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      ctx.font = 'bold 12px Inter,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y + h * 1.5 + 14);
    }
  }

  _gen() {
    const baseFaces = this._randomCube();
    // True rotation: apply 1-4 random valid rotations
    const rotFns = [this._rotX.bind(this), this._rotY.bind(this), this._rotZ.bind(this)];
    const numRots = 1 + Math.floor(Math.random() * 3);
    const rots = Array.from({length: numRots}, () => rotFns[Math.floor(Math.random() * 3)]);
    const correctFaces = this._applyRotations(baseFaces, rots);

    // Generate 3 distractors: 2 extra rotations + 1 recolor (impossible)
    const distractors = [];
    for (let i = 0; i < 2; i++) {
      const extraRots = [rotFns[Math.floor(Math.random()*3)], rotFns[Math.floor(Math.random()*3)]];
      distractors.push(this._applyRotations(baseFaces, extraRots));
    }
    // Recolored impostor
    const impostor = this._randomCube();
    distractors.push(impostor);

    const answerIdx = Math.floor(Math.random() * 4);
    const options = [];
    let dIdx = 0;
    for (let i = 0; i < 4; i++) {
      if (i === answerIdx) options.push(correctFaces);
      else options.push(distractors[dIdx++]);
    }
    return { baseFaces, correctFaces, options, answerIdx };
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'sd-game';
    this.container.appendChild(this.el);
    this._next();
  }

  _next() {
    if (!this.el) return;
    this.locked = false;
    this._cur = this._gen();
    this._t0 = Date.now();
    this._render();
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
            <span class="ap-question-num">Round ${this.total + 1}</span>
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
            <div class="ap-workspace" style="max-width: 900px">
              
              <!-- Header Info -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Shapedance</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Mental Rotation & 3D Spatial Reasoning</span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">SCORE</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#3b22d8; font-family:var(--fm)">${this.score}</div>
                </div>
              </div>

              <!-- Spin Grid (Left: Reference, Right: Options) -->
              <div class="ap-spin-grid" style="margin-top:0; margin-bottom:24px">
                
                <!-- Reference Card -->
                <div class="ap-spin-left-card">
                  <span class="ap-spin-badge">Reference Cube</span>
                  <div class="ap-spin-ref-box" style="margin:12px 0 0 0; width:150px; height:150px">
                    <canvas id="sd-ref" width="150" height="150"></canvas>
                  </div>
                  <div class="ap-spin-ref-sub" style="margin-top:10px">
                    Rotate this shape mentally
                  </div>
                </div>

                <!-- Options Grid -->
                <div class="ap-spin-right-grid">
                  ${[0,1,2,3].map(i => `
                    <div class="ap-spin-option-card sd-opt-wrap" data-i="${i}">
                      <span class="ap-spin-option-lbl">${['A','B','C','D'][i]}</span>
                      <canvas class="sd-opt-canvas" id="sd-opt-${i}" width="140" height="140" style="margin-top: 10px"></canvas>
                    </div>`).join('')}
                </div>

              </div>

              <!-- Footer Row with stats feedback -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Shapedance Instructions</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Determine which of the options (A-D) represents a valid 3D rotation of the reference cube.
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

    // Draw cubes on canvases
    const refCtx = document.getElementById('sd-ref')?.getContext('2d');
    if (refCtx) this._drawCube(refCtx, this._cur.baseFaces, 75, 20, 58);

    [0,1,2,3].forEach(i => {
      const cvs = document.getElementById(`sd-opt-${i}`);
      if (cvs) this._drawCube(cvs.getContext('2d'), this._cur.options[i], 70, 15, 48);
    });

    this.el.querySelectorAll('.sd-opt-wrap').forEach(wrap => {
      wrap.addEventListener('click', () => this._pick(parseInt(wrap.dataset.i)));
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _pick(idx) {
    if (this.locked || !this.el) return;
    this.locked = true;
    const rt = Date.now() - this._t0;
    this.times.push(rt); this.total++;

    const ok = idx === this._cur.answerIdx;
    const opts = this.el.querySelectorAll('.sd-opt-wrap');
    
    opts[this._cur.answerIdx]?.classList.add('correct');
    if (!ok) opts[idx]?.classList.add('incorrect');

    if (ok) {
      this.correct++; this.streak++;
      if (this.correct % 6 === 0) this.level = Math.min(3, this.level + 1);
      const spdBonus = Math.max(0, Math.floor((5000 - rt) / 50));
      const pts = 120 + spdBonus + this.streak * 15;
      this.score += pts;
      this.cb.onScore(pts, this.streak); this.cb.onFeedback(true);
    } else {
      this.streak = 0; this.cb.onFeedback(false);
    }
    setTimeout(() => this._next(), 1000);
  }

  timeUp() {
    this.cb.onEnd({ score: this.score, accuracy: this.total?(this.correct/this.total)*100:0, avgTime: this.times.length?this.times.reduce((a,b)=>a+b,0)/this.times.length:0, correct: this.correct, total: this.total, level: this.level });
  }
  destroy() { this.el = null; }
}
window.ShapedanceGame = ShapedanceGame;
