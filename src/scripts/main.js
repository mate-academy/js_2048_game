'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const field = document.querySelector('.game-field');
const fieldCells = field.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');
const notifications = document.querySelector('.message-container');
const messages = notifications.querySelectorAll('.message');

function updateGameField() {
  const currentState = game.getState();

  currentState.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      const cell = fieldCells[rowIndex * 4 + colIndex];

      cell.className = 'field-cell';

      if (cellValue !== 0) {
        cell.classList.add(`field-cell--${cellValue}`);
        cell.textContent = cellValue;
      } else {
        cell.textContent = '';
      }
    });
  });
}

function updateScore() {
  const score = game.getScore();
  const scoreElement = document.querySelector('.game-score');

  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

function showMessage(messageType) {
  messages.forEach((msg) => {
    msg.classList.add('hidden');

    const message = document.querySelector(`.message-${messageType}`);

    if (message) {
      message.classList.remove('hidden');
    }
  });
}

function handleKeyPress(e) {
  let moved = false;

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;

    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;

    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;

    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
  }

  if (moved) {
    updateGameField();
    updateScore();

    if (game.getStatus() === 'win') {
      showMessage('win');
      startButton.textContent = 'Restart';
      startButton.classList.add('restart');
    } else if (game.getStatus() === 'lose') {
      showMessage('lose');
      startButton.textContent = 'Restart';
      startButton.classList.add('restart');
    } else {
      showMessage('playing');
    }
  }
}

function startOrRestartGame() {
  if (startButton.textContent === 'Start') {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    showMessage('playing');
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    showMessage('start');
  }

  updateGameField();
  updateScore();
}

document.addEventListener('keydown', handleKeyPress);
startButton.addEventListener('click', startOrRestartGame);

if (game.getStatus() === 'idle') {
  showMessage('start');
} else {
  showMessage('playing');
}

updateGameField();
updateScore();
