'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const mesStart = document.querySelector('.message-start');
const butStart = document.querySelector('.start');

butStart.addEventListener('click', () => {
  if (butStart.classList.contains('start')) {
    game.start();
    mesStart.classList.add('hidden');
    butStart.classList.remove('start');
    butStart.classList.add('restart');
    butStart.textContent = 'Restart';
    updateDOM();
  } else {
    game.restart();
    butStart.classList.remove('restart');
    butStart.classList.add('start');
    butStart.textContent = 'Start';
    mesStart.classList.remove('hidden');
    updateDOM();
  }
});

function updateDOM() {
  const cells = document.querySelectorAll('.field-cell');
  const boardState = game.getState().flat();
  const score = document.querySelector('.game-score');
  const loseMes = document.querySelector('.message-lose');
  const winMes = document.querySelector('.message-win');

  score.textContent = game.getScore();

  if (!boardState.includes(0)) {
    loseMes.classList.remove('hidden');
  } else {
    loseMes.classList.add('hidden');
  }

  if (!boardState.includes(2048)) {
    winMes.classList.add('hidden');
  } else {
    winMes.classList.remove('hidden');
  }

  cells.forEach((cell, i) => {
    const value = boardState[i];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (
    game.getStatus() === 'idle' ||
    game.getStatus() === 'win' ||
    game.getStatus() === 'lose'
  ) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    updateDOM();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    updateDOM();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    updateDOM();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    updateDOM();
  }
});
