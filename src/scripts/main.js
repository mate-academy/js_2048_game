'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// DOM elements
const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// Render game state to UI
function render() {
  const field = game.getState();
  const score = game.getScore();
  const statusGame = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = field[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreEl.textContent = score;

  // Messages
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// Start / Restart button
button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
  }

  render();
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  e.preventDefault();

  let moved = false;

  switch (e.key) {
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
      return;
  }

  if (moved) {
    render();
  }
});

// Initial render func
render();
