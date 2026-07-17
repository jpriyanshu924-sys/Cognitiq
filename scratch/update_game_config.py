import os

app_js_path = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Locate GAME_CONFIG start
start_marker = "const GAME_CONFIG = {"
start_idx = content.find(start_marker)
if start_idx == -1:
    print("Error: Could not find start of GAME_CONFIG")
    exit(1)

# Locate GAME_ORDER start (which marks the end of GAME_CONFIG)
end_marker = "const GAME_ORDER = ["
end_idx = content.find(end_marker)
if end_idx == -1:
    print("Error: Could not find start of GAME_ORDER")
    exit(1)

new_game_config = """const GAME_CONFIG = {
  // Pymetrics (12 games)
  'balloon-game': {
    name: 'Balloon Game', icon: '🎈', cat: 6, duration: 0, provider: 'Pymetrics', difficulty: 'easy', tag: 'Decision',
    desc: 'Pump a balloon to earn $1 per pump. Collect before it pops to bank your earnings. Risk too much and lose it all. 15 rounds to build up a score.',
    skills: ['Risk Tolerance', 'Impulsivity', 'Decision Making'],
    howto: ["Click \\"🎈 Pump\\" to inflate the balloon and earn $1 per pump", "Click \\"💰 Collect\\" at any point to bank your earnings", "If the balloon pops, you lose all uncollected earnings for that round", "There is no way to know when it will pop — it is random", "Complete 15 rounds. Balance caution and risk for max score"]
  },
  'money-exchange': {
    name: 'Money Exchange', icon: '🤝', cat: 6, duration: 0, provider: 'Pymetrics', difficulty: 'medium', tag: 'Decision',
    desc: 'Three classic economic games: Ultimatum (accept or reject offers), Trust (how much will you send?), and Dictator (you control the split). Reveals your social preferences.',
    skills: ['Fairness', 'Trust', 'Altruism', 'Social Cognition'],
    howto: ['Ultimatum: Accept or reject money splits from a partner', 'Trust: Send any amount to a stranger (it triples, they return some)', "Dictator: You decide how $$ is split — other person can\\'t refuse", "There\\'s no single right answer — your pattern reveals your values", '12 rounds rotating through all 3 game types']
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
    name: 'Lengths Game', icon: '📏', cat: 1, duration: 60, provider: 'Pymetrics', difficulty: 'easy', tag: 'Attention',
    desc: 'Quickly distinguish between two lines of slightly different lengths. Focuses on perceptual precision and detail scanning under speed pressure.',
    skills: ['Detail Scanning', 'Perceptual Speed', 'Visual Accuracy'],
    howto: ['Two vertical lines will flash on the screen', 'Identify whether the lines are equal or unequal in length', 'Press A key if they are equal, press L key if they are unequal', "The difference can be extremely subtle. Trust your first instinct"]
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
"""

# Splice the new config in
updated_content = content[:start_idx] + new_game_config + content[end_idx:]

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(updated_content)

print("GAME_CONFIG updated successfully!")
