'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const gameField = document.querySelector('.game-field');

// Minimum finger travel (px) for a gesture to count as a swipe, so taps
// and small jitters on the board never move the tiles.
const SWIPE_THRESHOLD = 30;

const moves = {
  left: () => game.moveLeft(),
  right: () => game.moveRight(),
  up: () => game.moveUp(),
  down: () => game.moveDown(),
};

const keyDirections = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

// Shared by keyboard and swipe input, so both go through the same
// game methods and render flow.
function move(direction) {
  if (game.getStatus() !== 'playing' || !moves[direction]) {
    return;
  }

  moves[direction]();
  render();
}

function getSwipeDirection(deltaX, deltaY) {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) < SWIPE_THRESHOLD) {
    return null;
  }

  // Diagonal swipes resolve to the dominant axis.
  if (absX > absY) {
    return deltaX > 0 ? 'right' : 'left';
  }

  return deltaY > 0 ? 'down' : 'up';
}

document.addEventListener('keydown', (e) => {
  move(keyDirections[e.key]);
});

let swipeStart = null;

gameField.addEventListener('pointerdown', (e) => {
  // Swipes are for touchscreens only: mouse dragging never moves tiles
  // (desktop plays with the keyboard). Track one finger at a time.
  if (e.pointerType !== 'touch' || !e.isPrimary) {
    return;
  }

  swipeStart = {
    pointerId: e.pointerId,
    x: e.clientX,
    y: e.clientY,
  };

  // Keep receiving pointerup even if the finger leaves the board.
  try {
    gameField.setPointerCapture(e.pointerId);
  } catch (err) {
    // Capture is best-effort (e.g. synthetic events have no active pointer).
  }
});

gameField.addEventListener('pointerup', (e) => {
  if (!swipeStart || e.pointerId !== swipeStart.pointerId) {
    return;
  }

  const direction = getSwipeDirection(
    e.clientX - swipeStart.x,
    e.clientY - swipeStart.y,
  );

  // Decide only once, on release: one physical swipe = at most one move.
  swipeStart = null;

  if (direction) {
    move(direction);
  }
});

gameField.addEventListener('pointercancel', () => {
  swipeStart = null;
});

// Backs up `touch-action: none` from the CSS: stops the page from scrolling
// or bouncing (and the browser from starting a fling) while swiping on the
// board. Scrolling outside the board is untouched.
gameField.addEventListener(
  'touchmove',
  (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
  },
  { passive: false },
);

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

function render() {
  const state = game.getState();
  const score = game.getScore();
  const globalStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = score;

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (globalStatus === 'idle') {
    messageStart.classList.remove('hidden');
    startButton.textContent = 'Start';

    startButton.classList.add('start');
    startButton.classList.remove('restart');
  }

  if (globalStatus === 'playing') {
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }

  if (globalStatus === 'win') {
    messageWin.classList.remove('hidden');
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }

  if (globalStatus === 'lose') {
    messageLose.classList.remove('hidden');
    startButton.textContent = 'Restart';

    startButton.classList.add('restart');
    startButton.classList.remove('start');
  }
}

render();
