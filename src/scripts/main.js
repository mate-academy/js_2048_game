/* eslint-disable no-shadow */
/* eslint-disable max-len */
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const N = 4;
const MAX_USES = 3;
const MOVE_MS = 110; // must match --move-ms in SCSS
const BEST_KEY = '2048_best';

const TILE_COLORS = {
  2: { bg: '#eee4da', fg: '#776e65' },
  4: { bg: '#ede0c8', fg: '#776e65' },
  8: { bg: '#f2b179', fg: '#f9f6f2' },
  16: { bg: '#f59563', fg: '#f9f6f2' },
  32: { bg: '#f67c5f', fg: '#f9f6f2' },
  64: { bg: '#f65e3b', fg: '#f9f6f2' },
  128: { bg: '#edcf72', fg: '#f9f6f2' },
  256: { bg: '#edcc61', fg: '#f9f6f2' },
  512: { bg: '#edc850', fg: '#f9f6f2' },
  1024: { bg: '#edc53f', fg: '#f9f6f2' },
  2048: { bg: '#edc22e', fg: '#f9f6f2' },
};
const tileColor = (v) => TILE_COLORS[v] ?? { bg: '#3c3a32', fg: '#f9f6f2' };

// ─────────────────────────────────────────────────────────────────────────────
// Tile identity — each tile gets a unique numeric ID at birth.
// That ID is used as the DOM element's data-id attribute so we can look it up
// and update left/top in-place, letting CSS transition actually fire.
// ─────────────────────────────────────────────────────────────────────────────
let _uid = 1;
const uid = () => _uid++;

// ─────────────────────────────────────────────────────────────────────────────
// Board model
// A cell is either null or { id, value, isNew, isMerge }
// ─────────────────────────────────────────────────────────────────────────────
function emptyBoard() {
  return Array.from({ length: N }, () => Array(N).fill(null));
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function addRandomTile(board) {
  const empties = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!board[r][c]) {
        empties.push([r, c]);
      }
    }
  }

  if (!empties.length) {
    return board;
  }

  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const next = cloneBoard(board);

  next[r][c] = {
    id: uid(),
    value: Math.random() < 0.9 ? 2 : 4,
    isNew: true,
    isMerge: false,
  };

  return next;
}

// Slide one row leftward; returns { row, scoreGain, moved }
function slideRow(row) {
  const cells = row.filter(Boolean);
  const out = [];
  let score = 0;
  let i = 0;

  while (i < cells.length) {
    if (i + 1 < cells.length && cells[i].value === cells[i + 1].value) {
      const val = cells[i].value * 2;

      score += val;

      // keep the first tile's id so that tile animates the merge bounce
      out.push({
        id: cells[i].id,
        value: val,
        isNew: false,
        isMerge: true,
      });
      i += 2;
    } else {
      out.push({ ...cells[i], isNew: false, isMerge: false });
      i++;
    }
  }

  while (out.length < N) {
    out.push(null);
  }

  const moved = out.some((cell, j) => {
    const orig = row[j];

    if (!cell && orig) {
      return true;
    }

    if (cell && !orig) {
      return true;
    }

    if (cell && orig && cell.id !== orig.id) {
      return true;
    }

    return false;
  });

  return { row: out, score, moved };
}

function applyMove(board, dir) {
  let totalScore = 0;
  let anyMoved = false;
  const next = cloneBoard(board);

  const processLine = (getLine, setLine) => {
    for (let i = 0; i < N; i++) {
      const line = getLine(next, i);
      const { row: slid, score, moved } = slideRow(line);

      totalScore += score;

      if (moved) {
        anyMoved = true;
      }

      setLine(next, i, slid);
    }
  };

  switch (dir) {
    case 'left':
      processLine(
        (b, i) => b[i],
        (b, i, r) => {
          b[i] = r;
        },
      );
      break;

    case 'right':
      processLine(
        (b, i) => [...b[i]].reverse(),
        (b, i, r) => {
          b[i] = [...r].reverse();
        },
      );
      break;

    case 'up':
      processLine(
        (b, i) => b.map((row) => row[i]),
        (b, i, r) =>
          r.forEach((v, j) => {
            b[j][i] = v;
          }),
      );
      break;

    case 'down':
      processLine(
        (b, i) => [...b.map((row) => row[i])].reverse(),
        (b, i, r) =>
          [...r].reverse().forEach((v, j) => {
            b[j][i] = v;
          }),
      );
      break;

    default:
      break;
  }

  return { board: next, score: totalScore, moved: anyMoved };
}

