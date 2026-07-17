/* ══════════════════════════════════════════════════════
   The Talent Games 2: Crisis Room
   Measures: Prioritization, resource allocation, composure under pressure
   Based on: The Talent Games "Crisis Room" simulation
   ══════════════════════════════════════════════════════ */
class CrisisRoomGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.el = null;
    this._timers = [];
    this._interval = null;

    // Game stats
    this.crisisLevel = 30; // Starts at 30%, game over at 100%
    this.timeLeft = 60; // 60 seconds survival
    
    // Staff pool (available / total)
    this.staff = {
      tech: { av: 3, tot: 3 },
      support: { av: 2, tot: 2 },
      qa: { av: 2, tot: 2 }
    };

    // Active tickets
    this.activeTickets = [
      { id: 1, title: "Database deadlock on login cluster", severity: "HIGH", req: { tech: 2, qa: 1, support: 0 }, timeToFix: 5, status: "pending" },
      { id: 2, title: "Enterprise customer synchronization error", severity: "MEDIUM", req: { tech: 1, qa: 0, support: 1 }, timeToFix: 4, status: "pending" },
      { id: 3, title: "Social media complaint regarding UI typo", severity: "LOW", req: { tech: 0, qa: 0, support: 1 }, timeToFix: 3, status: "pending" }
    ];

    this.ticketTemplates = [
      { title: "Payment gateway timeout on checkout", severity: "HIGH", req: { tech: 2, qa: 1, support: 0 }, timeToFix: 5 },
      { title: "API latency spikes across region", severity: "HIGH", req: { tech: 2, qa: 0, support: 1 }, timeToFix: 6 },
      { title: "Refund process failing for Shopify users", severity: "MEDIUM", req: { tech: 1, qa: 1, support: 1 }, timeToFix: 4 },
      { title: "Billing portal rendering issues", severity: "MEDIUM", req: { tech: 0, qa: 1, support: 1 }, timeToFix: 4 },
      { title: "Helpdocs search engine returns 404", severity: "LOW", req: { tech: 0, qa: 0, support: 1 }, timeToFix: 3 },
      { title: "Dark mode color palette mismatches", severity: "LOW", req: { tech: 0, qa: 1, support: 0 }, timeToFix: 3 }
    ];

    this.nextTicketId = 4;
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'crisis-game';
    this.container.appendChild(this.el);
    this._render();
    this._startSimulation();
  }

  _startSimulation() {
    this._interval = setInterval(() => {
      this.timeLeft--;
      
      // Update crisis levels
      let activeHighCount = 0;
      let activeMedCount = 0;
      this.activeTickets.forEach(t => {
        if (t.status === "pending") {
          if (t.severity === "HIGH") activeHighCount++;
          if (t.severity === "MEDIUM") activeMedCount++;
        }
      });

      // Crisis rises if tickets are unresolved
      this.crisisLevel += (activeHighCount * 2.5) + (activeMedCount * 1.2) - 1.5;
      this.crisisLevel = Math.max(0, Math.min(100, this.crisisLevel));

      // Check failure
      if (this.crisisLevel >= 100) {
        this._finish(false);
        return;
      }

      // Check success
      if (this.timeLeft <= 0) {
        this._finish(true);
        return;
      }

      // Periodically spawn new ticket templates (every 8 seconds)
      if (this.timeLeft % 8 === 0 && this.activeTickets.length < 5) {
        this._spawnTicket();
      }

      this._render();
    }, 1000);
  }

  _spawnTicket() {
    const template = this.ticketTemplates[Math.floor(Math.random() * this.ticketTemplates.length)];
    this.activeTickets.push({
      id: this.nextTicketId++,
      title: template.title,
      severity: template.severity,
      req: { ...template.req },
      timeToFix: template.timeToFix,
      status: "pending"
    });
  }

  _render() {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="cr-header">
        <div class="cr-stat"><span class="cr-l">⏱ Time Left</span><span class="cr-v" style="color:var(--cyan)">${this.timeLeft}s</span></div>
        <div class="cr-stat"><span class="cr-l">Crisis Level</span><span class="cr-v" style="color:${this.crisisLevel > 70 ? 'var(--red)' : 'var(--amber)'}">${Math.round(this.crisisLevel)}%</span></div>
        <div class="cr-stat"><span class="cr-l">Score</span><span class="cr-v" style="color:var(--violet-l)">${this.score}</span></div>
      </div>
      
      <!-- Crisis meter -->
      <div class="cr-crisis-meter">
        <div class="cr-meter-fill" style="width:${this.crisisLevel}%; background:${this.crisisLevel > 70 ? 'var(--red)' : 'var(--amber)'}"></div>
      </div>

      <!-- Staff Pool dashboard -->
      <div class="cr-staff-pool">
        <h4>👷 Dispatched Staff Pool</h4>
        <div class="cr-staff-grid">
          <div class="cr-staff-card">
            <div class="cr-staff-icon">⚙️</div>
            <div class="cr-staff-name">Tech Devs</div>
            <div class="cr-staff-qty">${this.staff.tech.av} / ${this.staff.tech.tot}</div>
          </div>
          <div class="cr-staff-card">
            <div class="cr-staff-icon">🔍</div>
            <div class="cr-staff-name">QA Testing</div>
            <div class="cr-staff-qty">${this.staff.qa.av} / ${this.staff.qa.tot}</div>
          </div>
          <div class="cr-staff-card">
            <div class="cr-staff-icon">☎️</div>
            <div class="cr-staff-name">Customer Support</div>
            <div class="cr-staff-qty">${this.staff.support.av} / ${this.staff.support.tot}</div>
          </div>
        </div>
      </div>

      <!-- Active Tickets / Inbox -->
      <div class="cr-inbox-section">
        <h4>📥 Active Incident Tickets</h4>
        <div class="cr-ticket-list">
          ${this.activeTickets.map(t => {
            const canAfford = this.staff.tech.av >= t.req.tech && 
                              this.staff.qa.av >= t.req.qa && 
                              this.staff.support.av >= t.req.support;
            
            return `
              <div class="cr-ticket-card cr-sev-${t.severity.toLowerCase()} cr-status-${t.status}">
                <div class="cr-ticket-left">
                  <span class="cr-badge-sev">${t.severity}</span>
                  <div class="cr-ticket-title">${t.title}</div>
                  <div class="cr-ticket-reqs">
                    Req: 
                    ${t.req.tech ? `<span>⚙️ ${t.req.tech}</span>` : ''}
                    ${t.req.qa ? `<span>🔍 ${t.req.qa}</span>` : ''}
                    ${t.req.support ? `<span>☎️ ${t.req.support}</span>` : ''}
                  </div>
                </div>
                <div class="cr-ticket-right">
                  ${t.status === "pending" ? `
                    <button class="btn btn-sm cr-action-btn" data-id="${t.id}" ${!canAfford ? 'disabled' : ''}>
                      ${canAfford ? "DISPATCH" : "LACK STAFF"}
                    </button>
                  ` : `
                    <div class="cr-resolving-bar">
                      <div class="cr-resolving-fill" style="animation: cr-resolving-anim ${t.timeToFix}s linear forwards"></div>
                      <span>RESOLVING...</span>
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>`;

    this.el.querySelectorAll('.cr-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        this._dispatchStaff(id);
      });
    });
  }

  _dispatchStaff(ticketId) {
    const t = this.activeTickets.find(tick => tick.id === ticketId);
    if (!t || t.status !== "pending") return;

    // Deduct staff
    this.staff.tech.av -= t.req.tech;
    this.staff.qa.av -= t.req.qa;
    this.staff.support.av -= t.req.support;

    t.status = "resolving";
    this._render();

    // Fix timer
    const ft = setTimeout(() => {
      this._resolveTicket(ticketId);
    }, t.timeToFix * 1000);
    this._timers.push(ft);
  }

  _resolveTicket(ticketId) {
    const t = this.activeTickets.find(tick => tick.id === ticketId);
    if (!t) return;

    // Refund staff
    this.staff.tech.av += t.req.tech;
    this.staff.qa.av += t.req.qa;
    this.staff.support.av += t.req.support;

    // Remove from active list
    this.activeTickets = this.activeTickets.filter(tick => tick.id !== ticketId);

    // Add score
    let pts = t.severity === "HIGH" ? 300 : t.severity === "MEDIUM" ? 150 : 80;
    this.score += pts;
    this.correct++;
    this.total++;
    
    // Reduce crisis levels
    let reduction = t.severity === "HIGH" ? 20 : t.severity === "MEDIUM" ? 12 : 6;
    this.crisisLevel = Math.max(0, this.crisisLevel - reduction);

    this.cb.onScore(pts, this.correct);
    this.cb.onFeedback(true);

    this._render();
  }

  _finish(survived) {
    clearInterval(this._interval);
    this._timers.forEach(clearTimeout);

    if (!this.el) return;

    this.el.innerHTML = `
      <div style="text-align:center;padding:40px">
        <div style="font-size:3.5rem;margin-bottom:16px">${survived ? '🛡️' : '💥'}</div>
        <h3 style="font-family:var(--fh);margin-bottom:12px">${survived ? 'Crisis Contained!' : 'Outage Collapse!'}</h3>
        <p style="color:var(--muted);margin-bottom:8px">Incidents resolved: <strong>${this.correct}</strong></p>
        <p style="color:var(--muted);margin-bottom:20px">Final crisis level: <strong>${Math.round(this.crisisLevel)}%</strong></p>
        <div style="font-family:var(--fm);font-size:2.5rem;color:var(--violet-l)">${this.score} pts</div>
      </div>`;

    const ft = setTimeout(() => {
      this.cb.onEnd({
        score: this.score,
        accuracy: survived ? 100 : Math.round(this.timeLeft / 60 * 100),
        avgTime: 0,
        correct: this.correct,
        total: this.total,
        level: 1
      });
    }, 2000);
    this._timers.push(ft);
  }

  timeUp() { this._finish(true); }
  destroy() {
    clearInterval(this._interval);
    this._timers.forEach(clearTimeout);
    this.el = null;
  }
}
window.CrisisRoomGame = CrisisRoomGame;
