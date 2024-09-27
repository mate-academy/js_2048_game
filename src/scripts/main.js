'use strict';

import Game from '../modules/Game.class';
const game = new Game();

const startButton = document.querySelector('.button.start');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  game.restart();
  game.start();
  updateGameField();
  messageStart.classList.add('hidden');
  updateButtonLabel();
});

function updateGameField() {
  const state = game.getState();
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const value = state[Math.floor(index / 4)][index % 4];
    cell.textContent = value !== 0 ? value : '';
    cell.className = 'field-cell';
    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  gameScore.textContent = game.getScore();
  updateMessage();
}

function updateMessage() {
  const status = game.getStatus();
  messageLose.classList.toggle('hidden', status !== 'lose');
  messageWin.classList.toggle('hidden', status !== 'win');
}

function updateButtonLabel() {
  if (game.getStatus() === 'playing') {
    startButton.textContent = 'Restart';
  } else {
    startButton.textContent = 'Start';
  }
}

document.addEventListener('keydown', (event) => {
  if (game.getStatus() !== 'playing') return;

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
      return;
  }

  updateGameField();
  updateButtonLabel();
});
