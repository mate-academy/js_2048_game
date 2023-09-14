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

document.addEventListener('keydown', changeKey);

startButton.addEventListener('click', () => {
  toggleButton(startButton, restartButton);
  hideElem(startMessage);
  startGame();
}
);

restartButton.addEventListener('click', () => {
  restartGame();
});

function startGame() {
  resetGame();
  generateRandomTile();
  generateRandomTile();
  upDateBoard();

  gameStarted = true;
}

function resetGame() {
  board = [];
  initializedBoard();
  score = 0;
  gameOver = false;
}

function restartGame() {
  startGame();
  hideElem(loseMessage);
}

function changeKey(evt) {
  evt.preventDefault();

  if (!gameOver && gameStarted) {
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

    generateRandomTile();
    upDateBoard();
    isGameOver();
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

function generateRandomTile() {
  const emptyCells = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({
          row,
          col,
        });
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  const randomNumber = Math.random() < 0.9 ? 2 : 4;

  board[randomCell.row][randomCell.col] = randomNumber;
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

function isGameOver() {
  // Check for empty cells
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (board[row][col] === 0) {
        return;
      }
    }
  }

  // Check for possible merges
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      // Check adjacent cells (up, down, left, right)
      const currentTile = board[row][col];

      if (
        (row > 0 && board[row - 1][col] === currentTile)
        || (row < boardSize - 1 && board[row + 1][col] === currentTile)
        || (col > 0 && board[row][col - 1] === currentTile)
        || (col < boardSize - 1 && board[row][col + 1] === currentTile)
      ) {
        return;
      }
    }
  }

  gameOver = true;
  showElem(loseMessage);
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
