'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startGame = document.querySelector('.buttun.start');
const scoreElement = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateBoard() {
  const board = game.getState();
  const rows = gameField.querySelectorAll('.field-row');

  board.forEach((row, i) => {
    const cells = rows[i].querySelectorAll('.field-cell');

    row.forEach((value, j) => {
      cells[j].textContent = value === 0 ? '' : value;

      cells[j].className =
        `field-cell--${value ? 'field-cell--' + 'value' : ''}`;
    });

    scoreElement.textContent = game.getScore();
  });
}

function updateMessage() {
  const statusGame = game.getStatus();

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  } else if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

// Слухач для клавіш стрілок
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress() {
  if (game.getStatus !== 'playing') {
    return null;
  }

  switch (event.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return null;
  }

  updateBoard();
  updateMessage();
}

startGame.addEventListener('click', () => {
  game.start();
  updateBoard();
  updateMessage();
});

// Початковий стан
updateBoard();
updateMessage();
