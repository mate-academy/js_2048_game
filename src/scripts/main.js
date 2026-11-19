'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
  }

  game.start();

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  render();
});

const moves = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (e) => {
  const move = moves[e.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  e.preventDefault();
  move();
  render();
});

render();
