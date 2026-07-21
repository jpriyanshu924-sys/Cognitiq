/* ══════════════════════════════════════════════════════
   Talegent 2: Team Dilemma
   Measures: Interpersonal judgement, empathy, conflict resolution
   Based on: Talegent Workplace Challenges - Team Dilemma
   ══════════════════════════════════════════════════════ */
class TeamDilemmaGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.qIndex = 0;
    this.el = null;
    this.hasAnswered = false;

    // Advanced, subtle set of 5 realistic corporate dilemmas with balanced, professional options
    this.dilemmas = [
      {
        title: "The Autonomy Conflict",
        chars: { left: "👨‍💼 David (Lead)", right: "👩‍💻 Sarah (Engineer)" },
        dialogue: "David demands daily, detailed status reports on every task. Sarah feels micro-managed, arguing that writing reports eats up coding time and shows a lack of trust.",
        options: [
          { text: "Establish a automated daily Slack status update (using a template) and a weekly status sync to balance autonomy and visibility.", val: 4 },
          { text: "Instruct Sarah to log tasks directly into the project board in real-time, allowing David to check status autonomously without demanding separate reports.", val: 3.8 },
          { text: "Implement weekly milestone reports instead of daily logs, allowing Sarah more coding focus while providing David summary updates.", val: 3.5 },
          { text: "Establish a mandatory daily 15-minute standup meeting where Sarah reports details, ensuring David has full visibility while saving written reporting time.", val: 3.0 }
        ],
        explanation: "Establishing automated daily logs (Option 1) or real-time project board updates (Option 2) are highly effective ways to provide status visibility without adding bureaucratic overhead or creating manager-employee friction."
      },
      {
        title: "Quality vs. Speed",
        chars: { left: "👩‍💼 Chloe (Marketing)", right: "👨‍💻 Marcus (QA Lead)" },
        dialogue: "Chloe wants to launch the new web module immediately to align with a major ad campaign. Marcus refuses to sign off because test coverage is at 80% rather than the 95% company target.",
        options: [
          { text: "Launch a limited beta release to 15% of users to test in production on schedule, while QA runs tests to hit 95% before full rollout.", val: 4 },
          { text: "Review the missing 15% test coverage to identify critical risk areas; launch low-risk core features on schedule while delaying high-risk edge features.", val: 3.8 },
          { text: "Delay the launch by one week to allow QA to reach 90% coverage, and request Marketing to run pre-launch teasers to minimize campaign disruption.", val: 3.5 },
          { text: "Launch on schedule with a dedicated fast-response developer crew on standby to fix errors in real-time as they appear.", val: 2.8 }
        ],
        explanation: "Risk-managed compromises like phased beta releases (Option 1) or feature prioritization by risk (Option 2) balance high-stakes campaign deadlines with critical quality controls."
      },
      {
        title: "Credit Misattribution",
        chars: { left: "👩‍💼 Lin (Researcher)", right: "👨‍💼 James (Presenter)" },
        dialogue: "James presented a slide deck to the director using Lin's sole research, but took credit without mentioning her. Lin is upset and refuses to collaborate with James.",
        options: [
          { text: "Meet with James privately to have him email the director clarifying Lin's contribution, and set up a joint presentation for the next director briefing.", val: 4 },
          { text: "Personally brief the director on Lin's research role, while mentoring James on collaborative leadership and sharing credit.", val: 3.8 },
          { text: "Facilitate a private discussion where James explains his actions, apologizes, and agrees to highlight Lin's role in the follow-up project report.", val: 3.5 },
          { text: "Propose establishing a mandatory 'Credits & Contributors' slide for all team presentations going forward to prevent future omissions.", val: 3.0 }
        ],
        explanation: "Having James personally correct the record with the director (Option 1) or directly briefing the director (Option 2) restores professional equity and credit while encouraging collaborative growth."
      },
      {
        title: "Resource Allocation",
        chars: { left: "👨‍💻 Alex (Tech Lead)", right: "👩‍💼 Priya (Product Lead)" },
        dialogue: "Both Alex and Priya need the senior designer, Leo, full-time next week. Alex needs Leo to fix CSS design bugs, and Priya needs Leo for investor mocks.",
        options: [
          { text: "Allocate Leo to Priya for the investor mocks, as funding is a strategic priority, while outsourcing the CSS bugs to a junior designer with senior support.", val: 4 },
          { text: "Have Leo create a design template system on Monday, enabling Alex's developers to fix CSS bugs themselves while Leo works with Priya.", val: 3.8 },
          { text: "Split Leo's time 50/50 next week, setting fixed morning/afternoon hours for each project to ensure both make progress.", val: 3.0 },
          { text: "Keep Leo on CSS bugs to maintain release stability, and ask Priya to use existing mock wireframes for the investor meeting.", val: 2.5 }
        ],
        explanation: "Prioritizing the strategic funding mockup while delegating CSS work (Option 1) or empowering developers with templates (Option 2) resolves the constraint while maximizing business output."
      },
      {
        title: "Remote Work Core Hours",
        chars: { left: "👨‍💼 Ken (Eng Lead)", right: "👨‍💻 Liam (Developer)" },
        dialogue: "Ken wants to enforce core collaboration hours (10 AM to 3 PM) for the remote team. Liam is upset, stating it violates the company's flexible hours policy.",
        options: [
          { text: "Establish a 2-hour daily collaboration window (e.g. 11 AM to 1 PM) for standups and syncs, leaving the rest of the day completely flexible.", val: 4 },
          { text: "Maintain absolute flex hours, but require all team members to respond to Slack messages within a 4-hour window.", val: 3.5 },
          { text: "Have Liam and others who want flexibility work on async-heavy tasks, while Ken's sync-heavy tasks are handled by developers who prefer fixed hours.", val: 3.0 },
          { text: "Enforce Ken's core hours (10 AM - 3 PM) since core team sync is essential for project velocity.", val: 2.5 }
        ],
        explanation: "Structuring a narrow 2-hour daily sync window (Option 1) allows vital team coordination to occur without stripping employees of their remote work flexibility."
      }
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'tdil-game';
    this.container.appendChild(this.el);
    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIndex >= this.dilemmas.length) {
      this._finish();
      return;
    }

    this.hasAnswered = false;
    const d = this.dilemmas[this.qIndex];
    this._render(d);
  }

  _render(d) {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="tdil-header">
        <div class="tdil-stat"><span class="tdil-l">Dilemma</span><span class="tdil-v" style="color:var(--violet-l)">${this.qIndex + 1}/${this.dilemmas.length}</span></div>
        <div class="tdil-stat"><span class="tdil-l">Score</span><span class="tdil-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.qIndex) / this.dilemmas.length * 100}%"></div></div>
      
      <div class="tdil-workspace">
        <div class="tdil-scenario-card">
          <h3>👥 Team Conflict: ${d.title}</h3>
          
          <div class="tdil-chat-interface">
            <div class="tdil-bubble left">
              <strong>${d.chars.left}</strong>
              <p>We are facing gridlock on this project due to our conflicting styles.</p>
            </div>
            <div class="tdil-bubble right">
              <strong>${d.chars.right}</strong>
              <p>${d.dialogue}</p>
            </div>
          </div>
        </div>
        
        <div class="tdil-choices-section">
          <label>Select your mediation action:</label>
          <div class="tdil-options">
            ${d.options.map((opt, idx) => `
              <button class="tdil-opt-btn" data-idx="${idx}">
                <span class="tdil-opt-num">${idx + 1}</span>
                <span class="tdil-opt-text">${opt.text}</span>
              </button>
            `).join('')}
          </div>
          <div class="tdil-explanation" id="tdil-explanation" style="display:none;margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px"></div>
        </div>
      </div>
      
      <div class="tdil-footer" style="display:none;margin-top:20px" id="tdil-next-panel">
        <button class="btn btn-primary" id="tdil-next-btn">Next Conflict ➔</button>
      </div>`;

    this.el.querySelectorAll('.tdil-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        this._pickAnswer(idx);
      });
    });
  }

  _pickAnswer(choiceIdx) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;
    this.total++;

    const d = this.dilemmas[this.qIndex];
    const chosenOpt = d.options[choiceIdx];
    
    // Find optimal option (val === 4)
    const optimalIdx = d.options.findIndex(o => o.val === 4);
    const isPerfect = (choiceIdx === optimalIdx);

    const btns = this.el.querySelectorAll('.tdil-opt-btn');
    btns.forEach(btn => {
      const idx = parseInt(btn.dataset.idx);
      if (idx === optimalIdx) {
        btn.classList.add('tdil-opt-correct');
      } else if (idx === choiceIdx && !isPerfect) {
        btn.classList.add('tdil-opt-wrong');
      }
    });

    const pts = Math.round(chosenOpt.val * 75);
    this.score += pts;
    if (isPerfect) this.correct++;

    this.cb.onScore(pts, this.qIndex + 1);
    this.cb.onFeedback(chosenOpt.val >= 3.5);

    const expEl = this.el.querySelector('#tdil-explanation');
    if (expEl) {
      expEl.style.display = 'block';
      expEl.innerHTML = `<strong>Feedback:</strong> ${d.explanation}`;
    }

    const nextPanel = this.el.querySelector('#tdil-next-panel');
    if (nextPanel) {
      nextPanel.style.display = 'flex';
      const nextBtn = this.el.querySelector('#tdil-next-btn');
      if (nextBtn) {
        nextBtn.onclick = () => {
          this.qIndex++;
          this._showQuestion();
        };
      }
    }
  }

  _finish() {
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: 0,
      correct: this.correct,
      total: this.total,
      level: 3
    });
  }

  timeUp() { this._finish(); }
  destroy() {
    this.el = null;
  }
}
window.TeamDilemmaGame = TeamDilemmaGame;
