'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const cells = [...document.querySelectorAll('.field-cell')];
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

function render() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  startMessage.classList.toggle('hidden', gameStatus !== 'idle');

  if (gameStatus === 'idle') {
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  } else {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  render();
});

render();
