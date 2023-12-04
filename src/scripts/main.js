/* eslint-disable max-len */
'use strict';

const startButton = document.querySelector('.start'); // 37, 72-73, 124-125
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

let gameStarted = false;
let score = 0;
const rows = 4;
const columns = 4;
let board;

const moveLeft = 'ArrowLeft';
const moveRight = 'ArrowRight';
const moveUp = 'ArrowUp';
const moveDown = 'ArrowDown';

window.onload = function() {
  setGame();
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const fieldCell = document.createElement('div');

      fieldCell.classList.add('field-cell');
      fieldCell.id = `${r}-${c}`;

      const cellValue = board[r][c];

      updateFieldCell(fieldCell, cellValue);
      document.querySelector('.game-field').append(fieldCell);
    }
  }

  gameStarted = false;
};

function updateFieldCell(fieldCell, cellValue) {
  fieldCell.innerText = '';
  fieldCell.classList.value = '';
  fieldCell.classList.add('field-cell');

  if (cellValue > 0) {
    fieldCell.innerText = cellValue;
    fieldCell.classList.add(`field-cell--${cellValue}`);
  }
};

document.addEventListener('keydown', (e) => {
  if (!gameStarted) {
    return;
  }

  switch (e.code) {
    case moveLeft:
      return slideLeft();
    case moveRight:
      return slideRight();
    case moveUp:
      return slideUp();
    case moveDown:
      return slideDown();
  }

  document.querySelector('.game-score').innerText = score;

  if (gameIsOver()) {
    loseMessage.classList.remove('hidden');
  }

  if (isWinner()) {
    winMessage.classList.remove('hidden');
  }
});

startButton.addEventListener('click', () => {
  if (!startButton.classList.contains('start')) {
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.innerText = 'Start';
    gameStarted = false;
    resetGame();
  } else {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerHTML = 'Restart';
    startMessage.classList.add('hidden');
    gameStarted = true;
    addRandomCell();
    addRandomCell();
  }
});

function resetGame() {
  score = 0;
  document.querySelector('.game-score').innerText = score;
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const fieldCell = document.getElementById(`${r}-${c}`);

      updateFieldCell(fieldCell, 0);
    }
  }
}

function hasEmptyFieldCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addRandomCell() {
  if (!hasEmptyFieldCell) {
    return;
  }

  while (true) {
    const randomRowIndex = Math.floor(Math.random() * rows);
    const randomColumnIndex = Math.floor(Math.random() * columns);

    if (board[randomRowIndex][randomColumnIndex] === 0) {
      const randomFieldCell = document.getElementById(randomRowIndex.toString() + '-' + randomColumnIndex.toString());
      const randomCellValue = Math.random() >= 0.1 ? 2 : 4;

      board[randomRowIndex][randomColumnIndex] = randomCellValue;
      randomFieldCell.innerText = randomCellValue;
      randomFieldCell.classList.add(`field-cell--${randomCellValue}`);
      break;
    }
  }
}

function arraysAreEqual(arr1, arr2) {
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

function clearZeroes(row) {
  return row.filter(Boolean);
}

function slide(row) {
  let newRow = clearZeroes(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = clearZeroes(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  slideLeftAndRight('left');
}

function slideRight() {
  slideLeftAndRight('right');
}

function slideUp() {
  slideUpAndDown('up');
}

function slideDown() {
  slideUpAndDown('down');
}

function slideLeftAndRight(direction) {
  let isAnyCellMoved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const prevRow = [...row];

    if (direction === 'right') {
      row.reverse();
    }

    row = slide(row);

    if (direction === 'right') {
      row.reverse();
    }
    board[r] = row;

    if (!arraysAreEqual(prevRow, row)) {
      isAnyCellMoved = true;
    }

    for (let c = 0; c < columns; c++) {
      const fieldCell = document.getElementById(`${r}-${c}`);
      const cellValue = board[r][c];

      updateFieldCell(fieldCell, cellValue);
    }
  }

  if (isAnyCellMoved) {
    addRandomCell();
  }
}

function slideUpAndDown(direction) {
  let isAnyCellMoved = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const prevRow = [...row];

    if (direction === 'down') {
      row.reverse();
    }
    row = slide(row);

    if (direction === 'down') {
      row.reverse();
    }

    if (!arraysAreEqual(prevRow, row)) {
      isAnyCellMoved = true;
    }

    for (let r = 0; r < columns; r++) {
      board[r][c] = row[r];

      const fieldCell = document.getElementById(`${r}-${c}`);
      const cellValue = board[r][c];

      updateFieldCell(fieldCell, cellValue);
    }
  }

  if (isAnyCellMoved) {
    addRandomCell();
  }
}

function gameIsOver() {
  const hasNoEmptyCells = !hasEmptyFieldCell();
  let move = true;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (c > 0 && board[r][c] === board[r][c - 1]) {
        move = false;
        break;
      }

      if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        move = false;
        break;
      }

      if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        move = false;
        break;
      }

      if (r > 0 && board[r][c] === board[r - 1][c]) {
        move = false;
        break;
      }
    }
  }

  return move && hasNoEmptyCells;
}

function isWinner() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}
