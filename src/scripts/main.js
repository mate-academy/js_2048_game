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

setNumber();
setNumber();

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

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
  } else if (e.code === 'ArrowRight') {
    slideRight();
  } else if (e.code === 'ArrowUp') {
    slideUp();
  } else if (e.code === 'ArrowDown') {
    slideDown();
  }

  setNumber();
  document.querySelector('.game-score').innerText = score;
});

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
  let moved = false;

  for (let r = 0; r < rows; r++) {
    row = field[r];

    const originalRow = row.slice();

    field[r] = slide(row);

    if (!arraysEqual(originalRow, field[r])) {
      moved = true;
    }

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

  if (!hasEmptyTile() && !moved) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function slideRight() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    row = field[r].reverse();

    const originalRow = row.slice();

    field[r] = slide(row).reverse();

    if (!arraysEqual(originalRow, field[r])) {
      moved = true;
    }

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

  if (!hasEmptyTile() && !moved) {
    hideMessage(messageStart);
    showMessage(messageLose);
  }
}

function slideUp() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    const originalRow = row.slice();

    row = slide(row);

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

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

  if (!hasEmptyTile() && !moved) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function slideDown() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    row = [field[0][c], field[1][c], field[2][c], field[3][c]].reverse();

    const originalRow = row.slice();

    row = slide(row).reverse();

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

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

  if (!hasEmptyTile() && !moved) {
    showMessage(messageLose);
    hideMessage(messageStart);
  }
}

function setNumber() {
  if (!hasEmptyTile()) {
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
      }

      if (r < rows - 1 && field[r][c] === field[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
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

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    };
  };

  return true;
}

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  clearField();
  hideMessage(messageWin);
  hideMessage(messageLose);
  hideMessage(messageStart);

  score = 0;

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
