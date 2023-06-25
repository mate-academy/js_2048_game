'use strict';

// elements constants
const body = document.querySelector('body');
const start = body.querySelector('.button');
const rows = body.querySelectorAll('.field-row');
const cells = body.querySelectorAll('.field-cell');
const score = body.querySelector('.game-score');
const messages = body.querySelectorAll('.message');

// values
let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rowsPerField = 4;
const cellsPerRow = 4;

// const gameOver = false;

// change button
start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.replace('start', 'restart');
    start.textContent = 'Restart';

    document.addEventListener('keydown', (keybordEvent) => {
      switch (keybordEvent.key) {
        case 'ArrowLeft':
          moveCellsToLeft();
          break;

        case 'ArrowRight':
          moveCellsToRight();
          break;

        case 'ArrowUp':
          moveCellsUp();
          break;

        case 'ArrowDown':
          moveCellsDown();
          break;
      };
    });
  }

  cells.forEach(cell => {
    cell.className = '';
    cell.classList.add(`field-cell`);
    cell.textContent = '';
  });

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  [...messages].forEach(message => message.classList.add('hidden'));

  score.textContent = 0;

  getRandomCell();
  getRandomCell();
});

function getRandomCellNumber() {
  return Math.floor(Math.random() * 16);
}

function getRandomValue() {
  return (Math.random() >= 0.9) ? 4 : 2;
}

// getRandomCell function
function getRandomCell() {
  const cellNumber = getRandomCellNumber();
  const cellValue = getRandomValue();
  const cell = cells[cellNumber];

  if (cell.classList.length < 2) {
    field[Math.floor(cellNumber / 4)][cellNumber % 4] = cellValue;
    cell.classList.add(`field-cell--${cellValue}`);
    cell.textContent = `${cellValue}`;
  } else {
    getRandomCell();
  }
}

// slide function
function deleteZeroes(row) {
  return row.filter(cell => cell !== 0);
}

function slide(row) {
  let newRow = deleteZeroes(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score.textContent = +score.textContent + newRow[i];
      i++;
    }
  }

  newRow = deleteZeroes(newRow);

  while (newRow.length < cellsPerRow) {
    newRow.push(0);
  }

  return newRow;
}

// changeCell function
function changeCell(cell, count) {
  cell.className = '';
  cell.classList.add('field-cell');

  if (count === 0) {
    cell.textContent = '';

    return;
  }

  cell.textContent = `${count}`;
  cell.classList.add(`field-cell--${count}`);
}

function changeCellinRow(row) {
  for (let col = 0; col < cellsPerRow; col++) {
    const cell = rows[row].children[col];
    const count = field[row][col];

    changeCell(cell, count);
  }
}

function changeCellInColumn(col) {
  for (let row = 0; row < rowsPerField; row++) {
    const cell = rows[row].children[col];
    const count = field[row][col];

    changeCell(cell, count);
  }
}

// move functions
function moveCellsToLeft() {
  for (let row = 0; row < rowsPerField; row++) {
    const newRow = slide(field[row]);

    field[row] = newRow;

    changeCellinRow(row);
  }

  getRandomCell();
}

function moveCellsToRight() {
  for (let row = 0; row < rowsPerField; row++) {
    const newRow = slide(field[row].reverse()).reverse();

    field[row] = newRow;

    changeCellinRow(row);
  }

  getRandomCell();
}

function moveCellsUp() {
  for (let column = 0; column < cellsPerRow; column++) {
    let newColumn = [
      field[0][column],
      field[1][column],
      field[2][column],
      field[3][column],
    ];

    newColumn = slide(newColumn);

    field[0][column] = newColumn[0];
    field[1][column] = newColumn[1];
    field[2][column] = newColumn[2];
    field[3][column] = newColumn[3];

    changeCellInColumn(column);
  }

  getRandomCell();
}

function moveCellsDown() {
  for (let column = 0; column < cellsPerRow; column++) {
    let newColumn = [
      field[0][column],
      field[1][column],
      field[2][column],
      field[3][column],
    ];

    newColumn = slide(newColumn.reverse()).reverse();

    field[0][column] = newColumn[0];
    field[1][column] = newColumn[1];
    field[2][column] = newColumn[2];
    field[3][column] = newColumn[3];

    changeCellInColumn(column);
  }

  getRandomCell();
}
