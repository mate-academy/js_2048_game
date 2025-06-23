'use strict';

const Game = require('../modules/Game.class');

const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const game = new Game(initialState);
const button = document.querySelector('button');
const gameScore = document.querySelector('.game-score');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    messageStart.classList.add('hidden');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    renderGame();
  } else if (button.classList.contains('restart')) {
    game.restart();
    renderGame();
  }
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

  renderGame();
});

function renderGame() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');
  const score = game.getScore();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  gameScore.textContent = score;

  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}
