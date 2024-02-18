'use strict';

const startButton = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('tbody');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const rulesButton = document.querySelector('.rules');
const rulesExitButton = document.querySelector('.rules-exit');
const rules = document.querySelector('.rules-container');

const rows = 4;
const columns = 4;
let score;
let field;
let moved;
let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

startButton.addEventListener('click', () => {
  startGame();
});

function startGame() {
  field = Array.from(
    { length: rows }, () => Array.from({ length: columns }, () => 0)
  );

  score = 0;

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startButton.classList.replace('start', 'restart');
  startButton.innerText = 'Restart';

  addRandomCell();
  addRandomCell();
}

function addRandomCell() {
  setTimeout(() => {
    const availableCells = getAvailableCells();

    if (availableCells.length === 0) {
      return;
    }

    const randomCell
      = availableCells[Math.floor(Math.random() * availableCells.length)];
    const value = Math.random() > 0.1 ? 2 : 4;

    field[randomCell.row][randomCell.column] = value;

    updateField();
  }, 150);
}

function getAvailableCells() {
  const availableCells = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      if (field[row][column] === 0) {
        availableCells.push({
          row, column,
        });
      }
    }
  }

  return availableCells;
}

function updateField() {
  gameField.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    const newRow = document.createElement('tr');

    for (let column = 0; column < columns; column++) {
      const value = field[row][column];
      const newCell = document.createElement('td');

      newCell.textContent = value > 0 ? value : '';
      newCell.classList.add('field-cell');

      if (value > 0) {
        newCell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        messageWin.classList.remove('hidden');
        startButton.classList.replace('restart', 'start');
        startButton.innerText = 'Start';
      }
      newRow.appendChild(newCell);
    }

    gameField.appendChild(newRow);
  }

  gameScore.textContent = score;

  if (gameLose()) {
    messageLose.classList.remove('hidden');
  }
}

function gameLose() {
  if (getAvailableCells().length > 0) {
    return false;
  }

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns - 1; cell++) {
      if (field[row][cell] === field[row][cell + 1]
        || field[cell][row] === field[cell + 1][row]) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keydown', pressKeyDown);

function pressKeyDown(e) {
  moved = false;

  switch (e.key) {
    case 'ArrowUp':
      moved = moveCellsUp();
      break;
    case 'ArrowDown':
      moved = moveCellsDown();
      break;
    case 'ArrowLeft':
      moved = moveCellsLeft();
      break;
    case 'ArrowRight':
      moved = moveCellsRight();
      break;
  }

  if (moved) {
    addRandomCell();
  }
}

function moveCellsUp() {
  moved = false;

  for (let column = 0; column < columns; column++) {
    for (let row = 1; row < rows; row++) {
      if (field[row][column] !== 0) {
        let newRow = row;

        while (newRow > 0 && field[newRow - 1][column] === 0) {
          newRow--;
        }

        if (newRow !== row) {
          field[newRow][column] = field[row][column];
          field[row][column] = 0;
          moved = true;
        }

        if (
          newRow > 0 && field[newRow - 1][column] === field[newRow][column]
        ) {
          field[newRow - 1][column] *= 2;
          field[newRow][column] = 0;
          score += field[newRow - 1][column];
          moved = true;
        }
      }
    }
  }

  updateField();

  return moved;
}

function moveCellsDown() {
  moved = false;

  for (let column = 0; column < columns; column++) {
    for (let row = rows - 2; row >= 0; row--) {
      if (field[row][column] !== 0) {
        let newRow = row;

        while (newRow < rows - 1 && field[newRow + 1][column] === 0) {
          newRow++;
        }

        if (newRow !== row) {
          field[newRow][column] = field[row][column];
          field[row][column] = 0;
          moved = true;
        }

        if (
          newRow < rows - 1
          && field[newRow + 1][column] === field[newRow][column]
        ) {
          field[newRow + 1][column] *= 2;
          field[newRow][column] = 0;
          score += field[newRow + 1][column];
          moved = true;
        }
      }
    }
  }

  updateField();

  return moved;
}

function moveCellsLeft() {
  moved = false;

  for (let row = 0; row < rows; row++) {
    for (let column = 1; column < columns; column++) {
      if (field[row][column] !== 0) {
        let newColumn = column;

        while (newColumn > 0 && field[row][newColumn - 1] === 0) {
          newColumn--;
        }

        if (newColumn !== column) {
          field[row][newColumn] = field[row][column];
          field[row][column] = 0;
          moved = true;
        }

        if (
          newColumn > 0 && field[row][newColumn - 1] === field[row][newColumn]
        ) {
          field[row][newColumn - 1] *= 2;
          field[row][newColumn] = 0;
          score += field[row][newColumn - 1];
          moved = true;
        }
      }
    }
  }

  updateField();

  return moved;
}

function moveCellsRight() {
  moved = false;

  for (let row = 0; row < rows; row++) {
    for (let column = columns - 2; column >= 0; column--) {
      if (field[row][column] !== 0) {
        let newColumn = column;

        while (newColumn < columns - 1 && field[row][newColumn + 1] === 0) {
          newColumn++;
        }

        if (newColumn !== column) {
          field[row][newColumn] = field[row][column];
          field[row][column] = 0;
          moved = true;
        }

        if (
          newColumn < columns - 1
          && field[row][newColumn + 1] === field[row][newColumn]
        ) {
          field[row][newColumn + 1] *= 2;
          field[row][newColumn] = 0;
          score += field[row][newColumn + 1];
          moved = true;
        }
      }
    }
  }

  updateField();

  return moved;
}

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  moved = false;

  const swipeThreshold = 100;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (
    Math.abs(deltaX) < swipeThreshold
    && Math.abs(deltaY) < swipeThreshold
  ) {
    return;
  }

  switch (true) {
    case Math.abs(deltaX) >= Math.abs(deltaY):
      if (deltaX > 0) {
        moved = moveCellsRight();
      } else {
        moved = moveCellsLeft();
      }
      break;

    default:
      if (deltaY > 0) {
        moved = moveCellsDown();
      } else {
        moved = moveCellsUp();
      }
  }

  if (moved) {
    addRandomCell();
  }

  updateField();
}

rulesButton.addEventListener('click', () => {
  rules.classList.remove('visibility');
});

rulesExitButton.addEventListener('click', () => {
  rules.classList.add('visibility');
});
