'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const fieldCell = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('button');

function render() {
  const gameState = game.getState();

  fieldCell.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = gameState[row][col];

    if (value === 0) {
      cell.textContent = '';
    } else {
      cell.textContent = value;
    }

    cell.classList.remove(
      'field-cell--2',
      'field-cell--4',
      'field-cell--8',
      'field-cell--16',
      'field-cell--32',
      'field-cell--64',
      'field-cell--128',
      'field-cell--256',
      'field-cell--512',
      'field-cell--1024',
      'field-cell--2048',
    );

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  document.querySelector('.game-score').textContent = game.getScore();

  renderMessage();
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      render();
      break;
    case 'ArrowRight':
      game.moveRight();
      render();
      break;
    case 'ArrowUp':
      game.moveUp();
      render();
      break;
    case 'ArrowDown':
      game.moveDown();
      render();
      break;
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
  startButton.textContent = 'Restart';
  startButton.style.width = 85 + 'px';

  document.querySelector('.message-start').classList.add('hidden');
});

function renderMessage() {
  const messageOfWin = document.querySelector('.message-win');
  const messageOfLose = document.querySelector('.message-lose');
  const messageOfStart = document.querySelector('.message-start');

  messageOfWin.classList.add('hidden');
  messageOfLose.classList.add('hidden');
  messageOfStart.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageOfWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageOfLose.classList.remove('hidden');
  }
}
