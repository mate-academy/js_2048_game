'use strict';

let board = [];
const boardSize = 4;
let score = 0;
let gameOver = false;
let gameStarted = false;

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const scoreEl = document.querySelector('.game-score');

const startMessage = document.querySelector('.message.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const gameBoard = document.querySelector('.game-field');
const rows = gameBoard.querySelectorAll('.field-row');

window.addEventListener('load', () => {
  initializedBoard();
  generateTwoTile();
  upDateBoard();
});

document.addEventListener('keydown', changeKey);

startButton.addEventListener('click', () => {
  startGame();
}
);

restartButton.addEventListener('click', () => {
  restartGame();
});

function startGame() {
  toggleButton(startButton, restartButton);
  hideElem(startMessage);
  resetGame();
  generateTwoTile();
  upDateBoard();
}

function restartGame() {
  toggleButton(restartButton, startButton);
  startGame();
  hideElem(loseMessage);
}

function resetGame() {
  board = [];
  initializedBoard();
  score = 0;
  gameOver = false;
}

function changeKey(evt) {
  evt.preventDefault();

  if (!gameStarted) {
    startGame();
  }

  gameStarted = true;

  if (!gameOver) {
    switch (evt.key) {
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
    }
    generateTwoTile();
    upDateBoard();
    checkBoard();
  }
}

function initializedBoard() {
  for (let row = 0; row < boardSize; row++) {
    board[row] = [];

    for (let col = 0; col < boardSize; col++) {
      board[row].push(0);
    }
  }
}

function getEmptyCell() {
  const cells = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === 0) {
        cells.push({
          row,
          col,
        });
      }
    }
  }

  return cells;
}

function generateRandomTile() {
  const emptyCells = getEmptyCell();

  if (emptyCells.length) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const randomNumber = Math.random() < 0.9 ? 2 : 4;

    board[randomCell.row][randomCell.col] = randomNumber;
  }
}

function generateTwoTile() {
  generateRandomTile();
  generateRandomTile();
}

function upDateBoard() {
  scoreEl.innerHTML = score;

  rows.forEach((row, indexRow) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, indexCol) => {
      const cellValue = board[indexRow][indexCol];

      if (cell.textContent) {
        cell.classList.remove(`field-cell--${cell.textContent}`);
      }

      if (cellValue) {
        cell.classList.add(`field-cell--${cellValue}`);
      }

      cell.textContent = cellValue > 0 ? cellValue : '';

      if (cellValue === 2048) {
        showElem(winMessage);
        document.removeEventListener('keydown', changeKey);
      }
    });
  });
}

function moveUp() {
  let merged = false;

  for (let col = 0; col < boardSize; col++) {
    for (let row = 0; row < boardSize; row++) {
      const currentCell = board[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentRow = row;

        while (
          currentRow > 0
          && (board[row - 1][col] === 0
            || (board[row - 1][col] === board[row][col]
              && !merged))
        ) {
          if (board[row - 1][col] === 0) {
            board[row - 1][col] = board[row][col];
            board[row][col] = 0;
            merged = false;
            row = currentRow - 1;
          } else if (board[row - 1][col] === board[row][col]) {
            if (!merged) {
              board[row - 1][col] *= 2;
              board[row][col] = 0;
              score += board[row - 1][col];
              merged = true;
              row = currentRow - 1;
            }
          }

          currentRow--;
        }
      }
    }
  }
}

function moveDown() {
  let merged = false;

  for (let col = 0; col < boardSize; col++) {
    for (let row = boardSize - 1; row >= 0; row--) {
      const currentCell = board[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentRow = row;

        while (
          currentRow < boardSize - 1
          && (board[row + 1][col] === 0
            || (board[row + 1][col] === board[row][col]
              && !merged))
        ) {
          if (board[row + 1][col] === 0) {
            board[row + 1][col] = board[row][col];
            board[row][col] = 0;
            merged = false;
            row = currentRow + 1;
          } else if (board[row + 1][col] === board[row][col]) {
            if (!merged) {
              board[row + 1][col] *= 2;
              board[row][col] = 0;
              score += board[row + 1][col];
              merged = true;
              row = currentRow + 1;
            }
          }

          currentRow++;
        }
      }
    }
  }
}

function moveRight() {
  let merged = false;

  for (let row = 0; row < boardSize; row++) {
    for (let col = boardSize - 1; col >= 0; col--) {
      const currentCell = board[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentCol = col;

        while (
          currentCol < boardSize - 1
          && (board[row][col + 1] === 0
            || (board[row][col + 1] === board[row][col]
              && !merged))
        ) {
          if (board[row][col + 1] === 0) {
            board[row][col + 1] = board[row][col];
            board[row][col] = 0;
            merged = false;
            col = currentCol + 1;
          } else if (board[row][col + 1] === board[row][col]) {
            if (!merged) {
              board[row][col + 1] *= 2;
              board[row][col] = 0;
              score += board[row][col + 1];
              merged = true;
              col = currentCol + 1;
            }
          }

          currentCol++;
        }
      }
    }
  }
}

function moveLeft() {
  let merged = false;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const currentCell = board[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentCol = col;

        while (
          currentCol > 0
          && (board[row][col - 1] === 0
            || (board[row][col - 1] === board[row][col]
              && !merged))
        ) {
          if (board[row][col - 1] === 0) {
            board[row][col - 1] = board[row][col];
            board[row][col] = 0;
            merged = false;
            col = currentCol - 1;
          } else if (board[row][col - 1] === board[row][col]) {
            if (!merged) {
              board[row][col - 1] *= 2;
              board[row][col] = 0;
              score += board[row][col - 1];
              merged = true;
              col = currentCol - 1;
            }
          }

          currentCol--;
        }
      }
    }
  }
}

function checkBoard() {
  const emptyCells = getEmptyCell();

  if (!emptyCells.length
    && (!isAvailableMove(moveUp)
      || !isAvailableMove(moveDown)
      || !isAvailableMove(moveLeft)
      || !isAvailableMove(moveRight)
    )) {
    gameOver = true;
  }

  if (gameOver) {
    showElem(loseMessage);
  }
}

function isAvailableMove(move) {
  move();

  const emptyCells = getEmptyCell();

  if (emptyCells.length) {
    return true;
  }

  return false;
}

function showElem(elem) {
  elem.classList.remove('hidden');
}

function hideElem(elem) {
  elem.classList.add('hidden');
}

function toggleButton(btnToHide, btnToShow) {
  hideElem(btnToHide);
  showElem(btnToShow);
}
