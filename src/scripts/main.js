'use strict';

const countOfNewCellsWhenStart = 2;
const start = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameFieldCells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');

const fieldArray = [
  [8, 16, 64, 5],
  [2, 4, 2, 8],
  [4, 2, 16, 4],
  [2, 4, 2, 2],
];

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    startGame();
  }
  restart();
  updateCells(gameFieldCells, fieldArray);

  for (let i = 0; i < countOfNewCellsWhenStart; i++) {
    addNewCell(fieldArray);
    updateCells(gameFieldCells, fieldArray);
  }
});

function startGame() {
  start.classList.remove('start');
  start.classList.add('restart');
  start.textContent = 'Restart';
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

let scoreValue = 0;
let gameOver = false;

document.addEventListener('keyup', (e) => {
  if (gameOver) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      canMoveHorizontally(moveLeft, fieldArray);
      updateScore();
      break;

    case 'ArrowRight':
      canMoveHorizontally(moveRight, fieldArray);
      updateScore();
      break;

    case 'ArrowUp':
      canMoveVertically(moveRight, fieldArray);

      updateScore();
      break;

    case 'ArrowDown':
      canMoveVertically(moveLeft, fieldArray);
      updateScore();
  }

  checkIfLose(fieldArray);
});

function moveLeft(row) {
  let nonZeroCells = filterRow(row);

  for (let i = 0; i < nonZeroCells.length; i++) {
    const cell = nonZeroCells[i];
    const nextCell = nonZeroCells[i + 1];

    if (cell === nextCell) {
      nonZeroCells[i] = cell * 2;
      scoreValue += nonZeroCells[i];
      nonZeroCells[i + 1] = 0;
      updateScore();
    }
  }

  nonZeroCells = filterRow(nonZeroCells);

  for (let i = 0; i < row.length; i++) {
    row[i] = nonZeroCells[i] || 0;
  }
}

function canMoveHorizontally(move, arr) {
  switch (move) {
    case moveLeft:
    case moveRight:
      const copyFieldArray = flatArray(arr);

      for (const row of arr) {
        move(row);
      }

      if (!areArraysEqual(copyFieldArray, flatArray(arr))) {
        checkIfLose(arr);
        addNewCell(arr);
        updateCells(gameFieldCells, arr);
      }
      break;
  }
}

function canMoveVertically(move, arr) {
  switch (move) {
    case moveLeft:
    case moveRight:
      const arrayRotated = rotateArray(arr);
      const arrayRotatedFlat = flatArray(arrayRotated);

      for (let i = 0; i < arrayRotated.length; i++) {
        move(arrayRotated[i]);
      }

      if (!areArraysEqual(
        arrayRotatedFlat, flatArray(arrayRotated))) {
        checkIfLose(arr);
        addNewCell(arrayRotated);

        const arrayBack = rotateArrayBack(arrayRotated);

        for (let i = 0; i < arrayBack.length; i++) {
          for (let j = 0; j < arrayBack[i].length; j++) {
            arr[i][j] = arrayBack[i][j];
          }
        }

        updateCells(gameFieldCells, arrayBack);
      }
      break;
  }
}

function moveRight(row) {
  moveLeft(row.reverse());
  row.reverse();
}

function addNewCell(arr) {
  const emptyIndxs = arr
    .map((row, rowIndex) => row.map(
      (col, colIndex) => col === 0 ? [rowIndex, colIndex] : null))
    .flat()
    .filter(index => index !== null);

  if (emptyIndxs.length > 0) {
    const randIndex = emptyIndxs[Math.floor(Math.random() * emptyIndxs.length)];
    const [rowIndex, colIndex] = randIndex;

    arr[rowIndex][colIndex] = Math.random() <= 0.9 ? 2 : 4;
    checkIfLose(arr);
    updateScore();
  }
}

function updateCells(gameCells, arr) {
  const flatFieldArray = flatArray(arr);

  setValueToCell(gameCells, flatFieldArray);
}

function updateScore() {
  score.textContent = scoreValue;

  for (const row of fieldArray) {
    for (const cell of row) {
      if (cell === 2048) {
        winMessage.classList.remove('hidden');
        gameOver = true;

        return;
      }
    }
  }
}

function checkIfLose(arr) {
  if (!canMergeCell() && !hasEmptyCell(arr)) {
    loseMessage.classList.remove('hidden');
    gameOver = true;
  }
}

function hasEmptyCell(arr) {
  for (const row of arr) {
    if (row.includes(0)) {
      return true;
    }
  }

  return false;
}

function canMergeCell() {
  for (let i = 0; i < fieldArray.length; i++) {
    const row = fieldArray[i];

    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        return true;
      }
    }
  }

  for (let i = 0; i < fieldArray.length - 1; i++) {
    for (let j = 0; j < fieldArray[i].length; j++) {
      if (fieldArray[i][j] === fieldArray[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function filterRow(row) {
  return row.filter(item => item !== 0);
}

function flatArray(arr) {
  return arr.flat();
}

function areArraysEqual(arr1, arr2) {
  return arr1.length === arr2.length && arr1.every(
    (value, index) => value === arr2[index]);
}

function restart() {
  for (let i = 0; i < fieldArray.length; i++) {
    fieldArray[i] = [0, 0, 0, 0];
  }

  gameOver = false;

  if (!loseMessage.classList.contains('hidden')) {
    loseMessage.classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

  scoreValue = 0;
  updateScore();
}

function setValueToCell(cells, arr) {
  for (let i = 0; i < cells.length; i++) {
    if (arr[i] === 0) {
      cells[i].textContent = '';
      cells[i].classList = 'field-cell';
    } else {
      cells[i].textContent = arr[i];
      cells[i].classList = `field-cell field-cell--${arr[i]}`;
    }
  }
}

function rotateArray(arr) {
  const newRows = [];

  for (let i = 0; i < arr.length; i++) {
    const row = [];

    for (let j = arr.length - 1; j >= 0; j--) {
      row.push(arr[j][i]);
    }
    newRows.push(row);
  }

  return newRows;
}

function rotateArrayBack(arr) {
  const newRows = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    const row = [];

    for (let j = 0; j < arr[i].length; j++) {
      row.push(arr[j][i]);
    }
    newRows.push(row);
  }

  return newRows;
}
