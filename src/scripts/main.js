'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const gameContainer = document.querySelector('tbody');
const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
    default:
      return;
  }
  updateBoard();
});

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    game.addRandomTile();
    game.addRandomTile();
    updateBoard();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
    game.start();
    game.addRandomTile();
    game.addRandomTile();
    updateBoard();
  }
});

function updateBoard() {
  gameContainer.innerHTML = '';

  game.getState().forEach((row) => {
    const rowElement = document.createElement('tr');

    rowElement.classList.add('field-row');

    row.forEach((value) => {
      const cell = document.createElement('td');

      cell.classList.add('field-cell');

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
      rowElement.appendChild(cell);
    });
    gameContainer.appendChild(rowElement);
  });
  scoreElement.textContent = game.getScore();
  updateMessages();
}

function updateMessages() {
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (game.getStatus() === 'idle') {
    startMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}
