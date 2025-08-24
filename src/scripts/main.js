'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameScoreText = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const gameField = document.querySelector('.game-field tbody');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const updateUI = () => {
  const board = game.getState();
  const cells = gameField.querySelectorAll('.field-cell');

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = board[r][c];
      const cell = cells[r * 4 + c];

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  gameScoreText.textContent = game.getScore();

  const gameStatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  if (gameStatus === 'win') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }

  if (gameStatus === 'idle') {
    startMessage.classList.remove('hidden');
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
};

const handleMove = (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        game.moveUp();
        break;

      case 'ArrowDown':
        game.moveDown();
        break;

      case 'ArrowLeft':
        game.moveLeft();
        break;

      case 'ArrowRight':
        game.moveRight();
        break;
    }

    updateUI();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});

startButton.addEventListener('click', () => {
  game.restart();
  updateUI();
});

document.addEventListener('keydown', handleMove);
