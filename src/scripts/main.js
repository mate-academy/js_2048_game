'use strict';

const body = document.querySelector('body');
const start = body.querySelector('.button');
const rows = body.querySelectorAll('.field-row');
const cells = body.querySelectorAll('.field-cell');
const score = body.querySelector('.game-score');
const messages = body.querySelectorAll('.message');
const winMessage = body.querySelector('.message-win');
const loseMessage = body.querySelector('.message-lose');

let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameOver = false;

const rowsPerField = 4;
const cellsPerRow = 4;

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.replace('start', 'restart');
    start.textContent = 'Restart';

    document.addEventListener('keydown', (keybordEvent) => {
      if (gameOver === true) {
        return;
      }

      const boardClone = JSON.stringify(field);

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

      if (isImpossibleMove()) {
        loseMessage.classList.remove('hidden');
      }

      if (boardClone === JSON.stringify(field)) {
        return;
      }

      if ([...cells].some(cell =>
        cell.classList.contains('field-cell--2048'))) {
        gameOver = true;
        winMessage.classList.remove('hidden');
      }

      getRandomCell();
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

  gameOver = false;

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

function moveCellsToLeft() {
  for (let row = 0; row < rowsPerField; row++) {
    const newRow = slide(field[row]);

    field[row] = newRow;

    changeCellinRow(row);
  }
}

function moveCellsToRight() {
  for (let row = 0; row < rowsPerField; row++) {
    const newRow = slide(field[row].reverse()).reverse();

    field[row] = newRow;

    changeCellinRow(row);
  }
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
}

function isImpossibleMove() {
  for (let row = 0; row < rowsPerField; row++) {
    const column = [
      field[0][row],
      field[1][row],
      field[2][row],
      field[3][row],
    ];

    for (let cell = 0; cell < cellsPerRow; cell++) {
      if (
        field[row][cell] === 0
        || field[row][cell] === field[row][cell + 1]
        || column[cell] === column[cell + 1]
      ) {
        return false;
      }
    }
  }

  return true;
}
