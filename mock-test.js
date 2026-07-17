/* ══════════════════════════════════════════════════════════════
   MOCK-TEST.JS — Provider data, UI logic, timed test orchestration
   ══════════════════════════════════════════════════════════════ */

const PROVIDERS = {
  pymetrics: {
    name: 'Pymetrics',
    icon: '🧠',
    meta: '12 games · ~35 min',
    totalSeconds: 35 * 60,
    desc: 'Pymetrics uses neuroscience-based games to measure 91 cognitive and emotional traits. Employers like Goldman Sachs, Accenture, Unilever and LinkedIn use your profile to assess culture fit and role suitability.',
    traits: ['Risk Tolerance', 'Attention', 'Working Memory', 'Emotional Intelligence', 'Altruism', 'Response Inhibition', 'Learning Speed'],
    employers: ['Goldman Sachs', 'Accenture', 'Unilever', 'LinkedIn', 'Kraft Heinz', 'Merck'],
    games: [
      { id: 'balloon-game',   name: 'Balloon Game',      icon: '🎈' },
      { id: 'money-exchange', name: 'Money Exchange',     icon: '💰' },
      { id: 'tower-game',     name: 'Tower of London',    icon: '🗼' },
      { id: 'keypress-game',  name: 'Keypress',           icon: '⌨️' },
      { id: 'hard-easy-game', name: 'Hard / Easy Task',   icon: '⚖️' },
      { id: 'arrows-game',    name: 'Arrows',             icon: '🏹' },
      { id: 'lengths-game',   name: 'Lengths',            icon: '📏' },
      { id: 'cards-game',     name: 'Cards',              icon: '🃏' },
      { id: 'faces-game',     name: 'Faces',              icon: '😊' },
      { id: 'signal-stop',    name: 'Signal / Stop',      icon: '🚦' },
      { id: 'memory-vault',   name: 'Memory Vault',       icon: '🧩' },
      { id: 'shape-spinner',  name: 'Shape Spinner',      icon: '🔷' },
    ]
  },
  arctic: {
    name: 'Arctic Shores',
    icon: '🏔️',
    meta: '10 games · ~30 min',
    totalSeconds: 30 * 60,
    desc: 'Arctic Shores uses behavioural game-based assessments to measure planning, attention, rule switching and problem-solving. Used widely in the UK public sector and professional services.',
    traits: ['Attention Control', 'Planning Depth', 'Rule Application', 'Working Memory', 'Emotional Intelligence', 'Hypothesis Testing'],
    employers: ['PwC', 'KPMG', 'NHS', 'Aviva', 'Balfour Beatty'],
    games: [
      { id: 'arrow-directions',  name: 'Arrow Directions',   icon: '🏹' },
      { id: 'balloon-risk-game', name: 'Balloon Risk Game',  icon: '🎈' },
      { id: 'tickets',           name: 'Tickets',            icon: '🎫' },
      { id: 'sequence',          name: 'Sequence',           icon: '📈' },
      { id: 'emotions-face-game', name: 'Emotions / Face Game', icon: '🎭' },
      { id: 'team-selling',      name: 'Team Selling',       icon: '🤝' },
      { id: 'power-generators',  name: 'Power Generators',   icon: '⚡' },
      { id: 'security-door',     name: 'Security Door',      icon: '🔓' },
      { id: 'patterns',          name: 'Patterns',           icon: '🏁' },
      { id: 'order',             name: 'Order',              icon: '🧩' },
    ]
  },
  mckinsey: {
    name: 'McKinsey Solve',
    icon: '⚓',
    meta: '4 games · ~40 min',
    totalSeconds: 40 * 60,
    desc: 'McKinsey Solve (formerly Imbellus) is a game-based cognitive assessment used to evaluate system-level planning, resource allocation, and hypothesis testing. Critical for all McKinsey recruiting.',
    traits: ['System Optimization', 'Food Chain Logic', 'Battery Optimization', 'Scenario Estimation'],
    employers: ['McKinsey & Company'],
    games: [
      { id: 'mirror-match', name: 'Redrock', icon: '⛰️' },
      { id: 'pathfinder',   name: 'Sea Wolf / Ocean Cleanup', icon: '⚓' },
      { id: 'flashback',    name: 'Sustainability Futures Lab', icon: '🧪' },
      { id: 'shapedance',   name: 'Ecosystem Creation', icon: '🦊' }
    ]
  },
  aon: {
    name: 'Aon / Cut-e',
    icon: '⚡',
    meta: '6 games · ~25 min',
    totalSeconds: 25 * 60,
    desc: 'Aon Cut-e assessments are known for their demanding dual-task and working memory challenges. Widely used in engineering, banking and operations sectors across Europe.',
    traits: ['Dual-Rule Task Switching', 'Working Memory', 'Multiple Object Tracking', 'Spatial Planning', 'Reflection Detection', 'Connection Logic'],
    employers: ['Siemens', 'EY', 'Deutsche Bank', 'Bosch', 'Lufthansa'],
    games: [
      { id: 'gridlock',     name: 'Grid Challenge',   icon: '🧩' },
      { id: 'motion-track', name: 'Motion Challenge', icon: '👁️' },
      { id: 'digit-nback',  name: 'Digit Challenge',  icon: '🧠' },
      { id: 'pipe-puzzle',  name: 'Gap Challenge',    icon: '🔧' },
      { id: 'aon-switch',   name: 'Switch Challenge', icon: '🔄' },
      { id: 'inbox-triage',  name: 'ChatAssess',       icon: '💬' }
    ]
  },
  shl: {
    name: 'SHL',
    icon: '📊',
    meta: '7 games · ~35 min',
    totalSeconds: 35 * 60,
    desc: 'SHL assessments are among the most widely used psychometric tests globally. They cover numerical reasoning, inductive logic, situational judgement and abstract pattern recognition.',
    traits: ['Numerical Reasoning', 'Inductive Logic', 'Deductive Reasoning', 'Attention Checking', 'Situational Judgement', 'Mechanical Aptitude'],
    employers: ['HSBC', 'Shell', 'Rolls-Royce', 'BT', 'Vodafone', 'Tesco'],
    games: [
      { id: 'verify-numerical', name: 'Numerical', icon: '📊' },
      { id: 'verify-inductive', name: 'Inductive', icon: '🔬' },
      { id: 'logic-deduction',   name: 'Deductive', icon: '🔍' },
      { id: 'checking-game',     name: 'Checking', icon: '📋' },
      { id: 'calculation-game',  name: 'Calculation', icon: '🔢' },
      { id: 'scenario-judge',    name: 'SJT', icon: '⚖️' },
      { id: 'pattern-matrix',    name: 'Mechanical Comprehension', icon: '⚙️' }
    ]
  },
  talent: {
    name: 'The Talent Games',
    icon: '🚀',
    meta: '5 games · ~25 min',
    totalSeconds: 25 * 60,
    desc: 'The Talent Games focuses on gamified business simulations, testing strategy, agility, and decision-making under uncertainty, commonly used in FMCG graduate recruitment.',
    traits: ['Business Acumen', 'Crisis Containment', 'Strategic Planning', 'Learning Agility', 'Job Simulations'],
    employers: ["L'Oréal", 'Nestlé', 'Danone', 'Unilever'],
    games: [
      { id: 'team-dilemma',       name: 'Strategy', icon: '🎯' },
      { id: 'crisis-room',        name: 'Crisis Management', icon: '🚨' },
      { id: 'business-sim',       name: 'Business Simulation', icon: '👔' },
      { id: 'personality-reveal', name: 'Learning Agility', icon: '📈' },
      { id: 'number-dash',        name: 'Job-Specific Simulation', icon: '🏢' }
    ]
  }
};

