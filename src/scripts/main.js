'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const fieldRows = document.querySelectorAll('.field-row');

function renderField() {
  const state = game.getState();

  fieldRows.forEach(
    (row, rowIndex) =>
      [...row.cells].forEach((el, colIndex) => {
        const elValue = state[rowIndex][colIndex];

        el.textContent = elValue === 0 ? '' : elValue;

        el.className = 'field-cell';

        if (elValue !== 0) {
          el.classList.add(`field-cell--${elValue}`);
        }
      }),
    // eslint-disable-next-line function-paren-newline
  );
}

const scoreField = document.querySelector('.game-score');

function renderScore() {
  scoreField.textContent = game.getScore();
}

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderMessages() {
  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else {
    game.restart();
  }

  renderField();
  renderScore();
  renderMessages();
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

    default:
      return;
  }

  e.preventDefault();

  renderField();
  renderScore();
  renderMessages();
});
