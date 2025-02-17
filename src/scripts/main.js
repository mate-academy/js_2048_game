'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const elements = {
  button: document.querySelector('.button'),
  gameField: document.querySelector('.game-field'),
  gameScore: document.querySelector('.game-score'),
  messages: {
    lose: document.querySelector('.message-lose'),
    win: document.querySelector('.message-win'),
    start: document.querySelector('.message-start'),
  },
};

const { button, gameField, gameScore, messages } = elements;

button.addEventListener('click', handleGameStart);
document.addEventListener('keydown', handleMove);

function handleGameStart() {
  const isIdle = game.getStatus() === 'idle';

  game[isIdle ? 'start' : 'restart']();

  button.textContent = isIdle ? 'Restart' : 'Start';
  button.classList.toggle('start', !isIdle);
  button.classList.toggle('restart', isIdle);

  updateUI();
}

function handleMove(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }
  e.preventDefault();

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (moves[e.key]) {
    moves[e.key]();
    updateUI();
  }
}

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

    cell.textContent = value || '';
    cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
  });
}

function updateScore() {
  gameScore.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  Object.entries(messages).forEach(([key, message]) => {
    message.classList.toggle('hidden', key !== gameStatus);
  });
}