/* ── State ───────────────────────────────────────────────────── */
let state = {
  provider: null,
  games: [],
  currentGameIdx: 0,
  scores: [],
  timerTotal: 0,
  timerLeft: 0,
  timerInterval: null,
  started: false,
  startWallTime: null,
};

/* ── DOM refs ────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

/* ── Init: handle URL hash for direct provider links ─────────── */
document.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '');
  if (hash && PROVIDERS[hash]) selectProvider(hash);
  // Provider card clicks
  document.querySelectorAll('.mt-pcard').forEach(card => {
    card.addEventListener('click', () => selectProvider(card.dataset.provider));
  });
  $('mt-back-btn').addEventListener('click', showSelector);
  $('mt-launch-btn').addEventListener('click', launchTest);
  $('mt-hud-exit').addEventListener('click', confirmExit);
  $('mt-final-retry').addEventListener('click', () => {
    hideFinalResults();
    launchTest();
  });
});

/* ── Provider selector ───────────────────────────────────────── */
function showSelector() {
  $('mt-selector').style.display = '';
  $('mt-detail').style.display = 'none';
  $('mt-footer').style.display = '';
  location.hash = '';
}

function selectProvider(key) {
  const p = PROVIDERS[key];
  if (!p) return;
  state.provider = key;
  state.games = p.games;

  // Update detail panel
  $('mt-detail-icon').textContent  = p.icon;
  $('mt-detail-name').textContent  = p.name;
  $('mt-detail-meta').textContent  = p.meta;
  $('mt-detail-desc').textContent  = p.desc;

  // Traits
  $('mt-detail-traits').innerHTML = p.traits.map(t => `<span>${t}</span>`).join('');
  // Employers
  $('mt-detail-employers').innerHTML = p.employers.map(e => `<span>${e}</span>`).join('');

  // Game list
  $('mt-game-list').innerHTML = p.games.map((g, i) => `
    <div class="mt-game-item">
      <div class="mt-game-item-num">${String(i+1).padStart(2,'0')}</div>
      <div class="mt-game-item-icon">${g.icon}</div>
      <div>${g.name}</div>
    </div>
  `).join('');

  $('mt-selector').style.display = 'none';
  $('mt-detail').style.display = '';
  location.hash = key;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Launch test ─────────────────────────────────────────────── */
function launchTest() {
  const p = PROVIDERS[state.provider];
  state.currentGameIdx = 0;
  state.scores = [];
  state.timerTotal = p.totalSeconds;
  state.timerLeft  = p.totalSeconds;
  state.startWallTime = Date.now();
  state.started = true;

  // Show overlay, hide footer
  $('mt-overlay').style.display = 'flex';
  $('mt-detail').style.display = 'none';
  $('mt-footer').style.display = 'none';
  document.body.style.overflow = 'hidden';

  // HUD
  $('mt-hud-provider').textContent = p.name;
  updateHUD();

  // Start global countdown
  clearInterval(state.timerInterval);
  state.timerInterval = setInterval(tickTimer, 1000);

  // Load first game
  loadGame(0);
}

/* ── Timer ───────────────────────────────────────────────────── */
function tickTimer() {
  state.timerLeft--;
  updateTimerDisplay();
  if (state.timerLeft <= 0) {
    clearInterval(state.timerInterval);
    finishTest();
  }
}

function updateTimerDisplay() {
  const m = Math.floor(state.timerLeft / 60);
  const s = state.timerLeft % 60;
  const el = $('mt-hud-timer');
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.className = 'mt-hud-timer' +
    (state.timerLeft <= 60 ? ' danger' :
     state.timerLeft <= 180 ? ' warning' : '');
}

/* ── HUD progress ────────────────────────────────────────────── */
function updateHUD() {
  const total = state.games.length;
  const idx   = state.currentGameIdx;
  const game  = state.games[idx] || {};
  $('mt-hud-game-label').textContent = `Game ${idx + 1} of ${total}`;
  $('mt-hud-game-name').textContent  = game.name || '';
  $('mt-hud-progress-fill').style.width = `${(idx / total) * 100}%`;
}

/* ── Load a game into the iframe ─────────────────────────────── */
function loadGame(idx) {
  const game = state.games[idx];
  if (!game) { finishTest(); return; }

  $('mt-transition').style.display = 'none';
  $('mt-final-results').style.display = 'none';
  $('mt-game-loading').style.display = 'flex';
  $('mt-game-frame').style.display = 'none';

  $('mt-loading-text').textContent = `Loading ${game.name}…`;

  // Load games.html with ?game= and ?mock=1 so games.html can auto-launch
  const frame = $('mt-game-frame');
  frame.src = `games.html?game=${game.id}&mock=1`;
  frame.onload = () => {
    $('mt-game-loading').style.display = 'none';
    frame.style.display = 'block';
  };

  updateHUD();
}

/* ── Called from iframe via postMessage when a game ends ─────── */
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GAME_COMPLETE') {
    const score = event.data.score ?? 0;
    const gameName = state.games[state.currentGameIdx]?.name || 'Game';
    state.scores.push({ name: gameName, score });
    showTransition(gameName, score);
  }
});

