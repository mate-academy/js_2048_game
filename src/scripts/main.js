'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field tbody');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
    updateUI();
  } else {
    document.addEventListener('keydown', (ev) => {
      if (game.getStatus() === 'playing') {
        switch (ev.key) {
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

        updateUI();
      }
    });

    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    game.start();
    updateUI();
  }
});

function updateUI() {
  const gameState = game.getState();
  const stt = game.getStatus();

  scoreElement.textContent = game.getScore();

  gameField.innerHTML = '';

  gameState.forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('field-cell');

      if (cell > 0) {
        cellElement.textContent = cell;
        cellElement.classList.add(`field-cell--${cell}`);
      }
      rowElement.appendChild(cellElement);
    });
    gameField.appendChild(rowElement);
  });

  if (stt === 'win') {
    messageWin.classList.remove('hidden');
  } else if (stt === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (stt === 'playing') {
    messageStart.classList.add('hidden');
  }
}
