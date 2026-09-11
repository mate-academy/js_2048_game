'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const cells = [...document.querySelectorAll('.field-cell')];
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const moves = {
  ArrowLeft: 'moveLeft',
  ArrowRight: 'moveRight',
  ArrowUp: 'moveUp',
  ArrowDown: 'moveDown',
};

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const tile = state[row][column];

    cell.className = 'field-cell';
    cell.textContent = tile || '';

    if (tile) {
      cell.classList.add(`field-cell--${tile}`);
    }
  });

  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  if (gameStatus === 'idle') {
    setStartButton();
  }
}

function setStartButton() {
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
}

function setRestartButton() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const move = moves[keyboardEvent.key];

  if (!move) {
    return;
  }

  keyboardEvent.preventDefault();

  if (game[move]()) {
    setRestartButton();
  }

  render();
});

render();
