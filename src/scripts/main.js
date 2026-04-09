// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

import Game from '../modules/Game.class.js';

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const btn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const field = document.querySelector('.game-field');

const cellIndex = (r, c) => r * 4 + c;

function render() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const i = cellIndex(r, c);
      const el = cells[i];
      const val = state[r][c];

      el.textContent = val === 0 ? '' : String(val);
      el.className = 'field-cell';

      if (val) {
        el.classList.add(`field-cell--${val}`);
      }
    }
  }

  scoreEl.textContent = String(game.getScore());

  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
    btn.textContent = 'Start';
    btn.classList.add('start');
    btn.classList.remove('restart');
  } else {
    msgStart.classList.add('hidden');
    btn.textContent = 'Restart';
    btn.classList.remove('start');
    btn.classList.add('restart');
  }

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else {
    msgWin.classList.add('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  } else {
    msgLose.classList.add('hidden');
  }
}

btn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) {
    return;
  }

  if (game.getStatus() !== 'playing') {
    return;
  }

  e.preventDefault();

  let moved = false;

  switch (key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;

    case 'ArrowRight':
      moved = game.moveRight();
      break;

    case 'ArrowUp':
      moved = game.moveUp();
      break;

    case 'ArrowDown':
      moved = game.moveDown();
      break;

    default:
      break;
  }

  if (moved) {
    render();
  }
});

let startX = 0;
let startY = 0;

function lockPageScroll() {
  document.body.classList.add('no-scroll');
}

function unlockPageScroll() {
  document.body.classList.remove('no-scroll');
}

field.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  startY = e.clientY;
});

field.addEventListener('mouseup', (e) => {
  handleSwipe(e.clientX - startX, e.clientY - startY);
});

field.addEventListener(
  'touchstart',
  (e) => {
    const touch = e.changedTouches[0];

    e.preventDefault();
    startX = touch.clientX;
    startY = touch.clientY;
    lockPageScroll();
  },
  { passive: false },
);

field.addEventListener(
  'touchmove',
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);

field.addEventListener(
  'touchend',
  (e) => {
    const touch = e.changedTouches[0];

    e.preventDefault();
    handleSwipe(touch.clientX - startX, touch.clientY - startY);
    unlockPageScroll();
  },
  { passive: false },
);

field.addEventListener('touchcancel', () => {
  unlockPageScroll();
});

function handleSwipe(dx, dy) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
    return;
  }

  let moved = false;

  if (Math.abs(dx) > Math.abs(dy)) {
    moved = dx > 0 ? game.moveRight() : game.moveLeft();
  } else {
    moved = dy > 0 ? game.moveDown() : game.moveUp();
  }

  if (moved) {
    render();
  }
}

render();
