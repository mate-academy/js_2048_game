'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreElement.textContent = score;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  } else if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const move = moves[keyboardEvent.key];

  if (move) {
    keyboardEvent.preventDefault();
    move();
    render();
  }
});

render();
