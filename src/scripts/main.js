'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const rows = gameField.querySelectorAll('.field-row');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderBoard() {
  const state = game.getState();

  rows.forEach((row, r) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, c) => {
      const value = state[r][c];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });
}

function renderMessages() {
  const gameStatus = game.getStatus();

  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function updateUI() {
  renderBoard();
  gameScore.textContent = game.getScore();
  renderMessages();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startMessage.classList.add('hidden');
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  } else {
    game.restart();
    startMessage.classList.remove('hidden');
    button.textContent = 'Start';
    button.classList.replace('restart', 'start');
  }

  updateUI();
});

document.addEventListener('keydown', (keyEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const move = moves[keyEvent.key];

  if (move) {
    keyEvent.preventDefault();
    move();
    updateUI();
  }
});

updateUI();
