/* ═══════════════════════════════════════════════════════
   app.js — CognitIQ App Controller (38 Games Suite)
   ═══════════════════════════════════════════════════════ */

const GAME_CONFIG = {
  // Pymetrics (12 games)
  'balloon-game': {
    name: 'Balloon Game', icon: '🎈', cat: 6, duration: 0, provider: 'Pymetrics', difficulty: 'easy', tag: 'Decision',
    desc: 'Pump a balloon to earn $1 per pump. Collect before it pops to bank your earnings. Risk too much and lose it all. 15 rounds to build up a score.',
    skills: ['Risk Tolerance', 'Impulsivity', 'Decision Making'],
    howto: ["Click \"🎈 Pump\" to inflate the balloon and earn $1 per pump", "Click \"💰 Collect\" at any point to bank your earnings", "If the balloon pops, you lose all uncollected earnings for that round", "There is no way to know when it will pop — it is random", "Complete 15 rounds. Balance caution and risk for max score"]
  },
  'money-exchange': {
    name: 'Money Exchange', icon: '🤝', cat: 6, duration: 0, provider: 'Pymetrics', difficulty: 'medium', tag: 'Decision',
    desc: 'Three classic economic games: Ultimatum (accept or reject offers), Trust (how much will you send?), and Dictator (you control the split). Reveals your social preferences.',
    skills: ['Fairness', 'Trust', 'Altruism', 'Social Cognition'],
    howto: ['Ultimatum: Accept or reject money splits from a partner', 'Trust: Send any amount to a stranger (it triples, they return some)', "Dictator: You decide how $$ is split — other person can\'t refuse", "There\'s no single right answer — your pattern reveals your values", '12 rounds rotating through all 3 game types']
  },
  'tower-game': {
    name: 'Tower Game', icon: '🗼', cat: 5, duration: 120, provider: 'Pymetrics', difficulty: 'hard', tag: 'Spatial',
    desc: 'Move coloured discs across three pegs to match the target configuration. The catch: you can only place a disc on top of a larger one. Plan ahead for maximum efficiency.',
    skills: ['Planning', 'Problem Solving', 'Cognitive Flexibility'],
    howto: ['Click a peg to select it (shown highlighted)', 'Click a destination peg to move the top disc there', 'A disc can only land on an EMPTY peg or a LARGER disc', 'Match the TARGET configuration shown in the top panel', 'Bonus points for solving in fewer moves']
  },
  'keypress-game': {
    name: 'Keypress Game', icon: '⌨️', cat: 1, duration: 60, provider: 'Pymetrics', difficulty: 'easy', tag: 'Attention',
    desc: 'Alternate between GO phases (press SPACE as fast as possible) and STOP phases (hold back completely). Tests impulsivity, follow-through, and ability to brake on command.',
    skills: ['Impulsivity Control', 'Sustained Attention', 'Response Speed'],
    howto: ['When the signal turns GREEN, press SPACE as many times as you can', 'When the signal turns RED, stop immediately — do not press', 'Wrong presses during RED phases cost you points', 'Speed matters during green: faster presses = more points', 'Complete all GO/STOP phases in 60 seconds']
  },
  'hard-easy-game': {
    name: 'Hard / Easy Task', icon: '⚖️', cat: 6, duration: 90, provider: 'Pymetrics', difficulty: 'medium', tag: 'Decision',
    desc: 'Choose between high-effort tasks for larger rewards or easy tasks for smaller rewards. The catch: success on hard tasks depends on your probability odds.',
    skills: ['Effort Allocation', 'Risk Assessment', 'Motivation'],
    howto: ['Choose between EASY (few taps, guaranteed $$) or HARD (many taps, conditional $$)', 'Check the probability odds shown before each choice', 'Complete the taps within the short round timer to succeed', 'Maximize earnings across 15 rounds by playing smart']
  },
  'arrows-game': {
    name: 'Arrows Game', icon: '🏹', cat: 1, duration: 60, provider: 'Pymetrics', difficulty: 'medium', tag: 'Attention',
    desc: 'React quickly to the middle arrow in a row of flanking distractors. Some point the same way (congruent), some point opposite (incongruent). Filters your focus.',
    skills: ['Selective Focus', 'Attention Control', 'Inhibition'],
    howto: ['Watch the row of 5 arrows that flash on screen', 'Identify the direction the CENTRE arrow is pointing', 'Press Left Arrow or Right Arrow key accordingly', 'Ignore the flanking arrows — they are distractors', 'Be fast and accurate. Speed + correctness = max score']
  },
  'lengths-game': {
    name: 'Lengths Game', icon: '😀', cat: 1, duration: 60, provider: 'Pymetrics', difficulty: 'easy', tag: 'Attention',
    desc: 'Quickly distinguish whether the cartoon face has a little mouth or a big mouth. Focuses on perceptual discrimination and reward sensitivity under speed pressure.',
    skills: ['Perceptual Accuracy', 'Selective Attention', 'Reward Learning'],
    howto: ['A cartoon face will flash briefly on the screen', 'Identify whether the face has a LITTLE mouth or a BIG mouth', 'Press Left Arrow key (or Left button) for a little mouth, and Right Arrow key (or Right button) for a big mouth', 'Correct answers may be rewarded with cash. Try to earn as much as you can!']
  },
  'cards-game': {
    name: 'Cards Game', icon: '🃏', cat: 6, duration: 90, provider: 'Pymetrics', difficulty: 'hard', tag: 'Decision',
    desc: 'Draw cards from four decks to win or lose virtual money. Decks have hidden risk profiles — some offer big wins but massive losses; others offer steady gains.',
    skills: ['Pattern Learning', 'Risk Calibration', 'Adaptive Learning'],
    howto: ['Click on any of the four card decks (A, B, C, D) to draw a card', 'Decks will award money or deduct money randomly', 'Identify which decks are profitable in the long run', 'Complete 80 draws. Try to maximize your net profit']
  },
  'faces-game': {
    name: 'Faces Game', icon: '😊', cat: 7, duration: 0, provider: 'Pymetrics', difficulty: 'easy', tag: 'Social',
    desc: 'Identify subtle, blended emotions from images of facial micro-expressions. Tests empathy, emotional intelligence, and social cue processing.',
    skills: ['Emotional Intelligence', 'Empathy', 'Detail Retention'],
    howto: ['Examine the facial expression shown in the center photo', 'Select the primary or blended emotion that matches best', 'Choose from Anger, Sadness, Joy, Surprise, Fear, or Disgust', 'Take your time — this game is untimed. Focus on accuracy']
  },
  'signal-stop': {
    name: 'Signal Stop', icon: '🚦', cat: 1, duration: 60, provider: 'Pymetrics', difficulty: 'easy', tag: 'Attention',
    desc: 'Tap when circles appear on screen, but hold back instantly if the stop signal flashes. Tests response inhibition and motor control.',
    skills: ['Response Inhibition', 'Motor Speed', 'Impulse Control'],
    howto: ['Taps as fast as possible when a circle flashes on screen', 'If a RED border flashes (stop signal), do NOT tap', 'Wait for the signal to clear. Incorrect taps deduct score', 'Find a balance between reaction speed and control']
  },
  'memory-vault': {
    name: 'Memory Vault', icon: '🧩', cat: 2, duration: 0, provider: 'Pymetrics', difficulty: 'hard', tag: 'Memory',
    desc: 'Remember and recall lists of digits of expanding lengths. Tests sequential digit span and short-term working memory capacity.',
    skills: ['Working Memory', 'Focus', 'Sequential Recall'],
    howto: ['A list of digits will flash one-by-one on screen', 'Enter the digits in the exact order shown', 'Length starts at 4 and grows by 1 for each correct answer', 'Three strikes and the game ends. Aim for the longest span']
  },
  'shape-spinner': {
    name: 'Shape Spinner', icon: '🔷', cat: 5, duration: 90, provider: 'Pymetrics', difficulty: 'medium', tag: 'Spatial',
    desc: 'Differentiate between rotated shapes and mirrored shapes. Tests mental rotation, spatial scanning, and processing speed.',
    skills: ['Mental Rotation', 'Spatial Scanning', 'Visual Speed'],
    howto: ['A target 2D shape is shown on the left', 'Compare it to the shape shown on the right', 'Determine if the right shape is a ROTATION or a MIRROR FLIP', 'Press A for Rotation, press L for Mirror Flip. Work quickly']
  },

  // Arctic Shores (10 games)
  'arrow-directions': {
    name: 'Arrow Directions', icon: '🏹', cat: 1, duration: 60, provider: 'Arctic Shores', difficulty: 'medium', tag: 'Attention',
    desc: 'You react to arrows pointing in different directions while dealing with conflicting visual information. It tests attention, inhibition and processing ability.',
    skills: ['Inhibition', 'Selective Attention', 'Processing Speed'],
    howto: ['React to the central arrow only', 'Ignore flanking arrows that point in conflicting directions', 'Swipe or click left/right accordingly']
  },
  'balloon-risk-game': {
    name: 'Balloon Risk Game', icon: '🎈', cat: 6, duration: 0, provider: 'Arctic Shores', difficulty: 'easy', tag: 'Decision',
    desc: 'You inflate a virtual balloon to gain rewards while deciding how much risk to take before it bursts. It observes risk-taking and decision-making behaviour.',
    skills: ['Risk Calibration', 'Decision Under Uncertainty', 'Loss Aversion'],
    howto: ['Pump the balloon to increase value', 'Collect/bank accumulated money before the balloon pops', 'Popping loses all earnings for that balloon']
  },
  'tickets': {
    name: 'Tickets', icon: '🎫', cat: 2, duration: 60, provider: 'Arctic Shores', difficulty: 'medium', tag: 'Memory',
    desc: 'You sort or process ticket-like objects according to changing rules and instructions. It tests attention, rule application and adaptability.',
    skills: ['Cognitive Switching', 'Rule Application', 'Adaptability'],
    howto: ['Sort the ticket according to the active rule', 'Sort by COLOR or by SHAPE based on the banner alert', 'React quickly when rules swap, maintaining speed and accuracy']
  },
  'sequence': {
    name: 'Sequence', icon: '📈', cat: 2, duration: 60, provider: 'Arctic Shores', difficulty: 'easy', tag: 'Memory',
    desc: 'You remember, identify or continue visual or numerical sequences. It tests working memory and pattern recognition.',
    skills: ['Working Memory', 'Pattern Recognition', 'Inductive Logic'],
    howto: ['Examine the sequence of items shown in the row', 'Identify the mathematical or pattern rule', 'Select the correct next item from 4 choices']
  },
  'emotions-face-game': {
    name: 'Emotions / Face Game', icon: '🎭', cat: 7, duration: 0, provider: 'Arctic Shores', difficulty: 'medium', tag: 'Social',
    desc: 'You interpret emotions from facial expressions or social cues. It tests emotion recognition and social processing.',
    skills: ['Emotion Recognition', 'Social Processing', 'Empathy'],
    howto: ['Study the facial expression presented on screen', 'Identify the correct emotion category', 'Submit your choice without timer pressure']
  },
  'team-selling': {
    name: 'Team Selling', icon: '🤝', cat: 7, duration: 0, provider: 'Arctic Shores', difficulty: 'medium', tag: 'Social',
    desc: 'You make decisions in a simulated team or sales situation. Your choices affect interactions and outcomes. It observes interpersonal judgement, collaboration and social decision-making.',
    skills: ['Interpersonal Judgement', 'Collaboration', 'Social Decision-Making'],
    howto: ['Read the team conflict or sales scenario', 'Select your preferred resolution or response option', 'Analyze the dynamic feedback and consequences']
  },
  'power-generators': {
    name: 'Power Generators', icon: '⚡', cat: 4, duration: 90, provider: 'Arctic Shores', difficulty: 'hard', tag: 'Logic',
    desc: 'You interact with virtual generators or resource elements and have to achieve an objective under specific constraints. It tests problem-solving, planning and attention.',
    skills: ['Problem Solving', 'Planning Depth', 'Resource Management'],
    howto: ['Click generator tiles to alter their output values', 'Observe the interaction rules and constraints', 'Find the combination that stabilizes all generators to unlock next level']
  },
  'security-door': {
    name: 'Security Door', icon: '🔓', cat: 1, duration: 60, provider: 'Arctic Shores', difficulty: 'medium', tag: 'Attention',
    desc: 'A virtual security lock displays or rotates through numbers. You have to stop/select the correct numbers to form the required passcode. It tests timing, attention and cognitive control.',
    skills: ['Timing Precision', 'Divided Attention', 'Cognitive Control'],
    howto: ['Observe the rotating digits on the lock dial', 'Tap when the dial lines up with the correct passcode digit', 'Avoid mistimed clicks which trigger alarm and deduct points']
  },
  'patterns': {
    name: 'Patterns', icon: '🏁', cat: 4, duration: 0, provider: 'Arctic Shores', difficulty: 'medium', tag: 'Logic',
    desc: 'You identify the underlying rule in a set of visual patterns and select the correct answer. It tests inductive reasoning and pattern recognition.',
    skills: ['Inductive Reasoning', 'Pattern Recognition', 'Fluid Intelligence'],
    howto: ['Examine the missing matrix cell in the diagram', 'Identify the rotation, mirror, or addition logic of the patterns', 'Choose the correct card option to fill the gap']
  },
  'order': {
    name: 'Order', icon: '🧩', cat: 5, duration: 0, provider: 'Arctic Shores', difficulty: 'hard', tag: 'Spatial',
    desc: 'You arrange objects, actions or information in the correct sequence based on specific rules. It tests planning, working memory and rule application.',
    skills: ['Planning Depth', 'Working Memory', 'Rule Application'],
    howto: ['Arrange block elements or pegs in the target configuration', 'Obey the movement constraints and sequencing rules', 'Solve in the minimum possible steps']
  },

  // McKinsey Solve (4 games)
  'mirror-match': {
    name: 'Redrock', icon: '⛰️', cat: 5, duration: 60, provider: 'McKinsey Solve', difficulty: 'medium', tag: 'Spatial',
    desc: 'Compare target patterns and identify matching visual reflection metrics to build species registries.',
    skills: ['Spatial Alignment', 'Reflection Detection', 'Target Matching'],
    howto: ['Study the reference grid pattern', 'Note the reflection axis shown (horizontal / vertical)', 'Identify which of the 4 options is the correct mirror', '60 seconds total']
  },
  'pathfinder': {
    name: 'Sea Wolf / Ocean Cleanup', icon: '⚓', cat: 5, duration: 90, provider: 'McKinsey Solve', difficulty: 'hard', tag: 'Spatial',
    desc: 'Navigate submarines and optimal routes across water nodes to capture and extract pollutant spills.',
    skills: ['Route Optimization', 'Incident Prioritization', 'Resource Management'],
    howto: ['Click starting node and draw paths to destination', 'Ensure the path crosses through every target waypoint star', 'Avoid walls and self-crossing tracks. Solve as many as possible']
  },
  'flashback': {
    name: 'Sustainability Futures Lab', icon: '🧪', cat: 3, duration: 90, provider: 'McKinsey Solve', difficulty: 'hard', tag: 'Numerical',
    desc: 'Run model scenarios, track statistics, and balance environmental thresholds in dynamic forecast models.',
    skills: ['Sequential Prediction', 'Working Memory', 'Statistical Tracking'],
    howto: ['Watch the sequence of colored shapes flash on screen', 'Select the matching shapes from the grid in the exact sequence', 'Length increases with success; three mistakes ends the game']
  },
  'shapedance': {
    name: 'Ecosystem Creation', icon: '🦊', cat: 4, duration: 90, provider: 'McKinsey Solve', difficulty: 'hard', tag: 'Logic',
    desc: 'Form complex food chain ecosystems by pairing predator and prey animals under strictly balanced rules.',
    skills: ['Systems Thinking', 'Ecosystem Modeling', 'Abstract Logical Reasoning'],
    howto: ['Examine the main 3D target shape closely', 'Identify which option matches a valid 3D rotation of the target', 'Watch out for mirrored or shape-shifted distractors']
  },

  // Aon / Cut-e (6 games)
  'gridlock': {
    name: 'Grid Challenge', icon: '🧩', cat: 5, duration: 90, provider: 'Aon / Cut-e', difficulty: 'hard', tag: 'Spatial',
    desc: 'Slide blocks inside a congested grid to clear exit paths for the primary target car.',
    skills: ['Spatial Planning', 'Logic Induction', 'Sequential Move Optimization'],
    howto: ['Click a block to select it', 'Use arrow keys or click the arrows on the block to slide it', 'Clear a path for the RED vehicle to reach the right-side EXIT']
  },
  'motion-track': {
    name: 'Motion Challenge', icon: '👁️', cat: 1, duration: 90, provider: 'Aon / Cut-e', difficulty: 'medium', tag: 'Attention',
    desc: 'Track multiple identical bouncing points after they are initially tagged as targets.',
    skills: ['Multiple Object Tracking', 'Sustained Visual Attention', 'Rapid Scan'],
    howto: ['Memorize which dots are highlighted in yellow targets', 'Track them as all dots turn gray and bounce around the canvas', 'When they stop, click on the target dots you tracked']
  },
  'digit-nback': {
    name: 'Digit Challenge', icon: '🧠', cat: 2, duration: 90, provider: 'Aon / Cut-e', difficulty: 'hard', tag: 'Memory',
    desc: 'Observe digit sequences flashing in a stream and identify repeats matching N steps ago.',
    skills: ['Working Memory Updating', 'Rapid Sequence Retention', 'Impulse Inhibition'],
    howto: ['Remember the stream of digits flashing one-by-one', 'Press SPACE or MATCH if current digit matches the one N-positions back', 'N-back levels range from 1-back to 3-back depending on performance']
  },
  'pipe-puzzle': {
    name: 'Gap Challenge', icon: '🔧', cat: 5, duration: 120, provider: 'Aon / Cut-e', difficulty: 'hard', tag: 'Spatial',
    desc: 'Rotate structural segments on grid cells to complete flow channels between endpoints.',
    skills: ['Spatial Orientation', 'Pipeline Mapping', 'Grid Scanning Speed'],
    howto: ['Click any pipe cell to rotate it 90° clockwise', 'Connect all pipes from the 🔵 START to the 🔴 END', 'A complete connected path will glow green', '120 seconds total']
  },
  'aon-switch': {
    name: 'Switch Challenge', icon: '🔄', cat: 2, duration: 60, provider: 'Aon / Cut-e', difficulty: 'medium', tag: 'Memory',
    desc: 'Switch rules dynamically on a character stream based on changing block background colors.',
    skills: ['Dual Rule Cognitive Switching', 'Information Processing Speed', 'Focus Retention'],
    howto: ['Look at the active stimulus box (Letter + Number)', 'If Blue: sort letter (Vowel/Consonant) | Yellow: sort number (Odd/Even)', 'Press A for left option, L for right option. Keep up speed!']
  },
  'inbox-triage': {
    name: 'ChatAssess', icon: '💬', cat: 7, duration: 90, provider: 'Aon / Cut-e', difficulty: 'medium', tag: 'Social',
    desc: 'Manage corporate text messages and email inbox streams under severe priority deadlines.',
    skills: ['Communication Agility', 'Situational Prioritization', 'Workplace Competence'],
    howto: ['Select emails from the inbox column', 'Assign a Priority (Urgent/Normal/Low) and Action (Reply/Delegate/Archive/Ignore)', 'Complete all emails and submit before the 90-second timer ends']
  },

  // SHL (7 games)
  'verify-numerical': {
    name: 'Numerical', icon: '📊', cat: 3, duration: 120, provider: 'SHL', difficulty: 'hard', tag: 'Numerical',
    desc: 'Interpret spreadsheets, calculate financial margins, and evaluate growth ratios under timers.',
    skills: ['Data Spreadsheet Analysis', 'Percentage Growth Ratios', 'Fast Mental Arithmetic'],
    howto: ['Study the business data table provided on the workspace', 'Solve the math problem (percentage growth, ratios, totals)', 'Select the correct answer from the choices and click Next']
  },
  'verify-inductive': {
    name: 'Inductive', icon: '🔬', cat: 4, duration: 90, provider: 'SHL', difficulty: 'medium', tag: 'Logic',
    desc: 'Infer core rule sequences governing 1D geometric progress paths to complete missing blocks.',
    skills: ['Sequence Logic Induction', 'Visual Transformation Rules', 'Fluid Reasoning'],
    howto: ['Examine the shape sequence (Step 1 to 4)', 'Identify the rule of rotation, size, count, or color change', 'Select the correct shape to fill the missing [ ? ] slot']
  },
  'logic-deduction': {
    name: 'Deductive', icon: '🔍', cat: 4, duration: 90, provider: 'SHL', difficulty: 'medium', tag: 'Logic',
    desc: 'Verify the truth values of syllogistic statements based on premise set constraints.',
    skills: ['Formal Deductive Syllogisms', 'Logical Venn Mapping', 'Categorical Inference'],
    howto: ['Study the 2-3 logical premises carefully', 'Evaluate if the given conclusion Must Be True, Might Be True, or Cannot Be True', 'Click the correct evaluations to score']
  },
  'checking-game': {
    name: 'Checking', icon: '📋', cat: 1, duration: 60, provider: 'SHL', difficulty: 'easy', tag: 'Attention',
    desc: 'Compare data strings, text labels, and numeric codes side-by-side to identify tiny discrepancies.',
    skills: ['Visual Comparison Speed', 'Detail Scanning Speed', 'Accuracy Checks'],
    howto: ['Two vertical lines will flash on the screen', 'Identify whether the lines are equal or unequal in length', 'Press A key if they are equal, press L key if they are unequal', "The difference can be extremely subtle. Trust your first instinct"]
  },
  'calculation-game': {
    name: 'Calculation', icon: '🔢', cat: 3, duration: 90, provider: 'SHL', difficulty: 'medium', tag: 'Numerical',
    desc: 'Combine arithmetic functions and floating figures in real-time to solve numerical equations.',
    skills: ['Mathematical Arithmetic', 'Formula Assembly Speed', 'Mental Arithmetic'],
    howto: ['Observe the target sum at the top of the board', 'Click on the floating number bubbles to add them together', 'Exactly match the target sum to pop bubbles and score points', 'Avoid running out of time!']
  },
  'scenario-judge': {
    name: 'SJT', icon: '⚖️', cat: 7, duration: 0, provider: 'SHL', difficulty: 'medium', tag: 'Social',
    desc: 'Assess workplace scenarios and conflicts and rank resolutions from most to least effective.',
    skills: ['Professional Conflict Judgment', 'Behavioral Alignment', 'Business Ethics Fit'],
    howto: ['Read the workplace conflict/scenario card carefully', 'Rearrange the 4 action options from Most Effective (top) to Least (bottom)', 'Use Up/Down buttons to sort, then click Submit']
  },
  'pattern-matrix': {
    name: 'Mechanical Comprehension', icon: '⚙️', cat: 4, duration: 90, provider: 'SHL', difficulty: 'hard', tag: 'Logic',
    desc: 'Analyse gear, lever, and abstract mechanical rule grids to deduce balance or rotation metrics.',
    skills: ['Mechanical Principles Induction', 'Spatial Logic Assembly', 'Abstract Grid Rule Discovery'],
    howto: ['Study the 3×3 grid — 8 cells filled, 1 missing', 'Identify the rule governing rows, columns, or both', 'Select the correct answer from 4 options below', '90 seconds to answer as many as possible']
  },

  // The Talent Games (5 games)
  'team-dilemma': {
    name: 'Strategy', icon: '🎯', cat: 7, duration: 0, provider: 'The Talent Games', difficulty: 'medium', tag: 'Social',
    desc: 'Mediate staff conflicts and choose collaboration roadmaps to preserve team alignment.',
    skills: ['Strategic Mediation', 'Organizational Alignment', 'Consensus Building'],
    howto: ['Read the dialog conflict between two team members', 'Analyze the 4 possible mediation plans', 'Select the most constructive strategy to restore team harmony']
  },
  'crisis-room': {
    name: 'Crisis Management', icon: '🚨', cat: 7, duration: 90, provider: 'The Talent Games', difficulty: 'hard', tag: 'Social',
    desc: 'Contain customer product outages in real-time by dispatching engineering resources under pressure.',
    skills: ['Outage Incident Response', 'Staff Skill Allocation', 'Calmness Under Pressure'],
    howto: ['Review incoming tickets with varying staff requirements (Tech, QA, Support)', 'Click Dispatch to assign idle staff to resolve the incidents', 'Manage resources to prevent the Crisis Meter from hitting 100%']
  },
  'business-sim': {
    name: 'Business Simulation', icon: '👔', cat: 6, duration: 180, provider: 'The Talent Games', difficulty: 'medium', tag: 'Decision',
    desc: 'Lead a tech company startup and manage cash reserves, staff morale, and code quality across quarters.',
    skills: ['Quarterly Startup Management', 'Cash Reserve Strategy', 'Balance Sheet Trade-offs'],
    howto: ['Review the business scenario presented each quarter', 'Select one of the 3 actions to solve the issue', 'Balance Cash, Morale, and Quality stats over 6 quarters']
  },
  'personality-reveal': {
    name: 'Learning Agility', icon: '📈', cat: 7, duration: 0, provider: 'The Talent Games', difficulty: 'medium', tag: 'Social',
    desc: 'Evaluate statement pairs in forced-choice selections to establish your behavioral adaptability profile.',
    skills: ['Agile Behavioral Profiling', 'Adaptability Indicators', 'Workplace Agility Fit'],
    howto: ['Read statements A and B in each pair', 'Choose the statement that fits your workplace preference better', 'Answer 10 statement pairs to build your Big Five profile']
  },
  'number-dash': {
    name: 'Job-Specific Simulation', icon: '🏢', cat: 2, duration: 90, provider: 'The Talent Games', difficulty: 'easy', tag: 'Memory',
    desc: 'Navigate specific job scenarios by collecting falling targets and managing dynamic rules.',
    skills: ['Role-Specific Task Execution', 'Fast Numerical Collection', 'Multi-Tasking Focus'],
    howto: ['Use ← → Arrow keys (or A/D) to move the collector', 'Collect numbers that sum to the TARGET shown at the top', 'Hit the exact target sum to score points', '90 seconds total']
  }
};
const GAME_ORDER = [
  // Pymetrics
  'balloon-game', 'money-exchange', 'tower-game', 'keypress-game', 'hard-easy-game', 'arrows-game', 'lengths-game', 'cards-game', 'faces-game', 'signal-stop', 'memory-vault', 'shape-spinner',
  // Arctic Shores
  'arrow-directions', 'balloon-risk-game', 'tickets', 'sequence', 'emotions-face-game', 'team-selling', 'power-generators', 'security-door', 'patterns', 'order',
  // McKinsey Solve
  'mirror-match', 'pathfinder', 'flashback', 'shapedance',
  // Aon / Cut-e
  'gridlock', 'motion-track', 'digit-nback', 'pipe-puzzle', 'aon-switch', 'inbox-triage',
  // SHL
  'verify-numerical', 'verify-inductive', 'logic-deduction', 'checking-game', 'calculation-game', 'scenario-judge', 'pattern-matrix',
  // The Talent Games
  'team-dilemma', 'crisis-room', 'business-sim', 'personality-reveal', 'number-dash'
];

