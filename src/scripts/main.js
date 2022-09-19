'use strict';

const fieldRows = document.querySelector('tbody').rows;
const scoreBoard = document.querySelector('.game-score');
const startGame = document.querySelector('.start');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const rows = 4;
const columns = 4;
let score = 0;

let gameField = resetField();

function resetField() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

startGame.addEventListener('click', () => {
  gameField = resetField();

  score = 0;

  updateGame();
  setNewCell();
  setNewCell();

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  startGame.classList.replace('start', 'restart');
  startGame.innerText = 'Restart';
});

document.addEventListener('keyup', (type) => {
  if (!startGame.classList.contains('restart')) {
    return;
  }

  switch (type.code) {
    case 'ArrowLeft':
      slideLeft();
      setNewCell();
      break;

    case 'ArrowRight':
      slideRight();
      setNewCell();
      break;

    case 'ArrowUp':
      slideUp();
      setNewCell();
      break;

    case 'ArrowDown':
      slideDown();
      setNewCell();
      break;
  }

  if (!isPossible()) {
    loseMessage.classList.remove('hidden');
  }
});

function updateGame() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const currentCell = fieldRows[row].cells[col];
      const num = gameField[row][col];

      updateCell(currentCell, num);
    }
  }

  scoreBoard.innerText = String(score);
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.className = 'field-cell';

  if (num > 0) {
    cell.innerText = String(num);
    cell.classList.add(`field-cell--${String(num)}`);
  }
}

function isEmpty() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (gameField[row][col] === 0) {
        return true;
      }
    }
  }

  return false;
}

function isPossible() {
  let check = false;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (row < 3) {
        if (gameField[row][col] === gameField[row + 1][col]
          || gameField[row][col] === gameField[row][col + 1]) {
          check = true;
        }
      } else {
        if (gameField[row][col] === gameField[row][col + 1]) {
          check = true;
        }
      }
    }
  }

  if (!check && !isEmpty()) {
    return false;
  }

  return true;
}

function setNewCell() {
  if (!isEmpty()) {
    return;
  }

  const value = Math.random() > 0.1 ? 2 : 4;

  let check = false;

  while (!check) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * columns);

    if (gameField[row][col] === 0) {
      gameField[row][col] = value;
      check = true;

      updateGame();
    }
  }
}

function filterRow(row) {
  return row.filter(el => el !== 0);
}

function slide(row) {
  let newRow = filterRow(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
      isWin(newRow[i]);
    }
  }

  newRow = filterRow(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let i = 0; i < rows; i++) {
    let row = gameField[i];

    row = slide(row);
    gameField[i] = row;
  }

  updateGame();
}

function slideRight() {
  for (let i = 0; i < rows; i++) {
    let row = gameField[i];

    row.reverse();
    row = slide(row);
    row.reverse();
    gameField[i] = row;
  }

  updateGame();
}

function slideUp() {
  for (let column = 0; column < columns; column++) {
    let row = [gameField[0][column], gameField[1][column], gameField[2][column],
      gameField[3][column]];

    row = slide(row);

    for (let i = 0; i < columns; i++) {
      gameField[i][column] = row[i];
    }
  }

  updateGame();
}

function slideDown() {
  for (let column = 0; column < columns; column++) {
    let row = [gameField[0][column], gameField[1][column], gameField[2][column],
      gameField[3][column]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let i = 0; i < columns; i++) {
      gameField[i][column] = row[i];
    }
  }

  updateGame();
}

function isWin(value) {
  if (value === 2048) {
    winMessage.classList.remove('hidden');
    startGame.classList.replace('restart', 'start');
    startGame.innerText = 'Start';
  }
}
