'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const messageContainer = document.querySelector('.message-container');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

document.addEventListener('keydown', (e) => {
  if (this.status !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      this.moveLeft();
      break;
    case 'ArrowRight':
      this.moveRight();
      break;
    case 'ArrowUp':
      this.moveUp();
      break;
    case 'ArrowDown':
      this.moveDown();
      break;
  }

  this.updateUI();
});

function updateUI() {
  const cells = game.getFlattenedBoard();

  cells.forEach((value, index) => {
    const cell = fieldCells[index];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field - cell ${value ? `field - cell--${value}` : ''}`;
  });

  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    showMessage(messageWin);
  } else if (game.getStatus() === 'lose') {
    showMessage(messageLose);
  }
}

function showMessage(messageElement) {
  hideMessages();
  messageElement.classList.remove('hidden');
}

function hideMessages() {
  messageContainer.querySelectorAll('.message').forEach((msg) => {
    msg.classList.add('hidden');
  });
}

function handleKeyPress(e) {
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
  }

  if (moved) {
    game.addRandomTile();
    game.checkGameOver();
    updateUI();
  }
}

function initGame() {
  hideMessages();
  showMessage(messageStart);
  game.start();
  updateUI();
}

startButton.addEventListener('click', () => {
  initGame();
  hideMessages();
});

window.addEventListener('keydown', handleKeyPress);

initGame();
