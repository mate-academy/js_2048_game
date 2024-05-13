'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const rows = Array.from(document.querySelectorAll('.field-row')).map((row) => {
  return Array.from(row.querySelectorAll('.field-cell'));
});

const score = document.querySelector('.game-score');
const isLoser = document.querySelector('.message-lose');
const isWiner = document.querySelector('.message-win');
const isStarter = document.querySelector('.message-start');

const setAllGameBoard = async () => {
  const itemsFromGame = game.getState();
  const statusGame = game.setStatus();

  score.textContent = game.getScore();

  rows.map((row, indexRow) => {
    return row.map((itemField, intexItemField) => {
      itemField.textContent = itemsFromGame[indexRow][intexItemField]
        ? itemsFromGame[indexRow][intexItemField]
        : '';

      itemField.className = itemsFromGame[indexRow][intexItemField]
        ? `field-cell field-cell--${itemsFromGame[indexRow][intexItemField]}`
        : 'field-cell';
    });
  });

  switch (statusGame) {
    case 'none': {
      if (isLoser.className !== 'message message-lose hidden') {
        isLoser.className = 'message message-lose hidden';
      }

      if (isWiner.className !== 'message message-win hidden') {
        isWiner.className = 'message message-win hidden';
      }

      if (isStarter.className !== 'message message-start') {
        isStarter.className = 'message message-start';
      }

      break;
    }

    case 'start': {
      if (isLoser.className !== 'message message-lose hidden') {
        isLoser.className = 'message message-lose hidden';
      }

      if (isWiner.className !== 'message message-win hidden') {
        isWiner.className = 'message message-win hidden';
      }

      if (isStarter.className !== 'message message-start hidden') {
        isStarter.className = 'message message-start hidden';
      }

      break;
    }

    case 'lose': {
      if (isLoser.className !== 'message message-lose') {
        isLoser.className = 'message message-lose';
      }

      if (isWiner.className !== 'message message-win hidden') {
        isWiner.className = 'message message-win hidden';
      }

      if (isStarter.className !== 'message message-start hidden') {
        isStarter.className = 'message message-start hidden';
      }

      break;
    }

    case 'win': {
      if (isLoser.className !== 'message message-lose hidden') {
        isLoser.className = 'message message-lose hidden';
      }

      if (isWiner.className !== 'message message-win') {
        isWiner.className = 'message message-win';
      }

      if (isStarter.className !== 'message message-start hidden') {
        isStarter.className = 'message message-start hidden';
      }

      break;
    }

    default:
      break;
  }
};

const start = document.querySelector('.button');

start.addEventListener('click', async () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'Restart';
    await game.start();
    setAllGameBoard();
  } else {
    await game.restart();
    setAllGameBoard();
  }
});

let isUseEventListener = true;

document.documentElement.addEventListener('keydown', async function (evenet) {
  if (game.getStatus() !== 'start') {
    return;
  }

  if (isUseEventListener) {
    switch (evenet.key) {
      case 'ArrowRight': {
        isUseEventListener = false;
        await game.moveRight();
        await setAllGameBoard();
        isUseEventListener = true;
        break;
      }

      case 'ArrowLeft': {
        isUseEventListener = false;
        await game.moveLeft();
        await setAllGameBoard();
        isUseEventListener = true;
        break;
      }

      case 'ArrowUp': {
        isUseEventListener = false;
        await game.moveUp();
        await setAllGameBoard();
        isUseEventListener = true;
        break;
      }

      case 'ArrowDown': {
        isUseEventListener = false;
        await game.moveDown();
        await setAllGameBoard();
        isUseEventListener = true;
        break;
      }

      default:
        break;
    }
  }
});
