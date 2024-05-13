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

const moverGame = async (moveToGamePosition) => {
  isUseEventListener = false;
  await game[moveToGamePosition]();
  await setAllGameBoard();
  isUseEventListener = true;
};

document.documentElement.addEventListener('keydown', async function (evenet) {
  if (game.getStatus() !== 'start' || !isUseEventListener) {
    return;
  }

  switch (evenet.key) {
    case 'ArrowRight': {
      await moverGame('moveRight');
      break;
    }

    case 'ArrowLeft': {
      await moverGame('moveLeft');
      break;
    }

    case 'ArrowUp': {
      await moverGame('moveUp');
      break;
    }

    case 'ArrowDown': {
      await moverGame('moveDown');
      break;
    }

    default:
      break;
  }
});

let startPositionX, startPositionY;

const gameBoard = document.querySelector('.game-field');

gameBoard.addEventListener('touchstart', function (evenet) {
  startPositionX = evenet.touches[0].clientX;
  startPositionY = event.touches[0].clientY;
});

gameBoard.addEventListener('touchmove', async function (evenet) {
  evenet.preventDefault();

  if (game.getStatus() !== 'start' || !isUseEventListener) {
    return;
  }

  const currentX = evenet.touches[0].clientX;
  const currentY = evenet.touches[0].clientY;

  const diffX = currentX - startPositionX;
  const diffY = currentY - startPositionY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 50) {
      await moverGame('moveRight');
      isUseEventListener = false;
    } else if (diffX < -50) {
      await moverGame('moveLeft');
      isUseEventListener = false;
    }
  } else {
    if (diffY > 50) {
      await moverGame('moveDown');
      isUseEventListener = false;
    } else if (diffY < -50) {
      await moverGame('moveUp');
      isUseEventListener = false;
    }
  }
});

gameBoard.addEventListener('touchend', function () {
  startPositionX = null;
  startPositionY = null;
  isUseEventListener = true;
});
