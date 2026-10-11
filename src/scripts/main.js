'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function render() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const value = state[Math.floor(index / 4)][index % 4];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
}

function setButton(mode) {
  button.classList.remove('start', 'restart');
  button.classList.add(mode);
  button.textContent = mode === 'start' ? 'Start' : 'Restart';
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    setButton('restart');
  } else {
    game.restart();
    setButton('start');
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const move = moves[keyEvent.key];

  if (!move) {
    return;
  }

  keyEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  const stateBefore = JSON.stringify(game.getState());

  move();

  // change Start -> Restart after the first successful move
  if (JSON.stringify(game.getState()) !== stateBefore) {
    setButton('restart');
  }

  render();
});

render();
