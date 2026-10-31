'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const allCells = [...document.querySelectorAll('.field-cell')];
const startButton = document.querySelector('.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const scoreValue = document.querySelector('.game-score');
const colors = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

let isGameOver = false;

// Реалізація кліків на клавіші руху
document.addEventListener('keydown', (e) => {
  if (isGameOver) {
    return;
  }

  if (e.key.startsWith('Arrow')) {
    e.preventDefault();
  }

  const previousBoard = game.board.map((row) => [...row]);

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

  const isEqual = previousBoard.every((row, rowIndex) => {
    return row.every((element, elementIndex) => {
      return element === game.board[rowIndex][elementIndex];
    });
  });

  if (!isEqual) {
    const hasWon = game.board.some((row) => {
      return row.some((element) => {
        return element === 2048;
      });
    });

    if (!hasWon) {
      game.addRandomTile();
      checkLose();
    } else {
      winMessage.classList.remove('hidden');
      isGameOver = true;
    }
  }

  renderBoard();
});

// Перевірка на рух
function canMove() {
  for (let index = 0; index < game.board.length; index++) {
    const row = game.board[index];

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1] && row[i] !== 0) {
        return true;
      }

      if (
        index < game.board.length - 1 &&
        game.board[index][i] === game.board[index + 1][i] &&
        game.board[index][i] !== 0
      ) {
        return true;
      }
    }
  }

  return false;
}

// Реалізація програшу
function checkLose() {
  const isBoardFull = game.board.every((row) => {
    return row.every((element) => element !== 0);
  });

  if (isBoardFull && !canMove()) {
    loseMessage.classList.remove('hidden');
    isGameOver = true;
  }
}

// Реалізація кнопок старт і рестарт
startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');

    startButton.textContent = 'Restart';

    game.start();
    isGameOver = false;

    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.add('hidden');
  } else {
    startButton.classList.remove('restart');
    startButton.classList.add('start');

    startButton.textContent = 'Start';

    game.restart();
    isGameOver = true;

    startMessage.classList.remove('hidden');
  }

  renderBoard();
});

// Реалізація дошки і клітинки очок
function renderBoard() {
  game.board.forEach((row, rowIndex) => {
    row.forEach((element, elementIndex) => {
      const index = rowIndex * 4 + elementIndex;

      colors.forEach((color) => {
        allCells[index].classList.remove(`field-cell--${color}`);
      });

      if (element !== 0) {
        allCells[index].classList.add(`field-cell--${element}`);
      }

      allCells[index].textContent = element === 0 ? '' : element;
    });
  });

  scoreValue.textContent = game.score;
}
