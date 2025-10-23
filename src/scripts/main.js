'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = [...document.querySelectorAll('.field-cell')];

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  renderBoard();
});

function renderBoard() {
  const gameField = game.getState().flat();

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const value = gameField[i];

    if (value !== 0) {
      cell.textContent = value;
      cell.className = 'field-cell';
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
      cell.className = 'field-cell';
    }
  }

  gameScore.textContent = game.getScore();
  updateMessage();
  handleButton();
}

function updateMessage() {
  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function handleButton() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
  } else {
    startButton.classList.replace('restart', 'start');
    startButton.textContent = 'Start';
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
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
    default:
      return;
  }

  if (moved) {
    renderBoard();
  }
});
