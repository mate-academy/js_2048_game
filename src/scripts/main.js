'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const gameField = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function renderBoard() {
  const cells = gameField.querySelectorAll('.field-cell');
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = `field-cell field-cell--${value}`;
  });

  scoreElement.textContent = game.getScore();
}

function handleGameStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  }

  if (gameStatus === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    startButton.classList.remove('start');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    startButton.classList.remove('restart');
  }
}

function startGame() {
  game.restart();
  game.start();
  renderBoard();
  handleGameStatus();

  startButton.textContent = 'Restart';
}

function handleKeyPress(e) {
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

  renderBoard();
  handleGameStatus();
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);

renderBoard();
