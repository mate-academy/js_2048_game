'use strict';

const Game = require('../../src/modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateUI() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });
  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    startButton.textContent = 'Restart';
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    startButton.textContent = 'Restart';
  }
}

function handleKeyPress() {
  if (game.getStatus() !== 'playing') {
    return;
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
  }
  updateUI();
}

startButton.addEventListener('click', () => {
  game.restart();
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  updateUI();
});

document.addEventListener('keydown', handleKeyPress);
updateUI();
