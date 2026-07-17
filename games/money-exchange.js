/* ══════════════════════════════════════════════════════
   Pymetrics Game 2: Money Exchange (Ultimatum + Trust)
   Measures: Fairness, altruism, trust, social preferences
   Real equivalent: Ultimatum Game + Trust Game + Dictator Game
══════════════════════════════════════════════════════ */
class MoneyExchangeGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.round = 0; this.totalRounds = 12;
    this.correct = 0; this.total = 0; this.level = 1;
    this.decisions = []; // behavioral log
    this.el = null; this.locked = false;
    // Alternate between game types
    this.gameTypes = ['ultimatum', 'trust', 'dictator'];
    this.finished = false;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'mex-game';
    this.container.appendChild(this.el);
    this._nextRound();
  }

  _nextRound() {
    if (this.round >= this.totalRounds) { this._finish(); return; }
    this.round++;
    this.locked = false;
    const type = this.gameTypes[(this.round - 1) % this.gameTypes.length];
    this._renderRound(type);
  }

  _renderRound(type) {
    if (!this.el) return;
    const totalPot = [10, 15, 20][Math.floor(Math.random() * 3)];
    const offerAmt = Math.floor(totalPot * (0.1 + Math.random() * 0.45)); // 10%–55% offered

    let html = '';
    if (type === 'ultimatum') {
      html = `
        <div style="display:flex; gap:16px; align-items:center; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:20px; margin-bottom:24px">
          <div style="width:52px; height:52px; border-radius:50%; background:#10b981; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.5rem">👤</div>
          <div style="flex:1">
            <div style="font-size:0.75rem; font-weight:700; color:#047857; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px">PROPOSAL FROM PLAYER A</div>
            <p style="font-size:0.95rem; color:#1f2937; margin:0">"I have a total pot of <strong>$${totalPot}</strong>. I offer you <strong>$${offerAmt}</strong>."</p>
          </div>
        </div>
        <div style="font-size:1.1rem; font-weight:800; color:#111827; text-align:center; margin-bottom:24px">Do you accept the split offer?</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px">
          <button class="btn ap-he-btn-solid mex-btn" style="margin-top:0" data-choice="accept" data-type="ultimatum" data-offer="${offerAmt}" data-pot="${totalPot}">
            ✅ Accept & take $${offerAmt}
          </button>
          <button class="btn ap-he-btn-outline mex-btn" style="margin-top:0" data-choice="reject" data-type="ultimatum" data-offer="${offerAmt}" data-pot="${totalPot}">
            ❌ Reject (both get $0)
          </button>
        </div>`;
    } else if (type === 'trust') {
      const sendAmts = [0, Math.floor(totalPot * 0.25), Math.floor(totalPot * 0.5), Math.floor(totalPot * 0.75), totalPot];
      html = `
        <div style="display:flex; gap:16px; align-items:center; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:20px; margin-bottom:24px">
          <div style="width:52px; height:52px; border-radius:50%; background:#3b82f6; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.5rem">💼</div>
          <div style="flex:1">
            <div style="font-size:0.75rem; font-weight:700; color:#1d4ed8; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px">TRUST CHALLENGE</div>
            <p style="font-size:0.92rem; color:#1f2937; margin:0">You have <strong>$${totalPot}</strong>. You can send any amount to a partner. Sent money will be <strong>tripled</strong>, and they can return a portion back to you.</p>
          </div>
        </div>
        <div style="font-size:1.1rem; font-weight:800; color:#111827; text-align:center; margin-bottom:24px">How much would you like to send?</div>
        <div style="display:flex; justify-content:space-between; gap:12px">
          ${sendAmts.map(a => `
            <button class="btn ap-he-btn-outline mex-btn" style="margin-top:0; flex:1; padding:16px 0" data-choice="${a}" data-type="trust" data-pot="${totalPot}">
              $${a}
            </button>`).join('')}
        </div>`;
    } else { // dictator
      const splitOptions = [
        { you: totalPot, them: 0 },
        { you: Math.floor(totalPot * 0.75), them: Math.ceil(totalPot * 0.25) },
        { you: Math.floor(totalPot * 0.5), them: Math.ceil(totalPot * 0.5) },
        { you: Math.floor(totalPot * 0.25), them: Math.ceil(totalPot * 0.75) },
        { you: 0, them: totalPot },
      ];
      html = `
        <div style="display:flex; gap:16px; align-items:center; background:#fdf2f8; border:1px solid #fbcfe8; border-radius:12px; padding:20px; margin-bottom:24px">
          <div style="width:52px; height:52px; border-radius:50%; background:#db2777; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.5rem">👑</div>
          <div style="flex:1">
            <div style="font-size:0.75rem; font-weight:700; color:#be185d; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:2px">DICTATOR SPLIT</div>
            <p style="font-size:0.92rem; color:#1f2937; margin:0">You control <strong>$${totalPot}</strong>. You decide how it's split. The other person <em>cannot</em> refuse or reject.</p>
          </div>
        </div>
        <div style="font-size:1.1rem; font-weight:800; color:#111827; text-align:center; margin-bottom:24px">Choose a split option:</div>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:12px">
          ${splitOptions.map(o => `
            <button class="btn ap-he-btn-outline mex-btn" style="margin-top:0; padding:14px 10px; display:flex; flex-direction:column; align-items:center; gap:4px" data-choice="${o.you}" data-type="dictator" data-pot="${totalPot}" data-them="${o.them}">
              <span style="font-weight:700; color:#111827">You: $${o.you}</span>
              <span style="font-size:0.75rem; color:#6b7280">Them: $${o.them}</span>
            </button>`).join('')}
        </div>`;
    }

    this.el.innerHTML = `
      <div class="ap-wrapper">
        <!-- Top Header Bar -->
        <header class="ap-header">
          <div class="ap-header-left">
            <span class="ap-logo">CognitIQ</span>
          </div>
          <div class="ap-header-center">
            <span class="ap-question-num">Round ${this.round} of 12</span>
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
              
              <!-- Header info block -->
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px">
                <div>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827">Money Exchange</h2>
                  <span style="font-size:0.85rem; color:#4b5563">Game Type: <strong>${type === 'ultimatum' ? '⚖️ Ultimatum' : type === 'trust' ? '🤝 Trust' : '👑 Dictator'}</strong></span>
                </div>
                <div style="text-align:right">
                  <span style="font-size:0.75rem; font-weight:700; color:#6b7280; letter-spacing:0.04em">POTENTIAL POINTS</span>
                  <div style="font-size:1.6rem; font-weight:800; color:#2563eb; font-family:var(--fm)" id="mex-score-display">${this.score} <span style="font-size:0.88rem; font-weight:600; color:#4b5563">pts</span></div>
                </div>
              </div>

              <!-- Main Card -->
              <div class="ap-he-card" style="min-height: 380px; justify-content: center; align-items: stretch; padding: 32px; margin-bottom: 24px">
                ${html}
              </div>

              <!-- Footer Row with instructions and progress bar -->
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center">
                <div class="ap-tow-footer-card">
                  <div style="font-size:0.78rem; font-weight:700; color:#1e3a8a; margin-bottom:4px">ℹ️ Social Preferences Task</div>
                  <div style="font-size:0.72rem; color:#4b5563; line-height:1.4">
                    Decide split proposals with partners. Your choices reveal social preferences, fairness thresholds, and altruism.
                  </div>
                </div>
                <div class="ap-tow-footer-card">
                  <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:700; color:#6b7280; margin-bottom:6px; letter-spacing:0.04em">
                    <span>ROUND PROGRESS</span>
                    <span style="color:#059669">${Math.round(((this.round - 1) / this.totalRounds) * 100)}%</span>
                  </div>
                  <div class="ap-progress-bar-bg" style="width:100%"><div class="ap-progress-bar-fill" style="width:${((this.round - 1) / this.totalRounds) * 100}%; background-color:#059669"></div></div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this.el.querySelectorAll('.mex-btn').forEach(btn => {
      btn.addEventListener('click', () => this._decide(btn));
    });

    const exitBtn = this.el.querySelector('#ap-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.CIQ) window.CIQ._exitGame();
      });
    }
  }

  _decide(btn) {
    if (this.locked) return;
    this.locked = true;
    const type = btn.dataset.type;
    const choice = btn.dataset.choice;
    const pot = parseInt(btn.dataset.pot);
    this.total++;

    // Score logic: reward thoughtful, nuanced choices
    let pts = 0;
    let rationale = '';

    if (type === 'ultimatum') {
      const offer = parseInt(btn.dataset.offer);
      const pct = offer / pot;
      if (choice === 'accept' && pct >= 0.2) {
        pts = 80; rationale = 'Rational acceptance';
        this.correct++;
      } else if (choice === 'reject' && pct < 0.2) {
        pts = 80; rationale = 'Fair rejection of low offer';
        this.correct++;
      } else if (choice === 'accept' && pct < 0.1) {
        pts = 20; rationale = 'Very low threshold';
      } else {
        pts = 40; rationale = 'Interesting choice';
      }
    } else if (type === 'trust') {
      const sent = parseInt(choice);
      const pct = sent / pot;
      pts = Math.floor(pct * 100) + 50; // Higher send = more points (reward trust)
      this.correct++;
      rationale = pct > 0.5 ? 'High trust' : pct > 0 ? 'Moderate trust' : 'No trust sent';
    } else { // dictator
      const you = parseInt(choice);
      const them = parseInt(btn.dataset.them);
      const pct = you / pot;
      if (pct <= 0.5) { pts = 100; this.correct++; rationale = 'Generous split'; }
      else if (pct <= 0.75) { pts = 60; rationale = 'Keeping more'; }
      else { pts = 20; rationale = 'Keeping all'; }
    }

    this.score += pts;
    this.decisions.push({ type, choice, pot, pts, rationale });
    this.cb.onScore(pts, this.round);
    btn.classList.add('mex-selected');
    btn.style.outline = '2px solid var(--violet-l)';

    // Show rationale briefly
    const ratEl = document.createElement('div');
    ratEl.style.cssText = 'text-align:center;margin-top:20px;font-size:0.9rem;font-weight:700;color:#3b22d8;animation:vFadeIn .3s ease';
    ratEl.textContent = rationale;
    this.el.querySelector('.ap-he-card').appendChild(ratEl);

    setTimeout(() => this._nextRound(), 1200);
  }

  _finish() {
    this.finished = true;
    const fairness = this.decisions.filter(d => d.pts >= 80).length / Math.max(1, this.decisions.length);
    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🤝</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Money Exchange Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Fair decisions: <strong>${Math.round(fairness * 100)}%</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Social profile: <strong>${fairness > 0.7 ? 'Prosocial' : fairness > 0.4 ? 'Balanced' : 'Self-interested'}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;
    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: Math.round(fairness * 100),
        avgTime: 0, correct: this.correct, total: this.total, level: this.level
      });
    }, 2000);
  }

  timeUp() { this._finish(); }
  destroy() { this.el = null; }
}

window.MoneyExchangeGame = MoneyExchangeGame;
