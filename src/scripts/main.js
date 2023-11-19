'use strict';

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

const rows = 4;
const columns = 4;
let score = 0;

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', () => {
  restart();
  button.blur();
  button.classList.add('restart');
  button.classList.remove('start');
  button.textContent = 'Restart';
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
});

const restart = () => {
  gameScore.textContent = '0';
  score = 0;

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  setRandomNum();
  setRandomNum();
};

const findZero = () => {
  for (let x = 0; x < rows; x++) {
    if (field[x].includes(0)) {
      return true;
    }
  }

  return false;
};

const setRandomNum = () => {
  while (findZero()) {
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * columns);

    if (field[x][y] === 0) {
      const randomNum = Math.random() < 0.9 ? 2 : 4;

      field[x][y] = randomNum;
      break;
    }
  }

  makeCell();
};

const makeCell = () => {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      const value = field[x][y];
      const cell = document.getElementById(`${x}_${y}`);

      cell.textContent = '';
      cell.classList.value = 'field-cell';

      if (value !== 0) {
        cell.textContent = `${value}`;
        cell.classList.add(`field-cell--${value}`);
      }

      if (value === 2048) {
        winMessage.classList.remove('hidden');
      }

      if (!canMove()) {
        loseMessage.classList.remove('hidden');
      }
    }
  };
};

document.addEventListener('keydown', even => {
  if (even.code === 'ArrowLeft') {
    slideLeft();
  }

  if (even.code === 'ArrowRight') {
    slideRight();
  }

  if (even.code === 'ArrowUp') {
    slideUp();
  }

  if (even.code === 'ArrowDown') {
    slideDown();
  }

  gameScore.textContent = `${score}`;
});

const filterZero = (row) => {
  return row.filter(num => num !== 0);
};

const slide = (row) => {
  let moveRow = filterZero(row);

  for (let x = 0; x < moveRow.length; x++) {
    if (moveRow[x] === moveRow[x + 1]) {
      moveRow[x] *= 2;
      moveRow[x + 1] = 0;
      score += moveRow[x];
    }
  }

  moveRow = filterZero(moveRow);

  while (moveRow.length < rows) {
    moveRow.push(0);
  }

  return moveRow;
};

const slideLeft = () => {
  const startField = field.map(row => [...row]);

  for (let x = 0; x < rows; x++) {
    let row = field[x];

    row = slide(row);
    field[x] = row;
  }

  if (!identicalFields(startField, field)) {
    setRandomNum();
  }
};

const slideRight = () => {
  const startField = field.map(row => [...row]);

  for (let x = 0; x < rows; x++) {
    const row = field[x];
    let revers = [...row].reverse();

    revers = slide(revers);
    revers.reverse();
    field[x] = revers;
  }

  if (!identicalFields(startField, field)) {
    setRandomNum();
  }
};

const slideUp = () => {
  const startField = field.map(row => [...row]);

  for (let y = 0; y < columns; y++) {
    let row = [field[0][y], field[1][y], field[2][y], field[3][y]];

    row = slide(row);
    field[0][y] = row[0];
    field[1][y] = row[1];
    field[2][y] = row[2];
    field[3][y] = row[3];
  }

  if (!identicalFields(startField, field)) {
    setRandomNum();
  }
};

const slideDown = () => {
  const startField = field.map(row => [...row]);

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

  if (!identicalFields(startField, field)) {
    setRandomNum();
  }
};

const canMove = () => {
  if (findZero()) {
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
};

const identicalFields = (startField, finishField) => {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      if (startField[x][y] !== finishField[x][y]) {
        return false;
      }
    }
  }

  return true;
};
