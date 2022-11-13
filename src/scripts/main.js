'use strict';

const columnsTable = 4;
const rowsTable = 4;
let score = 0;
const emptyCellsClass = 'field-cell';
let table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const gameField = document.querySelector('.game-field');
const rowsList = gameField.children[0].children;
const scoreField = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', (e) => {
  if (e.target.innerText === 'Start') {
    setNumbers();
    setNumbers();
    setGame();

    messageWin.classList.add('hidden');
    messageStart.hidden = true;
    e.target.innerText = 'Reset';
    e.target.classList.replace('start', 'restart');
  } else if (e.target.innerText === 'Reset') {
    score = 0;

    table = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    setGame();
    messageLose.classList.add('hidden');
    messageStart.hidden = false;
    messageWin.classList.add('hidden');
    e.target.innerText = 'Start';
    e.target.classList.replace('restart', 'start');
  }
});

document.addEventListener('keyup', (e) => {
  if (button.innerText === 'Reset') {
    switch (e.code) {
      case 'ArrowLeft':
        slideLeft();
        setNumbers();
        break;

      case 'ArrowRight':
        slideRight();
        setNumbers();
        break;

      case 'ArrowUp':
        slideUp();
        setNumbers();
        break;

      case 'ArrowDown':
        slideDown();
        setNumbers();
        break;
    }
  }
});

function setGame() {
  for (let i = 0; i < rowsTable; i++) {
    for (let k = 0; k < columnsTable; k++) {
      const setDefaultClass = () => {
        rowsList[i].children[k].classList = emptyCellsClass;
      };
      const showNumber = (number) => {
        rowsList[i].children[k].innerText = number;
      };

      if (table[i][k] === 0) {
        setDefaultClass();
        showNumber('');
      } else {
        if (table[i][k] >= 2048) {
          messageWin.classList.remove('hidden');
        };
        setDefaultClass();
        showNumber(table[i][k]);

        rowsList[i].children[k].classList.add(`field-cell--${table[i][k]}`);
      }
    }
  };

  scoreField.innerText = score;
};

function hasEmptyCell() {
  for (let i = 0; i < rowsTable; i++) {
    for (let k = 0; k < columnsTable; k++) {
      if (table[i][k] === 0) {
        return true;
      }
    }
  }

  return false;
};

function setNumbers() {
  if (!hasEmptyCell()) {
    if (!checkStep()) {
      messageLose.classList.remove('hidden');
    }

    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rowsTable);
    const c = Math.floor(Math.random() * columnsTable);

    if (table[r][c] === 0) {
      if (Math.floor(Math.random() * 10) < 9) {
        table[r][c] = 2;
      } else {
        table[r][c] = 4;
      }

      setGame();
      found = true;
    }
  }
};

function filterZero(rowFilter) {
  return rowFilter.filter(num => num !== 0);
};

function slide(rowSlide) {
  let row = filterZero(rowSlide);

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columnsTable) {
    row.push(0);
  }

  return row;
};

function slideLeft() {
  for (let i = 0; i < rowsTable; i++) {
    let tableRow = table[i];

    tableRow = slide(tableRow);
    table[i] = tableRow;

    setGame();
  }
};

function slideRight() {
  for (let i = 0; i < rowsTable; i++) {
    let tableRow = table[i];

    tableRow.reverse();
    tableRow = slide(tableRow);
    tableRow.reverse();
    table[i] = tableRow;

    setGame();
  }
};

function slideUp() {
  for (let i = 0; i < columnsTable; i++) {
    let tableRow = [table[0][i], table[1][i], table[2][i], table[3][i]];

    tableRow = slide(tableRow);

    for (let k = 0; k < rowsTable; k++) {
      table[k][i] = tableRow[k];
    }

    setGame();
  }
};

function slideDown() {
  for (let i = 0; i < columnsTable; i++) {
    let tableRow = [table[0][i], table[1][i], table[2][i], table[3][i]];

    tableRow.reverse();
    tableRow = slide(tableRow);
    tableRow.reverse();

    for (let k = 0; k < rowsTable; k++) {
      table[k][i] = tableRow[k];
    }

    setGame();
  }
};

function checkStep() {
  for (let i = 1; i < rowsTable; i++) {
    for (let k = 1; k < columnsTable; k++) {
      if (table[i - 1][k - 1] === table[i - 1][k]) {
        return true;
      };

      if (table[k - 1][i - 1] === table[k][i - 1]) {
        return true;
      }
    }
  }

  return false;
}
