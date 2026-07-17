/* ══════════════════════════════════════════════════════
   Pymetrics Game 8: Cards Game (Iowa Gambling Task)
   Measures: Decision-making under uncertainty, learning from feedback
   Real equivalent: Iowa Gambling Task (IGT)
══════════════════════════════════════════════════════ */
class CardsGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.level = 1;
    this.totalMoney = 2000; // starting pot
    this.turns = 0; this.maxTurns = 100;
    this.history = []; // {deck, win, lose, net}
    this.el = null; this.locked = false; this._timers = [];

    // IGT deck structure (simplified):
    this.decks = {
      A: { reward: 100, penaltyFreq: 0.5, penaltyAmt: 150, color: '#ef4444', label: 'A', good: false },
      B: { reward: 100, penaltyFreq: 0.1, penaltyAmt: 1250, color: '#f59e0b', label: 'B', good: false },
      C: { reward: 50,  penaltyFreq: 0.5, penaltyAmt: 25,   color: '#10b981', label: 'C', good: true  },
      D: { reward: 50,  penaltyFreq: 0.1, penaltyAmt: 250,  color: '#06b6d4', label: 'D', good: true  },
    };
    this.deckPicks = { A: 0, B: 0, C: 0, D: 0 };
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'cards-game';
    this.container.appendChild(this.el);
    this._render();
  }

  _getTopDeck() {
    const picks = Object.entries(this.deckPicks);
    const top = picks.reduce((a, b) => b[1] > a[1] ? b : a, ['None', 0]);
    return top[1] > 0 ? `Deck ${top[0]}` : 'None';
  }

  _getLastOutcome() {
    const last = this.history[this.history.length - 1];
    if (!last) return '—';
    return `${last.net >= 0 ? '+' : ''}$${last.net}`;
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
            <span class="ap-question-num">Trial ${this.turns + 1} of 100</span>
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
            <div class="ap-workspace" style="max-width: 1200px">
              
              <!-- Header info block -->
              <div class="ap-cards-header-block" style="display:flex; justify-content:between; align-items:flex-start">
                <div>
                  <span class="ap-cards-tag">Active Test</span>
                  <span style="font-size:0.75rem; color:#6b7280; margin-left:12px">Estimated: 5 min</span>
                  <h2 style="font-size:1.8rem; font-weight:800; color:#111827; margin-top:6px; margin-bottom:8px">Risk & Reward Cards</h2>
                  <p style="font-size:0.85rem; color:#4b5563; max-width:700px; line-height:1.4">Select cards from the decks below. Some decks are risky but high-reward, while others are stable. Your goal is to maximize your total bank over 100 trials.</p>
                </div>
                
                <div style="margin-left:auto; text-align:right">
                  <div style="font-size:0.75rem; font-weight:700; color:#374151; margin-bottom:6px" id="trial-progress-text">Trial Progress 1/100</div>
                  <div class="ap-progress-bar-bg" style="width:160px"><div class="ap-progress-bar-fill" id="cards-prog" style="width:1%"></div></div>
                </div>
              </div>

              <!-- Top Metrics Cards -->
              <div class="ap-cards-top-metrics">
                <div class="ap-cards-metric-card">
                  <div class="ap-cards-metric-icon-box" style="background-color:#e0e7ff; color:#4f46e5">💰</div>
                  <div class="ap-cards-metric-content">
                    <span class="ap-cards-metric-lbl">Total Bank</span>
                    <span class="ap-cards-metric-val" id="cards-money" style="color:#059669">$${this.totalMoney.toLocaleString()}</span>
                  </div>
                </div>
                
                <div class="ap-cards-metric-card">
                  <div class="ap-cards-metric-icon-box" style="background-color:#ecfdf5; color:#10b981">📈</div>
                  <div class="ap-cards-metric-content">
                    <span class="ap-cards-metric-lbl">Last Outcome</span>
                    <span class="ap-cards-metric-val" id="cards-last-outcome">${this._getLastOutcome()}</span>
                  </div>
                </div>

                <div class="ap-cards-metric-card">
                  <div class="ap-cards-metric-icon-box" style="background-color:#fff7ed; color:#ea580c">⏳</div>
                  <div class="ap-cards-metric-content">
                    <span class="ap-cards-metric-lbl">Top Deck</span>
                    <span class="ap-cards-metric-val" id="cards-top-deck">${this._getTopDeck()}</span>
                  </div>
                </div>
              </div>

              <!-- Card board -->
              <div class="ap-cards-board" id="cards-decks"></div>

              <!-- Bottom brief / actions -->
              <div class="ap-cards-bottom">
                <div class="ap-cards-brief">
                  <strong>Instruction Brief</strong><br>
                  Each card has a guaranteed win. Decks A & B offer high wins ($100) but large, occasional penalties. Decks C & D offer smaller wins ($50) but much smaller, safer penalties.
                </div>
                <div style="display:flex; gap:12px">
                  <button class="btn" style="background-color:#f3f4f6; color:#4b5563; border:1px solid #d1d5db !important; font-weight:600; padding:10px 20px; border-radius:8px" id="btn-card-reset">Reset Game</button>
                  <button class="btn" style="background-color:#005d50; color:#ffffff; font-weight:600; padding:10px 24px; border-radius:8px; border:none" id="btn-card-submit" disabled>Submit Progress</button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>`;

    this._renderDecks();

    const resetBtn = this.el.querySelector('#btn-card-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.totalMoney = 2000;
        this.turns = 0;
        this.deckPicks = { A: 0, B: 0, C: 0, D: 0 };
        this.history = [];
        this.score = 0;
        this.locked = false;
        this._render();
      });
    }

    const submitBtn = this.el.querySelector('#btn-card-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this._finish();
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

  _renderDecks() {
    const decksEl = document.getElementById('cards-decks');
    if (!decksEl) return;
    decksEl.innerHTML = '';

    Object.entries(this.decks).forEach(([key, deck]) => {
      const deckEl = document.createElement('div');
      deckEl.className = 'ap-card-stack';
      deckEl.dataset.deck = key;

      deckEl.innerHTML = `
        <div class="ap-card-circle">${key}</div>
        <div class="ap-card-deck-icon">🃏</div>
        <div class="ap-card-click-label">Click to Draw</div>
        <div style="font-size:0.68rem; color:#94a3b8; font-weight:700; margin-top:10px">${this.deckPicks[key]} picks</div>`;

      deckEl.addEventListener('click', () => this._pickDeck(key));
      decksEl.appendChild(deckEl);
    });
  }

  _pickDeck(deckKey) {
    if (this.locked || !this.el) return;
    this.locked = true;
    const deck = this.decks[deckKey];
    this.turns++;
    this.deckPicks[deckKey]++;

    // Simple tilt animation on click
    const deckEl = this.el.querySelector(`[data-deck="${deckKey}"]`);
    if (deckEl) {
      deckEl.style.transform = 'scale(0.95) rotate(-2deg)';
    }

    setTimeout(() => {
      const win = deck.reward;
      const hasPenalty = Math.random() < deck.penaltyFreq;
      const lose = hasPenalty ? deck.penaltyAmt : 0;
      const net = win - lose;
      this.totalMoney += net;

      this.history.push({ deck: deckKey, win, lose, net, good: net > 0 });
      this._updateStats();

      const pts = Math.max(-50, net > 0 ? Math.min(80, net) : net / 2);
      this.score = Math.max(0, this.score + pts);
      this.cb.onScore(Math.max(0, pts), this.turns);
      if (net > 0) this.cb.onFeedback(true);
      else this.cb.onFeedback(false);

      if (deckEl) {
        deckEl.style.transform = '';
      }
      this._renderDecks();

      if (this.turns >= this.maxTurns) {
        const submitBtn = this.el.querySelector('#btn-card-submit');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '#059669';
        }
        const t = setTimeout(() => this._finish(), 1200);
        this._timers.push(t);
      } else {
        this.locked = false;
      }
    }, 300);
  }

  _updateStats() {
    const moneyEl = document.getElementById('cards-money');
    const outcomeEl = document.getElementById('cards-last-outcome');
    const topDeckEl = document.getElementById('cards-top-deck');
    const turnText = document.getElementById('trial-progress-text');
    const progEl = document.getElementById('cards-prog');
    
    if (moneyEl) moneyEl.textContent = `$${this.totalMoney.toLocaleString()}`;
    if (outcomeEl) {
      const last = this.history[this.history.length - 1];
      if (last) {
        outcomeEl.textContent = `${last.net >= 0 ? '+' : ''}$${last.net}`;
        outcomeEl.style.color = last.net >= 0 ? '#059669' : '#dc2626';
      }
    }
    if (topDeckEl) topDeckEl.textContent = this._getTopDeck();
    if (turnText) turnText.textContent = `Trial Progress ${this.turns}/${this.maxTurns}`;
    if (progEl) progEl.style.width = `${(this.turns / this.maxTurns) * 100}%`;
  }

  _renderHistory() {
    const dots = document.getElementById('hist-dots');
    if (!dots) return;
    const last20 = this.history.slice(-20);
    dots.innerHTML = last20.map(h =>
      `<span class="hist-dot" style="background:${h.net >= 0 ? 'var(--emerald)' : 'var(--red)'}" title="Deck ${h.deck}: $${h.net}"></span>`
    ).join('');
  }

  _finish() {
    const goodPicks = ['C', 'D'].reduce((a, d) => a + this.deckPicks[d], 0);
    const badPicks = ['A', 'B'].reduce((a, d) => a + this.deckPicks[d], 0);
    const learningScore = goodPicks / Math.max(1, this.turns);

    if (!this.el) return;
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">🃏</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Cards Game Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Final balance: <strong style="color:${this.totalMoney>2000?'var(--emerald)':'var(--red)'}">$${this.totalMoney}</strong></p>
        <p style="color:var(--muted);margin-bottom:8px">Good deck picks (C+D): <strong>${goodPicks}</strong> · Bad (A+B): <strong>${badPicks}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Decision profile: <strong>${learningScore > 0.6 ? 'Risk-averse / Rational' : learningScore > 0.4 ? 'Balanced' : 'Risk-seeking'}</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: Math.round(learningScore * 100),
        avgTime: 0, correct: goodPicks, total: this.turns, level: this.level
      });
    }, 2000);
  }

  timeUp() {
    this._timers.forEach(clearTimeout);
    this._finish();
  }

  destroy() {
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}

window.CardsGame = CardsGame;
