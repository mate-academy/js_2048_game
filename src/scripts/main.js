'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const startButton = document.querySelector('.button.start');
const gameField = [...document.getElementsByClassName('field-row')].map(
  (row) => [...row.cells],
);

const setGameField = () => {
  let hasEmptyCell = false;

  game.getState().forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      gameField[rowIndex][colIndex].classList = 'field-cell';

      if (col) {
        gameField[rowIndex][colIndex].innerText = col;
        gameField[rowIndex][colIndex].classList.add(`field-cell--${col}`);

        if (col === 2048) {
          document.querySelector('.message-win').classList.remove('hidden');
        }
      } else {
        gameField[rowIndex][colIndex].innerText = '';
        hasEmptyCell = true;
      }
    });
  });
  document.querySelector('.game-score').innerText = game.getScore();

  if (hasEmptyCell || isTurnPossible()) {
    document.querySelector('.message-lose').classList.add('hidden');
  } else {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
};

const isTurnPossible = () => {
  let isSimilarSiblings = false;

  game.getState().forEach((row, rowIndex, arr) => {
    for (let i = 0; i < game.BOARD_SIZE; i++) {
      if (i !== 0 && row[i] === row[i - 1]) {
        isSimilarSiblings = true;
        break;
      }

      if (rowIndex !== 0 && row[i] === arr[rowIndex - 1][i]) {
        isSimilarSiblings = true;
        break;
      }
    }
  });

  return isSimilarSiblings;
};

document.addEventListener('keydown', (ev) => {
  switch (ev.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    default:
      return 0;
  }

  setGameField();
});

startButton.addEventListener('click', (ev) => {
  if (ev.target.classList.contains('start')) {
    ev.target.classList.remove('start');
    ev.target.classList.add('restart');
    ev.target.innerText = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
    game.start();
  } else {
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    game.restart();
  }

  setGameField();
});
