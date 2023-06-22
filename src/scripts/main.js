'use strict';

const start = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCell = document.getElementsByClassName('field-cell');
const tabl = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    setNewNumber();
    setNewNumber();
  } else {
    start.classList.remove('restart');
    start.classList.add('start');
    start.textContent = 'Start';
    messageStart.classList.remove('hidden');
    restart();
  }
});

function restart() {
  [...fieldCell].forEach(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });
  score = 0;

  gameScore.innerText = 0;
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    moveLeft();
    setNewNumber();
  }

  if (e.code === 'ArrowRight') {
    moveRight();
    setNewNumber();
  }

  if (e.code === 'ArrowUp') {
    moveUp();
    setNewNumber();
  }

  if (e.code === 'ArrowDown') {
    moveDown();
    setNewNumber();
  }

  gameScore.innerText = score;

  if (!hasEmptyCell()) {
    messageLose.classList.remove('hidden');
  }

  if (score === 2048) {
    messageWin.classList.remove('hidden');
  }
});

let index = 0;

for (let r = 0; r < tabl.length; r++) {
  for (let c = 0; c < tabl.length; c++) {
    fieldCell[index++].id = r.toString() + '-' + c.toString();
  }
}

let score = 0;

function slide(row) {
  row.filter(num => num !== 0);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  const rowNew = row.filter(num => num !== 0);

  while (rowNew.length < tabl.length) {
    rowNew.push(0);
  }

  return rowNew;
}

function moveLeft() {
  for (let r = 0; r < tabl.length; r++) {
    let row = tabl[r];

    row = slide(row);
    tabl[r] = row;

    for (let c = 0; c < tabl.length; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());

      const value = tabl[r][c];

      updateCell(cell, value);
    }
  }
}

function moveRight() {
  for (let r = 0; r < tabl.length; r++) {
    let row = tabl[r];

    row.reverse();
    row = slide(row);
    tabl[r] = row.reverse();

    for (let c = 0; c < tabl.length; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());

      const value = tabl[r][c];

      updateCell(cell, value);
    }
  }
}

function moveUp() {
  for (let c = 0; c < tabl.length; c++) {
    let row = [tabl[0][c], tabl[1][c], tabl[2][c], tabl[3][c]];

    row = slide(row);

    for (let r = 0; r < tabl.length; r++) {
      tabl[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const value = tabl[r][c];

      updateCell(cell, value);
    }
  }
}

function moveDown() {
  for (let c = 0; c < tabl.length; c++) {
    let row = [tabl[0][c], tabl[1][c], tabl[2][c], tabl[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < tabl.length; r++) {
      tabl[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const value = tabl[r][c];

      updateCell(cell, value);
    }
  }
}

function setNewNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const value = Math.random() > 0.1 ? 2 : 4;
    const r = Math.floor(Math.random() * tabl.length);
    const c = Math.floor(Math.random() * tabl.length);

    if (tabl[r][c] === 0) {
      tabl[r][c] = value;

      const cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = value;

      updateCell(cell, value);

      found = true;
    }
  }
}

function hasEmptyCell() {
  for (let r = 0; r < tabl.length; r++) {
    for (let c = 0; c < tabl.length; c++) {
      if (tabl[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function updateCell(cell, value) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (value > 0) {
    cell.innerText = value.toString();

    if (value <= 2048) {
      cell.classList.add('field-cell--' + value.toString());
    }
  }
}
