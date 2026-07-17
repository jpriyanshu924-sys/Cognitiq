/* ══════════════════════════════════════════════════════
   Sova Assessment 2: Personality Reveal
   Measures: Big Five traits (Openness, Conscientiousness, Extraversion, Agreeableness, Emotional Stability)
   Based on: Sova Forced-Choice Ipsative Personality Profile
   ══════════════════════════════════════════════════════ */
class PersonalityRevealGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 500; // Flat completion score
    this.qIndex = 0;
    this.el = null;

    // Big Five Trait scoring tracker
    this.traits = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      stability: 0
    };

    this.pairs = [
      {
        stmtA: { text: "I prefer to take the lead in team projects and direct others.", trait: "extraversion" },
        stmtB: { text: "I prefer to analyze data thoroughly before drawing conclusions.", trait: "conscientiousness" }
      },
      {
        stmtA: { text: "I enjoy exploring new, creative, and unconventional ideas.", trait: "openness" },
        stmtB: { text: "I prioritize helping and supporting my colleagues with their work.", trait: "agreeableness" }
      },
      {
        stmtA: { text: "I remain calm and level-headed when project requirements shift suddenly.", trait: "stability" },
        stmtB: { text: "I keep my workspace and digital files meticulously organized.", trait: "conscientiousness" }
      },
      {
        stmtA: { text: "I thrive when pitching ideas to large audiences and networking.", trait: "extraversion" },
        stmtB: { text: "I am deeply curious about how complex backend systems work.", trait: "openness" }
      },
      {
        stmtA: { text: "I avoid conflict by finding diplomatic compromises for everyone.", trait: "agreeableness" },
        stmtB: { text: "I keep my emotions separate from logical decisions under pressure.", trait: "stability" }
      },
      {
        stmtA: { text: "I create detailed checklist milestones to track my task progress.", trait: "conscientiousness" },
        stmtB: { text: "I enjoy brainstorming out-of-the-box features for our products.", trait: "openness" }
      },
      {
        stmtA: { text: "I am comfortable speaking up immediately when I disagree with a plan.", trait: "extraversion" },
        stmtB: { text: "I make an effort to check in on teammates who seem stressed.", trait: "agreeableness" }
      },
      {
        stmtA: { text: "I rarely get anxious or stressed by impending project deadlines.", trait: "stability" },
        stmtB: { text: "I follow established company protocols and guidelines carefully.", trait: "conscientiousness" }
      },
      {
        stmtA: { text: "I seek out feedback to continuously learn and innovate.", trait: "openness" },
        stmtB: { text: "I energy-charge myself by interacting with others in office events.", trait: "extraversion" }
      },
      {
        stmtA: { text: "I am willing to compromise my own preferences to maintain team harmony.", trait: "agreeableness" },
        stmtB: { text: "I have a highly stable mood and rarely feel irritable at work.", trait: "stability" }
      }
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'pers-reveal-game';
    this.container.appendChild(this.el);
    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIndex >= this.pairs.length) {
      this._finish();
      return;
    }
    const pair = this.pairs[this.qIndex];
    this._render(pair);
  }

  _render(pair) {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="pr-header">
        <div class="pr-stat"><span class="pr-l">Progress</span><span class="pr-v" style="color:var(--violet-l)">${this.qIndex + 1}/${this.pairs.length} statements</span></div>
        <div class="pr-stat"><span class="pr-l">Profile Type</span><span class="pr-v" style="color:var(--amber)">IPSATIVE</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.qIndex) / this.pairs.length * 100}%"></div></div>
      
      <div class="pr-workspace">
        <div class="pr-prompt">Choose the statement that describes your workplace preferences better:</div>
        
        <div class="pr-choice-container">
          <button class="pr-stmt-card" id="pr-btn-a">
            <div class="pr-stmt-emoji">🅰️</div>
            <div class="pr-stmt-text">${pair.stmtA.text}</div>
          </button>
          
          <div class="pr-or-divider">OR</div>
          
          <button class="pr-stmt-card" id="pr-btn-b">
            <div class="pr-stmt-emoji">🅱️</div>
            <div class="pr-stmt-text">${pair.stmtB.text}</div>
          </button>
        </div>
      </div>`;

    this.el.querySelector('#pr-btn-a').addEventListener('click', () => this._choose(pair.stmtA.trait));
    this.el.querySelector('#pr-btn-b').addEventListener('click', () => this._choose(pair.stmtB.trait));
  }

  _choose(trait) {
    this.traits[trait]++;
    this.qIndex++;
    
    // Reward points for moving forward
    this.cb.onScore(50, this.qIndex);
    this.cb.onFeedback(true);

    this._showQuestion();
  }

  _finish() {
    if (!this.el) return;

    // Normalize trait scores to a percentage based on maximum selections
    const norm = (val) => Math.min(100, Math.round((val / 4) * 100));

    this.el.innerHTML = `
      <div style="padding:20px;text-align:center">
        <div style="font-size:3.5rem;margin-bottom:16px">🎭</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">Personality Profile Built!</h3>
        <p style="color:var(--muted);margin-bottom:20px">Your forced-choice preferences indicate the following dimensions:</p>
        
        <div class="pr-results-grid" style="text-align:left;max-width:400px;margin:0 auto">
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:between"><span>💡 Openness (Innovation)</span><strong>${norm(this.traits.openness)}%</strong></div>
            <div class="bd-bar"><div class="bd-fill" style="width:${norm(this.traits.openness)}%;background:var(--violet-l)"></div></div>
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:between"><span>📅 Conscientiousness (Structure)</span><strong>${norm(this.traits.conscientiousness)}%</strong></div>
            <div class="bd-bar"><div class="bd-fill" style="width:${norm(this.traits.conscientiousness)}%;background:var(--cyan)"></div></div>
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:between"><span>🗣️ Extraversion (Leadership)</span><strong>${norm(this.traits.extraversion)}%</strong></div>
            <div class="bd-bar"><div class="bd-fill" style="width:${norm(this.traits.extraversion)}%;background:var(--amber)"></div></div>
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:between"><span>🤝 Agreeableness (Cooperation)</span><strong>${norm(this.traits.agreeableness)}%</strong></div>
            <div class="bd-bar"><div class="bd-fill" style="width:${norm(this.traits.agreeableness)}%;background:var(--emerald)"></div></div>
          </div>
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:between"><span>🧘 Emotional Stability</span><strong>${norm(this.traits.stability)}%</strong></div>
            <div class="bd-bar"><div class="bd-fill" style="width:${norm(this.traits.stability)}%;background:var(--pink)"></div></div>
          </div>
        </div>
        
        <button class="btn btn-primary btn-lg" id="pr-finish-btn" style="margin-top:20px">Submit Profile ➔</button>
      </div>`;

    const finishBtn = this.el.querySelector('#pr-finish-btn');
    if (finishBtn) finishBtn.addEventListener('click', () => {
      this.cb.onEnd({
        score: this.score,
        accuracy: 100,
        avgTime: 0,
        correct: 10,
        total: 10,
        level: 1
      });
    });
  }

  timeUp() {
    // Auto-submit the personality profile when timer expires
    this.cb.onEnd({
      score: this.score,
      accuracy: 100,
      avgTime: 0,
      correct: this.qIndex,
      total: this.pairs.length,
      level: 1
    });
  }
  destroy() {
    this.el = null;
  }
}
window.PersonalityRevealGame = PersonalityRevealGame;
