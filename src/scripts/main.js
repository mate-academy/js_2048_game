'use strict';

let gameGrid = [];
const gridSize = 4;
let gameStarted = false;
let gameOver = false;
let score = 0;

const startButt = document.querySelector('.start');
const restartButt = document.querySelector('.restart');
const startMess = document.querySelector('.message.message-start');
const winMess = document.querySelector('.message-win');
const loseMess = document.querySelector('.message-lose');
const scoreElem = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const rows = gameField.querySelectorAll('.field-row');

document.addEventListener('keydown', changeKey);

function startGame() {
  resetGame();
  generateRandomTile();
  generateRandomTile();
  updateBoard();

  gameStarted = true;

  hideElem(startButt);
  showElem(restartButt);
}

function resetGame() {
  gameGrid = [];
  initializedBoard();
  score = 0;
  gameOver = false;
}

function restartGame() {
  startGame();
  hideElem(loseMess);
}

restartButt.addEventListener('click', () => {
  restartGame();
});

startButt.addEventListener('click', () => {
  toggleButton(startButt, restartButt);
  hideElem(startMess);
  startGame();
  showElem(restartButt);
});

function initializedBoard() {
  for (let row = 0; row < gridSize; row++) {
    gameGrid[row] = [];

    for (let col = 0; col < gridSize; col++) {
      gameGrid[row].push(0);
    }
  }
}

function moveUp() {
  let merged = false;

  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize; row++) {
      const currentCell = gameGrid[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentRow = row;

        while (
          currentRow > 0
          && (gameGrid[row - 1][col] === 0
            || (gameGrid[row - 1][col] === gameGrid[row][col] && !merged))
        ) {
          if (gameGrid[row - 1][col] === 0) {
            gameGrid[row - 1][col] = gameGrid[row][col];
            gameGrid[row][col] = 0;
            merged = false;
            row = currentRow - 1;
          } else if (gameGrid[row - 1][col] === gameGrid[row][col]) {
            if (!merged) {
              gameGrid[row - 1][col] *= 2;
              gameGrid[row][col] = 0;
              score += gameGrid[row - 1][col];
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

  for (let col = 0; col < gridSize; col++) {
    for (let row = gridSize - 1; row >= 0; row--) {
      const currentCell = gameGrid[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentRow = row;

        while (
          currentRow < gridSize - 1
          && (gameGrid[row + 1][col] === 0
            || (gameGrid[row + 1][col] === gameGrid[row][col] && !merged))
        ) {
          if (gameGrid[row + 1][col] === 0) {
            gameGrid[row + 1][col] = gameGrid[row][col];
            gameGrid[row][col] = 0;
            merged = false;
            row = currentRow + 1;
          } else if (gameGrid[row + 1][col] === gameGrid[row][col]) {
            if (!merged) {
              gameGrid[row + 1][col] *= 2;
              gameGrid[row][col] = 0;
              score += gameGrid[row + 1][col];
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

  for (let row = 0; row < gridSize; row++) {
    for (let col = gridSize - 1; col >= 0; col--) {
      const currentCell = gameGrid[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentCol = col;

        while (
          currentCol < gridSize - 1
          && (gameGrid[row][col + 1] === 0
            || (gameGrid[row][col + 1] === gameGrid[row][col] && !merged))
        ) {
          if (gameGrid[row][col + 1] === 0) {
            gameGrid[row][col + 1] = gameGrid[row][col];
            gameGrid[row][col] = 0;
            merged = false;
            col = currentCol + 1;
          } else if (gameGrid[row][col + 1] === gameGrid[row][col]) {
            if (!merged) {
              gameGrid[row][col + 1] *= 2;
              gameGrid[row][col] = 0;
              score += gameGrid[row][col + 1];
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

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const currentCell = gameGrid[row][col];

      merged = false;

      if (currentCell !== 0) {
        let currentCol = col;

        while (
          currentCol > 0 && (gameGrid[row][col - 1] === 0
            || (gameGrid[row][col - 1] === gameGrid[row][col] && !merged))
        ) {
          if (gameGrid[row][col - 1] === 0) {
            gameGrid[row][col - 1] = gameGrid[row][col];
            gameGrid[row][col] = 0;
            merged = false;
            col = currentCol - 1;
          } else if (gameGrid[row][col - 1] === gameGrid[row][col]) {
            if (!merged) {
              gameGrid[row][col - 1] *= 2;
              gameGrid[row][col] = 0;
              score += gameGrid[row][col - 1];
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
    updateBoard();
    isGameOver();
  }
}

function generateRandomTile() {
  const emptyCells = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (gameGrid[row][col] === 0) {
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

  gameGrid[randomCell.row][randomCell.col] = randomNumber;
}

function updateBoard() {
  scoreElem.innerHTML = score;

  rows.forEach((row, indexRow) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell, indexCol) => {
      const cellValue = gameGrid[indexRow][indexCol];

      if (cell.textContent) {
        cell.classList.remove(`field-cell--${cell.textContent}`);
      }

      if (cellValue) {
        cell.classList.add(`field-cell--${cellValue}`);
      }

      cell.textContent = cellValue > 0 ? cellValue : '';

      if (cellValue === 2048) {
        showElem(winMess);
        document.removeEventListener('keydown', changeKey);
      }
    });
  });
}

function showElem(elem) {
  elem.classList.remove('hidden');

  if (elem.classList.contains('restart')) {
    elem.style.display = 'inline-block';
  }
}

function hideElem(elem) {
  elem.classList.add('hidden');
}

function toggleButton(btnToHide, btnToShow) {
  hideElem(btnToHide);
  showElem(btnToShow);
}

function isGameOver() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (gameGrid[row][col] === 0) {
        return;
      }
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const currentTile = gameGrid[row][col];

      if (
        (row > 0 && gameGrid[row - 1][col] === currentTile)
        || (row < gridSize - 1 && gameGrid[row + 1][col] === currentTile)
        || (col > 0 && gameGrid[row][col - 1] === currentTile)
        || (col < gridSize - 1 && gameGrid[row][col + 1] === currentTile)
      ) {
        return;
      }
    }
  }

  gameOver = true;
  showElem(loseMess);
}
