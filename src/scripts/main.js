'use strict';

const gameField = document.querySelector('.game_field').children[0];
const controlButton = document.querySelector('.button');
const score = document.querySelector('.game_score');
const messageContainer = document.querySelector('.message_container');
const messageLose = document.querySelector('.message_lose');
const messageWin = document.querySelector('.message_win');

const gameRows = [[], [], [], []];

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    gameRows[i][j] = gameField.children[i].children[j];
  }
}

function setCell([y, x], val = ['']) {
  const cell = gameRows[x][y];
  const prevCellClass = cell.classList[1] ? cell.classList[1] : null;

  cell.innerHTML = val;

  if (prevCellClass) {
    cell.classList.replace(prevCellClass, 'field_cell--' + val);
  }
  cell.classList.add('field_cell--' + val);
}

function hideAllMessages() {
  for (const message of messageContainer.children) {
    message.classList.add('hidden');
  }
}

function initializeGame() {
  resetCells(gameRows);
  hideAllMessages();

  for (let i = 0; i < 2; i++) {
    createNewCell();
  }

  controlButton.classList.replace('start', 'restart');
  controlButton.innerHTML = 'Restart';
}

function createNewCell() {
  const emptyCellCoord = findRandomEmptyCell(gameRows);

  if (emptyCellCoord === null) {
    return;
  }

  const [x, y] = emptyCellCoord;

  setCell([y, x], 2);
}

function resetCells(grid) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j];

      cell.innerHTML = '';
      cell.classList = ['field_cell'];
    }
  }
}

function findRandomEmptyCell(grid) {
  const emptyCells = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].classList.length === 1) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[randomIndex];
}

controlButton.addEventListener('click', initializeGame);

document.onkeydown = (e) => {
  if (
    e.key === 'ArrowRight'
    || e.key === 'ArrowLeft'
    || e.key === 'ArrowUp'
    || e.key === 'ArrowDown'
  ) {
    e.preventDefault();

    const originalCellValues = extractCellValues(gameRows);

    if (e.code === 'ArrowRight') {
      moveRight();
    } else if (e.code === 'ArrowLeft') {
      moveLeft();
    } else if (e.code === 'ArrowUp') {
      moveUp();
    } else if (e.code === 'ArrowDown') {
      moveDown();
    }

    const updatedCellValues = extractCellValues(gameRows);
    const cellsChanged = !arraysEqual(originalCellValues, updatedCellValues);

    if (cellsChanged) {
      createNewCell();
    }
  }
};

function extractCellValues(grid) {
  const values = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cellValue = parseInt(grid[i][j].innerHTML) || 0;

      values.push(cellValue);
    }
  }

  return values;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function moveLeft() {
  for (let i = 0; i < gameRows.length; i++) {
    for (let j = 1; j < gameRows[i].length; j++) {
      moveOrMergeCell(i, j, 0, -1);
    }
  }
}

function moveRight() {
  for (let i = 0; i < gameRows.length; i++) {
    for (let j = gameRows[i].length - 2; j >= 0; j--) {
      moveOrMergeCell(i, j, 0, 1);
    }
  }
}

function moveUp() {
  for (let i = 1; i < gameRows.length; i++) {
    for (let j = 0; j < gameRows[i].length; j++) {
      moveOrMergeCell(i, j, -1, 0);
    }
  }
}

function moveDown() {
  for (let i = gameRows.length - 2; i >= 0; i--) {
    for (let j = 0; j < gameRows[i].length; j++) {
      moveOrMergeCell(i, j, 1, 0);
    }
  }
}

function moveOrMergeCell(externalI, externalJ, di, dj) {
  let i = externalI;
  let j = externalJ;
  let currentCell = gameRows[i][j];

  if (currentCell.innerHTML !== '') {
    const value = parseInt(currentCell.innerHTML);

    let nextCell = gameRows[i + di] ? gameRows[i + di][j + dj] : null;

    while (nextCell && nextCell.innerHTML === '') {
      nextCell.classList = ['field_cell', `field_cell--${value}`].join(' ');
      nextCell.innerHTML = value;

      currentCell.classList = ['field_cell'];
      currentCell.innerHTML = '';

      currentCell = nextCell;
      i += di;
      j += dj;
      nextCell = gameRows[i + di] ? gameRows[i + di][j + dj] : null;
    }

    if (nextCell && parseInt(nextCell.innerHTML) === value) {
      const mergedValue = value * 2;
      const originalScore = parseInt(score.innerHTML);

      score.innerHTML = mergedValue + originalScore;

      nextCell.classList = ['field_cell', `field_cell--${mergedValue}`].join(
        ' '
      );
      nextCell.innerHTML = mergedValue;

      currentCell.classList = ['field_cell'];
      currentCell.innerHTML = '';
    }
  }

  if (find2048Value()) {
    hideAllMessages();
    messageWin.classList.remove('hidden');
  }

  if (!hasAvailableMoves()) {
    hideAllMessages();
    messageLose.classList.remove('hidden');
  }
}

function hasAvailableMoves() {
  for (let i = 0; i < gameRows.length; i++) {
    for (let j = 0; j < gameRows[i].length; j++) {
      if (gameRows[i][j].innerHTML === '') {
        return true;
      }
    }
  }

  for (let i = 0; i < gameRows.length; i++) {
    for (let j = 0; j < gameRows[i].length; j++) {
      const currentValue = parseInt(gameRows[i][j].innerHTML);

      if (!isNaN(currentValue)) {
        if (j < gameRows[i].length - 1) {
          const rightNeighbor = parseInt(gameRows[i][j + 1].innerHTML);

          if (currentValue === rightNeighbor) {
            return true;
          }
        }

        if (i < gameRows.length - 1) {
          const downNeighbor = parseInt(gameRows[i + 1][j].innerHTML);

          if (currentValue === downNeighbor) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function find2048Value() {
  for (let i = 0; i < gameRows.length; i++) {
    for (let j = 0; j < gameRows[i].length; j++) {
      const cellValue = parseInt(gameRows[i][j].innerHTML);

      if (!isNaN(cellValue) && cellValue >= 2048) {
        return true;
      }
    }
  }

  return false;
}
