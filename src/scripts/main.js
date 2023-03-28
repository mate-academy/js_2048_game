'use strict';

const fieldRows = document.querySelector('tbody').rows;
const startGame = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');

let score = 0;
let rows = 4;
let columns = 4;
let field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

function gameStart() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  addTwoDeuces();
  addTwoDeuces();
  updateHtml();
};

startGame.addEventListener('click', () => {
  startGame.classList.replace('start', 'restart');
  startGame.innerHTML = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  gameScore.innerHTML = 0;

  gameStart();
})

document.addEventListener('keyup', (event) => {
  if (!startGame.classList.contains('restart')) {
    return
  }

  switch (event.code) {
    case 'ArrowLeft':
      slideLeft();
      addTwoDeuces();
      break;
    case 'ArrowRight':
      slideRight();
      addTwoDeuces();
      break;
    case 'ArrowUp':
      slideUp();
      addTwoDeuces();
      break;
    case 'ArrowDown':
      slideDown();
      addTwoDeuces();
      break;
  }

  if (!isPossibleMove()) {
    messageLose.classList.remove('hidden');
  }
});

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
 let newRow = filterZeros(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (newRow[i] === newRow[i + 1] && isFinite(newRow[i])) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
      isWin(newRow[i]);
    }
  }

  newRow = filterZeros(newRow);

  while (newRow.length < columns) {
    newRow.push(0)
  }

  return newRow;
};

function slideLeft() {
  for (let i = 0; i < rows; i++) {
    let row = field[i];

    row = slide(row);
    field[i] = row;

    updateHtml();
  }
};

function slideRight() {
  for (let i = 0; i < rows; i++) {
    let row = field[i];

    row.reverse();
    row = slide(row);
    row.reverse();
    field[i] = row;
  }

  updateHtml();
};

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];
    row = slide(row);

    for (let i = 0; i < columns; i++) {
      field[i][c] = row[i];
    }
  }

  updateHtml();
};

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();

    for (let i = 0; i < columns; i++) {
      field[i][c] = row[i];
    }
  }

  updateHtml();
};

function updateHtml() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentCell = fieldRows[r].cells[c];
      const num = field[r][c];

      updateCell(currentCell, num);
    }
  }

  gameScore.innerText = score;
};

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.className = 'field-cell';

  if (num > 0) {
    cell.innerText = num;
    cell.classList.add(`field-cell--${num}`);
  }

  if (cell === 2048) {
    messageWin.style.display = 'block'
  }
};

function isEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 0) {
        return true
      }
    }
  }
  return false;
};

function addTwoDeuces() {
  if (!isEmptyCell()) {
    return;
  }

  const value = Math.random() > 0.1 ? 2 : 4;

  let found = false;

  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (field[r][c] === 0) {
      field[r][c] = value;
      found = true;

      updateHtml()
    }
  }
};

function isPossibleMove() {
  let found = false;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (r < 3) {
        if (field[r][c] === field[r + 1][c]
          || field[r][c] === field[r][c + 1]) {
            found = true;
        }
      } else {
        if (field[r][c] === field[r][c + 1]) {
          found = true;
        }
      }
    }
  }

  if (!found && !isEmptyCell()) {
    return false;
  }

  return true;
};

function isWin(value) {
  if (value === 2048) {
    messageWin.classList.remove('hidden');
    startGame.classList.replace('restart', 'start');
    startGame.innerText = 'Start'
  }
};