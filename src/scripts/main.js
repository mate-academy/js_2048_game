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
});

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

      default:
        break;
    }

    generateRandomTile();

    if (!gameOver) {
      upDateBoard();
    }
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
        while (row > 0) {
          const nextCellIsEmpty = board[row - 1][col] === 0;
          const canMerge = (board[row - 1][col] === board[row][col] && !merged);

          if (nextCellIsEmpty) {
            board[row - 1][col] = board[row][col];
            board[row][col] = 0;
            row--;
          } else if (canMerge) {
            board[row - 1][col] *= 2;
            board[row][col] = 0;
            score += board[row - 1][col];
            merged = true;
            row--;
            break;
          } else {
            break;
          }
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
        while (row < boardSize - 1) {
          const nextCellIsEmpty = board[row + 1][col] === 0;
          const canMerge = board[row + 1][col] === board[row][col] && !merged;

          if (nextCellIsEmpty) {
            board[row + 1][col] = board[row][col];
            board[row][col] = 0;
            merged = false;
            row++;
          } else if (canMerge) {
            board[row + 1][col] *= 2;
            board[row][col] = 0;
            score += board[row + 1][col];
            merged = true;
            row++;
            break;
          } else {
            break;
          }
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
        while (col < boardSize - 1) {
          const nextCellIsEmpty = board[row][col + 1] === 0;
          const canMerge = board[row][col + 1] === board[row][col] && !merged;

          if (nextCellIsEmpty) {
            board[row][col + 1] = board[row][col];
            board[row][col] = 0;
            merged = false;
            col++;
          } else if (canMerge) {
            board[row][col + 1] *= 2;
            board[row][col] = 0;
            score += board[row][col + 1];
            merged = true;
            col++;
            break;
          } else {
            break;
          }
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
        while (col > 0) {
          const nextCellIsEmpty = board[row][col - 1] === 0;
          const canMerge = board[row][col - 1] === board[row][col] && !merged;

          if (nextCellIsEmpty) {
            board[row][col - 1] = board[row][col];
            board[row][col] = 0;
            merged = false;
            col--;
          } else if (canMerge) {
            board[row][col - 1] *= 2;
            board[row][col] = 0;
            score += board[row][col - 1];
            merged = true;
            col--;
            break;
          } else {
            break;
          }
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

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const randomNumber = Math.random() < 0.9 ? 2 : 4;

    board[randomCell.row][randomCell.col] = randomNumber;
  } else {
    isGameOver();
  }
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
  // Check for possible merges
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      // Check adjacent cells (up, down, left, right)
      const currentCell = board[row][col];

      if (
        (row > 0 && board[row - 1][col] === currentCell)
        || (row < boardSize - 1 && board[row + 1][col] === currentCell)
        || (col > 0 && board[row][col - 1] === currentCell)
        || (col < boardSize - 1 && board[row][col + 1] === currentCell)
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
