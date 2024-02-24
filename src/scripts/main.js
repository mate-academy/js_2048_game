'use strict';

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function showMessage(message) {
  message.classList.remove('hidden');
};

function hideMessage(message) {
  message.classList.add('hidden');
}

let score = 0;
let cell;
let num;
let row;
const rows = 4;
const columns = 4;

let field = document.getElementById('field');

field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < columns; c++) {
    cell = document.createElement('div');

    cell.id = r.toString() + '-' + c.toString();

    num = field[r][c];

    updateTile(cell, num);
    document.getElementById('field').append(cell);
  }
}

function updateTile(tile, numer) {
  cell = tile;
  num = numer;
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;

    if (num <= 1024) {
      cell.classList.add('field-cell--' + num.toString());
    } else {
      cell.classList.add('field-cell--2048');
    }
  }
}

function filterZero(arrRow) {
  return arrRow.filter(number => number !== 0);
}

function slide(arrRow) {
  row = filterZero(arrRow);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  let originalRow;

  for (let r = 0; r < rows; r++) {
    row = field[r];

    originalRow = row.slice();

    field[r] = slide(row);

    for (let c = 0; c < columns; c++) {
      cell = document.getElementById(r.toString() + '-' + c.toString());
      num = field[r][c];
      updateTile(cell, num);
    }
  }

  if (hasValue(2048)) {
    showMessage(messageWin);
    hideMessage(messageStart);
  }

  if (!hasEmptyTile() && !arraysEqual(originalRow, row)) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function slideRight() {
  let originalRow;

  for (let r = 0; r < rows; r++) {
    row = field[r].reverse();

    originalRow = row.slice();

    field[r] = slide(row).reverse();

    for (let c = 0; c < columns; c++) {
      cell = document.getElementById(r.toString() + '-' + c.toString());
      num = field[r][c];
      updateTile(cell, num);
    }
  }

  if (hasValue(2048)) {
    hideMessage(messageStart);
    showMessage(messageWin);
  }

  if (!hasEmptyTile() && !arraysEqual(originalRow, row)) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function slideUp() {
  let originalRow;

  for (let c = 0; c < columns; c++) {
    row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    originalRow = row.slice();

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];
      cell = document.getElementById(r.toString() + '-' + c.toString());
      num = field[r][c];
      updateTile(cell, num);
    }
  }

  if (hasValue(2048)) {
    showMessage(messageWin);
    hideMessage(messageStart);
  }

  if (!hasEmptyTile() && !arraysEqual(originalRow, row)) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function slideDown() {
  let originalRow;

  for (let c = 0; c < columns; c++) {
    originalRow = row.slice();

    row = [field[0][c], field[1][c], field[2][c], field[3][c]].reverse();

    row = slide(row).reverse();

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];
      cell = document.getElementById(r.toString() + '-' + c.toString());
      num = field[r][c];
      updateTile(cell, num);
    }
  }

  if (hasValue(2048)) {
    showMessage(messageWin);
    hideMessage(messageStart);
  }

  if (!hasEmptyTile() && !arraysEqual(originalRow, row)) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function setNumber() {
  if (!hasValue(0)) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (field[r][c] === 0) {
      const randomNumber = Math.random();

      field[r][c] = randomNumber < 0.9 ? 2 : 4;

      cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = field[r][c].toString();
      cell.classList.add('field-cell--' + field[r][c].toString());
      found = true;
    }
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 0) {
        return true;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (c < columns - 1 && field[r][c] === field[r][c + 1]) {
        return true;
      } else if (r < rows - 1 && field[r][c] === field[r + 1][c]) {
        return true;
      } else {
        return false;
      }
    }
  }
}

function hasValue(value) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === value) {
        return true;
      }
    }
  }

  return false;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (arr1[r][c] !== arr2[r][c]) {
        return false;
      }
    }
  }

  return true;
}

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  document.addEventListener('keyup', (e) => {
    const prevField = JSON.parse(JSON.stringify(field));

    if (e.code === 'ArrowLeft') {
      slideLeft();
    } else if (e.code === 'ArrowRight') {
      slideRight();
    } else if (e.code === 'ArrowUp') {
      slideUp();
    } else if (e.code === 'ArrowDown') {
      slideDown();
    }

    document.querySelector('.game-score').innerText = score;

    const fieldChanged = !arraysEqual(prevField, field);

    if (fieldChanged) {
      setNumber();
    }
  });

  clearField();
  hideMessage(messageWin);
  hideMessage(messageLose);
  hideMessage(messageStart);

  startButton.classList.value = '';
  startButton.classList.add('button', 'restart');
  startButton.innerText = 'Restart';

  score = 0;

  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  updateScore();
  setNumber();
  setNumber();
});

function clearField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cell = document.getElementById(r.toString() + '-' + c.toString());
      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');
    }
  }
}

function updateScore() {
  document.querySelector('.game-score').innerText = score;
}
