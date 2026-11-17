'use strict';

import { Game } from '../modules/Game.class.js';

const game = new Game();

const boardElement = document.getElementById('board');
const scoreElement = document.querySelector('.game-score');
const messageElement = document.querySelector('.message');
const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');

function renderBoard() {
  const board = game.getState();

  boardElement.innerHTML = '';

  for (let r = 0; r < 4; r++) {
    const row = document.createElement('tr');

    for (let c = 0; c < 4; c++) {
      const cell = document.createElement('td');
      const value = board[r][c];

      cell.classList.add('field-cell');

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }

      row.appendChild(cell);
    }

    boardElement.appendChild(row);
  }

  scoreElement.textContent = game.getScore();
}

function updateMessage() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'lose') {
    messageElement.textContent = 'You lose! Restart the game?';
    messageElement.classList.remove('hidden');
    messageElement.classList.add('message-lose');
  } else if (gameStatus === 'win') {
    messageElement.textContent = 'You win!';
    messageElement.classList.remove('hidden');
    messageElement.classList.add('message-win');
  } else {
    messageElement.classList.add('hidden');
    messageElement.classList.remove('message-lose', 'message-win');
  }
}

function startGame() {
  game.start();
  renderBoard();
  updateMessage();
}

function restartGame() {
  game.restart();
  renderBoard();
  updateMessage();
}

function handleKeyPress(keyEvent) {
  if (game.getStatus() !== 'playing' && game.getStatus() !== 'win') {
    return;
  }

  switch (keyEvent.key) {
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

    default:
      return;
  }

  renderBoard();
  updateMessage();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
window.addEventListener('keydown', handleKeyPress);

renderBoard();
