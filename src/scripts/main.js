'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const cells = [...document.querySelectorAll('.field-cell')];
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const cellClasses = [
  'field-cell--2',
  'field-cell--4',
  'field-cell--8',
  'field-cell--16',
  'field-cell--32',
  'field-cell--64',
  'field-cell--128',
  'field-cell--256',
  'field-cell--512',
  'field-cell--1024',
  'field-cell--2048',
];

function render() {
  const state = game.getState();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.classList.remove(...cellClasses);

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  score.textContent = game.getScore();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
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

  if (moves[keyEvent.key]) {
    keyEvent.preventDefault();
    moves[keyEvent.key]();

    if (game.getStatus() !== 'idle') {
      button.textContent = 'Restart';
      button.classList.remove('start');
      button.classList.add('restart');
    }

    render();
  }
});

render();
