/* ══════════════════════════════════════════════════════
   Arctic Shores 1: Skyrise Builder
   Measures: Decision-making under constraints, resource allocation
   Based on: Arctic Shores "Skyrise City" city-building mechanics
══════════════════════════════════════════════════════ */
class SkyriseBuildGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.round = 0; this.maxRounds = 8; this.level = 1;
    this.el = null; this._timers = [];
    this.buildings = [
      { id:'house',   icon:'🏠', name:'House',      cost:3, value:4,  workers:1, desc:'Low cost, steady income' },
      { id:'office',  icon:'🏢', name:'Office',     cost:6, value:10, workers:3, desc:'High value, needs workers' },
      { id:'park',    icon:'🌳', name:'Park',       cost:2, value:3,  workers:0, desc:'Boosts nearby buildings +1' },
      { id:'factory', icon:'🏭', name:'Factory',    cost:5, value:8,  workers:4, desc:'High output, worker-heavy' },
      { id:'school',  icon:'🏫', name:'School',     cost:4, value:5,  workers:2, desc:'Trains 2 extra workers' },
      { id:'hospital',icon:'🏥', name:'Hospital',   cost:5, value:6,  workers:2, desc:'Protects value from events' },
    ];
    this.cityGrid = Array(9).fill(null); // 3×3 city plot
    this.budget = 0; this.workers = 0; this.cityValue = 0;
    this.choices = []; this.decisions = [];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'skyrise-game';
    this.container.appendChild(this.el);
    this._nextRound();
  }

  _nextRound() {
    if (this.round >= this.maxRounds) { this._finish(); return; }
    this.round++;
    // Each round: random budget + worker budget
    this.budget  = 6 + this.round * 2 + Math.floor(Math.random() * 4);
    this.workers = 3 + this.round + Math.floor(Math.random() * 3);
    // Pick 3 random building choices
    const shuffled = [...this.buildings].sort(() => Math.random() - 0.5);
    this.choices = shuffled.slice(0, 3);
    // Random event every 3 rounds
    this.event = this.round % 3 === 0 ? this._randomEvent() : null;
    this._render();
  }

  _randomEvent() {
    const events = [
      { icon:'⚡', text:'Power surge! Factories produce +50% this round.', boost:'factory' },
      { icon:'🌧️', text:'Rainstorm! Parks provide +2 value this round.',   boost:'park' },
      { icon:'📈', text:'Boom! All values +2 this round.',                  boost:'all' },
    ];
    return events[Math.floor(Math.random() * events.length)];
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
            <span class="ap-question-num">Round ${this.round} of 8</span>
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
            <div class="ap-workspace" style="max-width: 800px">
              
              <!-- Header Info -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Skyrise Builder</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Resource Management & Planning</span>
                </div>
                <div style="display:flex; gap:16px">
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">BUDGET</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#059669">$${this.budget}</div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">WORKERS</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#0284c7">${this.workers}</div>
                  </div>
                  <div style="text-align:right">
                    <span style="font-size:0.7rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">CITY VALUE</span>
                    <div style="font-size:1.4rem; font-weight:800; color:#d97706">${this.cityValue}</div>
                  </div>
                </div>
              </div>

              ${this.event ? `
              <div style="display:flex; gap:12px; align-items:center; background:#fff7ed; border:1px solid #ffedd5; border-radius:12px; padding:12px 18px; margin-bottom:20px; font-size:0.85rem; color:#c2410c">
                <span style="font-size:1.25rem">${this.event.icon}</span>
                <span><strong>Event Alert:</strong> ${this.event.text}</span>
              </div>` : ''}

              <!-- Main Workspace split into two parts: left building choices, right city map -->
              <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:24px; margin-bottom:24px">
                
                <!-- Choices column -->
                <div class="ap-he-card" style="padding:20px; justify-content:flex-start; align-items:stretch; min-height:360px">
                  <div style="font-size:0.88rem; font-weight:800; color:#111827; margin-bottom:14px">Construct a Building:</div>
                  <div style="display:flex; flex-direction:column; gap:12px">
                    ${this.choices.map(b => {
                      const disabled = b.cost > this.budget || b.workers > this.workers;
                      return `
                      <div class="sky-card ${disabled ? 'sky-unaffordable' : ''}" data-id="${b.id}" style="display:flex; align-items:center; gap:12px; border:1px solid ${disabled ? '#e5e7eb' : '#cbd5e1'}; background:${disabled ? '#f9fafb' : '#ffffff'}; border-radius:10px; padding:12px; cursor:${disabled ? 'not-allowed' : 'pointer'}; opacity:${disabled ? 0.6 : 1}">
                        <div style="font-size:2rem; width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:#eff6ff; border-radius:8px">${b.icon}</div>
                        <div style="flex:1">
                          <div style="font-weight:700; color:${disabled ? '#6b7280' : '#111827'}">${b.name}</div>
                          <div style="font-size:0.75rem; color:#4b5563">${b.desc}</div>
                        </div>
                        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:2px; font-size:0.75rem; font-weight:700">
                          <span style="color:#ef4444">💰 $${b.cost}</span>
                          <span style="color:#0284c7">👷 ${b.workers}</span>
                          <span style="color:#059669">📈 +${b.value} val</span>
                        </div>
                      </div>`;
                    }).join('')}
                    
                    <div class="sky-card" data-id="skip" style="display:flex; align-items:center; gap:12px; border:1px dashed #cbd5e1; border-radius:10px; padding:12px; cursor:pointer">
                      <div style="font-size:1.5rem; width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:#f3f4f6; border-radius:8px">⏭️</div>
                      <div style="flex:1">
                        <div style="font-weight:700; color:#4b5563">Skip Construction</div>
                        <div style="font-size:0.75rem; color:#6b7280">Save budget for next round</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- City grid column -->
                <div class="ap-he-card" style="padding:20px; align-items:center; justify-content:center; background:#eff6ff; border:1.5px dashed #bfdbfe">
                  <div style="font-size:0.8rem; font-weight:700; color:#1e3a8a; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.04em">Your 3×3 City Grid</div>
                  <div style="display:grid; grid-template-columns:repeat(3, 80px); grid-template-rows:repeat(3, 80px); gap:12px">
                    ${this.cityGrid.map((b, i) => `
                      <div style="border-radius:10px; background:#ffffff; border:1px solid #bfdbfe; display:flex; align-items:center; justify-content:center; font-size:2.2rem; box-shadow:0 2px 4px rgba(0,0,0,0.03); position:relative">
                        ${b ? b.icon : '<span style="font-size:1.2rem; color:#bfdbfe; font-weight:600">+</span>'}
                      </div>`).join('')}
                  </div>
                </div>

              </div>

              <!-- Footer Row with instructions and progress bar -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Planning under Constraints</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Allocate your budget and workers optimally each round. Some buildings have trade-offs, like Factory (high workers) or School (creates workers).
                  </div>
                </div>
                <div class="ap-tow-footer-card">
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:#6b7280; margin-bottom:6px; letter-spacing:0.04em">
                    <span>ROUND PROGRESS</span>
                    <span style="color:#059669">${Math.round(((this.round - 1) / this.maxRounds) * 100)}%</span>
                  </div>
                  <div class="ap-progress-bar-bg" style="width:100%"><div class="ap-progress-bar-fill" style="width:${((this.round - 1) / this.maxRounds) * 100}%; background-color:#059669"></div></div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this.el.querySelectorAll('.sky-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        if (id === 'skip') { this._build(null); return; }
        const bldg = this.choices.find(b => b.id === id);
        if (bldg && bldg.cost <= this.budget && bldg.workers <= this.workers) this._build(bldg);
      });
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _build(bldg) {
    if (bldg) {
      // Apply event boosts
      let val = bldg.value;
      if (this.event) {
        if (this.event.boost === 'all') val += 2;
        if (this.event.boost === bldg.id) val = Math.floor(val * 1.5);
      }
      this.cityValue += val;
      // Place in first empty slot
      const slot = this.cityGrid.indexOf(null);
      if (slot !== -1) this.cityGrid[slot] = bldg;
      const pts = val * 50 + (this.level * 30);
      this.score += pts;
      this.cb.onScore(pts, this.round);
      this.cb.onFeedback(true);
      this.decisions.push({ bldg: bldg.id, value: val, round: this.round });
    } else {
      this.decisions.push({ bldg: 'skip', value: 0, round: this.round });
    }
    const t = setTimeout(() => this._nextRound(), 400);
    this._timers.push(t);
  }

  _finish() {
    const diversity = new Set(this.decisions.map(d => d.bldg).filter(b => b !== 'skip')).size;
    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🏙️</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">City Built!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Final city value: <strong style="color:var(--amber)">${this.cityValue}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Building diversity: <strong>${diversity} types</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;
    setTimeout(() => this.cb.onEnd({ score: this.score, accuracy: Math.round((this.cityValue/this.maxRounds)*10), avgTime: 0, correct: diversity, total: this.maxRounds, level: this.level }), 2000);
  }

  timeUp() { this._timers.forEach(clearTimeout); this._finish(); }
  destroy() { this._timers.forEach(clearTimeout); this.el = null; }
}
window.SkyriseBuildGame = SkyriseBuildGame;
