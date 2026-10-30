'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function renderBoard() {
  const rows = document.querySelectorAll('.field-row');
  const score = document.querySelector('.game-score');

  for (let i = 0; i < 4; i++) {
    const cells = rows[i].querySelectorAll('.field-cell');

    for (let j = 0; j < 4; j++) {
      const value = game.getState()[i][j];
      const cell = cells[j];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    }
  }
  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      messageLose.classList.remove('hidden');
      break;
  }
}

const button = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    renderBoard();
    messageStart.classList.add('hidden');
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
  } else if (button.classList.contains('restart')) {
    game.restart();
    renderBoard();
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');
    button.classList.replace('restart', 'start');
    button.textContent = 'Start';
  }
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (keyboardEvent.key === 'ArrowUp') {
    game.moveUp();
    game.spawnTitle();
    renderBoard();
  }

  if (keyboardEvent.key === 'ArrowDown') {
    game.moveDown();
    game.spawnTitle();
    renderBoard();
  }

  if (keyboardEvent.key === 'ArrowLeft') {
    game.moveLeft();
    game.spawnTitle();
    renderBoard();
  }

  if (keyboardEvent.key === 'ArrowRight') {
    game.moveRight();
    game.spawnTitle();
    renderBoard();
  }
});
