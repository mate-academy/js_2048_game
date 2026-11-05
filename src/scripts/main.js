'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const moves = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

function render() {
  const values = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = values[index];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
}

function setButton(isRestart) {
  button.classList.toggle('start', !isRestart);
  button.classList.toggle('restart', isRestart);
  button.textContent = isRestart ? 'Restart' : 'Start';
}

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
    setButton(false);
  }

  game.start();
  render();
});

document.addEventListener('keydown', (e) => {
  const move = moves[e.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  e.preventDefault();

  const stateBefore = JSON.stringify(game.getState());

  move();

  if (JSON.stringify(game.getState()) !== stateBefore) {
    setButton(true);
  }

  render();
});

render();
