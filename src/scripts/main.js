'use strict';

const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const allRows = document.querySelectorAll('.field-row');
const allCells = document.querySelectorAll('.field-cell');

const winMessage = document.querySelector('.message.message-win');
const loseMessage = document.querySelector('.message.message-lose');
const startMessage = document.querySelector('.message.message-start');
const gameScore = document.querySelector('.game-score');

const Game = require('../modules/Game.class');
const game = new Game();

function addCellClass() {
  allCells.forEach((cell) => {
    cell.className = 'field-cell';

    if (cell.innerHTML) {
      cell.classList.add(`field-cell--${cell.innerHTML}`);
    }
  });
}

function render() {
  game.getState().forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellElement = allRows[rowIndex].children[cellIndex];

      cellElement.innerHTML = cell || '';
    });
  });

  addCellClass();

  gameScore.innerHTML = game.getScore();

  switch (game.getStatus()) {
    case 'win':
      winMessage.classList.remove('hidden');
      loseMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      break;
    case 'playing':
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      break;
    case 'idle':
    default:
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      break;
  }
}

function startGame() {
  game.start();

  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');

  render();

  document.addEventListener('keydown', handleKeyPress);
}

function restartGame() {
  game.restart();

  startButton.classList.remove('hidden');
  restartButton.classList.add('hidden');

  render();

  document.removeEventListener('keydown', handleKeyPress);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

let isKeyPressed = false;

function handleKeyPress(e) {
  if (game.getStatus() === 'playing' && !isKeyPressed) {
    isKeyPressed = true;

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
        isKeyPressed = false;

        return;
    }

    game.checkForWin();
    game.checkForLose();
    render();

    if (game.getStatus() !== 'playing') {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }
}

function handleKeyUp() {
  isKeyPressed = false;
}

document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyUp);
