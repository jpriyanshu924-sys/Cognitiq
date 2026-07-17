/* ══════════════════════════════════════════════════════
   Game 3: Pipe Puzzle
   Recruitment equivalent: TestPartnership MindmetriQ
   Measures: Spatial scanning, logical path tracing
══════════════════════════════════════════════════════ */

/* Pipe types: each cell has open sides (T=top,R=right,B=bottom,L=left)
   Types:
     'straight-h': R,L
     'straight-v': T,B
     'bend-tr':    T,R
     'bend-rb':    R,B
     'bend-bl':    B,L
     'bend-lt':    L,T
     'tee-trb':    T,R,B
     'tee-rbl':    R,B,L
     'tee-blt':    B,L,T
     'tee-ltr':    L,T,R
     'cross':      T,R,B,L
*/

const PIPE_SIDES = {
  'straight-h': ['R','L'],
  'straight-v': ['T','B'],
  'bend-tr':    ['T','R'],
  'bend-rb':    ['R','B'],
  'bend-bl':    ['B','L'],
  'bend-lt':    ['L','T'],
  'tee-trb':    ['T','R','B'],
  'tee-rbl':    ['R','B','L'],
  'tee-blt':    ['B','L','T'],
  'tee-ltr':    ['L','T','R'],
  'cross':      ['T','R','B','L'],
  'end-t':      ['T'],
  'end-r':      ['R'],
  'end-b':      ['B'],
  'end-l':      ['L'],
};

function rotatePipe(type) {
  const map = {
    'straight-h':'straight-v','straight-v':'straight-h',
    'bend-tr':'bend-rb','bend-rb':'bend-bl','bend-bl':'bend-lt','bend-lt':'bend-tr',
    'tee-trb':'tee-rbl','tee-rbl':'tee-blt','tee-blt':'tee-ltr','tee-ltr':'tee-trb',
    'cross':'cross',
    'end-t':'end-r','end-r':'end-b','end-b':'end-l','end-l':'end-t',
  };
  return map[type] || type;
}

function hasSide(type, side) { return (PIPE_SIDES[type]||[]).includes(side); }

const OPPOSITE = {T:'B',B:'T',L:'R',R:'L'};

class PipePuzzleGame {
  constructor(container, cb) {
    this.container=container; this.cb=cb;
    this.score=0; this.level=1; this.puzzlesSolved=0;
    this.el=null; this.grid=null; this.rows=0; this.cols=0;
    this.src=null; this.sink=null;
  }

  start() {
    this.el=document.createElement('div');
    this.el.className='pp-game';
    this.container.appendChild(this.el);
    this._newPuzzle();
  }

  _newPuzzle() {
    // Grid size scales with level
    const size = this.level<=1?4:this.level<=2?5:6;
    this.rows=size; this.cols=size;
    this._buildGrid(size,size);
    this._render();
  }

