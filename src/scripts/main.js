'use strict';

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const start = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const rowsArr = [...document.querySelectorAll('.field-row')];
const cellsArr = [...document.querySelectorAll('.field-cell')];
const gameScore = document.querySelector('.game-score');
const rows = 4;
const columns = 4;
let result = 0;

function gameBeginning() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  startWithRandom();
}

function empty() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (field[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function squareValue(square, num) {
  square.innerText = '';
  square.classList.value = '';
  square.classList.add(`field-cell--${num}`, 'field-cell');

  if (num > 0) {
    square.innerText = num;
  }

  if (square === 2048) {
    messageWin.style.display = 'block';
  }
}

function startWithRandom() {
  if (!empty()) {
    return;
  }

  let detected = false;

  while (!detected) {
    const x = Math.floor(Math.random() * 4);
    const y = Math.floor(Math.random() * 4);
    const random = Math.random() * 100;

    if (field[x][y] === 0) {
      const square = rowsArr[x].children[y];

      if (random < 10) {
        field[x][y] = 4;
        squareValue(square, 4);
      } else {
        field[x][y] = 2;
        squareValue(square, 2);
      }

      detected = true;
    }
  }
}

function connect(array) {
  let rowFilter = array.filter(item => item !== 0);

  for (let i = 0; i < rowFilter.length - 1; i++) {
    if (rowFilter[i] === rowFilter[i + 1]) {
      rowFilter[i] *= 2;
      rowFilter[i + 1] = 0;
      result += rowFilter[i];
    }
  }

  gameScore.innerHTML = result;
  rowFilter = rowFilter.filter(item => item !== 0);

  while (rowFilter.length < columns) {
    rowFilter.push(0);
  }

  return rowFilter;
}

function checkConnection() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns - 1; j++) {
      if (field[i][j] === field[i][j + 1] || field[j][i] === field[j + 1][i]) {
        return true;
      }
    }
  }

  return false;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      for (let c = 0; c < columns; c++) {
        let row = field.map(el => el[c]);

        row = connect(row);

        for (let r = 0; r < rows; r++) {
          field[r][c] = row[r];

          const quadrate = rowsArr[r].children[c];
          const number = field[r][c];

          squareValue(quadrate, number);
        }
      }

      startWithRandom();
      break;
    case 'ArrowDown':
      for (let c = 0; c < columns; c++) {
        let row = field.map(el => el[c]).reverse();

        row = connect(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
          field[r][c] = row[r];

          const quadrate = rowsArr[r].children[c];
          const number = field[r][c];

          squareValue(quadrate, number);
        }
      }

      startWithRandom();
      break;
    case 'ArrowRight':
      for (let r = 0; r < rows; r++) {
        let row = field[r];

        row.reverse();
        row = connect(row);
        row.reverse();
        field[r] = row;

        for (let c = 0; c < columns; c++) {
          const quadrate = rowsArr[r].children[c];
          const number = field[r][c];

          squareValue(quadrate, number);
        }
      }

      startWithRandom();
      break;
    case 'ArrowLeft':
      for (let r = 0; r < rows; r++) {
        let row = field[r];

        row = connect(row);
        field[r] = row;

        for (let c = 0; c < columns; c++) {
          const quadrate = rowsArr[r].children[c];
          const number = field[r][c];

          squareValue(quadrate, number);
        }
      }

      startWithRandom();
      break;
  }

  if (!checkConnection() && empty()) {
    messageLose.style.display = 'block';
  }
});

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    gameBeginning();
  }

  if (start.classList.contains('restart')) {
    cellsArr.forEach(i => squareValue(i, 0));
    result = 0;
    gameScore.innerHTML = result;
    messageLose.style.display = 'none';
    messageWin.style.display = 'none';
    gameBeginning();
  }
});