/* ── Between-games transition screen ────────────────────────── */
function showTransition(prevName, prevScore) {
  const nextIdx = state.currentGameIdx + 1;
  const nextGame = state.games[nextIdx];

  $('mt-game-frame').style.display = 'none';
  $('mt-transition').style.display = 'flex';
  $('mt-transition-prev').textContent = `${prevName} complete`;
  $('mt-transition-score').textContent = `Score: ${prevScore.toLocaleString()}`;

  if (!nextGame) {
    $('mt-transition-next-label').textContent = 'All games done!';
    $('mt-transition-next').textContent = 'Calculating results…';
    countdown(2, () => {
      state.currentGameIdx++;
      finishTest();
    });
  } else {
    $('mt-transition-next-label').textContent = 'Next up:';
    $('mt-transition-next').textContent = nextGame.name;
    countdown(3, () => {
      state.currentGameIdx++;
      loadGame(state.currentGameIdx);
    });
  }
}

function countdown(from, cb) {
  let n = from;
  const el = $('mt-transition-countdown');
  el.textContent = `Starting in ${n}…`;
  const iv = setInterval(() => {
    n--;
    if (n <= 0) { clearInterval(iv); cb(); }
    else el.textContent = `Starting in ${n}…`;
  }, 1000);
}

/* ── Finish test ─────────────────────────────────────────────── */
function finishTest() {
  clearInterval(state.timerInterval);
  $('mt-transition').style.display = 'none';
  $('mt-game-frame').style.display = 'none';
  $('mt-game-loading').style.display = 'none';

  // Compute stats
  const done = state.scores.length;
  const total = state.games.length;
  const avgScore = done > 0
    ? Math.round(state.scores.reduce((a, b) => a + b.score, 0) / done)
    : 0;
  const elapsed = Math.round((Date.now() - state.startWallTime) / 1000);
  const em = Math.floor(elapsed / 60), es = elapsed % 60;
  const timeUsed = `${String(em).padStart(2,'0')}:${String(es).padStart(2,'0')}`;

  // Populate
  const p = PROVIDERS[state.provider];
  $('mt-final-title').textContent    = `${p.name} Complete!`;
  $('mt-final-provider').textContent = `${p.name} Mock Assessment`;
  $('mt-final-games-done').textContent = `${done}/${total}`;
  $('mt-final-avg-score').textContent  = avgScore.toLocaleString();
  $('mt-final-time-used').textContent  = timeUsed;

  // Score rows
  $('mt-final-game-scores').innerHTML = state.scores.map((s, i) => `
    <div class="mt-final-game-row">
      <div class="mt-final-game-row-name">${String(i+1).padStart(2,'0')}. ${s.name}</div>
      <div class="mt-final-game-row-score">${s.score.toLocaleString()}</div>
    </div>
  `).join('');

  // HUD progress to 100%
  $('mt-hud-progress-fill').style.width = '100%';

  $('mt-final-results').style.display = 'flex';
}

function hideFinalResults() {
  $('mt-final-results').style.display = 'none';
}

/* ── Exit confirmation ───────────────────────────────────────── */
function confirmExit() {
  const overlay = document.createElement('div');
  overlay.className = 'mt-confirm-overlay';
  overlay.innerHTML = `
    <div class="mt-confirm-card">
      <div class="mt-confirm-title">Exit Mock Test?</div>
      <div class="mt-confirm-sub">Your progress will be lost and the test will be marked incomplete.</div>
      <div class="mt-confirm-actions">
        <button class="mt-confirm-cancel" id="mc-cancel">Keep Going</button>
        <button class="mt-confirm-exit"   id="mc-exit">Exit Test</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('mc-cancel').onclick = () => overlay.remove();
  document.getElementById('mc-exit').onclick   = () => { overlay.remove(); exitTest(); };
}

function exitTest() {
  clearInterval(state.timerInterval);
  state.started = false;
  $('mt-overlay').style.display = 'none';
  $('mt-game-frame').src = '';
  $('mt-detail').style.display = '';
  $('mt-footer').style.display = '';
  document.body.style.overflow = '';
}
