'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const updateScore = () => {
  score.textContent = game.getScore();
};
const updateStatus = () => {
  if (game.getStatus() === Game.statuses.LOSE) {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === Game.statuses.WIN) {
    messageWin.classList.remove('hidden');
  }
};

function updateBoard() {
  const table = document.querySelector('.game-field');

  table.innerHTML = '';

  game.getState().forEach((row) => {
    const newRow = document.createElement('tr');

    // newRow.classList.add('game-field');

    row.forEach((cell) => {
      const newCell = document.createElement('td');

      newCell.classList.add('field-cell');

      if (cell > 0) {
        newCell.classList.add(`field-cell--${cell}`);
        newCell.textContent = cell;
      }

      newRow.append(newCell);
    });

    table.append(newRow);
  });
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    updateScore();
    updateBoard();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    messageStart.classList.add('hidden');
  } else {
    game.restart();
    updateScore();
    updateBoard();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

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

  updateBoard();
  updateScore();
  updateStatus();
});