function checkWin(board) {
  return board.some((row) => row.some((cell) => cell && cell.value >= 2048));
}

function checkLose(board) {
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (!board[r][c]) {
        return false;
      }

      if (c + 1 < N && board[r][c].value === board[r][c + 1]?.value) {
        return false;
      }

      if (r + 1 < N && board[r][c].value === board[r + 1][c]?.value) {
        return false;
      }
    }
  }

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tile pixel positions (must match SCSS: --tile-size + --gap)
// We read the computed CSS variables at runtime so responsive tweaks propagate.
// ─────────────────────────────────────────────────────────────────────────────
function getCSSVar(name) {
  return (
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(name),
    ) || 0
  );
}

function tilePos(col, row) {
  const size = getCSSVar('--tile-size') || 78;
  const gap = getCSSVar('--gap') || 12;

  return { x: gap + col * (size + gap), y: gap + row * (size + gap) };
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM helpers
// ─────────────────────────────────────────────────────────────────────────────
function $(sel) {
  return document.querySelector(sel);
}

function $$(sel) {
  return document.querySelectorAll(sel);
}

// ─────────────────────────────────────────────────────────────────────────────
// Score persistence
// ─────────────────────────────────────────────────────────────────────────────
function getBest() {
  try {
    return +localStorage.getItem(BEST_KEY) || 0;
  } catch {
    return 0;
  }
}

function saveBest(s) {
  try {
    if (s > getBest()) {
      localStorage.setItem(BEST_KEY, String(s));
    }
  } catch (_e) {
    /* storage unavailable */
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Game state
// ─────────────────────────────────────────────────────────────────────────────
let board = emptyBoard();
let score = 0;
let best = getBest();
let gameStatus = 'idle'; // 'idle' | 'playing' | 'won' | 'lost'
let history = [];
let abilities = { undo: MAX_USES, delete: MAX_USES, shuffle: MAX_USES };
let moveLock = false; // prevent input during animation

// ─────────────────────────────────────────────────────────────────────────────
// Tile DOM registry
// Maps tile id → <div.tile> element.
// Because we reuse the same element, changing its left/top triggers CSS transition.
// ─────────────────────────────────────────────────────────────────────────────
const tileEls = new Map();

function getTileEl(id) {
  return tileEls.get(id) ?? null;
}

function createTileEl(tile, container) {
  const el = document.createElement('div');

  el.dataset.tileId = tile.id;
  applyTileStyle(el, tile);
  container.appendChild(el);
  tileEls.set(tile.id, el);

  return el;
}

function applyTileStyle(el, tile) {
  const { x, y } = tilePos(tile.col, tile.row);
  const { bg, fg } = tileColor(tile.value);
  const size = getCSSVar('--tile-size') || 78;

  el.className = 'tile';

  if (tile.value >= 1024) {
    el.classList.add('tile--tiny');
  } else if (tile.value >= 128) {
    el.classList.add('tile--small');
  }

  if (tile.isNew) {
    el.classList.add('tile--spawn');
  }

  if (tile.isMerge) {
    el.classList.add('tile--merge');
  }

  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.background = bg;
  el.style.color = fg;
  el.textContent = String(tile.value);
}

// Move a tile element to new position (triggers CSS transition).
function moveTileEl(el, col, row) {
  const { x, y } = tilePos(col, row);

  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
}

function removeTileEl(id) {
  const el = tileEls.get(id);

  if (el) {
    el.remove();
    tileEls.delete(id);
  }
}

function flatTiles(b) {
  const result = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (b[r][c]) {
        result.push({ ...b[r][c], row: r, col: c });
      }
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Render
// Two-phase render so slide animation plays before new tile pops in.
// Phase 1: update positions of existing tiles, remove vanished ones.
// Phase 2 (after MOVE_MS): create new tile with spawn animation.
// ─────────────────────────────────────────────────────────────────────────────
function renderSlide(nextBoard) {
  const container = $('#boardTiles');
  const nextTiles = flatTiles(nextBoard);
  const nextIds = new Set(nextTiles.map((t) => t.id));

  // Remove tiles that disappeared (merged away)
  for (const [id] of tileEls) {
    if (!nextIds.has(id)) {
      removeTileEl(id);
    }
  }

  // Move or create
  for (const tile of nextTiles) {
    if (tile.isNew) {
      continue; // defer new tiles to phase 2
    }

    const el = getTileEl(tile.id);

    if (el) {
      // Existing tile: just move it (CSS transition fires)
      moveTileEl(el, tile.col, tile.row);

      // Re-apply color/value in case of merge
      const { bg, fg } = tileColor(tile.value);

      el.style.background = bg;
      el.style.color = fg;
      el.textContent = String(tile.value);

      // Reset animation classes, then apply merge if needed
      el.classList.remove(
        'tile--spawn',
        'tile--merge',
        'tile--small',
        'tile--tiny',
      );

      if (tile.value >= 1024) {
        el.classList.add('tile--tiny');
      } else if (tile.value >= 128) {
        el.classList.add('tile--small');
      }

      if (tile.isMerge) {
        // force reflow so the animation restarts
        void el.offsetWidth;
        el.classList.add('tile--merge');
      }
    } else {
      createTileEl(tile, container);
    }
  }
}

function renderSpawn(nextBoard) {
  const container = $('#boardTiles');

  for (const tile of flatTiles(nextBoard)) {
    if (!tile.isNew) {
      continue;
    }

    createTileEl(tile, container);
  }
}

function renderScores() {
  $('#score').textContent = String(score);
  $('#best').textContent = String(best);
}

// ─────────────────────────────────────────────────────────────────────────────
// Build static grid cells (background squares)
// ─────────────────────────────────────────────────────────────────────────────
function buildGrid() {
  const grid = $('#boardGrid');

  grid.innerHTML = '';

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cell = document.createElement('div');

      cell.className = 'board__grid-cell';

      const { x, y } = tilePos(c, r);

      cell.style.left = `${x}px`;
      cell.style.top = `${y}px`;
      grid.appendChild(cell);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Status messages
// ─────────────────────────────────────────────────────────────────────────────
function showMessage(which) {
  $('#msgIdle').classList.add('hidden');
  $('#msgWin').classList.add('hidden');
  $('#msgLose').classList.add('hidden');

  if (which) {
    $('#' + which).classList.remove('hidden');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Powerup UI
// ─────────────────────────────────────────────────────────────────────────────
function updatePowerupUI() {
  for (const key of ['undo', 'delete', 'shuffle']) {
    const rem = abilities[key];
    const btn = $(`.powerup[data-powerup="${key}"]`);
    const pipsEl = $(`.powerup__pips[data-powerup="${key}"]`);
    const usesEl = $(`.tip-uses[data-powerup="${key}"]`);
    const active = gameStatus === 'playing';

    btn.disabled = !active || rem <= 0;

    // Pips
    pipsEl.innerHTML = '';

    for (let i = 0; i < MAX_USES; i++) {
      const pip = document.createElement('span');

      pip.className = 'pip' + (i < rem ? ' on' : '');
      pipsEl.appendChild(pip);
    }

    if (usesEl) {
      usesEl.textContent = `${rem}/${MAX_USES} left`;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// New game
// ─────────────────────────────────────────────────────────────────────────────
function startGame() {
  board = addRandomTile(addRandomTile(emptyBoard()));
  score = 0;
  gameStatus = 'playing';
  history = [];
  moveLock = false;
  abilities = { undo: MAX_USES, delete: MAX_USES, shuffle: MAX_USES };

  // Clear all tile DOM elements
  tileEls.forEach((el) => el.remove());
  tileEls.clear();

  // Draw all tiles immediately (no slide needed on game start)
  const container = $('#boardTiles');

  for (const tile of flatTiles(board)) {
    createTileEl(tile, container);
  }

  renderScores();
  updatePowerupUI();
  showMessage(null);

  $('#newGame').textContent = 'Restart';
}

// ─────────────────────────────────────────────────────────────────────────────
// Move
// ─────────────────────────────────────────────────────────────────────────────
function doMove(dir) {
  if (moveLock || gameStatus !== 'playing') {
    return;
  }

  const { board: next, score: gain, moved } = applyMove(board, dir);

  if (!moved) {
    return;
  }

  moveLock = true;

  // Snapshot for undo
  history.push({ board: cloneBoard(board), score });

  // Phase 1: slide existing tiles
  board = next;
  score += gain;
  best = Math.max(best, score);
  saveBest(score);
  renderScores();
  renderSlide(board);

  // Phase 2: spawn new tile after slide finishes
  setTimeout(() => {
    board = addRandomTile(board);
    renderSpawn(board);

    if (checkWin(board)) {
      setStatus('won');
    } else if (checkLose(board)) {
      setStatus('lost');
    }

    moveLock = false;
  }, MOVE_MS + 30);
}

function setStatus(s) {
  gameStatus = s;
  updatePowerupUI();

  if (s === 'won') {
    showMessage('msgWin');
  }

  if (s === 'lost') {
    showMessage('msgLose');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Powerup actions
// ─────────────────────────────────────────────────────────────────────────────
function doUndo() {
  if (!history.length || abilities.undo <= 0 || moveLock) {
    return;
  }

  const snap = history.pop();

  board = snap.board;
  score = snap.score;
  gameStatus = 'playing';
  abilities.undo--;

  tileEls.forEach((el) => el.remove());
  tileEls.clear();

  const container = $('#boardTiles');

  for (const tile of flatTiles(board)) {
    createTileEl(tile, container);
  }

  renderScores();
  updatePowerupUI();
  showMessage(null);
}

function doDelete() {
  if (abilities.delete <= 0 || gameStatus !== 'playing' || moveLock) {
    return;
  }

  const filled = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (board[r][c]) {
        filled.push([r, c]);
      }
    }
  }

  if (!filled.length) {
    return;
  }

  history.push({ board: cloneBoard(board), score });

  const [r, c] = filled[Math.floor(Math.random() * filled.length)];
  const id = board[r][c].id;

  board = cloneBoard(board);
  board[r][c] = null;
  abilities.delete--;

  removeTileEl(id);
  updatePowerupUI();
}

function doShuffle() {
  if (abilities.shuffle <= 0 || gameStatus !== 'playing' || moveLock) {
    return;
  }

  history.push({ board: cloneBoard(board), score });

  // Collect all tile values
  const vals = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (board[r][c]) {
        vals.push(board[r][c].value);
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = vals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [vals[i], vals[j]] = [vals[j], vals[i]];
  }

  // Rebuild board — give each tile a NEW id so they all pop-spawn
  const next = emptyBoard();
  let k = 0;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (k < vals.length) {
        next[r][c] = {
          id: uid(),
          value: vals[k++],
          isNew: true,
          isMerge: false,
        };
      }
    }
  }

  board = next;
  abilities.shuffle--;

  // Re-render all tiles
  tileEls.forEach((el) => el.remove());
  tileEls.clear();

  const container = $('#boardTiles');

  for (const tile of flatTiles(board)) {
    createTileEl(tile, container);
  }

  updatePowerupUI();
}

// ─────────────────────────────────────────────────────────────────────────────
// Menu
// ─────────────────────────────────────────────────────────────────────────────
function openMenu() {
  $('#menu').classList.add('open');
  $('#menu').setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  $('#menu').classList.remove('open');
  $('#menu').setAttribute('aria-hidden', 'true');
}

// ─────────────────────────────────────────────────────────────────────────────
// Tutorial
// ─────────────────────────────────────────────────────────────────────────────
const MINI_SZ = 46;
const MINI_GAP = 7;

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to 2048!',
    text: 'Your goal is to slide tiles on the board and merge them to create a tile with the number 2048.',
    tiles: [
      { r: 1, c: 1, v: 2 },
      { r: 3, c: 3, v: 4 },
      { r: 0, c: 3, v: 8 },
      { r: 2, c: 0, v: 16 },
    ],
    arrow: null,
  },
  {
    title: 'Slide with arrow keys',
    text: 'Press ← → ↑ ↓ (or swipe on mobile). Every tile slides as far as possible in that direction.',
    tiles: [
      { r: 1, c: 0, v: 4 },
      { r: 2, c: 1, v: 2 },
      { r: 0, c: 2, v: 8 },
    ],
    arrow: '→',
  },
  {
    title: 'Same numbers merge!',
    text: 'When two tiles with the same value collide they combine into one worth double. Your score increases by that value.',
    tiles: [
      { r: 1, c: 0, v: 4 },
      { r: 1, c: 3, v: 4 },
      { r: 3, c: 0, v: 16 },
      { r: 3, c: 3, v: 16 },
    ],
    arrow: 'merge',
  },
  {
    title: 'Plan your strategy',
    text: 'Keep your highest tile in a corner. Build a chain of halving values beside it. Think 2–3 moves ahead!',
    tiles: [
      { r: 0, c: 0, v: 512 },
      { r: 0, c: 1, v: 256 },
      { r: 0, c: 2, v: 128 },
      { r: 0, c: 3, v: 64 },
      { r: 1, c: 0, v: 32 },
      { r: 1, c: 1, v: 16 },
      { r: 1, c: 2, v: 8 },
      { r: 1, c: 3, v: 4 },
      { r: 2, c: 3, v: 2 },
    ],
    arrow: null,
  },
  {
    title: 'Use your powerups!',
    text: 'You get 3 uses each of Undo (revert last move), Delete (remove a random tile), and Shuffle (mix positions). Use them when stuck!',
    tiles: [
      { r: 0, c: 0, v: 1024 },
      { r: 0, c: 1, v: 512 },
      { r: 1, c: 0, v: 256 },
      { r: 3, c: 2, v: 4 },
      { r: 2, c: 3, v: 8 },
      { r: 3, c: 3, v: 2 },
    ],
    arrow: null,
  },
  {
    title: 'Reach 2048 to win!',
    text: "Merge your way to 2048. You can keep playing past that for a higher score. Good luck — you've got this!",
    tiles: [
      {
        r: 0,
        c: 0,
        v: 2048,
        glow: true,
      },
      { r: 0, c: 1, v: 512 },
      { r: 0, c: 2, v: 256 },
      { r: 1, c: 0, v: 128 },
      { r: 2, c: 1, v: 4 },
    ],
    arrow: null,
  },
];

let tutStep = 0;

function miniX(c) {
  return MINI_GAP + c * (MINI_SZ + MINI_GAP);
}

function miniY(r) {
  return MINI_GAP + r * (MINI_SZ + MINI_GAP);
}

function renderTutStep() {
  const step = TUTORIAL_STEPS[tutStep];

  // Counter
  $('#tutCounter').textContent = `${tutStep + 1}/${TUTORIAL_STEPS.length}`;

  // Mini board
  const mb = $('#miniBoard');

  mb.innerHTML = '';

  // Grid cells
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cell = document.createElement('div');

      cell.className = 'mini-board__cell';
      cell.style.left = `${miniX(c)}px`;
      cell.style.top = `${miniY(r)}px`;
      mb.appendChild(cell);
    }
  }

  // Tiles
  for (const t of step.tiles) {
    const { bg, fg } = tileColor(t.v);
    const el = document.createElement('div');

    el.className = 'mini-board__tile';
    el.style.left = `${miniX(t.c)}px`;
    el.style.top = `${miniY(t.r)}px`;
    el.style.background = bg;
    el.style.color = fg;
    el.style.fontSize = t.v >= 1024 ? '11px' : t.v >= 128 ? '13px' : '16px';

    if (t.glow) {
      el.style.animation = 'merge-glow 900ms ease-in-out infinite';
    }

    el.textContent = String(t.v);
    mb.appendChild(el);
  }

  // Arrow / merge label overlay
  if (step.arrow === '→') {
    const arr = document.createElement('div');

    arr.className = 'mini-board__arrow';
    arr.textContent = '→';
    mb.appendChild(arr);
  } else if (step.arrow === 'merge') {
    const wrap = document.createElement('div');

    wrap.className = 'mini-board__merge-label';

    const lbl = document.createElement('span');

    lbl.textContent = '4 + 4 → 8  ✦  16 + 16 → 32';
    wrap.appendChild(lbl);
    mb.appendChild(wrap);
  }

  // Text
  $('#tutStepTitle').textContent = step.title;
  $('#tutStepText').textContent = step.text;

  // Dots
  const dots = $('#tutDots');

  dots.innerHTML = '';

  TUTORIAL_STEPS.forEach((_, i) => {
    const dot = document.createElement('div');

    dot.className = 'dot' + (i === tutStep ? ' active' : '');

    dot.addEventListener('click', () => {
      tutStep = i;
      renderTutStep();
    });
    dots.appendChild(dot);
  });

  // Nav buttons
  const nav = $('#tutNav');

  nav.innerHTML = '';

  if (tutStep > 0) {
    const back = document.createElement('button');

    back.className = 'sec';
    back.textContent = '← Back';

    back.addEventListener('click', () => {
      tutStep--;
      renderTutStep();
    });
    nav.appendChild(back);
  }

  if (tutStep < TUTORIAL_STEPS.length - 1) {
    const next = document.createElement('button');

    next.className = 'pri';
    next.textContent = 'Next →';

    next.addEventListener('click', () => {
      tutStep++;
      renderTutStep();
    });
    nav.appendChild(next);
  } else {
    const play = document.createElement('button');

    play.className = 'pri';
    play.textContent = "Let's play! 🎮";

    play.addEventListener('click', () => {
      closeTutorial();
      startGame();
    });
    nav.appendChild(play);
  }
}

function openTutorial() {
  tutStep = 0;
  renderTutStep();
  $('#tutorial').classList.remove('hidden');
}

function closeTutorial() {
  $('#tutorial').classList.add('hidden');
}

// ─────────────────────────────────────────────────────────────────────────────
// Touch / swipe
// ─────────────────────────────────────────────────────────────────────────────
let touch0 = null;

function onTouchStart(e) {
  touch0 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}

function onTouchEnd(e) {
  if (!touch0) {
    return;
  }

  const dx = e.changedTouches[0].clientX - touch0.x;
  const dy = e.changedTouches[0].clientY - touch0.y;

  touch0 = null;

  if (Math.abs(dx) < 22 && Math.abs(dy) < 22) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    doMove(dx > 0 ? 'right' : 'left');
  } else {
    doMove(dy > 0 ? 'down' : 'up');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard
// ─────────────────────────────────────────────────────────────────────────────
const KEY_MAP = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

document.addEventListener('keydown', (e) => {
  // Overlay escape
  if (e.key === 'Escape') {
    closeMenu();
    closeTutorial();

    return;
  }

  // Shift → show tips
  if (e.key === 'Shift') {
    $('#powerups').classList.add('show-tips');

    return;
  }

  // Arrow keys → move
  const dir = KEY_MAP[e.key];

  if (dir) {
    e.preventDefault();
    doMove(dir);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift') {
    $('#powerups').classList.remove('show-tips');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Wire up all buttons
// ─────────────────────────────────────────────────────────────────────────────
function wireUI() {
  // Topbar
  $('#newGame').addEventListener('click', startGame);
  $('#menuOpen').addEventListener('click', openMenu);

  // Menu
  $('#menuClose').addEventListener('click', closeMenu);
  $('#menuBackdrop').addEventListener('click', closeMenu);

  $$('.menu-item[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      closeMenu();

      if (action === 'standard') {
        startGame();
      }

      if (action === 'tutorial') {
        openTutorial();
      }
    });
  });

  // Tutorial
  $('#tutClose').addEventListener('click', closeTutorial);

  // Close on backdrop click
  $('#tutorial').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeTutorial();
    }
  });

  // Msg tutorial link
  $('#msgTutLink')?.addEventListener('click', openTutorial);

  // Powerups
  $$('.powerup[data-powerup]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.powerup;

      if (key === 'undo') {
        doUndo();
      }

      if (key === 'delete') {
        doDelete();
      }

      if (key === 'shuffle') {
        doShuffle();
      }
    });
  });

  // Board swipe
  $('#board').addEventListener('touchstart', onTouchStart, { passive: true });
  $('#board').addEventListener('touchend', onTouchEnd, { passive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────
function init() {
  buildGrid();
  wireUI();

  // Show best score from storage
  $('#best').textContent = String(getBest());

  // Show idle message
  showMessage('msgIdle');
  updatePowerupUI();
}

window.addEventListener('DOMContentLoaded', init);
