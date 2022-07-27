'use strict';

const square = 4;
const cellSize = 75;
const gapSize = 10;
let score = 0;
const values = [[0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]];

const root = document.querySelector('.container');
const gameBoard = document.createElement('div');

gameBoard.className = 'game-field';
root.firstElementChild.after(gameBoard);

for (let i = 0; i < square; i++) {
  for (let j = 0; j < square; j++) {
    const cell = document.createElement('div');

    cell.className = 'field-cell';
    cell.id = `${i + '-' + j}`;
    gameBoard.append(cell);
  }
}

root.style.width = square * cellSize + (square - 1) * gapSize + 'px';

function generate() {
  const probability = Math.random();
  const rowIndex = Math.floor(Math.random() * square);
  const columnIndex = Math.floor(Math.random() * square);
  let newValue = 2;

  if (probability <= 0.1) {
    newValue = 4;
  }

  // cell.classList.add('cell-new');
  // cell.style.animationDuration = '0.3s';

  if (values[rowIndex][columnIndex] === 0) {
    values[rowIndex][columnIndex] = newValue;

    const cell = document.getElementById(`${rowIndex + '-' + columnIndex}`);

    updateBoard(cell, newValue);
  } else {
    generate();
  }
}

generate();
generate();

function updateBoard(cell, value) {
  cell.innerText = value === 0 ? '' : value;
  cell.className = '';
  cell.classList.add('field-cell');
  cell.classList.add(`field-cell--${value}`);
}

function slide(row) {
  let newRow = row.filter(num => num !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      score += newRow[i];
    }
  }
  newRow = newRow.filter(num => num !== 0);

  while (newRow.length < square) {
    newRow.push(0);
  }

  return newRow;
}

function moveRow(direction) {
  for (let rowIndex = 0; rowIndex < square; rowIndex++) {
    let row = values[rowIndex];

    if (direction === 'right') {
      row.reverse();
    }

    row = slide(row);

    if (direction === 'right') {
      row.reverse();
    }

    values[rowIndex] = row;

    for (let columnIndex = 0; columnIndex < square; columnIndex++) {
      const cell = document.getElementById(`${rowIndex + '-' + columnIndex}`);
      const value = values[rowIndex][columnIndex];

      updateBoard(cell, value);
    }
  }
}

function moveColumn(direction) {
  for (let columnIndex = 0; columnIndex < square; columnIndex++) {
    let row = [values[0][columnIndex], values[1][columnIndex],
      values[2][columnIndex], values[3][columnIndex]];

    if (direction === 'down') {
      row.reverse();
    }

    row = slide(row);

    if (direction === 'down') {
      row.reverse();
    }

    for (let rowIndex = 0; rowIndex < square; rowIndex++) {
      values[rowIndex][columnIndex] = row[rowIndex];

      const cell = document.getElementById(`${rowIndex + '-' + columnIndex}`);
      const value = values[rowIndex][columnIndex];

      updateBoard(cell, value);
    }
  }
}

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      moveRow('left');
      break;
    case 'ArrowRight':
      moveRow('right');
      break;
    case 'ArrowUp':
      moveColumn('up');
      break;
    case 'ArrowDown':
      moveColumn('down');
      break;
  }

  generate();
  alert(score);
});
