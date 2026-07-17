/* ══════════════════════════════════════════════════════
   The Talent Games 1: Business Sim
   Measures: Leadership, decision-making, consequence thinking
   Based on: The Talent Games story-based business simulations
   ══════════════════════════════════════════════════════ */
class BusinessSimGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.round = 0; this.maxRounds = 6;
    this.el = null;
    this._timers = [];

    // Stats (0 to 100)
    this.stats = {
      morale: 60,
      cash: 60,
      quality: 60
    };

    this.rounds = [
      {
        scenario: "Your lead software developer requests a 20% raise. Cash is tight, but losing them would delay your product launch significantly.",
        options: [
          { text: "Grant the full raise immediately.", morale: 20, cash: -20, quality: 5, feedback: "The developer is thrilled, boosting morale. However, cash reserves take a hit." },
          { text: "Offer a smaller 5% raise with a promise of stock options post-launch.", morale: 5, cash: -5, quality: 0, feedback: "The developer accepts reluctantly. Minimal immediate impact on cash." },
          { text: "Reject the raise. Remind them of the team mission and stock potential.", morale: -20, cash: 10, quality: -15, feedback: "Morale drops, and the developer begins looking elsewhere. Quality suffers as progress slows." }
        ]
      },
      {
        scenario: "A minor security vulnerability is discovered in your beta product. Fixing it immediately will delay the release by two weeks.",
        options: [
          { text: "Delay the launch to patch the security vulnerability properly.", morale: -5, cash: -15, quality: 25, feedback: "Product quality and security are safeguarded, but cash is burned during the delay." },
          { text: "Launch on schedule and schedule a patch update for next month.", morale: 5, cash: 15, quality: -10, feedback: "You hit your launch target and bring in revenue, but initial product quality is compromised." },
          { text: "Ignore the bug. It is unlikely users will discover it anyway.", morale: -10, cash: 5, quality: -30, feedback: "Morale dips due to ethical concerns, and product quality is severely degraded." }
        ]
      },
      {
        scenario: "Your main competitor launches a copycat feature that is gaining traction. The team is divided on whether to pivot or stick to the plan.",
        options: [
          { text: "Pivot your roadmap to match and out-innovate the competitor's feature.", morale: -15, cash: -10, quality: 5, feedback: "Pivoting exhausts the team and burns cash, but keeps you competitive." },
          { text: "Stick to your original unique roadmap and double down on your differentiators.", morale: 15, cash: -5, quality: 15, feedback: "The team appreciates the clear vision, raising morale and product quality." },
          { text: "Initiate partnership talks with the competitor to integrate your services.", morale: 5, cash: 20, quality: -10, feedback: "Investor interest spikes cash, but integration complexity hurts product quality." }
        ]
      },
      {
        scenario: "The marketing team requests a $15k campaign budget increase to run social media ads.",
        options: [
          { text: "Approve the full request to maximize initial customer acquisition.", morale: 10, cash: -25, quality: 0, feedback: "The marketing team is energized, but cash reserves are depleted." },
          { text: "Approve a half-budget compromise ($7.5k).", morale: 5, cash: -10, quality: 0, feedback: "A sensible middle ground that keeps marketing moving while preserving cash." },
          { text: "Reject the request. Rely purely on organic, unpaid growth.", morale: -15, cash: 10, quality: 0, feedback: "Marketing feels restricted, reducing morale. Cash is preserved." }
        ]
      },
      {
        scenario: "To handle the workload, you need additional development power immediately. How do you scale?",
        options: [
          { text: "Hire a highly-rated full-time senior developer.", morale: 15, cash: -30, quality: 25, feedback: "Quality and capacity shoot up, but hiring fees and salary burn serious cash." },
          { text: "Hire a temporary freelance developer on a contract.", morale: 5, cash: -12, quality: 10, feedback: "Provides decent capacity with moderate cash burn." },
          { text: "Ask the existing team to work overtime for the next month.", morale: -30, cash: 0, quality: -5, feedback: "Severe burnout spikes. Quality dips slightly due to fatigue, but cash is saved." }
        ]
      },
      {
        scenario: "A major client offers a high-value contract but demands custom features that divert from your core product strategy.",
        options: [
          { text: "Accept the contract and build the custom features.", morale: -10, cash: 35, quality: -15, feedback: "A massive cash injection! However, customizing the software hurts core product quality." },
          { text: "Decline the contract. Stay focused on your scalable product.", morale: 15, cash: -15, quality: 20, feedback: "The team is proud to maintain product integrity. Core quality rises, but cash remains tight." },
          { text: "Negotiate a compromise to build only a subset of their requests.", morale: 5, cash: 15, quality: 5, feedback: "A balanced contract that funds operations while keeping the product close to roadmap." }
        ]
      }
    ];

    this.decisions = [];
    this.currentFeedback = "";
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'bsim-game';
    this.container.appendChild(this.el);
    this._nextRound();
  }

  _nextRound() {
    if (this.round >= this.maxRounds) {
      this._finish();
      return;
    }
    this.round++;
    this.currentFeedback = "";
    this._render();
  }

  _render() {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="bsim-header">
        <div class="bsim-stat"><span class="bsim-l">Quarter</span><span class="bsim-v" style="color:var(--violet-l)">${this.round}/${this.maxRounds}</span></div>
        <div class="bsim-stat"><span class="bsim-l">Manager Score</span><span class="bsim-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.round - 1) / this.maxRounds * 100}%"></div></div>
      
      <!-- Stats Dashboard -->
      <div class="bsim-dashboard">
        <div class="bsim-dash-card">
          <div class="bd-label">👷 Team Morale</div>
          <div class="bd-val" style="color:var(--cyan)">${this.stats.morale}%</div>
          <div class="bd-bar"><div class="bd-fill" style="width:${this.stats.morale}%;background:var(--cyan)"></div></div>
        </div>
        <div class="bsim-dash-card">
          <div class="bd-label">💰 Cash Reserves</div>
          <div class="bd-val" style="color:var(--emerald)">${this.stats.cash}%</div>
          <div class="bd-bar"><div class="bd-fill" style="width:${this.stats.cash}%;background:var(--emerald)"></div></div>
        </div>
        <div class="bsim-dash-card">
          <div class="bd-label">💎 Product Quality</div>
          <div class="bd-val" style="color:var(--violet-l)">${this.stats.quality}%</div>
          <div class="bd-bar"><div class="bd-fill" style="width:${this.stats.quality}%;background:var(--violet-l)"></div></div>
        </div>
      </div>
      
      <div class="bsim-workspace">
        ${this.currentFeedback ? `
          <div class="bsim-feedback-box">
            <h4>Outcome Action:</h4>
            <p>${this.currentFeedback}</p>
            <button class="btn btn-primary" id="bsim-next-btn">Continue ➔</button>
          </div>
        ` : `
          <div class="bsim-scenario-box">
            <h3 class="bsim-scen-title">Quarter ${this.round} Scenario</h3>
            <p class="bsim-scen-text">${this.rounds[this.round - 1].scenario}</p>
          </div>
          
          <div class="bsim-options">
            ${this.rounds[this.round - 1].options.map((opt, idx) => `
              <button class="bsim-opt-card" data-idx="${idx}">
                <div class="bsim-opt-num">${idx + 1}</div>
                <div class="bsim-opt-text">${opt.text}</div>
              </button>
            `).join('')}
          </div>
        `}
      </div>`;

    if (this.currentFeedback) {
      const nextBtn = this.el.querySelector('#bsim-next-btn');
      if (nextBtn) nextBtn.addEventListener('click', () => this._nextRound());
    } else {
      this.el.querySelectorAll('.bsim-opt-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          this._chooseOption(idx);
        });
      });
    }
  }

  _chooseOption(idx) {
    const r = this.rounds[this.round - 1];
    const opt = r.options[idx];

    // Apply stat changes
    this.stats.morale = Math.max(0, Math.min(100, this.stats.morale + opt.morale));
    this.stats.cash = Math.max(0, Math.min(100, this.stats.cash + opt.cash));
    this.stats.quality = Math.max(0, Math.min(100, this.stats.quality + opt.quality));

    // Calculate score change
    // A balanced manager score: rewards keeping all stats high and balanced
    const average = (this.stats.morale + this.stats.cash + this.stats.quality) / 3;
    const pts = Math.round(average * 5);
    this.score += pts;

    this.cb.onScore(pts, this.round);
    this.cb.onFeedback(true);

    this.decisions.push({ round: this.round, choice: idx });
    this.currentFeedback = opt.feedback;

    this._render();
  }

  _finish() {
    if (!this.el) return;
    const finalAvg = Math.round((this.stats.morale + this.stats.cash + this.stats.quality) / 3);
    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">👔</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Startup Simulation Complete!</h3>
        <p style="color:var(--muted);margin-bottom:8px">Final Enterprise Health: <strong>${finalAvg}% avg</strong></p>
        <div style="display:flex;justify-content:center;gap:20px;margin:20px 0">
          <div>Morale: <strong style="color:var(--cyan)">${this.stats.morale}%</strong></div>
          <div>Cash: <strong style="color:var(--emerald)">${this.stats.cash}%</strong></div>
          <div>Quality: <strong style="color:var(--violet-l)">${this.stats.quality}%</strong></div>
        </div>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    const t = setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: finalAvg,
        avgTime: 0,
        correct: finalAvg >= 50 ? 1 : 0,
        total: 1,
        level: 1
      });
    }, 2000);
    this._timers.push(t);
  }

  timeUp() { this._finish(); }
  destroy() {
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}
window.BusinessSimGame = BusinessSimGame;
