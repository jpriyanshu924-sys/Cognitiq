/* ══════════════════════════════════════════════════════
   Arctic Shores 2: Feature Unlock
   Measures: Hypothesis testing, deductive reasoning, adaptability
   Based on: Arctic Shores rule-discovery "Feature Unlock" game
══════════════════════════════════════════════════════ */
class FeatureUnlockGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.puzzlesSolved = 0; this.level = 1;
    this.el = null; this._timers = []; this.guesses = 0; this.maxGuesses = 0;
    this.rule = null; this.grid = []; this.selected = new Set();
    this.feedbackMsg = '';
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'fu-game';
    this.container.appendChild(this.el);
    this._newPuzzle();
  }

  _COLORS() { return ['🔴','🟠','🟡','🟢','🔵','🟣']; }
  _SHAPES() { return ['●','■','▲','◆','★','♣']; }

  _newPuzzle() {
    this.guesses = 0;
    this.maxGuesses = this.level === 1 ? 6 : this.level === 2 ? 5 : 4;
    this.selected = new Set();
    this.feedbackMsg = '';

    const colors = this._COLORS();
    const shapes = this._SHAPES();
    const gridSize = this.level <= 1 ? 9 : 12; // 3×3 or 3×4 grid

    // Generate grid of {color, shape, id} tiles
    this.grid = [];
    for (let i = 0; i < gridSize; i++) {
      this.grid.push({
        id: i,
        color: colors[i % colors.length],
        shape: shapes[Math.floor(i / colors.length) % shapes.length],
        colorIdx: i % colors.length,
        shapeIdx: Math.floor(i / colors.length) % shapes.length,
      });
    }

    // Generate a hidden rule
    const ruleTypes = ['same-color', 'same-shape', 'count'];
    const ruleType = ruleTypes[Math.floor(Math.random() * (this.level === 1 ? 2 : 3))];

    if (ruleType === 'same-color') {
      const targetColorIdx = Math.floor(Math.random() * colors.length);
      this.rule = { type: 'same-color', target: targetColorIdx, label: `All ${colors[targetColorIdx]} tiles` };
    } else if (ruleType === 'same-shape') {
      const targetShapeIdx = Math.floor(Math.random() * shapes.length);
      this.rule = { type: 'same-shape', target: targetShapeIdx, label: `All ${shapes[targetShapeIdx]} shapes` };
    } else {
      const count = 2 + Math.floor(Math.random() * 3);
      this.rule = { type: 'count', target: count, label: `Exactly ${count} tiles selected` };
    }

    this._render();
  }

  _isCorrect() {
    if (this.rule.type === 'same-color') {
      const correctIds = this.grid.filter(t => t.colorIdx === this.rule.target).map(t => t.id);
      return correctIds.length === this.selected.size && correctIds.every(id => this.selected.has(id));
    } else if (this.rule.type === 'same-shape') {
      const correctIds = this.grid.filter(t => t.shapeIdx === this.rule.target).map(t => t.id);
      return correctIds.length === this.selected.size && correctIds.every(id => this.selected.has(id));
    } else {
      return this.selected.size === this.rule.target;
    }
  }

  _render() {
    if (!this.el) return;
    const cols = this.grid.length === 9 ? 3 : 4;
    this.el.innerHTML = `
      <div class="fu-header">
        <div>Puzzle ${this.puzzlesSolved + 1} · Level ${this.level}</div>
        <div style="color:var(--amber)">Guesses left: <strong style="font-family:var(--fm)">${this.maxGuesses - this.guesses}</strong></div>
        <div style="color:var(--violet-l)">Solved: ${this.puzzlesSolved}</div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${this.puzzlesSolved*12}%"></div></div>
      <div class="fu-instruction">
        <strong>Discover the hidden rule.</strong> Select the tiles that satisfy it, then click <em>Unlock!</em>
        ${this.feedbackMsg ? `<div class="fu-feedback">${this.feedbackMsg}</div>` : ''}
      </div>
      <div class="fu-grid" style="grid-template-columns:repeat(${cols},1fr)">
        ${this.grid.map(t => `
          <div class="fu-tile ${this.selected.has(t.id) ? 'fu-selected' : ''}" data-id="${t.id}">
            <span class="fu-tile-emoji">${t.color}</span>
            <span class="fu-tile-shape">${t.shape}</span>
          </div>`).join('')}
      </div>
      <div class="fu-actions">
        <button class="btn btn-secondary fu-clear" id="fu-clear">Clear</button>
        <button class="btn btn-primary fu-submit" id="fu-submit">🔓 Unlock!</button>
      </div>
      <p style="font-size:.72rem;color:var(--subtle);text-align:center">Hint: The rule could be about COLOR, SHAPE, or COUNT of tiles.</p>`;

    this.el.querySelectorAll('.fu-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const id = parseInt(tile.dataset.id);
        if (this.selected.has(id)) this.selected.delete(id);
        else this.selected.add(id);
        this._render();
      });
    });
    document.getElementById('fu-clear')?.addEventListener('click', () => { this.selected.clear(); this._render(); });
    document.getElementById('fu-submit')?.addEventListener('click', () => this._submit());
  }

  _submit() {
    this.guesses++;
    if (this._isCorrect()) {
      const efficiencyPts = (this.maxGuesses - this.guesses + 1) * 80 + this.level * 50;
      this.score += efficiencyPts;
      this.puzzlesSolved++;
      this.cb.onScore(efficiencyPts, this.puzzlesSolved);
      this.cb.onFeedback(true);
      if (this.puzzlesSolved % 3 === 0) this.level = Math.min(3, this.level + 1);
      this.feedbackMsg = `✅ Correct! Rule: <em>${this.rule.label}</em>`;
      this._render();
      const t = setTimeout(() => this._newPuzzle(), 2000);
      this._timers.push(t);
    } else if (this.guesses >= this.maxGuesses) {
      this.feedbackMsg = `❌ Out of guesses! Rule was: <em>${this.rule.label}</em>`;
      this.cb.onFeedback(false);
      this._render();
      const t = setTimeout(() => this._newPuzzle(), 2200);
      this._timers.push(t);
    } else {
      this.feedbackMsg = `❌ Not quite. ${this.maxGuesses - this.guesses} guesses remaining.`;
      this.selected.clear();
      this.cb.onFeedback(false);
      this._render();
    }
  }

  timeUp() {
    this._timers.forEach(clearTimeout);
    this.cb.onEnd({ score: this.score, accuracy: this.puzzlesSolved > 0 ? 70 : 0, avgTime: 0, correct: this.puzzlesSolved, total: this.puzzlesSolved + 1, level: this.level });
  }
  destroy() { this._timers.forEach(clearTimeout); this.el = null; }
}
window.FeatureUnlockGame = FeatureUnlockGame;
