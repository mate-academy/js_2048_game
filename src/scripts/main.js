'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  const isIdle = game.getStatus() === 'idle';

  game[isIdle ? 'start' : 'restart']();
  button.textContent = isIdle ? 'Restart' : 'Start';

  button.classList.toggle('start', !isIdle);
  button.classList.toggle('restart', isIdle);

  updateUI();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
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

  updateUI();
});

function updateUI() {
  renderBoard();
  updateScore();
  updateMessages();
}

function renderBoard() {
  const board = game.getState();

  gameField.querySelectorAll('.field-cell').forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
  });
}

function updateScore() {
  gameScore.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();
  const messages = {
    lose: messageLose,
    win: messageWin,
    start: messageStart,
  };

  Object.keys(messages).forEach((key) => {
    messages[key].classList.toggle('hidden', key !== gameStatus);
  });
}
