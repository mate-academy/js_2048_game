'use strict';

const Game = require('../modules/Game.class');
const cells = document.querySelectorAll('.field-cell');
const game = new Game();
const startButton = document.getElementById('start-button');
const messageStart = document.querySelector('.message-start');
const scoreElement = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function render() {
  const state = game.getState();

  scoreElement.textContent = game.getScore();

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

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() !== 'idle') {
    game.restart();

    render();

    return;
  }

  game.start();
  messageStart.classList.add('hidden');

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerHTML = 'Restart';

  render();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    game.addRandomTile();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    game.addRandomTile();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    game.addRandomTile();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    game.addRandomTile();
  }

  game.checkStatus();
  render();
});
