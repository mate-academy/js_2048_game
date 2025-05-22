'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const boardElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const statusElement = document.querySelector('.message-lose');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');

function render() {
  const state = game.getState();
  const mainstatus = game.getStatus();
  const cells = boardElement.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  if (mainstatus === 'win') {
    statusElement.textContent = 'You win!';
    statusElement.classList.remove('hidden');
  } else if (mainstatus === 'lose') {
    statusElement.textContent = 'You lose! Restart the game?';
    statusElement.classList.remove('hidden');
  } else {
    statusElement.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
  }

  if (moved) {
    render();
  }
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
  }

  render();
});

render();
