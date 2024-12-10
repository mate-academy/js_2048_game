'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');

    game.start();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');

    game.restart();
  }

  updateUI(game);
});

document.addEventListener('keydown', (e) => {
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
  }

  updateUI(game);
});

function updateUI(curGame) {
  const gameField = document.querySelector('.game-field');
  const cells = gameField.querySelectorAll('.field-cell');
  const score = document.querySelector('.game-score');

  const board = curGame.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cellIndex = row * 4 + col;
      const cell = cells[cellIndex];
      const cellValue = board[row][col];

      cell.classList = `field-cell field-cell--${cellValue}`;
      cell.textContent = cellValue === 0 ? '' : cellValue;

      if (cellValue === 0) {
        cell.classList = 'field-cell';
      }
    }
  }

  score.textContent = curGame.getScore();

  if (curGame.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (curGame.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}
