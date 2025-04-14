'use strict';

const Game = require('../modules/Game.class');
// // import Game from '../modules/Game.class';

const game = new Game();

const startGame = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function updateBoard() {
  const board = game.getState();
  const rows = gameField.querySelectorAll('.field-row');

  board.forEach((row, i) => {
    const cells = rows[i].querySelectorAll('.field-cell');

    row.forEach((value, j) => {
      cells[j].textContent = value === 0 ? '' : value;
      cells[j].className = `field-cell field-cell--${value}`;
    });

    scoreElement.textContent = game.getScore();
  });
}

function updateMessage() {
  const statusGame = game.getStatus();

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (statusGame === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (statusGame === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (statusGame === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (statusGame === 'playing') {
    startGame.classList.remove('start');
    startGame.classList.add('restart');
    startGame.textContent = 'Restart';
  }
}

document.addEventListener('keydown', handlePressKey);

function handlePressKey(pressKey) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (pressKey.key) {
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
      return;
  }

  updateBoard();
  updateMessage();
}

startGame.addEventListener('click', () => {
  game.start();
  updateBoard();
  updateMessage();
});

updateBoard();
updateMessage();
