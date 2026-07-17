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

    this.dilemmas = [
      {
        title: "The Autonomy Conflict",
        chars: { left: "👨‍💼 David (Lead)", right: "👩‍💻 Sarah (Engineer)" },
        dialogue: "David demands daily, detailed status reports on every task. Sarah feels micro-managed, arguing that writing reports eats up coding time and shows a lack of trust.",
        options: [
          { text: "Instruct Sarah to comply with David's requests, as he is the lead and needs full visibility.", val: 2 },
          { text: "Tell David to stop requesting reports and trust Sarah to complete her work.", val: 1 },
          { text: "Facilitate a compromise: agree on a brief, automated daily Slack update and a weekly status sync to balance autonomy and visibility.", val: 4 }, // Best
          { text: "Reassign Sarah to a different project so they no longer need to coordinate.", val: 1.5 }
        ],
        explanation: "Collaborative compromises (Option C) preserve trust and autonomy while meeting management needs. Forceful or avoidant actions (A/B/D) aggravate friction."
      },
      {
        title: "Quality vs. Speed",
        chars: { left: "👩‍💼 Chloe (Marketing)", right: "👨‍💻 Marcus (QA Lead)" },
        dialogue: "Chloe wants to launch the new web module immediately to align with a major ad campaign. Marcus refuses to sign off because test coverage is at 80% rather than the 95% company target.",
        options: [
          { text: "Delay the launch until Marcus hits the 95% test coverage requirement.", val: 2 },
          { text: "Bypass QA and approve the launch to satisfy Chloe's marketing goals.", val: 1.5 },
          { text: "Run a risk assessment: launch the core modules on schedule with standard support, and target the remaining test patches for a hotfix deployment next week.", val: 4 }, // Best
          { text: "Advise Chloe and Marcus to debate and settle the dispute on their own.", val: 1 }
        ],
        explanation: "Pragmatic, risk-managed compromises (Option C) balance business urgencies with quality controls. Siding entirely or neglect (A/B/D) harms one stakeholder."
      },
      {
        title: "Credit Misattribution",
        chars: { left: "👩‍💼 Lin (Researcher)", right: "👨‍💼 James (Presenter)" },
        dialogue: "James presented a slide deck to the director using Lin's sole research, but took full credit without mentioning her. Lin is upset and refuses to collaborate with James.",
        options: [
          { text: "Advise Lin to let it go, as slides are corporate team property.", val: 1.5 },
          { text: "Meet with James privately; ask him to email the director acknowledging Lin's contribution, and ensure clear credit guidelines for future projects.", val: 4 }, // Best
          { text: "Escalate the issue to HR immediately, claiming plagiarism.", val: 2 },
          { text: "Tell Lin to represent herself better during presentations in the future.", val: 1 }
        ],
        explanation: "Corrective feedback combined with structural restoration of credit (Option B) repairs peer relationships without premature escalations."
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
    
    // Find optimal option
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
    this.cb.onFeedback(chosenOpt.val >= 3);

    const expEl = this.el.querySelector('#tdil-explanation');
    if (expEl) {
      expEl.style.display = 'block';
      expEl.innerHTML = `<strong>Feedback:</strong> ${d.explanation}`;
    }

    const nextPanel = this.el.querySelector('#tdil-next-panel');
    if (nextPanel) {
      nextPanel.style.display = 'flex';
      const nextBtn = this.el.querySelector('#tdil-next-btn');
      if (nextBtn) nextBtn.addEventListener('click', () => {
        this.qIndex++;
        this._showQuestion();
      });
    }
  }

  _finish() {
    this.cb.onEnd({
      score: this.score,
      accuracy: this.total ? (this.correct / this.total) * 100 : 0,
      avgTime: 0,
      correct: this.correct,
      total: this.total,
      level: 1
    });
  }

  timeUp() { this._finish(); }
  destroy() {
    this.el = null;
  }
}
window.TeamDilemmaGame = TeamDilemmaGame;
