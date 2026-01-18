'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const startBtn = document.querySelector('.start');
const scoreBlock = document.querySelector('.game-score');
const allCells = document.querySelectorAll('.field-cell');
let clicked = false;

function render() {
  const gameField = game.getState();
  const gamescore = game.getScore();

  scoreBlock.textContent = String(gamescore);

  gameField.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cellIndex = rowIndex * 4 + colIndex;

      const cellElement = allCells[cellIndex];

      cellElement.textContent = '';
      cellElement.className = 'field-cell';

      if (cellValue > 0) {
        cellElement.textContent = cellValue;
        cellElement.classList.add(`field-cell--${cellValue}`);
      }
    });
  });
}

startBtn.addEventListener('click', () => {
  removeMessage();

  if (game.getStatus() === 'idle') {
    game.start();

    if (!clicked) {
      startBtn.classList.remove('start');
      startBtn.classList.add('restart');
      startBtn.textContent = 'Restart';
      clicked = true;
    }
  } else {
    game.restart();
    game.start();
    render();
  }
  render();
});

document.addEventListener('keydown', handler);

function handler(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let madeMove = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      madeMove = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      madeMove = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      madeMove = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      madeMove = true;
      break;
    default:
      return;
  }

  if (madeMove) {
    render();
    updateScore();
    checkStatus();
  }
}

function updateScore() {
  const score = game.getScore();

  scoreBlock.textContent = score;
}

function checkStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing' || gameStatus === 'idle') {
    return;
  }

  removeMessage();

  const messageEl = document.querySelector(`.message-${gameStatus}`);

  messageEl.classList.remove('hidden');
}

function removeMessage() {
  const allMesseges = document.querySelectorAll('.message');

  allMesseges.forEach((message) => message.classList.add('hidden'));
}
