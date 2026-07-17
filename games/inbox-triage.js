/* ══════════════════════════════════════════════════════
   Talegent 1: Inbox Triage
   Measures: Prioritization, judgement, organizational skills
   Based on: Talegent Job Simulation - Inbox Triage
   ══════════════════════════════════════════════════════ */
class InboxTriageGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.el = null;
    this._timers = [];
    this.selectedEmailIdx = 0;

    this.emails = [
      {
        from: "DevOps Alert <alerts@corp.io>",
        subject: "CRITICAL: Checkout Service latency spikes (5000ms+)",
        body: "The payment checkout API is experiencing major degradation. Errors are affecting roughly 35% of all client checkout attempts. Action required immediately to avoid client churn.",
        choices: {
          priority: ["Urgent", "Normal", "Low"],
          action: ["Reply/Investigate", "Delegate", "Archive", "Ignore"]
        },
        correctPriority: "Urgent",
        correctAction: "Reply/Investigate",
        explanation: "Checkout API downtime immediately hurts sales. High-priority investigation is urgent.",
        userPriority: null,
        userAction: null
      },
      {
        from: "Sarah Jenkins <sjenkins@corp.io>",
        subject: "Lunch tomorrow?",
        body: "Hey! Just wanted to see if you were free to grab lunch tomorrow at 12:30? Let me know if you want to try the new sushi place down the street.",
        choices: {
          priority: ["Urgent", "Normal", "Low"],
          action: ["Reply/Investigate", "Delegate", "Archive", "Ignore"]
        },
        correctPriority: "Low",
        correctAction: "Archive",
        explanation: "Social invites are low priority and should be archived or quickly answered later.",
        userPriority: null,
        userAction: null
      },
      {
        from: "Alex Chen <achen@design.io>",
        subject: "FYI: Brand asset draft updates",
        body: "Hi team, we've updated the draft logo files in the shared drive. No immediate changes are needed on your end, just sharing the progress for our review next week.",
        choices: {
          priority: ["Urgent", "Normal", "Low"],
          action: ["Reply/Investigate", "Delegate", "Archive", "Ignore"]
        },
        correctPriority: "Low",
        correctAction: "Archive",
        explanation: "FYI updates with no blocker require no immediate action, making Archive the best choice.",
        userPriority: null,
        userAction: null
      },
      {
        from: "CFO Office <finance@corp.io>",
        subject: "URGENT: Q3 Budget Draft review due tomorrow 9AM",
        body: "Please review the attached spreadsheet of your department's Q3 budget proposals and verify the staff count projections before the final sign-off meeting tomorrow morning.",
        choices: {
          priority: ["Urgent", "Normal", "Low"],
          action: ["Reply/Investigate", "Delegate", "Archive", "Ignore"]
        },
        correctPriority: "Urgent",
        correctAction: "Reply/Investigate",
        explanation: "Budget submissions have firm executive deadlines and require personal verification.",
        userPriority: null,
        userAction: null
      },
      {
        from: "Marketing Software Promo <news@salesfunnel.com>",
        subject: "Increase your sales conversions by 300% now!",
        body: "Unlock our exclusive SaaS tools for sales performance optimization. Sign up today and get 50% off your subscription package...",
        choices: {
          priority: ["Urgent", "Normal", "Low"],
          action: ["Reply/Investigate", "Delegate", "Archive", "Ignore"]
        },
        correctPriority: "Low",
        correctAction: "Ignore",
        explanation: "External spam and sales emails should be ignored or deleted.",
        userPriority: null,
        userAction: null
      }
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'inbox-triage-game';
    this.container.appendChild(this.el);
    this._render();
  }

  _render() {
    if (!this.el) return;

    const currentEmail = this.emails[this.selectedEmailIdx];
    const completedCount = this.emails.filter(e => e.userPriority && e.userAction).length;

    this.el.innerHTML = `
      <div class="it-header">
        <div class="it-stat"><span class="it-l">Triage Status</span><span class="it-v" style="color:var(--violet-l)">${completedCount}/${this.emails.length} sorted</span></div>
        <div class="it-stat"><span class="it-l">Score</span><span class="it-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(completedCount / this.emails.length) * 100}%"></div></div>
      
      <div class="it-workspace">
        <!-- Sidebar: Email list -->
        <div class="it-sidebar">
          <h3>Inbox</h3>
          <div class="it-email-list">
            ${this.emails.map((e, idx) => `
              <div class="it-email-item ${idx === this.selectedEmailIdx ? 'it-active' : ''} ${e.userPriority && e.userAction ? 'it-completed' : ''}" data-idx="${idx}">
                <div class="it-item-from">${e.from.split(' <')[0]}</div>
                <div class="it-item-subject">${e.subject}</div>
                ${e.userPriority ? `<span class="it-item-badge it-badge-${e.userPriority.toLowerCase()}">${e.userPriority}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Main: Current email details and actions -->
        <div class="it-main">
          <div class="it-email-view">
            <div class="it-view-from"><strong>From:</strong> ${currentEmail.from}</div>
            <div class="it-view-subj"><strong>Subject:</strong> ${currentEmail.subject}</div>
            <hr class="it-divider" />
            <div class="it-view-body">${currentEmail.body}</div>
          </div>
          
          <div class="it-actions-card">
            <h4>Triage Action Plan</h4>
            <div class="it-choices-row">
              <div>
                <label>Set Priority:</label>
                <div class="it-choice-buttons">
                  ${currentEmail.choices.priority.map(p => `
                    <button class="btn btn-sm btn-outline it-p-btn ${currentEmail.userPriority === p ? 'it-selected-p' : ''}" data-val="${p}">${p}</button>
                  `).join('')}
                </div>
              </div>
              
              <div>
                <label>Assign Action:</label>
                <div class="it-choice-buttons">
                  ${currentEmail.choices.action.map(a => `
                    <button class="btn btn-sm btn-outline it-a-btn ${currentEmail.userAction === a ? 'it-selected-a' : ''}" data-val="${a}">${a}</button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="it-footer">
        ${completedCount === this.emails.length ? `
          <button class="btn btn-primary btn-lg" id="it-submit-btn">Submit Triage Results ➔</button>
        ` : `
          <button class="btn btn-ghost" id="it-prev-btn" ${this.selectedEmailIdx === 0 ? 'disabled' : ''}>◀ Previous</button>
          <button class="btn btn-ghost" id="it-next-btn" ${this.selectedEmailIdx === this.emails.length - 1 ? 'disabled' : ''}>Next ▶</button>
        `}
      </div>`;

    this._bindEvents();
  }

  _bindEvents() {
    this.el.querySelectorAll('.it-email-item').forEach(item => {
      item.addEventListener('click', () => {
        this.selectedEmailIdx = parseInt(item.dataset.idx);
        this._render();
      });
    });

    this.el.querySelectorAll('.it-p-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        this.emails[this.selectedEmailIdx].userPriority = val;
        this._render();
      });
    });

    this.el.querySelectorAll('.it-a-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.val;
        this.emails[this.selectedEmailIdx].userAction = val;
        this._render();
      });
    });

    const prevBtn = this.el.querySelector('#it-prev-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => {
      if (this.selectedEmailIdx > 0) {
        this.selectedEmailIdx--;
        this._render();
      }
    });

    const nextBtn = this.el.querySelector('#it-next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (this.selectedEmailIdx < this.emails.length - 1) {
        this.selectedEmailIdx++;
        this._render();
      }
    });

    const submitBtn = this.el.querySelector('#it-submit-btn');
    if (submitBtn) submitBtn.addEventListener('click', () => this._submit());
  }

  _submit() {
    this.total = this.emails.length;
    let scoreEarned = 0;

    this.emails.forEach(e => {
      const correctP = (e.userPriority === e.correctPriority);
      const correctA = (e.userAction === e.correctAction);
      
      if (correctP) scoreEarned += 100;
      if (correctA) scoreEarned += 100;
      if (correctP && correctA) this.correct++;
    });

    this.score = scoreEarned;
    this.cb.onScore(this.score, this.correct);
    this.cb.onFeedback(this.correct >= 3);

    // Show feedback screen
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="it-feedback-screen">
        <h3>Triage Review</h3>
        <div class="it-review-list">
          ${this.emails.map(e => {
            const correctP = (e.userPriority === e.correctPriority);
            const correctA = (e.userAction === e.correctAction);
            return `
              <div class="it-review-card">
                <div class="it-review-subject">${e.subject}</div>
                <div class="it-review-verdict">
                  Priority: <span class="${correctP ? 'it-c-text' : 'it-w-text'}">${e.userPriority}</span> (Goal: ${e.correctPriority}) | 
                  Action: <span class="${correctA ? 'it-c-text' : 'it-w-text'}">${e.userAction}</span> (Goal: ${e.correctAction})
                </div>
                <p class="it-review-desc">${e.explanation}</p>
              </div>
            `;
          }).join('')}
        </div>
        <button class="btn btn-primary btn-lg" id="it-finish-btn">Finish Test ➔</button>
      </div>`;

    const finishBtn = this.el.querySelector('#it-finish-btn');
    if (finishBtn) finishBtn.addEventListener('click', () => this._finish());
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
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}
window.InboxTriageGame = InboxTriageGame;
