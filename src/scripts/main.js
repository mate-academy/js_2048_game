'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

let gameStarted = false;

// Write your code here

// Updating state function
function updateGameState() {
  const score = game.getScore();
  const gameStatus = game.getStatus();

  // score update
  document.querySelector('.game-score').textContent = score;

  // status update
  const messageContainer = document.querySelector('.message-container');

  messageContainer.querySelector('.message-lose').classList.add('hidden');
  messageContainer.querySelector('.message-win').classList.add('hidden');
  messageContainer.querySelector('.message-start').classList.add('hidden');

  if (gameStatus === 'win') {
    messageContainer.querySelector('.message-win').classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageContainer.querySelector('.message-lose').classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    messageContainer.querySelector('.message-start').classList.remove('hidden');
  }

  displayBoard();
}

// display board function
function displayBoard() {
  const board = game.getState();
  const boardContainer = document.querySelector('.game-field');
  const cells = boardContainer.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const cellValue = board[row][col];

    const currentClass = Array.from(cell.classList).find(function (className) {
      return className.startsWith('field-cell--');
    });

    if (currentClass) {
      cell.classList.remove(currentClass);
    }

    if (cellValue !== 0) {
      cell.classList.add(`field-cell--${cellValue}`);
    }

    cell.textContent = cellValue === 0 ? '' : cellValue;
  });
}

// movement events
document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
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
  updateGameState();
});

// Start game
function startGame() {
  if (!gameStarted) {
    game.start();
    gameStarted = true;

    const startButton = document.querySelector('.start');

    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  updateGameState();
}

// Restart game
function restartGame() {
  game.restart();
  gameStarted = false;

  const restartButton = document.querySelector('.restart');

  restartButton.textContent = 'Start';
  restartButton.classList.remove('restart');
  restartButton.classList.add('start');

  updateGameState();
}

// Event listener for the button
document.querySelector('.start, .restart').addEventListener('click', (e) => {
  const button = e.target;

  if (button.classList.contains('start')) {
    startGame();
  } else if (button.classList.contains('restart')) {
    restartGame();
  }
});