const GAME_MODULES = {
  // Pymetrics
  'balloon-game':     () => window.BalloonGame,
  'money-exchange':   () => window.MoneyExchangeGame,
  'tower-game':       () => window.TowerGame,
  'keypress-game':    () => window.KeypressGame,
  'hard-easy-game':   () => window.HardEasyGame,
  'arrows-game':      () => window.ArrowsGame,
  'lengths-game':     () => window.LengthsGame,
  'cards-game':       () => window.CardsGame,
  'faces-game':       () => window.FacesGame,
  'signal-stop':      () => window.SignalStopGame,
  'memory-vault':     () => window.MemoryVaultGame,
  'shape-spinner':    () => window.ShapeSpinnerGame,
  // Arctic Shores
  'arrow-directions':  () => window.ArrowsGame,
  'balloon-risk-game': () => window.BalloonGame,
  'tickets':           () => window.ArcticSwitchGame,
  'sequence':          () => window.SequenceSurgeGame,
  'emotions-face-game':() => window.FacesGame,
  'team-selling':      () => window.TeamDilemmaGame,
  'power-generators':  () => window.FeatureUnlockGame,
  'security-door':     () => window.SecurityDoorGame,
  'patterns':          () => window.PatternMatrixGame,
  'order':             () => window.GridlockGame,
  // McKinsey Solve
  'mirror-match':      () => window.MirrorMatchGame,
  'pathfinder':        () => window.PathfinderGame,
  'flashback':         () => window.FlashbackGame,
  'shapedance':        () => window.ShapedanceGame,
  // Aon / Cut-e
  'gridlock':          () => window.GridlockGame,
  'motion-track':      () => window.MotionTrackGame,
  'digit-nback':       () => window.DigitNBackGame,
  'pipe-puzzle':       () => window.PipePuzzleGame,
  'aon-switch':        () => window.AonSwitchGame,
  'inbox-triage':      () => window.InboxTriageGame,
  // SHL
  'verify-numerical':  () => window.VerifyNumericalGame,
  'verify-inductive':  () => window.VerifyInductiveGame,
  'logic-deduction':   () => window.LogicDeductionGame,
  'checking-game':     () => window.LengthsGame,
  'calculation-game':  () => window.NumerosityGame,
  'scenario-judge':    () => window.ScenarioJudgeGame,
  'pattern-matrix':    () => window.PatternMatrixGame,
  // The Talent Games
  'team-dilemma':      () => window.TeamDilemmaGame,
  'crisis-room':       () => window.CrisisRoomGame,
  'business-sim':      () => window.BusinessSimGame,
  'personality-reveal':() => window.PersonalityRevealGame,
  'number-dash':       () => window.NumberDashGame
};

