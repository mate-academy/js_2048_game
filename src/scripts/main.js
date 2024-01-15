'use strict';

let gameStatus = false;

const ROWS_COUNT = 4;
const START_CELLS_COUNT = 2;
const NEW_CELLS_TURN_COUNT = 1;
const POSSIBLE_BLOCK_VALUES = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

let restartButton;
const startButton = document.getElementsByClassName('start')[0];
const visualCells = document.getElementsByClassName('field-cell');
const gameScore = document.getElementsByClassName('game-score')[0];

const messageStart = document.getElementsByClassName('message-start')[0];
const messageLose = document.getElementsByClassName('message-lose')[0];
const messageWin = document.getElementsByClassName('message-win')[0];

document.addEventListener('keydown', e => turn(e));

const cells = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score;

startButton.addEventListener('click', startGame);

function startGame() {
  const addingRandomCells = addRandomCells(START_CELLS_COUNT);

  if (addingRandomCells === null) {
    return;
  }

  score = 0;
  gameStatus = true;

  getGameState();

  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');

  restartButton = document.getElementsByClassName('restart')[0];
  restartButton.addEventListener('click', restartGame);

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function restartGame() {
  clearGameState();
  getGameState();
  startGame();
}

function addRandomCells(times = 1) {
  const cellsValues = Object.values(cells).flat();
  const emptyCells = [];

  cellsValues.forEach((cellValue, index) => {
    if (cellValue === 0) {
      emptyCells.push(index);
    }
  });

  if (emptyCells.length > 0) {
    for (let i = 0; i < times; i++) {
      const randomIndex = Math.floor(emptyCells.length * Math.random());
      const value = Math.random() < 0.1 ? 4 : 2;

      changeCell(emptyCells[randomIndex], value);
    }
  } else {
    return null;
  }
}

function turn(action) {
  const GAME_BUTTONS = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

  if (!GAME_BUTTONS.includes(action.key) || !gameStatus) {
    return;
  }

  let hasMoved = false;

  switch (action.key) {
    case 'ArrowUp':
      hasMoved = moveCellsUp();
      break;
    case 'ArrowDown':
      hasMoved = moveCellsDown();
      break;
    case 'ArrowLeft':
      hasMoved = moveCellsLeft();
      break;
    case 'ArrowRight':
      hasMoved = moveCellsRight();
      break;
  }

  getGameState();

  if (hasMoved) {
    addRandomCells(NEW_CELLS_TURN_COUNT);
    getGameState();
  }

  checkWin();
  checkAvailableMoves();
}

function checkWin() {
  const cellsValues = Object.values(cells).flat();

  for (let i = 0; i < cellsValues.length; i++) {
    if (cellsValues[i] === 2048) {
      gameStatus = false;
      messageWin.classList.remove('hidden');
    }
  }
}

function getGameState() {
  const cellsValues = Object.values(cells).flat();

  for (let i = 0; i < visualCells.length; i++) {
    removePreviousBlockState(visualCells[i]);

    if (cellsValues[i] !== 0) {
      visualCells[i].textContent = cellsValues[i];
    } else if (cellsValues[i] === 0) {
      visualCells[i].textContent = '';
    }

    visualCells[i].classList.add(`field-cell--${cellsValues[i]}`);
  }

  gameScore.textContent = score;
}

function removePreviousBlockState(cell) {
  POSSIBLE_BLOCK_VALUES.forEach(
    item => cell.classList.remove(`field-cell--${item}`),
  );
}

function clearGameState() {
  for (let i = 0; i < cells.length; i++) {
    cells[i] = [0, 0, 0, 0];
  }
}

function changeCell(cellIndex, value) {
  switch (Math.floor(cellIndex / ROWS_COUNT)) {
    case 0:
      cells[0][cellIndex % ROWS_COUNT] = value;
      break;
    case 1:
      cells[1][cellIndex % ROWS_COUNT] = value;
      break;
    case 2:
      cells[2][cellIndex % ROWS_COUNT] = value;
      break;
    case 3:
      cells[3][cellIndex % ROWS_COUNT] = value;
      break;
  }
}

function moveCellsUp() {
  let hasMoved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (cells[row][col] !== 0) {
        let currentRow = row;

        while (currentRow > 0) {
          if (cells[currentRow - 1][col] === 0) {
            cells[currentRow - 1][col] = cells[currentRow][col];
            cells[currentRow][col] = 0;
            currentRow--;
            hasMoved = true;
          } else if (cells[currentRow - 1][col] === cells[currentRow][col]) {
            cells[currentRow - 1][col] *= 2;
            score += cells[currentRow - 1][col];
            cells[currentRow][col] = 0;
            hasMoved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return hasMoved;
}

function moveCellsDown() {
  let hasMoved = false;

  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (cells[row][col] !== 0) {
        let currentRow = row;

        while (currentRow < 3) {
          if (cells[currentRow + 1][col] === 0) {
            cells[currentRow + 1][col] = cells[currentRow][col];
            cells[currentRow][col] = 0;
            currentRow++;
            hasMoved = true;
          } else if (cells[currentRow + 1][col] === cells[currentRow][col]) {
            cells[currentRow + 1][col] *= 2;
            score += cells[currentRow + 1][col];
            cells[currentRow][col] = 0;
            hasMoved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return hasMoved;
}

function moveCellsLeft() {
  let hasMoved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (cells[row][col] !== 0) {
        let currentCol = col;

        while (currentCol > 0) {
          if (cells[row][currentCol - 1] === 0) {
            cells[row][currentCol - 1] = cells[row][currentCol];
            cells[row][currentCol] = 0;
            currentCol--;
            hasMoved = true;
          } else if (cells[row][currentCol - 1] === cells[row][currentCol]) {
            cells[row][currentCol - 1] *= 2;
            score += cells[row][currentCol - 1];
            cells[row][currentCol] = 0;
            hasMoved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return hasMoved;
}

function moveCellsRight() {
  let hasMoved = false;

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (cells[row][col] !== 0) {
        let currentCol = col;

        while (currentCol < 3) {
          if (cells[row][currentCol + 1] === 0) {
            cells[row][currentCol + 1] = cells[row][currentCol];
            cells[row][currentCol] = 0;
            currentCol++;
            hasMoved = true;
          } else if (cells[row][currentCol + 1] === cells[row][currentCol]) {
            cells[row][currentCol + 1] *= 2;
            score += cells[row][currentCol + 1];
            cells[row][currentCol] = 0;
            hasMoved = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  return hasMoved;
}

function checkAvailableMoves() {
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (cells[row][col] === 0 || cells[row][col] === cells[row][col - 1]) {
        return true;
      }
    }
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (cells[row][col] === 0 || cells[row][col] === cells[row][col + 1]) {
        return true;
      }
    }
  }

  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (cells[row][col] === 0 || cells[row][col] === cells[row - 1][col]) {
        return true;
      }
    }
  }

  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (cells[row][col] === 0 || cells[row][col] === cells[row + 1][col]) {
        return true;
      }
    }
  }

  gameStatus = false;
  messageLose.classList.remove('hidden');
}
