'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScore = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function renderBoard() {
  const state = game.getState();

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const value = state[row][column];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });

  gameScore.textContent = game.getScore();

  if (game.status === 'win') {
    winMessage.classList.remove('hidden');
  } else if (game.status === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (e.key in moves) {
    moves[e.key]();
    renderBoard();
  }
});

startButton.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }

  renderBoard();
});

renderBoard();
