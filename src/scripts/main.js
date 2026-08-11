'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const scoreEl = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const winMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

let hasMoved = false;

function setButtonToRestart() {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

const CELL_BASE_CLASS = 'field-cell';

function render() {
  const state = game.getState();
  const fieldRows = document.querySelectorAll('.field-row');

  state.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = fieldRows[rowIndex].children[colIndex];

      cell.className = CELL_BASE_CLASS;
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`${CELL_BASE_CLASS}--${value}`);
        cell.textContent = value;
      }
    });
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function handleMove(moveF) {
  if (game.getStatus() === 'idle') {
    return;
  }

  const stateBefore = JSON.stringify(game.getState());

  moveF();

  const moved = stateBefore !== JSON.stringify(game.getState());

  if (moved && !hasMoved) {
    hasMoved = true;
    setButtonToRestart();
  }

  render();
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      handleMove(() => game.moveLeft());
      break;

    case 'ArrowRight':
      e.preventDefault();
      handleMove(() => game.moveRight());
      break;

    case 'ArrowUp':
      e.preventDefault();
      handleMove(() => game.moveUp());
      break;

    case 'ArrowDown':
      e.preventDefault();
      handleMove(() => game.moveDown());
      break;

    default:
      break;
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }

  game.restart();
  game.start();

  hasMoved = true;
  setButtonToRestart();

  render();
});
