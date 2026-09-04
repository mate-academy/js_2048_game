'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

let gameStarted = false;

let previousBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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
    const prevValue = previousBoard[row][col];

    const currentClass = Array.from(cell.classList).find(function (className) {
      return (
        className.startsWith('field-cell--') &&
        className !== 'field-cell--spawn' &&
        className !== 'field-cell--merge'
      );
    });

    if (currentClass) {
      cell.classList.remove(currentClass);
    }

    cell.classList.remove('field-cell--spawn', 'field-cell--merge');

    if (cellValue !== 0) {
      cell.classList.add(`field-cell--${cellValue}`);
    }

    cell.textContent = cellValue === 0 ? '' : cellValue;

    if (cellValue !== 0 && cellValue !== prevValue) {
      // Force a reflow so the animation restarts even if the same
      // animation class was applied to this cell on a previous render.
      void cell.offsetWidth;

      cell.classList.add(
        prevValue === 0 ? 'field-cell--spawn' : 'field-cell--merge',
      );
    }
  });

  previousBoard = board.map((boardRow) => boardRow.slice());
}

// movement handler shared by keyboard and swipe input
function handleMove(direction) {
  if (!gameStarted) {
    return;
  }

  switch (direction) {
    case 'left':
      game.moveLeft();
      break;
    case 'right':
      game.moveRight();
      break;
    case 'up':
      game.moveUp();
      break;
    case 'down':
      game.moveDown();
      break;
    default:
      return;
  }
  updateGameState();
}

// movement events (keyboard)
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      handleMove('left');
      break;
    case 'ArrowRight':
      handleMove('right');
      break;
    case 'ArrowUp':
      handleMove('up');
      break;
    case 'ArrowDown':
      handleMove('down');
      break;
    default:
      break;
  }
});

// movement events (swipe, mobile)
const SWIPE_THRESHOLD = 30;

let touchStartX = 0;
let touchStartY = 0;

const gameField = document.querySelector('.game-field');

gameField.addEventListener('touchstart', (e) => {
  const touch = e.changedTouches[0];

  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

gameField.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < SWIPE_THRESHOLD) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    handleMove(deltaX > 0 ? 'right' : 'left');
  } else {
    handleMove(deltaY > 0 ? 'down' : 'up');
  }
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
