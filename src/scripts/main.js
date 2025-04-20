'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');

function updateBoard() {
  gameField.innerHTML = '';

  game.getState().forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((cell) => {
      const cellElement = document.createElement('td');

      cellElement.classList.add('field-cell');

      if (cell > 0) {
        cellElement.classList.add(`field-cell--${cell}`);
      }
      cellElement.textContent = cell !== 0 ? cell : '';
      rowElement.appendChild(cellElement);
    });

    gameField.appendChild(rowElement);
  });
}

function updateScore() {
  gameScore.innerHTML = game.getScore();
}

function updateStatus() {
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const currentStatus = game.getStatus();

  if (currentStatus === Game.statuses.WIN) {
    messageWin.classList.remove('hidden');
  } else if (currentStatus === Game.statuses.LOSE) {
    messageLose.classList.remove('hidden');
  }
}

updateScore();

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    updateBoard();
    updateScore();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    messageStart.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    game.restart();
    updateBoard();
    updateScore();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== Game.statuses.PLAYING) {
    return;
  }

  let keyProcessed = true;

  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    default:
      keyProcessed = false;
      break;
  }

  if (keyProcessed) {
    updateScore();
    updateBoard();
    updateStatus();
  }
});
