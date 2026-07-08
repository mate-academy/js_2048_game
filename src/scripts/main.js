'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const renderboard = () => {
  const state = game.getState();

  gameScore.textContent = game.getScore();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;

    const value = state[row][col];

    cell.textContent = value > 0 ? value : '';

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
};

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startMessage.classList.add('hidden');
  } else {
    game.restart();
    game.start();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  renderboard();
});

window.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let move = false;

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      game.moveUp();
      move = true;
      break;
    case 'ArrowDown':
    case 's':
      game.moveDown();
      move = true;
      break;
    case 'ArrowLeft':
    case 'a':
      game.moveLeft();
      move = true;
      break;
    case 'ArrowRight':
    case 'd':
      game.moveRight();
      move = true;
      break;
  }

  if (move) {
    renderboard();
  }
});
