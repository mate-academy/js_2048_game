'use strict';

import { Game } from '../modules/Game.class.js';

const boardElement = document.querySelector('.game-field tbody');
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let game;

const updateBoard = () => {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = boardElement.children[r].children[c];
      const value = game.board[r][c];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
};

const updateScore = () => {
  scoreElement.textContent = game.score;
};

const handleStartButton = () => {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  game.restart();
  updateBoard();
  updateScore();
};

const handleRestartButton = () => {
  game.restart();
  updateBoard();
  updateScore();
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
};

const checkGameState = () => {
  if (game.hasWon) {
    winMessage.classList.remove('hidden');
  } else if (game.isGameOver()) {
    loseMessage.classList.remove('hidden');
  }
};

const handleMove = (direction) => {
  const moved = game.move(direction);

  if (moved) {
    updateBoard();
    updateScore();
    checkGameState();
  }
};

(() => {
  game = new Game();

  startButton.addEventListener('click', () => {
    if (startButton.classList.contains('start')) {
      handleStartButton();
    } else {
      handleRestartButton();
    }
  });

  document.addEventListener('keydown', (e) => {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (directions.includes(e.key)) {
      e.preventDefault();
      handleMove(e.key);
    }
  });
})();