  _buildGrid(rows,cols) {
    // 1) Create a solved path first (BFS tree from src to sink)
    this.grid=Array.from({length:rows},()=>Array(cols).fill(null));
    this.src  = {r:0, c:0};
    this.sink = {r:rows-1, c:cols-1};

    // Build a random path from src to sink using a simple random walk
    const path = this._randomPath(rows,cols);
    this._placePipes(path,rows,cols);

    // Scramble: randomly rotate each cell
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      const rots=Math.floor(Math.random()*4);
      for(let i=0;i<rots;i++) this.grid[r][c]=rotatePipe(this.grid[r][c]);
    }
  }

  _randomPath(rows,cols) {
    const path=[{r:0,c:0}];
    const visited=new Set(['0,0']);
    let cur={r:0,c:0};
    const target={r:rows-1,c:cols-1};

    while(cur.r!==target.r||cur.c!==target.c) {
      const dirs=[];
      // Bias toward target
      if(cur.r<target.r) dirs.push({r:cur.r+1,c:cur.c},{r:cur.r+1,c:cur.c});
      if(cur.c<target.c) dirs.push({r:cur.r,c:cur.c+1},{r:cur.r,c:cur.c+1});
      if(cur.r>0) dirs.push({r:cur.r-1,c:cur.c});
      if(cur.c>0) dirs.push({r:cur.r,c:cur.c-1});

      const valid=dirs.filter(d=>d.r>=0&&d.r<rows&&d.c>=0&&d.c<cols&&!visited.has(`${d.r},${d.c}`));
      if(!valid.length) break;
      const next=valid[Math.floor(Math.random()*valid.length)];
      path.push(next);
      visited.add(`${next.r},${next.c}`);
      cur=next;

      if(path.length>rows*cols*2) break; // safety
    }
    // Force end at sink
    if(cur.r!==target.r||cur.c!==target.c) path.push(target);
    return path;
  }

  _placePipes(path,rows,cols) {
    // Fill path cells with correct pipe types
    const get=(r,c)=>({r,c});

    // Mark path cells
    const pathSet=new Set(path.map(p=>`${p.r},${p.c}`));

    // For each path cell, determine open sides from neighbors in path
    path.forEach((cell,i) => {
      const {r,c}=cell;
      const openSides=[];
      if(i>0){
        const prev=path[i-1];
        if(prev.r<r) openSides.push('T');
        else if(prev.r>r) openSides.push('B');
        else if(prev.c<c) openSides.push('L');
        else openSides.push('R');
      }
      if(i<path.length-1){
        const next=path[i+1];
        if(next.r<r) openSides.push('T');
        else if(next.r>r) openSides.push('B');
        else if(next.c<c) openSides.push('L');
        else openSides.push('R');
      }

      // Find pipe type matching open sides
      let pType=null;
      for(const[type,sides] of Object.entries(PIPE_SIDES)){
        const s=new Set(sides);
        if(s.size===openSides.length && openSides.every(x=>s.has(x))){
          pType=type; break;
        }
      }
      this.grid[r][c] = pType || 'cross';
    });

    // Fill non-path cells with random non-connecting pipes
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
      if(!this.grid[r][c]) {
        const decoys=['straight-h','straight-v','bend-tr','bend-rb','bend-bl','bend-lt'];
        this.grid[r][c]=decoys[Math.floor(Math.random()*decoys.length)];
      }
    }
  }

  _render() {
    if(!this.el) return;
    const CS=this.level<=1?68:this.level<=2?58:50;
    this.el.innerHTML=`
      <div class="pp-info">Level ${this.level} · Puzzle ${this.puzzlesSolved+1} · Solved: ${this.puzzlesSolved}</div>
      <div class="pp-grid" id="pp-grid" style="grid-template-columns:repeat(${this.cols},${CS}px)"></div>
      <div class="pp-status" id="pp-status">Connect 🔵 START → 🔴 END by clicking to rotate pipes</div>`;

    const grid=this.el.querySelector('#pp-grid');

    for(let r=0;r<this.rows;r++) for(let c=0;c<this.cols;c++) {
      const cell=document.createElement('div');
      cell.className='pp-cell';
      cell.style.width=cell.style.height=CS+'px';

      const cvs=document.createElement('canvas');
      cvs.width=CS; cvs.height=CS;
      this._drawPipe(cvs.getContext('2d'),this.grid[r][c],CS,r,c);
      cell.appendChild(cvs);

      cell.addEventListener('click',()=>{
        this.grid[r][c]=rotatePipe(this.grid[r][c]);
        this._drawPipe(cvs.getContext('2d'),this.grid[r][c],CS,r,c);
        this._check();
      });
      grid.appendChild(cell);
    }
  }

  _drawPipe(ctx, type, CS, r, c) {
    const cx=CS/2, cy=CS/2, hw=CS*0.12; // half-width of pipe
    ctx.clearRect(0,0,CS,CS);

    const isSrc  = r===this.src.r  && c===this.src.c;
    const isSink = r===this.sink.r && c===this.sink.c;

    // Background
    if(isSrc)  { ctx.fillStyle='rgba(6,182,212,.18)';  ctx.fillRect(0,0,CS,CS); }
    if(isSink) { ctx.fillStyle='rgba(239,68,68,.18)';   ctx.fillRect(0,0,CS,CS); }

    const connected=this._isConnected();
    const pipeColor = connected ? '#10b981' : (isSrc?'#06b6d4':isSink?'#ef4444':'#7c3aed');
    const bgColor   = connected ? 'rgba(16,185,129,.15)' : 'rgba(124,58,237,.1)';

    // Pipe center hub
    ctx.fillStyle=bgColor;
    ctx.beginPath();
    ctx.arc(cx,cy,hw*1.2,0,2*Math.PI);
    ctx.fill();

    // Pipe segments
    ctx.fillStyle=pipeColor;
    ctx.shadowColor=pipeColor;
    ctx.shadowBlur=6;

    const sides=PIPE_SIDES[type]||[];
    if(sides.includes('T')) ctx.fillRect(cx-hw, 0, hw*2, cy+hw);
    if(sides.includes('B')) ctx.fillRect(cx-hw, cy-hw, hw*2, CS-(cy-hw));
    if(sides.includes('L')) ctx.fillRect(0, cy-hw, cx+hw, hw*2);
    if(sides.includes('R')) ctx.fillRect(cx-hw, cy-hw, CS-(cx-hw), hw*2);

    ctx.shadowBlur=0;

    // Hub
    ctx.fillStyle=pipeColor;
    ctx.beginPath(); ctx.arc(cx,cy,hw*1.1,0,2*Math.PI); ctx.fill();

    // Src / Sink labels
    if(isSrc) {
      ctx.fillStyle='#fff'; ctx.font=`bold ${CS*0.22}px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.fillText('S',cx,CS-2);
    }
    if(isSink) {
      ctx.fillStyle='#fff'; ctx.font=`bold ${CS*0.22}px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='bottom';
      ctx.fillText('E',cx,CS-2);
    }
  }

  _isConnected() {
    // BFS from src following pipe connections
    const visited=new Set();
    const queue=[this.src];
    visited.add(`${this.src.r},${this.src.c}`);

    while(queue.length){
      const {r,c}=queue.shift();
      if(r===this.sink.r && c===this.sink.c) return true;
      const cur=this.grid[r][c];

      const neighbors=[
        {nr:r-1,nc:c,from:'B',to:'T'},
        {nr:r+1,nc:c,from:'T',to:'B'},
        {nr:r,nc:c-1,from:'R',to:'L'},
        {nr:r,nc:c+1,from:'L',to:'R'},
      ];

      neighbors.forEach(({nr,nc,from,to})=>{
        if(nr<0||nr>=this.rows||nc<0||nc>=this.cols) return;
        if(visited.has(`${nr},${nc}`)) return;
        if(!hasSide(cur,to)) return;          // current cell opens toward neighbor
        if(!hasSide(this.grid[nr][nc],from)) return; // neighbor opens back
        visited.add(`${nr},${nc}`);
        queue.push({r:nr,c:nc});
      });
    }
    return false;
  }

  _check() {
    if(!this._isConnected()) return;

    // Solved!
    this.puzzlesSolved++;
    const pts=200+this.level*100;
    this.score+=pts;
    this.cb.onScore(pts, this.puzzlesSolved);
    this.cb.onFeedback(true);

    const statusEl=document.getElementById('pp-status');
    if(statusEl){statusEl.textContent='✅ Connected! Loading next puzzle…'; statusEl.className='pp-status done';}

    // Re-draw all cells green
    const CS=this.level<=1?68:this.level<=2?58:50;
    const cells=document.querySelectorAll('.pp-cell canvas');
    cells.forEach((cvs,i)=>{
      const r=Math.floor(i/this.cols), c=i%this.cols;
      this._drawPipe(cvs.getContext('2d'),this.grid[r][c],CS,r,c);
    });

    if(this.puzzlesSolved%2===0) this.level=Math.min(3,this.level+1);
    setTimeout(()=>this._newPuzzle(), 1400);
  }

  timeUp() {
    this.cb.onEnd({
      score:this.score, accuracy:100, avgTime:0,
      correct:this.puzzlesSolved, total:this.puzzlesSolved+1, level:this.level
    });
  }

  destroy() { this.el=null; }
}

window.PipePuzzleGame = PipePuzzleGame;
