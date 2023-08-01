'use strict';

const GRID_SIZE = 4;
let gameGrid
  = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
let score = 0;
let gameIsOver = false;

const startButton = document.querySelector('.button.start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.querySelector('.game-score');

function generateRandomNumber() {
  const randomNumber = Math.random() < 0.1 ? 4 : 2;
  const emptyCells = [];

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (gameGrid[row][col] === 0) {
        emptyCells.push({
          row,
          col,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    gameGrid[row][col] = randomNumber;
  }
}

function renderGame() {
  const gameField = document.querySelector('.game-field');

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cellValue = gameGrid[row][col];
      const cellElement = gameField.rows[row].cells[col];

      cellElement.className = 'field-cell';

      if (cellValue !== 0) {
        cellElement.textContent = cellValue;
        cellElement.classList.add(`field-cell--${cellValue}`);
      } else {
        cellElement.textContent = '';
      }
    }
  }
}

function initGame() {
  gameGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));

  score = 0;
  gameIsOver = false;

  generateRandomNumber();
  generateRandomNumber();

  renderGame();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startMessage.classList.remove('hidden');
  startButton.classList.remove('hidden');
  document.getElementById('restartButton').classList.add('hidden');
}

function restartGame() {
  score = 0;
  gameIsOver = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      gameGrid[row][col] = 0;
    }
  }

  generateRandomNumber();
  generateRandomNumber();

  renderGame();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startMessage.classList.add('hidden');
  startButton.classList.add('hidden');

  document.getElementById('restartButton').classList.remove('hidden');
  document.querySelector('.game-score').textContent = score;

  restartButton.blur();
}

restartButton.addEventListener('click', function() {
  restartGame();
});

function startGame() {
  hideStartMessage();
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startButton.classList.add('hidden');
  document.getElementById('restartButton').classList.remove('hidden');
}

function hideStartMessage() {
  startMessage.classList.add('hidden');
}

function handleKeyPress(move) {
  if (gameIsOver) {
    return;
  }

  const key = move.key;

  if (key === 'ArrowUp'
    || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
    hideStartMessage();
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
  }

  if (key === 'ArrowUp') {
    moveUp();
  } else if (key === 'ArrowDown') {
    moveDown();
  } else if (key === 'ArrowLeft') {
    moveLeft();
  } else if (key === 'ArrowRight') {
    moveRight();
  }
}

document.addEventListener('keydown', handleKeyPress);
startButton.addEventListener('click', startGame);

initGame();

function combineCells(row, col, nextRow, nextCol) {
  const currentValue = gameGrid[row][col];
  const nextValue = gameGrid[nextRow][nextCol];

  if (currentValue === nextValue) {
    gameGrid[row][col] = currentValue * 2;
    gameGrid[nextRow][nextCol] = 0;
    score += currentValue * 2;
  }
}

function moveCellsUp() {
  let isMoved = false;

  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = 1; row < GRID_SIZE; row++) {
      let currentRow = row;

      while (currentRow > 0) {
        const currentValue = gameGrid[currentRow][col];
        const aboveValue = gameGrid[currentRow - 1][col];

        if (currentValue === 0) {
          break;
        } else if (aboveValue === 0) {
          gameGrid[currentRow][col] = 0;
          gameGrid[currentRow - 1][col] = currentValue;
          currentRow--;
          isMoved = true;
        } else if (currentValue === aboveValue) {
          combineCells(currentRow - 1,
            col, currentRow, col);
          isMoved = true;
          break;
        } else {
          break;
        }
      }
    }
  }

  return isMoved;
}

function moveCellsDown() {
  let isMoved = false;

  for (let col = 0; col < GRID_SIZE; col++) {
    for (let row = GRID_SIZE - 2; row >= 0; row--) {
      let currentRow = row;

      while (currentRow < GRID_SIZE - 1) {
        const currentValue = gameGrid[currentRow][col];
        const belowValue = gameGrid[currentRow + 1][col];

        if (currentValue === 0) {
          break;
        } else if (belowValue === 0) {
          gameGrid[currentRow][col] = 0;
          gameGrid[currentRow + 1][col] = currentValue;
          currentRow++;
          isMoved = true;
        } else if (currentValue === belowValue) {
          combineCells(currentRow + 1, col,
            currentRow, col);
          isMoved = true;
          break;
        } else {
          break;
        }
      }
    }
  }

  return isMoved;
}

function moveCellsLeft() {
  let isMoved = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 1; col < GRID_SIZE; col++) {
      let currentCol = col;

      while (currentCol > 0) {
        const currentValue = gameGrid[row][currentCol];
        const leftValue = gameGrid[row][currentCol - 1];

        if (currentValue === 0) {
          break;
        } else if (leftValue === 0) {
          gameGrid[row][currentCol] = 0;
          gameGrid[row][currentCol - 1] = currentValue;
          currentCol--;
          isMoved = true;
        } else if (currentValue === leftValue) {
          combineCells(row, currentCol - 1,
            row, currentCol);
          isMoved = true;
          break;
        } else {
          break;
        }
      }
    }
  }

  return isMoved;
}

function moveCellsRight() {
  let isMoved = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = GRID_SIZE - 2; col >= 0; col--) {
      let currentCol = col;

      while (currentCol < GRID_SIZE - 1) {
        const currentValue = gameGrid[row][currentCol];
        const rightValue = gameGrid[row][currentCol + 1];

        if (currentValue === 0) {
          break;
        } else if (rightValue === 0) {
          gameGrid[row][currentCol] = 0;
          gameGrid[row][currentCol + 1] = currentValue;
          currentCol++;
          isMoved = true;
        } else if (currentValue === rightValue) {
          combineCells(row, currentCol + 1,
            row, currentCol);
          isMoved = true;
          break;
        } else {
          break;
        }
      }
    }
  }

  return isMoved;
}

function moveCells(direction) {
  let isMoved = false;

  switch (direction) {
    case 'up':
      isMoved = moveCellsUp();
      break;
    case 'down':
      isMoved = moveCellsDown();
      break;
    case 'left':
      isMoved = moveCellsLeft();
      break;
    case 'right':
      isMoved = moveCellsRight();
      break;
    default:
      break;
  }

  if (isMoved) {
    generateRandomNumber();
    renderGame();
    updateScore();

    if (checkWin()) {
      winMessage.classList.remove('hidden');
    }

    if (checkGameOver()) {
      loseMessage.classList.remove('hidden');
    }
  }
}

function moveUp() {
  moveCells('up');
}

function moveDown() {
  moveCells('down');
}

function moveLeft() {
  moveCells('left');
}

function moveRight() {
  moveCells('right');
}

function checkGameOver() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (gameGrid[row][col] === 0) {
        return false;
      }

      if (col > 0 && gameGrid[row][col] === gameGrid[row][col - 1]) {
        return false;
      }

      if (row > 0 && gameGrid[row][col] === gameGrid[row - 1][col]) {
        return false;
      }
    }
  }

  return true;
}

function checkWin() {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (gameGrid[row][col] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function updateScore() {
  scoreElement.textContent = score;
}
