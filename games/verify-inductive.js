/* ══════════════════════════════════════════════════════
   SHL Interactive 2: Verify Inductive
   Measures: Inductive reasoning, abstract pattern recognition
   Based on: SHL Verify Interactive Inductive Assessment (Shape Sequences)
   ══════════════════════════════════════════════════════ */
class VerifyInductiveGame {
  constructor(container, cb) {
    this.container = container; this.cb = cb;
    this.score = 0; this.correct = 0; this.total = 0;
    this.qIndex = 0;
    this.el = null;
    this.hasAnswered = false;

    // Premium array of 10 highly complex abstract reasoning sequences
    this.questions = [
      {
        text: "Identify the pattern in the sequence and choose the correct shape that fills the missing [ ? ] slot.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="12" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="20" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="28" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="25" y="25" width="50" height="50" rx="4" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="36" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="28" fill="var(--red)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="12" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`
        ],
        answer: 1,
        explanation: "The shape size (circle radius) increases progressively in each step: 12px ➔ 20px ➔ 28px ➔ 36px. The color and shape remain constant."
      },
      {
        text: "Determine the rule of rotation and fill the missing [ ? ] slot.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(0 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(45 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(90 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(180 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(135 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--violet-l)" transform="rotate(270 50 50)" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><path d="M50 15 L20 70 L35 70 L35 85 L65 85 L65 70 L80 70 Z" fill="var(--emerald)" transform="rotate(135 50 50)" stroke="white" stroke-width="1.5"/></svg>`
        ],
        answer: 1,
        explanation: "The arrow rotates clockwise by 45 degrees in each step (0° ➔ 45° ➔ 90° ➔ 135°)."
      },
      {
        text: "Analyze the sequence of symbols to find the logical missing link.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 90,85 10,85" fill="var(--amber)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="15" y="15" width="70" height="70" rx="6" fill="var(--pink)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 90,85 10,85" fill="var(--amber)" stroke="white" stroke-width="2"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 90,85 10,85" fill="var(--pink)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="15" y="15" width="70" height="70" rx="6" fill="var(--pink)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="35" fill="var(--cyan)" stroke="white" stroke-width="2"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="15" y="15" width="70" height="70" rx="6" fill="var(--amber)" stroke="white" stroke-width="2"/></svg>`
        ],
        answer: 1,
        explanation: "The pattern alternates between an amber triangle and a pink square (Triangle ➔ Square ➔ Triangle ➔ Square)."
      },
      {
        text: "Analyze the count patterns and find the correct option to fill the slot.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="35" cy="50" r="10" fill="var(--emerald)"/><circle cx="65" cy="50" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="30" r="10" fill="var(--emerald)"/><circle cx="30" cy="70" r="10" fill="var(--emerald)"/><circle cx="70" cy="70" r="10" fill="var(--emerald)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="30" r="10" fill="var(--red)"/><circle cx="30" cy="70" r="10" fill="var(--red)"/><circle cx="70" cy="70" r="10" fill="var(--red)"/><circle cx="50" cy="50" r="10" fill="var(--red)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="30" cy="30" r="10" fill="var(--emerald)"/><circle cx="70" cy="30" r="10" fill="var(--emerald)"/><circle cx="30" cy="70" r="10" fill="var(--emerald)"/><circle cx="70" cy="70" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="30" cy="30" r="10" fill="var(--emerald)"/><circle cx="70" cy="30" r="10" fill="var(--emerald)"/><circle cx="30" cy="70" r="10" fill="var(--emerald)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="20" y="20" width="60" height="60" rx="4" fill="var(--emerald)"/></svg>`
        ],
        answer: 1,
        explanation: "The quantity of green circles increases by 1 in each step (1 ➔ 2 ➔ 3 ➔ 4 circles). The shape and color remain green."
      },
      {
        text: "Determine the rule for concentric rotation (Outer vs Inner elements).",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--cyan)" stroke-width="3" transform="rotate(0 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(0 50 50)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--cyan)" stroke-width="3" transform="rotate(30 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(-45 50 50)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--cyan)" stroke-width="3" transform="rotate(60 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(-90 50 50)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--cyan)" stroke-width="3" transform="rotate(90 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(-135 50 50)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--cyan)" stroke-width="3" transform="rotate(90 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(135 50 50)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--cyan)" stroke-width="3" transform="rotate(120 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(-180 50 50)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,35 85,75 50,90 15,75 15,35" fill="none" stroke="var(--red)" stroke-width="3" transform="rotate(90 50 50)"/><rect x="38" y="38" width="24" height="24" fill="var(--violet-l)" transform="rotate(-135 50 50)"/></svg>`
        ],
        answer: 0,
        explanation: "The outer hexagon rotates clockwise by 30° in each step (0° ➔ 30° ➔ 60° ➔ 90°), while the inner purple square rotates counterclockwise by 45° (0° ➔ -45° ➔ -90° ➔ -135°)."
      },
      {
        text: "Find the logic governing the shape morphing and line count.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,15 85,75 15,75" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="50" y1="15" x2="50" y2="75" stroke="var(--pink)" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="20" y="20" width="60" height="60" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="20" y1="50" x2="80" y2="50" stroke="var(--pink)" stroke-width="1.5"/><line x1="50" y1="20" x2="50" y2="80" stroke="var(--pink)" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,15 80,38 68,75 32,75 20,38" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="50" y1="15" x2="50" y2="75" stroke="var(--pink)" stroke-width="1.5"/><line x1="20" y1="38" x2="80" y2="38" stroke="var(--pink)" stroke-width="1.5"/><line x1="32" y1="75" x2="68" y2="75" stroke="var(--pink)" stroke-width="1.5"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="50" y1="10" x2="50" y2="90" stroke="var(--pink)" stroke-width="1.5"/><line x1="15" y1="30" x2="85" y2="70" stroke="var(--pink)" stroke-width="1.5"/><line x1="15" y1="70" x2="85" y2="30" stroke="var(--pink)" stroke-width="1.5"/><line x1="15" y1="50" x2="85" y2="50" stroke="var(--pink)" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="50" y1="10" x2="50" y2="90" stroke="var(--pink)" stroke-width="1.5"/><line x1="15" y1="50" x2="85" y2="50" stroke="var(--pink)" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><polygon points="50,15 85,75 15,75" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="50" y1="15" x2="50" y2="75" stroke="var(--pink)" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--pink)" stroke-width="2.5"/><line x1="50" y1="10" x2="50" y2="90" stroke="var(--pink)" stroke-width="1.5"/></svg>`
        ],
        answer: 0,
        explanation: "The bounding shape increases sides by 1 (Triangle ➔ Square ➔ Pentagon ➔ Hexagon), while internal intersecting helper lines increase from 1 ➔ 2 ➔ 3 ➔ 4."
      },
      {
        text: "Track the movement of both indicators on the 2x2 grid.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="30" cy="30" r="10" fill="var(--amber)"/><rect x="62" y="62" width="16" height="16" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="70" cy="30" r="10" fill="var(--amber)"/><rect x="62" y="22" width="16" height="16" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="70" cy="70" r="10" fill="var(--amber)"/><rect x="22" y="22" width="16" height="16" fill="var(--cyan)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="30" cy="70" r="10" fill="var(--amber)"/><rect x="22" y="62" width="16" height="16" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="30" cy="30" r="10" fill="var(--amber)"/><rect x="62" y="62" width="16" height="16" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="70" cy="30" r="10" fill="var(--amber)"/><rect x="22" y="62" width="16" height="16" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1"/><line x1="50" y1="10" x2="50" y2="90" stroke="white" stroke-width="1"/><line x1="10" y1="50" x2="90" y2="50" stroke="white" stroke-width="1"/><circle cx="30" cy="70" r="10" fill="var(--amber)"/><rect x="62" y="22" width="16" height="16" fill="var(--cyan)"/></svg>`
        ],
        answer: 0,
        explanation: "The amber circle moves clockwise around the grid quadrants (Top-Left ➔ Top-Right ➔ Bottom-Right ➔ Bottom-Left). The cyan square moves counterclockwise (Bottom-Right ➔ Top-Right ➔ Top-Left ➔ Bottom-Left)."
      },
      {
        text: "Determine the logical intersection rule (Venn diagram shading).",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="40" cy="50" r="22" fill="var(--violet-l)" opacity="0.85" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="40" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="var(--violet-l)" opacity="0.85" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><mask id="overlap"><circle cx="40" cy="50" r="22" fill="white"/><circle cx="60" cy="50" r="22" fill="white"/></mask><circle cx="40" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/><path d="M 50 28 A 22 22 0 0 1 60 50 A 22 22 0 0 1 50 72 A 22 22 0 0 1 40 50 A 22 22 0 0 1 50 28 Z" fill="var(--violet-l)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="40" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="40" cy="50" r="22" fill="var(--violet-l)" opacity="0.85" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="var(--violet-l)" opacity="0.85" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="40" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="var(--violet-l)" opacity="0.85" stroke="white" stroke-width="1.5"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><circle cx="40" cy="50" r="22" fill="var(--red)" opacity="0.85" stroke="white" stroke-width="1.5"/><circle cx="60" cy="50" r="22" fill="none" stroke="white" stroke-width="1.5"/></svg>`
        ],
        answer: 0,
        explanation: "The shaded region shifts sequentially: Left Circle ➔ Right Circle ➔ Intersection Only ➔ None (both empty)."
      },
      {
        text: "Analyze the vector addition logic of the arrow indicators.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="20" y1="50" x2="80" y2="50" stroke="var(--cyan)" stroke-width="4" marker-end="url(#arrow)"/><path d="M72 40 L85 50 L72 60 Z" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="50" y1="80" x2="50" y2="20" stroke="var(--cyan)" stroke-width="4"/><path d="M40 28 L50 15 L60 28 Z" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="25" y1="75" x2="75" y2="25" stroke="var(--cyan)" stroke-width="4"/><path d="M62 22 L78 22 L78 38 Z" fill="var(--cyan)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="80" y1="50" x2="20" y2="50" stroke="var(--cyan)" stroke-width="4"/><path d="M28 40 L15 50 L28 60 Z" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="20" y1="50" x2="80" y2="50" stroke="var(--cyan)" stroke-width="4"/><path d="M72 40 L85 50 L72 60 Z" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="50" y1="20" x2="50" y2="80" stroke="var(--cyan)" stroke-width="4"/><path d="M40 72 L50 85 L60 72 Z" fill="var(--cyan)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><line x1="25" y1="25" x2="75" y2="75" stroke="var(--cyan)" stroke-width="4"/><path d="M62 78 L78 78 L78 62 Z" fill="var(--cyan)"/></svg>`
        ],
        answer: 0,
        explanation: "Step 1 points East (1, 0). Step 2 points North (0, 1). Step 3 is the sum vector pointing North-East (1, 1). Step 4 should continue the sequence by repeating or flipping directions, where the only logical next step matches the negative primary axis West (-1, 0)."
      },
      {
        text: "Determine the rule governing the grid-based dot coordinates.",
        sequence: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="25" cy="25" r="8" fill="var(--pink)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="50" cy="50" r="8" fill="var(--pink)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="75" cy="75" r="8" fill="var(--pink)"/></svg>`,
          `<div class="vi-missing">?</div>`
        ],
        options: [
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="25" cy="75" r="8" fill="var(--pink)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="25" cy="25" r="8" fill="var(--pink)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="75" cy="25" r="8" fill="var(--pink)"/></svg>`,
          `<svg viewBox="0 0 100 100" class="vi-svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="white" stroke-width="1.5"/><circle cx="50" cy="25" r="8" fill="var(--pink)"/></svg>`
        ],
        answer: 0,
        explanation: "The dot slides diagonally along the primary diagonal (Top-Left ➔ Center ➔ Bottom-Right), and upon hitting the corner it rebounds along the counter-diagonal starting at Bottom-Left (25, 75)."
      }
    ];
  }

  start() {
    this.el = document.createElement('div');
    this.el.className = 'shl-ind-game';
    this.container.appendChild(this.el);
    this._showQuestion();
  }

  _showQuestion() {
    if (this.qIndex >= this.questions.length) {
      this._finish();
      return;
    }

    this.hasAnswered = false;
    const q = this.questions[this.qIndex];
    this._render(q);
  }

  _render(q) {
    if (!this.el) return;

    this.el.innerHTML = `
      <div class="shl-header">
        <div class="shl-stat"><span class="shl-l">Pattern</span><span class="shl-v" style="color:var(--violet-l)">${this.qIndex + 1}/${this.questions.length}</span></div>
        <div class="shl-stat"><span class="shl-l">Score</span><span class="shl-v" style="color:var(--amber)">${this.score}</span></div>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${(this.qIndex) / this.questions.length * 100}%"></div></div>
      
      <div class="vi-workspace">
        <div class="vi-question-instruction">${q.text}</div>
        
        <div class="vi-sequence-row">
          ${q.sequence.map((svg, i) => `
            <div class="vi-sequence-card">
              ${svg}
              <div class="vi-step-label">Step ${i + 1}</div>
            </div>
          `).join('')}
        </div>
        
        <div class="vi-choices-label">Choose the matching option:</div>
        <div class="vi-choices-grid" id="vi-choices">
          ${q.options.map((opt, idx) => `
            <button class="vi-choice-card" data-idx="${idx}">
              <div class="vi-choice-letter">${String.fromCharCode(65 + idx)}</div>
              <div class="vi-choice-shape">${opt}</div>
            </button>
          `).join('')}
        </div>
        
        <div class="shl-explanation" id="vi-explanation" style="display:none;margin-top:20px;padding:15px;background:rgba(255,255,255,0.03);border-radius:8px"></div>
      </div>
      
      <div class="shl-footer" style="display:none;margin-top:20px" id="vi-next-panel">
        <button class="btn btn-primary" id="vi-next-btn">Next Pattern ➔</button>
      </div>`;

    this.el.querySelectorAll('.vi-choice-card').forEach(btn => {
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

    const q = this.questions[this.qIndex];
    const isCorrect = (choiceIdx === q.answer);

    // Highlight choices
    const btns = this.el.querySelectorAll('.vi-choice-card');
    btns.forEach(btn => {
      const idx = parseInt(btn.dataset.idx);
      if (idx === q.answer) {
        btn.classList.add('vi-correct');
      } else if (idx === choiceIdx && !isCorrect) {
        btn.classList.add('vi-wrong');
      }
    });

    if (isCorrect) {
      this.correct++;
      const pts = 250;
      this.score += pts;
      this.cb.onScore(pts, this.qIndex + 1);
      this.cb.onFeedback(true);
    } else {
      this.cb.onFeedback(false);
    }

    // Display explanation
    const exp = this.el.querySelector('#vi-explanation');
    if (exp) {
      exp.innerHTML = `
        <strong style="color:${isCorrect ? '#10b981' : '#ef4444'}">${isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}</strong>
        <p style="margin-top:6px;font-size:0.8rem;color:var(--muted);line-height:1.5">${q.explanation}</p>`;
      exp.style.display = 'block';
    }

    const footer = this.el.querySelector('#vi-next-panel');
    if (footer) {
      footer.style.display = 'flex';
      footer.querySelector('#vi-next-btn').onclick = () => {
        this.qIndex++;
        this._showQuestion();
      };
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

  timeUp() {
    this._finish();
  }

  destroy() {
    this.el = null;
  }
}

window.VerifyInductiveGame = VerifyInductiveGame;
