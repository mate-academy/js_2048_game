'use strict';

import Game from '../modules/Game.class.js';

const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let game;

function startGame() {
  game = new Game();
  game.start();
  updateUI();
  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function updateUI() {
  updateBoard();
  updateScore();
  updateMessages();
}

function updateBoard() {
  const state = game.getState();

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    startButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
  }

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    restartButton.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    updateUI();
  }
});
