'use strict';

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const columns = 4;
let score = 0;

const button = document.querySelector('.button');
const scoreValue = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
  button.blur();
  restart();
});

function restart() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  scoreValue.textContent = '0';
  score = 0;
  setNewNum();
  setNewNum();
};

function updateCells() {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      const cell = document.getElementById(`${x}:${y}`);
      const value = field[x][y];

      cell.textContent = '';
      cell.classList.value = 'field-cell';

      if (value !== 0) {
        cell.textContent = `${value}`;
        cell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }

  if (!isMoreMoves()) {
    loseMessage.classList.remove('hidden');
  }
};

function isMoreMoves() {
  if (hasEmptyCell()) {
    return true;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      if (field[x][y] === field[x][y + 1]) {
        return true;
      }
    }
  }

  for (let x = 0; x < rows - 1; x++) {
    for (let y = 0; y < columns; y++) {
      if (field[x][y] === field[x + 1][y]) {
        return true;
      }
    }
  }

  return false;
}

function hasEmptyCell() {
  for (let x = 0; x < rows; x++) {
    if (field[x].includes(0)) {
      return true;
    }
  }

  return false;
}

function setNewNum() {
  while (hasEmptyCell()) {
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * columns);

    if (field[x][y] === 0) {
      const randomNum = Math.random() < 0.9 ? 2 : 4;

      field[x][y] = randomNum;
      updateCells();
      break;
    }
  }
}

document.addEventListener('keydown', ev => {
  switch (ev.key) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }

  scoreValue.textContent = `${score}`;
});

function slideLeft() {
  const initialField = field.map(row => [...row]);

  for (let x = 0; x < rows; x++) {
    let row = field[x];

    row = slide(row);
    field[x] = row;
  }

  if (!isArraysEquals(initialField, field)) {
    setNewNum();
  }
};

function slideRight() {
  const initialField = field.map(row => [...row]);

  for (let x = 0; x < rows; x++) {
    let row = field[x];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[x] = row;
  }

  if (!isArraysEquals(initialField, field)) {
    setNewNum();
  }
};

function slideUp() {
  const initialField = field.map(row => [...row]);

  for (let y = 0; y < columns; y++) {
    let row = [field[0][y], field[1][y], field[2][y], field[3][y]];

    row = slide(row);
    field[0][y] = row[0];
    field[1][y] = row[1];
    field[2][y] = row[2];
    field[3][y] = row[3];
  }

  if (!isArraysEquals(initialField, field)) {
    setNewNum();
  }
}

function slideDown() {
  const initialField = field.map(row => [...row]);

  for (let y = 0; y < columns; y++) {
    let row = [field[0][y], field[1][y], field[2][y], field[3][y]];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[0][y] = row[0];
    field[1][y] = row[1];
    field[2][y] = row[2];
    field[3][y] = row[3];
  }

  if (!isArraysEquals(initialField, field)) {
    setNewNum();
  }
}

function slide(row) {
  let slidedRow = filterZeros(row);

  for (let i = 0; i < slidedRow.length - 1; i++) {
    if (slidedRow[i] === slidedRow[i + 1]) {
      slidedRow[i] *= 2;
      slidedRow[i + 1] = 0;
      score += slidedRow[i];
    }
  }

  slidedRow = filterZeros(slidedRow);

  while (slidedRow.length < rows) {
    slidedRow.push(0);
  }

  return slidedRow;
}

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function isArraysEquals(arrayA, arrayB) {
  for (let i = 0; i < arrayA.length; i++) {
    for (let j = 0; j < arrayA[i].length; j++) {
      if (arrayA[i][j] !== arrayB[i][j]) {
        return false;
      }
    }
  }

  return true;
}
