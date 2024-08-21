'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

function updateUI() {
  const state = game.getState();

  gameScoreElement.textContent = game.getScore();

  cells.forEach((cell, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = state[row][col];

    cell.textContent = value > 0 ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function startGame() {
  game.start();
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startButton.classList.remove('start');
  updateUI();
}

function restartGame() {
  game.restart();
  updateUI();
}

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
    }
    updateUI();
  }
});

startButton.addEventListener('click', startGame);

startButton.addEventListener('click', restartGame);