/* ───────────────────────────────────────────────────── */

class CognitIQApp {
  constructor() {
    this.state = {
      currentGame: null,
      gameInst: null,
      scores: JSON.parse(localStorage.getItem('ciq_scores') || '{}'),
      timer: null,
      timeLeft: 0,
      totalDur: 0,
      hudScore: 0,
      streak: 0,
      practiceMode: false,
    };
    this._streakData = JSON.parse(localStorage.getItem('ciq_streak') || '{"streak":0,"lastPlayed":""}');
    this._renderCategories();
    this._bind();
    this._updateStreak(false); // init display without extending
    this._updateDashboard();
    this._showView('home');
  }

  /* ── BINDING ─────────────────────────── */
  _bind() {
    // Card play buttons
    document.querySelectorAll('.btn-play').forEach(b => {
      b.addEventListener('click', e => { e.stopPropagation(); this._openModal(b.dataset.game); });
    });
    document.querySelectorAll('.game-card').forEach(c => {
      c.addEventListener('click', () => this._openModal(c.dataset.game));
    });

    // Practice / Test mode toggle
    const btnTest     = document.getElementById('mode-btn-test');
    const btnPractice = document.getElementById('mode-btn-practice');
    if (btnTest && btnPractice) {
      btnTest.addEventListener('click', () => {
        this.state.practiceMode = false;
        btnTest.classList.add('active');
        btnTest.classList.remove('practice-active');
        btnPractice.classList.remove('active', 'practice-active');
      });
      btnPractice.addEventListener('click', () => {
        this.state.practiceMode = true;
        btnPractice.classList.add('active', 'practice-active');
        btnTest.classList.remove('active');
      });
    }

    // Modal
    document.getElementById('modal-close').addEventListener('click',  () => this._closeModal());
    document.getElementById('modal-cancel').addEventListener('click', () => this._closeModal());
    document.getElementById('modal-start').addEventListener('click',  () => {
      const id = document.getElementById('modal-start').dataset.game;
      this._closeModal();
      this._startGame(id);
    });

    // HUD exit
    document.getElementById('btn-exit-game').addEventListener('click', () => this._exitGame());

    // Results
    document.getElementById('btn-retry').addEventListener('click', () => {
      const id = this.state.currentGame;
      this._showView('home');
      setTimeout(() => this._startGame(id), 80);
    });
    document.getElementById('btn-next-game').addEventListener('click', () => {
      const idx = GAME_ORDER.indexOf(this.state.currentGame);
      const next = GAME_ORDER[(idx + 1) % GAME_ORDER.length];
      this._showView('home');
      setTimeout(() => this._startGame(next), 80);
    });
    document.getElementById('btn-hub').addEventListener('click', () => this._showView('home'));

    // Profile
    document.getElementById('btn-final-profile').addEventListener('click', () => this._showProfile());
    document.getElementById('btn-view-results').addEventListener('click',  () => this._showProfile());
    document.getElementById('btn-back-final').addEventListener('click',    () => this._showView('home'));

    // Reset
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm('Reset all scores? This cannot be undone.')) {
        localStorage.removeItem('ciq_scores');
        localStorage.removeItem('ciq_streak');
        this.state.scores = {};
        this._streakData = { streak: 0, lastPlayed: "" };
        this._updateStreak(false);
        this._updateDashboard();
      }
    });

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        this._filterGames(query);
      });
    }
  }

  _filterGames(query) {
    document.querySelectorAll('.game-card').forEach(card => {
      const gameId = card.dataset.game;
      const cfg = GAME_CONFIG[gameId];
      if (!cfg) return;

      const name = cfg.name.toLowerCase();
      const desc = cfg.desc.toLowerCase();
      const skills = cfg.skills.map(s => s.toLowerCase()).join(' ');

      const matches = name.includes(query) || desc.includes(query) || skills.includes(query);
      if (matches || !query) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    document.querySelectorAll('.category').forEach(cat => {
      const visibleCards = cat.querySelectorAll('.game-card:not([style*="display: none"])');
      if (visibleCards.length === 0 && query) {
        cat.style.display = 'none';
      } else {
        cat.style.display = '';
      }
    });
  }

  /* ── VIEWS ───────────────────────────── */
  _showView(name) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const el = document.getElementById(`view-${name}`);
    if (el) el.classList.add('active');
  }

  /* ── MODAL ───────────────────────────── */
  _openModal(gameId) {
    const cfg = GAME_CONFIG[gameId];
    if (!cfg) return;

    const PROVIDER_METADATA = {
      1: { name: 'PYMETRICS ASSESSMENT', bg: 'gc-bg-pink' },
      2: { name: 'ARCTIC SHORES ASSESSMENT', bg: 'gc-bg-violet' },
      3: { name: 'HIREVUE ASSESSMENT', bg: 'gc-bg-cyan' },
      4: { name: 'AON ASSESSMENT', bg: 'gc-bg-emerald' },
      5: { name: 'SHL ASSESSMENT', bg: 'gc-bg-amber' },
      6: { name: 'TALENT GAMES ASSESSMENT', bg: 'gc-bg-red' },
      7: { name: 'TALEGENT ASSESSMENT', bg: 'gc-bg-blue' },
      8: { name: 'SOVA ASSESSMENT', bg: 'gc-bg-purple' }
    };

    const provider = PROVIDER_METADATA[cfg.cat] || { name: 'ASSESSMENT', bg: 'gc-bg-pink' };
    const banner = document.getElementById('modal-header-banner');
    
    // Clear previous provider background classes
    Object.values(PROVIDER_METADATA).forEach(p => banner.classList.remove(p.bg));
    banner.classList.add(provider.bg);

    document.getElementById('modal-category-badge').textContent = provider.name;
    document.getElementById('modal-title-text').textContent = cfg.name;
    
    const durStr = cfg.duration > 0 ? `⏱️ ${cfg.duration / 60} Min` : '⏱️ Untimed';
    document.getElementById('modal-duration-badge').textContent = durStr;
    
    document.getElementById('modal-tags').innerHTML =
      cfg.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
      
    const stepsHtml = cfg.howto.map((step, idx) => {
      const stepNum = String(idx + 1).padStart(2, '0');
      return `
        <div class="instruction-card">
          <span class="instruction-num">${stepNum}</span>
          <p class="instruction-text">${step}</p>
        </div>`;
    }).join('');
    document.getElementById('modal-how-steps').innerHTML = stepsHtml;

    document.getElementById('modal-video-art').textContent = cfg.icon;
    
    // Randomize video duration mockup a bit to make it look active (e.g., 1:15, 1:40, 2:10)
    const mins = Math.floor(Math.random() * 2) + 1;
    const secs = String(Math.floor(Math.random() * 50) + 10).padStart(2, '0');
    const durElement = document.querySelector('.video-mockup-wrapper .video-duration');
    if (durElement) {
      durElement.textContent = `${mins}:${secs}`;
    }

    document.getElementById('modal-start').dataset.game = gameId;
    document.getElementById('game-modal').style.display = 'flex';
  }

  _closeModal() {
    document.getElementById('game-modal').style.display = 'none';
  }

  /* ── GAME LIFECYCLE ──────────────────── */
  _startGame(gameId) {
    const cfg = GAME_CONFIG[gameId];
    if (!cfg) return;

    this.state.currentGame = gameId;
    this.state.hudScore = 0;
    this.state.streak   = 0;

    document.getElementById('hud-game-name').textContent = cfg.name;
    document.getElementById('hud-score').textContent     = '0';
    document.getElementById('streak-count').textContent  = '0';

    // Update HUD mode badge
    const modeBadge = document.getElementById('hud-mode-badge');
    if (modeBadge) {
      if (this.state.practiceMode) {
        modeBadge.textContent = '🏋️ Practice';
        modeBadge.className = 'hud-mode-badge practice-mode';
      } else {
        modeBadge.textContent = '⏱ Test';
        modeBadge.className = 'hud-mode-badge test-mode';
      }
    }

    const container = document.getElementById('game-container');
    container.innerHTML = '';

    this._showView('game');

    // Only start global timer in Test mode AND if game has a duration
    if (!this.state.practiceMode && cfg.duration > 0) {
      this._startTimer(cfg.duration);
    } else {
      document.getElementById('timer-display').textContent = this.state.practiceMode ? '∞' : '∞';
      document.getElementById('timer-ring').style.strokeDashoffset = '0';
    }

    const Cls = GAME_MODULES[gameId]();
    if (Cls) {
      this.state.gameInst = new Cls(container, {
        name:       cfg.name,
        onScore:    (pts, streak) => this._hudScore(pts, streak),
        onEnd:      (result)      => this._endGame(result),
        onFeedback: (ok)          => this._flash(ok),
      });
      this.state.gameInst.start();
    }
  }

  _exitGame() {
    clearInterval(this.state.timer);
    if (this.state.gameInst?.destroy) this.state.gameInst.destroy();
    this.state.gameInst = null;
    this._showView('home');
  }

  _endGame(result) {
    clearInterval(this.state.timer);
    if (this.state.gameInst?.destroy) this.state.gameInst.destroy();

    const gameId = this.state.currentGame;
    const score  = result.score ?? this.state.hudScore;

    let entry = this.state.scores[gameId];
    if (!entry) {
      entry = { best: null, history: [] };
      this.state.scores[gameId] = entry;
    } else if (entry.score !== undefined) {
      entry = { best: entry, history: [] };
      this.state.scores[gameId] = entry;
    }
    if (!entry.best || score > entry.best.score) {
      entry.best = {
        score, accuracy: result.accuracy ?? 0,
        avgTime: result.avgTime ?? 0,
        correct: result.correct ?? 0,
        total:   result.total   ?? 0,
        level:   result.level   ?? 1,
        ts: Date.now(),
      };
    }
    // Add to history (cap at 5)
    if (!entry.history) entry.history = [];
    entry.history.push({ score, ts: Date.now() });
    if (entry.history.length > 5) entry.history.shift();

    localStorage.setItem('ciq_scores', JSON.stringify(this.state.scores));

    // Update streak (only count test mode plays for streak)
    if (!this.state.practiceMode) {
      this._updateStreak(true);
    }

    this._updateDashboard();
    this._showResults(gameId, result);
  }

  /* ── TIMER ───────────────────────────── */
  _startTimer(dur) {
    this.state.timeLeft = dur;
    this.state.totalDur = dur;
    clearInterval(this.state.timer);
    this._renderTimer();
    this.state.timer = setInterval(() => {
      this.state.timeLeft--;
      this._renderTimer();
      if (this.state.timeLeft <= 0) {
        clearInterval(this.state.timer);
        if (this.state.gameInst?.timeUp) this.state.gameInst.timeUp();
        else this._endGame({ score: this.state.hudScore, accuracy: 0, avgTime: 0, correct: 0, total: 0 });
      }
    }, 1000);
  }

  _renderTimer() {
    const t = this.state.timeLeft, tot = this.state.totalDur;
    const pct = Math.max(0, t / tot);
    const circumf = 99.9;
    const offset  = circumf * (1 - pct);

    const disp = document.getElementById('timer-display');
    const ring = document.getElementById('timer-ring');
    const svg  = ring.closest('.timer-svg');

    disp.textContent = t;
    ring.style.strokeDashoffset = offset;

    svg.classList.remove('warning','danger');
    if (t <= 10) svg.classList.add('danger');
    else if (t <= 20) svg.classList.add('warning');

    // AssessPro Header timer sync
    const apTimer = document.getElementById('ap-timer-val');
    if (apTimer) {
      const m = Math.floor(t / 60);
      const s = t % 60;
      apTimer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }
  }

  /* ── HUD SCORE ───────────────────────── */
  _hudScore(pts, streak) {
    this.state.hudScore += pts;
    if (streak !== undefined) this.state.streak = streak;

    const el = document.getElementById('hud-score');
    el.textContent = this.state.hudScore;
    el.style.transform = 'scale(1.35)';
    setTimeout(() => el.style.transform = 'scale(1)', 160);

    document.getElementById('streak-count').textContent = this.state.streak;
  }

  /* ── FEEDBACK FLASH ──────────────────── */
  _flash(ok) {
    const wrap = document.getElementById('feedback-flash');
    const span = document.getElementById('flash-content');
    wrap.style.display = 'flex';
    span.className = ok ? 'flash-correct' : 'flash-wrong';
    span.textContent = ok ? '✓' : '✗';
    clearTimeout(this._flashTO);
    this._flashTO = setTimeout(() => { wrap.style.display = 'none'; }, 860);
  }

  /* ── RESULTS SCREEN ──────────────────── */
  _showResults(gameId, result) {
    const cfg   = GAME_CONFIG[gameId];
    const score = result.score ?? this.state.hudScore;
    const acc   = result.accuracy ?? 0;
    const grade = this._grade(score, acc);

    document.getElementById('results-icon').textContent  = grade.icon;
    document.getElementById('results-title').textContent = `${cfg.name} Complete!`;
    document.getElementById('results-score').textContent = score.toLocaleString();
    document.getElementById('results-grade').textContent = grade.label;

    document.getElementById('results-metrics').innerHTML = `
      <div class="metric-card">
        <div class="metric-label">Accuracy</div>
        <div class="metric-val">${Math.round(acc)}%</div>
        <div class="metric-sub">${result.correct ?? 0} / ${result.total ?? 0} correct</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Speed</div>
        <div class="metric-val">${result.avgTime > 0 ? (result.avgTime/1000).toFixed(1) : '—'}s</div>
        <div class="metric-sub">per answer</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Level</div>
        <div class="metric-val">${result.level ?? 1}</div>
        <div class="metric-sub">difficulty reached</div>
      </div>`;

    const idx  = GAME_ORDER.indexOf(gameId);
    const hasN = idx < GAME_ORDER.length - 1;
    const nextBtn = document.getElementById('btn-next-game');
    nextBtn.textContent = hasN
      ? `Next: ${GAME_CONFIG[GAME_ORDER[idx+1]].name} →`
      : 'Back to Hub';

    // ── Recruitment Insights Panel ──────────────────────────
    this._renderRecruitmentInsights(gameId, score, acc);

    this._showView('results');
  }

  _renderRecruitmentInsights(gameId, score, acc) {
    const ri = RECRUITMENT_INSIGHTS[gameId];
    const card = document.getElementById('results-insights-card');
    if (!card) return;

    if (!ri) {
      card.style.display = 'none';
      return;
    }
    card.style.display = '';

    // Title uses game name
    const cfg = GAME_CONFIG[gameId];
    document.getElementById('ri-title').textContent = `${cfg.name} — Employer Intelligence`;

    // Employer badge
    document.getElementById('ri-employer-badge').textContent = ri.employer;

    // Trait measured
    document.getElementById('ri-measure').textContent = ri.measure;

    // What employers see
    document.getElementById('ri-insight').textContent = ri.insight;

    // Pro strategy
    document.getElementById('ri-strategy').textContent = ri.strategy;

    // Score interpretation bar
    // Map score+acc combo to 0-100 band
    const interpPct = Math.min(100, Math.round(
      (acc * 0.6) + (Math.min(score, 1500) / 1500 * 100 * 0.4)
    ));
    const marker = document.getElementById('ri-interp-marker');
    const label  = document.getElementById('ri-interp-label');
    if (marker) {
      // Animate marker after a short delay
      marker.style.left = '0%';
      setTimeout(() => { marker.style.left = `calc(${interpPct}% - 10px)`; }, 120);
    }
    if (label) {
      let interpText, interpColor;
      if (interpPct >= 80)      { interpText = '🏆 Outstanding — Top 10% candidate profile'; interpColor = '#059669'; }
      else if (interpPct >= 60) { interpText = '⭐ Strong — Above average, keep refining';   interpColor = '#0284c7'; }
      else if (interpPct >= 38) { interpText = '✅ Developing — Consistent practice helps';  interpColor = '#d97706'; }
      else                       { interpText = '📈 Emerging — Review the strategy tip above'; interpColor = '#dc2626'; }
      label.textContent = interpText;
      label.style.color = interpColor;
    }

    // Wire up "Practice Again" button inside insights card
    const riRetry = document.getElementById('ri-btn-retry');
    if (riRetry) {
      riRetry.onclick = () => {
        this._showView('home');
        setTimeout(() => this._startGame(gameId), 80);
      };
    }
  }


  _grade(score, acc) {
    if (acc >= 88 || score >= 1400) return { icon:'🏆', label:'Outstanding' };
    if (acc >= 72 || score >= 900)  return { icon:'⭐', label:'Excellent' };
    if (acc >= 55 || score >= 500)  return { icon:'🎯', label:'Good' };
    if (acc >= 38 || score >= 250)  return { icon:'💪', label:'Keep Practicing' };
    return { icon:'🔄', label:'Needs More Practice' };
  }

  _renderCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const s = this.state.scores;
    const count = (ids) => ids.filter(id => {
      const e = s[id]; return (e?.best ?? e)?.score !== undefined;
    }).length;

    const TRAIT_CATEGORIES = {
      // Practice grid — each unique game appears ONCE.
      // Aliases (arrow-directions, balloon-risk-game, etc.) live in mock-test.js
      // and are encountered there; they are intentionally excluded here.
      1: { name: 'Attention & Focus', icon: '🏹', desc: 'Inhibiting distractions and maintaining persistent focus', games: ['arrows-game', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop'], color: 'linear-gradient(135deg, #06b6d4, #0891b2)', bg: 'gc-bg-cyan', tag: 'Attention' },
      2: { name: 'Working Memory & Speed', icon: '🧠', desc: 'Holding, updating and manipulating sequential data', games: ['memory-vault', 'digit-nback', 'flashback', 'sequence', 'aon-switch', 'tickets', 'number-dash'], color: 'linear-gradient(135deg, #7c3aed, #6d28d9)', bg: 'gc-bg-violet', tag: 'Memory' },
      3: { name: 'Quantitative & Numerical', icon: '🔢', desc: 'Processing mental arithmetic and logical quantities', games: ['verify-numerical', 'numerosity'], color: 'linear-gradient(135deg, #d97706, #b45309)', bg: 'gc-bg-orange', tag: 'Numerical' },
      4: { name: 'Logical & Abstract Reasoning', icon: '🔷', desc: 'Formulating patterns and rules from visual shapes', games: ['pattern-matrix', 'verify-inductive', 'power-generators', 'logic-deduction'], color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', bg: 'gc-bg-purple', tag: 'Logic' },
      5: { name: 'Spatial Reasoning & Planning', icon: '📐', desc: 'Mentally rotating shapes and sequencing moves', games: ['shape-spinner', 'shapedance', 'mirror-match', 'pipe-puzzle', 'pathfinder', 'gridlock', 'tower-game'], color: 'linear-gradient(135deg, #2563eb, #1d4ed8)', bg: 'gc-bg-blue', tag: 'Spatial' },
      6: { name: 'Risk Calibration & Decision Making', icon: '🧩', desc: 'Assessing trade-offs under high-uncertainty rules', games: ['balloon-game', 'cards-game', 'hard-easy-game', 'money-exchange', 'business-sim'], color: 'linear-gradient(135deg, #10b981, #059669)', bg: 'gc-bg-emerald', tag: 'Decision' },
      7: { name: 'Social, Emotional & Interpersonal', icon: '🤝', desc: 'Reading expressions and resolving workplace scenarios', games: ['faces-game', 'team-dilemma', 'scenario-judge', 'inbox-triage', 'crisis-room', 'personality-reveal'], color: 'linear-gradient(135deg, #3b82f6, #2563eb)', bg: 'gc-bg-pink', tag: 'Social' }
    };

    container.innerHTML = Object.keys(TRAIT_CATEGORIES).map(catId => {
      const cat = TRAIT_CATEGORIES[catId];
      const played = count(cat.games);
      
      const cardsHtml = cat.games.map(gameId => {
        const cfg = GAME_CONFIG[gameId];
        if (!cfg) return '';
        const bestData = (s[gameId]?.best ?? s[gameId]);
        const scoreStr = bestData ? `${bestData.score.toLocaleString()} pts` : '';
        const accStr = bestData ? ` · ${Math.round(bestData.accuracy)}% acc` : '';
        
        let difficultyLabel = 'Easy';
        let diffClass = 'diff-easy';
        if (cfg.difficulty === 'medium') { difficultyLabel = 'Medium'; diffClass = 'diff-medium'; }
        else if (cfg.difficulty === 'hard') { difficultyLabel = 'Hard'; diffClass = 'diff-hard'; }

        const prov = cfg.provider || 'Recruitment Test';

        return `
          <div class="game-card" id="card-${gameId}" data-game="${gameId}">
            <div class="gc-header-block ${cat.bg}">
              <div class="gc-top-row">
                <span class="gc-popular-tag">${cat.tag}</span>
                <span class="gc-watermark">${cfg.icon}</span>
              </div>
              <div class="gc-title-row">
                <span class="gc-card-title-main">${cfg.name}</span>
              </div>
            </div>
            <div class="gc-body-block">
              <div class="gc-body-title">${prov} Assessment</div>
              <span class="difficulty ${diffClass}">${difficultyLabel}</span>
              <p>${cfg.desc}</p>
              <div class="game-best" id="best-${gameId}" style="${bestData ? '' : 'display:none'}">
                ${bestData ? `🏆 Best: <strong>${scoreStr}</strong>${accStr}` : ''}
              </div>
              <button class="btn btn-play" data-game="${gameId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Start Practice
              </button>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="category cat-${catId}">
          <div class="category-header">
            <div class="category-icon" style="background: ${cat.color}; color: #fff; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.25rem;">${cat.icon}</div>
            <div class="cat-meta" style="margin-left: 12px;">
              <h2 class="category-title" style="font-family: var(--fh); font-size: 1.15rem; font-weight: 700; color: var(--text);">${cat.name}</h2>
              <p class="category-subtitle" style="font-size: 0.82rem; color: var(--muted); margin-top: 2px;">${cat.desc}</p>
            </div>
            <div class="category-progress" id="progress-cat-${catId}" style="margin-left: auto; font-family: var(--fm); font-size: 0.85rem; font-weight: 700; color: var(--violet); background: rgba(37,99,235,0.08); padding: 4px 12px; border-radius: 100px;">
              <span>${played}/${cat.games.length}</span>
            </div>
          </div>
          <div class="game-grid grid-3">
            ${cardsHtml}
          </div>
        </div>`;
    }).join('');
  }

  /* ── DASHBOARD UPDATE ────────────────── */
  _updateDashboard() {
    const s = this.state.scores;

    GAME_ORDER.forEach(id => {
      const card = document.getElementById(`card-${id}`);
      const best = document.getElementById(`best-${id}`);
      if (!card) return;
      const entry = s[id];
      // Support both old flat format and new {best, history} format
      const bestData = entry?.best ?? entry;
      if (bestData?.score !== undefined) {
        card.classList.add('completed');
        best.style.display = 'block';
        best.innerHTML = `🏆 ${bestData.score.toLocaleString()} pts · ${Math.round(bestData.accuracy)}% acc`;
        // Render sparkline if history exists
        const history = entry?.history;
        if (history && history.length >= 2) {
          const existing = card.querySelector('.sparkline-wrap');
          if (!existing) {
            best.insertAdjacentHTML('afterend', this._genSparkline(history));
          } else {
            existing.outerHTML = this._genSparkline(history);
          }
        }
      }
    });

    const count = (ids) => ids.filter(id => {
      const e = s[id]; return (e?.best ?? e)?.score !== undefined;
    }).length;

    // Dynamically update progress counters for all 7 trait categories
    const categoriesMapping = [
      { id: 1, games: ['arrows-game', 'arrow-directions', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop', 'security-door', 'checking-game'] },
      { id: 2, games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets', 'number-dash'] },
      { id: 3, games: ['verify-numerical', 'calculation-game', 'flashback'] },
      { id: 4, games: ['verify-inductive', 'logic-deduction', 'pattern-matrix', 'patterns', 'power-generators', 'shapedance'] },
      { id: 5, games: ['tower-game', 'shape-spinner', 'order', 'mirror-match', 'pathfinder', 'gridlock', 'pipe-puzzle'] },
      { id: 6, games: ['balloon-game', 'money-exchange', 'hard-easy-game', 'cards-game', 'balloon-risk-game', 'business-sim'] },
      { id: 7, games: ['faces-game', 'emotions-face-game', 'team-selling', 'inbox-triage', 'scenario-judge', 'team-dilemma', 'crisis-room', 'personality-reveal'] }
    ]

    categoriesMapping.forEach(cat => {
      const el = document.getElementById(`progress-cat-${cat.id}`);
      if (el) {
        el.innerHTML = `<span>${count(cat.games)}/${cat.games.length}</span>`;
      }
    });

    const getScore = (id) => (s[id]?.best ?? s[id])?.score ?? 0;
    const total = GAME_ORDER.reduce((a, id) => a + getScore(id), 0);
    const n = GAME_ORDER.filter(id => getScore(id) > 0).length;
    if (n > 0) {
      document.getElementById('session-score').style.display = 'flex';
      document.getElementById('total-score-display').textContent = total.toLocaleString();
      document.getElementById('btn-view-results').style.display = '';
    }
    if (n >= 15) document.getElementById('final-cta').style.display = 'block';
  }

  /* ── FINAL PROFILE ───────────────────── */
  _showProfile() {
    const s = this.state.scores;
    const MAX = 1500;

    // Streak display
    const streakEl = document.getElementById('fp-streak-display');
    if (streakEl) {
      const sd = this._streakData;
      streakEl.innerHTML = sd.streak > 0
        ? `<div class="fp-streak-chip">🔥 <span>${sd.streak}-day</span> practice streak — keep it up!</div>`
        : '';
    }

    const cats = [
      { name: 'Attention & Focus',         games: ['arrows-game', 'arrow-directions', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop', 'security-door', 'checking-game'], c1: '#06b6d4', c2: '#0891b2' },
      { name: 'Working Memory',            games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets', 'number-dash'], c1: '#7c3aed', c2: '#6d28d9' },
      { name: 'Quantitative',              games: ['verify-numerical', 'calculation-game', 'flashback'], c1: '#d97706', c2: '#b45309' },
      { name: 'Logical Reasoning',         games: ['verify-inductive', 'logic-deduction', 'pattern-matrix', 'patterns', 'power-generators', 'shapedance'], c1: '#8b5cf6', c2: '#7c3aed' },
      { name: 'Spatial & Planning',        games: ['tower-game', 'shape-spinner', 'order', 'mirror-match', 'pathfinder', 'gridlock', 'pipe-puzzle'], c1: '#2563eb', c2: '#1d4ed8' },
      { name: 'Risk & Decisions',          games: ['balloon-game', 'money-exchange', 'hard-easy-game', 'cards-game', 'balloon-risk-game', 'business-sim'], c1: '#10b981', c2: '#059669' },
      { name: 'Social & Interpersonal',    games: ['faces-game', 'emotions-face-game', 'team-selling', 'inbox-triage', 'scenario-judge', 'team-dilemma', 'crisis-room', 'personality-reveal'], c1: '#ec4899', c2: '#be185d' }
    ]

    const getScore = id => (s[id]?.best ?? s[id])?.score ?? 0;
    const getAcc   = id => (s[id]?.best ?? s[id])?.accuracy ?? 0;

    const avgScore = ids => {
      const played = ids.filter(id => getScore(id) > 0);
      if (!played.length) return 0;
      return played.reduce((a,id) => a + getScore(id), 0) / played.length;
    };

    document.getElementById('fp-breakdown').innerHTML = cats.map(cat => {
      const avg = avgScore(cat.games);
      const pct = Math.min(100, (avg / MAX) * 100);
      const played = cat.games.filter(id => getScore(id) > 0).length;
      return `
        <div class="breakdown-block">
          <div class="breakdown-label">${played}/${cat.games.length} games played</div>
          <div class="breakdown-name">${cat.name}</div>
          <div class="breakdown-bar">
            <div class="breakdown-fill" style="width:${pct}%;background:linear-gradient(90deg,${cat.c1},${cat.c2})"></div>
          </div>
          <div class="breakdown-pct">${Math.round(avg)} avg pts · ${Math.round(pct)}%ile</div>
        </div>`;
    }).join('');

    // Cognitive Trait Breakdown
    this._renderTraitBreakdown(s, getScore);

    document.getElementById('fp-all-scores').innerHTML = GAME_ORDER.map(id => {
      const cfg = GAME_CONFIG[id];
      const bestData = (s[id]?.best ?? s[id]);
      return `
        <div class="score-tile">
          <div class="st-icon">${cfg.icon}</div>
          <div class="st-name">${cfg.name}</div>
          <div class="st-val">${bestData ? bestData.score.toLocaleString() : '—'}</div>
          <div class="st-acc">${bestData ? `${Math.round(bestData.accuracy)}% acc` : 'Not played'}</div>
        </div>`;
    }).join('');

    this._showView('final');
    requestAnimationFrame(() => this._drawRadar(s));
  }

  _drawRadar(scores) {
    const canvas = document.getElementById('radar-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W/2, cy = H/2, r = W * 0.33;
    const MAX = 1500;
    const getScore = id => (scores[id]?.best ?? scores[id])?.score ?? 0;

    const cats = [
      { name: 'Attention & Focus',         games: ['arrows-game', 'arrow-directions', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop', 'security-door', 'checking-game'] },
      { name: 'Working Memory',            games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets', 'number-dash'] },
      { name: 'Quantitative',              games: ['verify-numerical', 'calculation-game', 'flashback'] },
      { name: 'Logical Reasoning',         games: ['verify-inductive', 'logic-deduction', 'pattern-matrix', 'patterns', 'power-generators', 'shapedance'] },
      { name: 'Spatial & Planning',        games: ['tower-game', 'shape-spinner', 'order', 'mirror-match', 'pathfinder', 'gridlock', 'pipe-puzzle'] },
      { name: 'Risk & Decisions',          games: ['balloon-game', 'money-exchange', 'hard-easy-game', 'cards-game', 'balloon-risk-game', 'business-sim'] },
      { name: 'Social & Interpersonal',    games: ['faces-game', 'emotions-face-game', 'team-selling', 'inbox-triage', 'scenario-judge', 'team-dilemma', 'crisis-room', 'personality-reveal'] }
    ]
    const N = cats.length;

    ctx.clearRect(0, 0, W, H);

    // Grid rings
    [1,2,3,4].forEach(lvl => {
      const fr = r * lvl/4;
      ctx.beginPath();
      cats.forEach((_, i) => {
        const a = (2*Math.PI*i/N) - Math.PI/2;
        const x = cx + fr*Math.cos(a), y = cy + fr*Math.sin(a);
        i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Spokes + labels
    cats.forEach((cat, i) => {
      const a = (2*Math.PI*i/N) - Math.PI/2;
      const x = cx + r*Math.cos(a), y = cy + r*Math.sin(a);
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y);
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1; ctx.stroke();

      const lx = cx + (r+34)*Math.cos(a), ly = cy + (r+34)*Math.sin(a);
      ctx.fillStyle = 'rgba(148,163,184,.8)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      
      const words = cat.name.split(' ');
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(' '), lx, ly - 6);
        ctx.fillText(words.slice(2).join(' '), lx, ly + 6);
      } else {
        ctx.fillText(cat.name, lx, ly);
      }
    });

    const avgScore = ids => {
      const played = ids.filter(id => getScore(id) > 0);
      if (!played.length) return 0;
      return played.reduce((a,id) => a + getScore(id), 0) / played.length;
    };

    // Data polygon
    const vals = cats.map(cat => {
      const avg = avgScore(cat.games);
      return avg ? Math.min(1, avg / MAX) : 0;
    });

    ctx.beginPath();
    cats.forEach((_, i) => {
      const a = (2*Math.PI*i/N) - Math.PI/2;
      const x = cx + r*vals[i]*Math.cos(a), y = cy + r*vals[i]*Math.sin(a);
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.closePath();

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(124,58,237,.45)');
    grad.addColorStop(1, 'rgba(6,182,212,.2)');
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(167,139,250,.85)'; ctx.lineWidth = 2; ctx.stroke();

    // Dots
    cats.forEach((_, i) => {
      const a = (2*Math.PI*i/N) - Math.PI/2;
      const x = cx + r*vals[i]*Math.cos(a), y = cy + r*vals[i]*Math.sin(a);
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 2*Math.PI);
      ctx.fillStyle = '#a78bfa'; ctx.fill();
    });
  }
}

/* ── NEW HELPER METHODS ─────────────────────────────── */

Object.assign(CognitIQApp.prototype, {

  /* ── Streak Tracking ──────────────────────────────── */
  _updateStreak(extended) {
    const today = new Date().toISOString().slice(0, 10);
    const sd = this._streakData;

    if (extended) {
      if (sd.lastPlayed === today) {
        // Already played today — no change
      } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (sd.lastPlayed === yesterday) {
          sd.streak += 1;
          this._showStreakToast(sd.streak);
        } else {
          // Missed a day — reset
          sd.streak = 1;
          if (sd.lastPlayed !== '') this._showStreakToast(1, true);
        }
        sd.lastPlayed = today;
        localStorage.setItem('ciq_streak', JSON.stringify(sd));
      }
    }

    // Update header display
    const numEl = document.getElementById('header-streak-num');
    if (numEl) numEl.textContent = sd.streak;
  },

  _showStreakToast(streak, reset = false) {
    const toast = document.getElementById('streak-toast');
    if (!toast) return;
    toast.textContent = reset
      ? `🔥 Streak reset — Day 1! Keep going!`
      : streak === 1
        ? `🔥 Streak started! Play tomorrow to continue!`
        : `🔥 ${streak}-day streak! You're on fire!`;
    toast.classList.add('visible');
    clearTimeout(this._toastTO);
    this._toastTO = setTimeout(() => toast.classList.remove('visible'), 3200);
  },

  /* ── Sparkline Generator ──────────────────────────── */
  _genSparkline(history) {
    const scores = history.map(h => h.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const W = 72, H = 28, pad = 3;
    const range = max - min || 1;
    const pts = scores.map((v, i) => {
      const x = pad + (i / (scores.length - 1)) * (W - pad * 2);
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const last   = scores[scores.length - 1];
    const prev   = scores[scores.length - 2];
    const trend  = last > prev ? 'up' : last < prev ? 'down' : 'flat';
    const tLabel = last > prev ? '↑' : last < prev ? '↓' : '→';

    return `
      <div class="sparkline-wrap">
        <svg width="${W}" height="${H}" class="sparkline-svg" viewBox="0 0 ${W} ${H}">
          <polyline points="${pts.join(' ')}" fill="none"
            stroke="${trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8'}"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}"
            r="2.5" fill="${trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8'}"/>
        </svg>
        <div class="sparkline-info">
          <strong>${last.toLocaleString()}</strong><br>
          <span class="sparkline-trend ${trend}">${tLabel} ${Math.abs(last - prev).toLocaleString()}</span>
          <span style="color:var(--subtle)"> vs prev</span>
        </div>
      </div>`;
  },

  /* ── Cognitive Trait Breakdown ────────────────────── */
  _renderTraitBreakdown(s, getScore) {
    const MAX = 1500;
    const TRAITS = [
      { icon: '⚡', name: 'Processing Speed',    color: '#06b6d4', games: ['security-door','keypress-game','arrows-game','number-dash','aon-switch'], desc: 'How quickly you respond to stimuli' },
      { icon: '🧠', name: 'Working Memory',       color: '#7c3aed', games: ['memory-vault','sequence','digit-nback','flashback'], desc: 'Holding and manipulating information' },
      { icon: '🎯', name: 'Impulse Control',      color: '#db2777', games: ['security-door','keypress-game','hard-easy-game','balloon-risk-game'], desc: 'Inhibiting automatic responses' },
      { icon: '📐', name: 'Spatial Reasoning',    color: '#2563eb', games: ['shape-spinner','mirror-match','order','pathfinder','shapedance','pipe-puzzle'], desc: 'Mentally rotating and manipulating shapes' },
      { icon: '🔢', name: 'Numerical Reasoning',  color: '#d97706', games: ['verify-numerical','numerosity','sequence','number-dash'], desc: 'Working with numbers and data' },
      { icon: '🔷', name: 'Abstract Reasoning',   color: '#8b5cf6', games: ['patterns','verify-inductive','power-generators'], desc: 'Identifying rules and patterns' },
      { icon: '💛', name: 'Emotional Intelligence',color: '#f59e0b', games: ['emotions-face-game','money-exchange'], desc: 'Reading emotions and social cues' },
      { icon: '🧩', name: 'Decision Making',       color: '#10b981', games: ['cards-game','balloon-risk-game','business-sim','scenario-judge'], desc: 'Weighing options under uncertainty' },
      { icon: '🏹', name: 'Attention',             color: '#ef4444', games: ['motion-track','lengths-game','arrow-directions'], desc: 'Focusing on relevant stimuli' },
      { icon: '🤝', name: 'Social Judgment',       color: '#3b82f6', games: ['logic-deduction','team-selling','inbox-triage','personality-reveal'], desc: 'Navigating interpersonal situations' },
    ];

    const grid = document.getElementById('fp-traits-grid');
    if (!grid) return;

    grid.innerHTML = TRAITS.map(trait => {
      const played = trait.games.filter(id => getScore(id) > 0);
      if (played.length === 0) {
        return `
          <div class="trait-card">
            <div class="trait-top">
              <div class="trait-name"><span class="trait-icon">${trait.icon}</span>${trait.name}</div>
              <span class="trait-empty">Not played</span>
            </div>
            <div class="trait-bar-bg"><div class="trait-bar-fill" style="width:0%;background:${trait.color}"></div></div>
            <div class="trait-label">${trait.desc}</div>
          </div>`;
      }
      const avg = played.reduce((a, id) => a + getScore(id), 0) / played.length;
      const pct = Math.min(100, Math.round((avg / MAX) * 100));
      const label = pct >= 80 ? '🏆 Exceptional' : pct >= 60 ? '⭐ Strong' : pct >= 40 ? '✅ Developing' : '📈 Emerging';
      return `
        <div class="trait-card">
          <div class="trait-top">
            <div class="trait-name"><span class="trait-icon">${trait.icon}</span>${trait.name}</div>
            <span class="trait-score" style="color:${trait.color}">${pct}%</span>
          </div>
          <div class="trait-bar-bg">
            <div class="trait-bar-fill" style="width:${pct}%;background:${trait.color}"></div>
          </div>
          <div class="trait-label">${label} · ${played.length}/${trait.games.length} games played · ${trait.desc}</div>
        </div>`;
    }).join('');
  }
});

window.addEventListener('DOMContentLoaded', () => { window._app = window.CIQ = new CognitIQApp(); });
