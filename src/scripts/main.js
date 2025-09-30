'use strict';

/* global Game */

const $cells = Array.from(document.querySelectorAll('.field-row .field-cell'));
const $score = document.querySelector('.game-score');
const $btn = document.querySelector('.button');
const $msgStart = document.querySelector('.message-start');
const $msgWin = document.querySelector('.message-win');
const $msgLose = document.querySelector('.message-lose');
const $field = document.querySelector('.game-field');

const IS_TEST = typeof window !== 'undefined' && !!window.Cypress;

const game = new Game(
  typeof window !== 'undefined' ? window.initialState : undefined,
);
let prevState = game.getState().map((r) => r.slice());
let isAnimating = false;

const animLayer = document.createElement('div');

animLayer.className = 'anim-layer';
$field.appendChild(animLayer);

const cellAt = (r, c) => $cells[r * 4 + c];

function renderBoard(state) {
  let i = 0;

  for (const row of state) {
    for (const value of row) {
      const cell = $cells[i++];

      cell.textContent = value ? String(value) : '';

      Array.from(cell.classList)
        .filter(
          (cls) =>
            cls.startsWith('field-cell--') || cls === 'spawn' || cls === 'bump',
        )
        .forEach((cls) => cell.classList.remove(cls));

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function renderScore(score) {
  $score.textContent = String(score);
}

function renderMessages(gameStatus) {
  $msgStart.classList.add('hidden');
  $msgWin.classList.toggle('hidden', gameStatus !== 'win');
  $msgLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function animateChanges(prev, next) {
  if (IS_TEST) {
    return;
  }

  let idx = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const was = prev[r][c];
      const now = next[r][c];
      const cell = $cells[idx++];

      if (was === 0 && now > 0) {
        cell.classList.remove('spawn');
        cell.getBoundingClientRect();
        cell.classList.add('spawn');

        cell.addEventListener(
          'animationend',
          () => cell.classList.remove('spawn'),
          { once: true },
        );
      } else if (was > 0 && now > was) {
        cell.classList.remove('bump');
        cell.getBoundingClientRect();
        cell.classList.add('bump');

        cell.addEventListener(
          'animationend',
          () => cell.classList.remove('bump'),
          { once: true },
        );
      }
    }
  }
}

function renderAll() {
  const next = game.getState();

  renderBoard(next);
  renderScore(game.getScore());
  renderMessages(game.getStatus());

  const idle = game.getStatus() === 'idle';

  $btn.textContent = idle ? 'Start' : 'Restart';
  $btn.classList.toggle('start', idle);
  $btn.classList.toggle('restart', !idle);
  animateChanges(prevState, next);
  prevState = next.map((r) => r.slice());
}

function compressRowWithMappingLeft(row, r) {
  const src = [];

  for (let c = 0; c < 4; c++) {
    if (row[c] !== 0) {
      src.push({ val: row[c], c });
    }
  }

  const moves = [];
  let dest = 0;

  for (let i = 0; i < src.length; i++) {
    if (i + 1 < src.length && src[i].val === src[i + 1].val) {
      moves.push({
        fromR: r,
        fromC: src[i].c,
        toR: r,
        toC: dest,
        value: src[i].val,
      });

      moves.push({
        fromR: r,
        fromC: src[i + 1].c,
        toR: r,
        toC: dest,
        value: src[i + 1].val,
      });
      dest++;
      i++;
    } else {
      moves.push({
        fromR: r,
        fromC: src[i].c,
        toR: r,
        toC: dest,
        value: src[i].val,
      });
      dest++;
    }
  }

  return moves;
}

function planMoves(prev, dir) {
  const moves = [];

  if (dir === 'left') {
    for (let r = 0; r < 4; r++) {
      moves.push(...compressRowWithMappingLeft(prev[r], r));
    }
  } else if (dir === 'right') {
    for (let r = 0; r < 4; r++) {
      const rev = [...prev[r]].reverse();
      const m = compressRowWithMappingLeft(rev, r);

      for (const mv of m) {
        mv.toC = 3 - mv.toC;
        mv.fromC = 3 - mv.fromC;
      }
      moves.push(...m);
    }
  } else if (dir === 'up') {
    for (let c = 0; c < 4; c++) {
      const col = [prev[0][c], prev[1][c], prev[2][c], prev[3][c]];
      const m = compressRowWithMappingLeft(col, 0);

      for (const mv of m) {
        mv.fromR = mv.fromC;
        mv.fromC = c;
        mv.toR = mv.toC;
        mv.toC = c;
      }
      moves.push(...m);
    }
  } else if (dir === 'down') {
    for (let c = 0; c < 4; c++) {
      const col = [prev[3][c], prev[2][c], prev[1][c], prev[0][c]];
      const m = compressRowWithMappingLeft(col, 0);

      for (const mv of m) {
        const fr = mv.fromC;
        const tr = mv.toC;

        mv.fromR = 3 - fr;
        mv.fromC = c;
        mv.toR = 3 - tr;
        mv.toC = c;
      }
      moves.push(...m);
    }
  }

  return moves.filter((mv) => mv.fromR !== mv.toR || mv.fromC !== mv.toC);
}

function clearCellVisual(r, c) {
  const cell = cellAt(r, c);

  cell.textContent = '';

  Array.from(cell.classList)
    .filter(
      (cls) =>
        cls.startsWith('field-cell--') || cls === 'spawn' || cls === 'bump',
    )
    .forEach((cls) => cell.classList.remove(cls));
}

function playSlideAnimation(moves, done) {
  if (!moves.length) {
    done();

    return;
  }

  const fieldRect = $field.getBoundingClientRect();
  const ghosts = [];
  const seen = new Set();

  for (const mv of moves) {
    const k1 = `${mv.fromR}-${mv.fromC}`;
    const k2 = `${mv.toR}-${mv.toC}`;

    if (!seen.has(k1)) {
      clearCellVisual(mv.fromR, mv.fromC);
      seen.add(k1);
    }

    if (!seen.has(k2)) {
      clearCellVisual(mv.toR, mv.toC);
      seen.add(k2);
    }
  }

  for (const mv of moves) {
    const fromRect = cellAt(mv.fromR, mv.fromC).getBoundingClientRect();
    const toRect = cellAt(mv.toR, mv.toC).getBoundingClientRect();
    const ghost = document.createElement('div');

    ghost.className = `ghost field-cell field-cell--${mv.value}`;
    ghost.textContent = String(mv.value);
    ghost.style.left = `${fromRect.left - fieldRect.left}px`;
    ghost.style.top = `${fromRect.top - fieldRect.top}px`;
    ghost.style.transform = `translate(0px, 0px) scale(0.9)`;
    animLayer.appendChild(ghost);
    ghosts.push(ghost);

    requestAnimationFrame(() => {
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;

      ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.9)`;
    });
  }

  let doneCount = 0;
  const onEnd = () => {
    if (++doneCount === ghosts.length) {
      ghosts.forEach((g) => g.remove());
      done();
    }
  };

  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].addEventListener('transitionend', onEnd, { once: true });
  }

  setTimeout(() => {
    ghosts.forEach((g) => g.removeEventListener('transitionend', onEnd));
    ghosts.forEach((g) => g.remove());
    done();
  }, 620);
}

function doMove(dir) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const prev = game.getState().map((r) => r.slice());
  const moves = planMoves(prev, dir);

  if (!moves.length) {
    return;
  }

  if (!IS_TEST && isAnimating) {
    return;
  }

  if (!IS_TEST) {
    isAnimating = true;
  }

  if (dir === 'left') {
    game.moveLeft();
  } else if (dir === 'right') {
    game.moveRight();
  } else if (dir === 'up') {
    game.moveUp();
  } else {
    game.moveDown();
  }

  if (IS_TEST) {
    renderAll();
  } else {
    playSlideAnimation(moves, () => {
      renderAll();
      isAnimating = false;
    });
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    doMove('left');
  } else if (e.key === 'ArrowRight') {
    doMove('right');
  } else if (e.key === 'ArrowUp') {
    doMove('up');
  } else if (e.key === 'ArrowDown') {
    doMove('down');
  }
});

$btn.addEventListener('click', () => {
  if (!IS_TEST && isAnimating) {
    return;
  }

  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }
  renderAll();
});

renderAll();
