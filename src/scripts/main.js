'use strict';

const rows = 4;
const columns = 4;
let gameField = [];
let score = 0;
const cellScoreLimit = 2048;

const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

/* event for start or restart button */
startButton.addEventListener('click', () => {
  if (startButton.innerHTML === 'Start') {
    messageStart.classList.add('hidden');
    setNewGame();
  } else {
    resetGameField();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    messageStart.classList.remove('hidden');
    startButton.classList.replace('restart', 'start');
    startButton.innerHTML = 'Start';
    score = 0;
    gameScore.innerText = score;
  }
});

/* events for arrow buttons */
document.addEventListener('keyup', (e) => {
  if (score === 0) {
    startButton.classList.replace('start', 'restart');
    startButton.innerHTML = 'Restart';
  }

  if (e.code === 'ArrowLeft') {
    slideLeft();
    newFieldGeneretion();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    newFieldGeneretion();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    newFieldGeneretion();
  } else if (e.code === 'ArrowDown') {

    slideDown();
    newFieldGeneretion();
  }
  gameScore.innerText = score;

  if (!checkPossibleMovVerticaly() && !checkPossibleMovHorizontaly()
   && !isEmptyCell()) {
    isLose();

    // eslint-disable-next-line no-useless-return
    return;
  }
});

/* set new game */
function setNewGame() {
  resetGameField();
  newFieldGeneretion();
  newFieldGeneretion();
}

/* new field generation */
function newFieldGeneretion() {
  const r = Math.floor(Math.random() * rows);
  const c = Math.floor(Math.random() * columns);

  if (gameField[r][c] === 0) {
    const newField = document.getElementById(r.toString()
       + '-' + c.toString());

    const valueNum = Math.random();

    if (valueNum < 0.9) {
      newField.innerText = '2';
    } else {
      newField.innerText = '4';
    }
    gameField[r][c] = +newField.innerText;

    // eslint-disable-next-line no-useless-return
    return;
  } else {
    if (!isEmptyCell()) {
      return;
    }

    newFieldGeneretion();
  }
}

/* reset game field */
function resetGameField() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const fieldCell = document.querySelectorAll('.field-cell');

  for (const cell of fieldCell) {
    cell.innerText = '';
    cell.classList.value = '';
    cell.classList.add('field-cell');
  }
}

/* directions of moving for game field */
function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [gameField[0][c], gameField[1][c],
      gameField[2][c], gameField[3][c]];

    row = shift(row);

    for (let r = 0; r < rows; r++) {
      gameField[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [gameField[0][c], gameField[1][c],
      gameField[2][c], gameField[3][c]];

    row.reverse();
    row = shift(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      gameField[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row.reverse();
    row = shift(row);
    row.reverse();
    gameField[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  }
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row = shift(row);
    gameField[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  }
}

/* moving of game field */
function shift(r) {
  let row = filterZero(r);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

/* changes game field after each moving */
function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;

    if (num < cellScoreLimit) {
      cell.classList.add('field-cell' + '--' + +num.toString());
    } else {
      cell.classList.add('field-cell--2048');
      isWinner();
    }
  }
}

function filterZero(row) {
  return row.filter(r => r);
}

/* check game field for empty cells */
function isEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

/* appear winner message */
function isWinner() {
  winMessage.classList.remove('hidden');
}

/* appear lose message */
function isLose() {
  loseMessage.classList.remove('hidden');
}

/* check possible of horizontal moving */
function checkPossibleMovHorizontaly() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === gameField[r][c + 1]) {
        return true;
      }
    }
  }

  return false;
}

/* merging of two rows */
function isMergingRow(r) {
  const row = filterZero(r);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      return true;
    }
  }

  return false;
}

/* check possible of vertical moving */
function checkPossibleMovVerticaly() {
  const arr = [];
  const result = [];

  for (let c = 0; c < columns; c++) {
    arr.push([gameField[0][c], gameField[1][c],
      gameField[2][c], gameField[3][c]]);
  }

  arr.forEach(b => result.push(isMergingRow(b)));

  return result.some(el => el);
}
