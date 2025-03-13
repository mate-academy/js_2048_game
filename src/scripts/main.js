'use strict';

const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.disabled = true;

    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else {
    game.restart();
    game.start();

    messageLose.classList.add('hidden');
  }

  renderBoard(game.getState());
});

document.addEventListener('win', () => {
  messageWin.classList.remove('hidden');
});

function renderBoard(cellsAfterMove) {
  score.innerText = game.getScore();

  if (game.status === 'lose') {
    messageLose.classList.remove('hidden');
  }

  cellsAfterMove.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = cells[rowIndex * 4 + colIndex];

      if (cell !== 0) {
        cellElement.textContent = cell;
        cellElement.className = `field-cell field-cell--${cell}`;
      } else {
        cellElement.textContent = '';
        cellElement.className = 'field-cell';
      }

      game.changedСell.forEach(([cellRow, cellColumn]) => {
        if (cellRow === rowIndex && cellColumn === colIndex) {
          cellElement.classList.add('animation');

          cellElement.addEventListener('animationend', () => {
            cellElement.classList.remove('animation');
          });
        }
      });
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
  }

  button.disabled = false;

  if (button.innerText === 'Start') {
    button.innerText = 'Restart';
    button.className = 'button restart';
  }

  renderBoard(game.getState());
});
