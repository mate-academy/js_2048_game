'use strict';

const messages = document.querySelectorAll('.message');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const table = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

const tableGame = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function render() {
  for (let i = 0; i < tableGame.length; i++) {
    const row = table.rows[i];

    for (let j = 0; j < tableGame[i].length; j++) {
      const cell = row.cells[j];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (tableGame[i][j] !== 0) {
        cell.classList.add(`field-cell--${tableGame[i][j]}`);
        cell.textContent = tableGame[i][j];
      }
    }
  }
}

button.addEventListener('click', () => {
  if (!button.classList.contains('restart')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  for (let i = 0; i < tableGame.length; i++) {
    for (let j = 0; j < tableGame[i].length; j++) {
      tableGame[i][j] = 0;
    }
  }

  [...messages].map((message) => message.classList.add('hidden'));
  score.textContent = 0;

  [...cells].map((cell) => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  addCell();
  render();
  button.blur();
});

document.addEventListener('keyup', (e) => {
  if (
    !button.classList.contains('restart')
    || !messageLose.classList.contains('hidden')
    || !messageWin.classList.contains('hidden')
  ) {
    return;
  }

  const copyTableGame = JSON.parse(JSON.stringify(tableGame));

  switch (e.code) {
    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    default:
      return;
  }

  if (JSON.stringify(copyTableGame) === JSON.stringify(tableGame)) {
    return;
  }

  addCell();
  render();

  if ([...cells].some((cell) => cell.classList.contains('field-cell--2048'))) {
    messageWin.classList.remove('hidden');
  }

  let horizontalEnd = true;
  let verticalEnd = true;

  for (let r = 0; r < tableGame.length; r++) {
    for (let c = 0; c < tableGame.length - 1; c++) {
      if (tableGame[r][c] === tableGame[r][c + 1]) {
        horizontalEnd = false;

        return;
      }
    }
  }

  for (let r = 0; r < tableGame.length; r++) {
    const row = [
      tableGame[0][r],
      tableGame[1][r],
      tableGame[2][r],
      tableGame[3][r],
    ];

    for (let c = 0; c < row.length - 1; c++) {
      if (row[c] === row[c + 1]) {
        verticalEnd = false;

        return;
      }
    }
  }

  if (
    tableGame.every((row) => row.every((cell) => cell !== 0))
    && verticalEnd === true
    && horizontalEnd === true
  ) {
    messageLose.classList.remove('hidden');
  }
});

function randomNumber() {
  let resultValue = 2;
  const number = Math.floor(Math.random() * 10);

  if (number === 0) {
    resultValue = 4;
  }

  return resultValue;
}

function addCell() {
  let randomRow = Math.floor(Math.random() * 4);
  let randomCell = Math.floor(Math.random() * 4);

  while (tableGame[randomRow][randomCell] !== 0) {
    randomRow = Math.floor(Math.random() * 4);
    randomCell = Math.floor(Math.random() * 4);
  }

  tableGame[randomRow][randomCell] = randomNumber();
}

function filterRow(row) {
  return row.filter((cell) => cell !== 0);
}

function move(row) {
  let line = filterRow(row);

  for (let j = 0; j < line.length - 1; j++) {
    if (line[j] === line[j + 1]) {
      line[j] *= 2;
      line[j + 1] = 0;
      score.textContent = +score.textContent + +line[j];
    }
  }

  line = filterRow(line);

  while (line.length < tableGame.length) {
    line.push(0);
  }

  return line;
}

function moveLeft() {
  for (let i = 0; i < tableGame.length; i++) {
    let row = tableGame[i];

    row = move(row);
    tableGame[i] = row;
  }
}

function moveRight() {
  for (let i = 0; i < tableGame.length; i++) {
    let row = tableGame[i];

    row.reverse();
    row = move(row);
    row.reverse();
    tableGame[i] = row;
  }
}

function moveUp() {
  for (let i = 0; i < tableGame.length; i++) {
    let row = [
      tableGame[0][i],
      tableGame[1][i],
      tableGame[2][i],
      tableGame[3][i],
    ];

    row = move(row);
    tableGame[0][i] = row[0];
    tableGame[1][i] = row[1];
    tableGame[2][i] = row[2];
    tableGame[3][i] = row[3];
  }
}

function moveDown() {
  for (let i = 0; i < tableGame.length; i++) {
    let row = [
      tableGame[0][i],
      tableGame[1][i],
      tableGame[2][i],
      tableGame[3][i],
    ];

    row.reverse();
    row = move(row);
    row.reverse();
    tableGame[0][i] = row[0];
    tableGame[1][i] = row[1];
    tableGame[2][i] = row[2];
    tableGame[3][i] = row[3];
  }
}
