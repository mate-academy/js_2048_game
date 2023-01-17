'use strict';

let gameField;
let score = 0;
const rows = 4;
const columns = 4;
const field = document.querySelector('tbody');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

// start button and arrow keys events
button.addEventListener('click', () => {
  score = 0;
  document.querySelector('.game-score').innerText = score;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    startMessage.classList.add('hidden');
    setGame();
  } else {
    loseMessage.classList.add('hidden');
    setGame();
  }
});

document.addEventListener('keyup', (e) => {
  const previousField = [...gameField].toString();

  e.code === 'ArrowLeft' || e.code === 'ArrowRight'
    ? slideHorizontally(e.code)
    : slideVertically(e.code);

  const currentField = [...gameField].toString();

  if (previousField !== currentField) {
    setNewNumber();
  }

  document.querySelector('.game-score').innerText = score;
});

// setting new game
function setGame() {
  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const num = gameField[r][c];

      updateCell(field.rows[r].cells[c], num);
    }
  }

  setNewNumber();
  setNewNumber();
}

// setting new 2 or 4 in random empty cells
function setNewNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (gameField[r][c] === 0) {
      gameField[r][c] = randomizeNumber();
      updateCell(field.rows[r].cells[c], gameField[r][c]);
      found = true;
    }
  }
}

function hasEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

// 10% probability of the appearance of 4
function randomizeNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
}

// updating cell value
function updateCell(fieldCell, num) {
  fieldCell.innerText = '';
  fieldCell.className = 'field-cell';
  fieldCell.classList.add(`field-cell--${num}`);

  if (num > 0) {
    fieldCell.innerText = num;
  } else {
    fieldCell.innerText = '';
  }

  if (!fieldCell.innerText) {
    fieldCell.className = 'field-cell';
  }

  setGameOver();
}

// cells sliding
function slide(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slideHorizontally(side) {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    if (side === 'ArrowLeft') {
      row = slide(row);
    }

    if (side === 'ArrowRight') {
      row.reverse();
      row = slide(row);
      row.reverse();
    }

    gameField[r] = row;

    for (let c = 0; c < columns; c++) {
      const num = gameField[r][c];

      updateCell(field.rows[r].cells[c], num);
    }
  }
}

function slideVertically(side) {
  for (let c = 0; c < columns; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    if (side === 'ArrowUp') {
      row = slide(row);
    }

    if (side === 'ArrowDown') {
      row.reverse();
      row = slide(row);
      row.reverse();
    }

    for (let r = 0; r < rows; r++) {
      gameField[r][c] = row[r];

      const num = gameField[r][c];

      updateCell(field.rows[r].cells[c], num);
    }
  }
}

// game over message
function setGameOver() {
  const emptyCell = gameField.some(r => r.some(c => c === 0));

  if (emptyCell) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]
        || gameField[c][r] === gameField[c + 1][r]) {
        return;
      }
    }
  }

  loseMessage.classList.remove('hidden');
}
