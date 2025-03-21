'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const startButton = document.querySelector('.button.start');
const cells = Array.from(document.querySelectorAll('.field-cell'));

function renderGameBoard(state) {
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value !== 0 ? value : '';

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

const restartButton = document.createElement('button');
const controlPanel = document.querySelector('.controls');

restartButton.classList.add('button');
restartButton.classList.add('restart');
restartButton.textContent = 'Restart';

startButton.addEventListener('click', () => {
  game.start();
  renderGameBoard(game.getState());
  startButton.remove();
  controlPanel.append(restartButton);
  document.querySelector('.message-start').classList.add('hidden');
});

restartButton.addEventListener('click', () => {
  game.restart();
  renderGameBoard(game.getState());
  restartButton.remove();
  controlPanel.append(startButton);
  document.querySelector('.message-start').classList.remove('hidden');

  if (document.querySelector('.message-lose')) {
    document.querySelector('.message-lose').classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    game.moveRight();
    renderGameBoard(game.getState());
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    renderGameBoard(game.getState());
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    renderGameBoard(game.getState());
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    renderGameBoard(game.getState());
  }

  const scorePoints = document.querySelector('.game-score');

  scorePoints.textContent = game.getScore();

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }
});
