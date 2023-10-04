'use strict';

const button = document.querySelector('.button');
const fieldRows = document.querySelector('tbody');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let field;
let score;
const cells = 4;

function startGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  gameScore.textContent = score;
  addNumbers();
  addNumbers();
  startKeyboardListener();
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');

    startGame();
  } else {
    startGame();

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
});

function addNumbers() {
  while (true) {
    const rowNumber = Math.floor(Math.random() * cells);
    const colNumber = Math.floor(Math.random() * cells);

    if (field[rowNumber][colNumber] === 0) {
      field[rowNumber][colNumber] = Math.random() >= 0.9 ? 4 : 2;
      break;
    }
  }

  showCells();
};

function showCells() {
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      fieldRows.rows[x].cells[y].className = '';
      fieldRows.rows[x].cells[y].classList.add(`field-cell`);
      fieldRows.rows[x].cells[y].classList.add(`field-cell--${field[x][y]}`);
      fieldRows.rows[x].cells[y].textContent = field[x][y] || '';
    }
  }
}

function startKeyboardListener() {
  document.addEventListener('keydown', arrowKeyAction);
}

function arrowKeyAction(e) {
  const oldField = JSON.parse(JSON.stringify(field));

  switch (e.key) {
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
  }

  if (fieldChanged(oldField)) {
    addNumbers();
    gameScore.textContent = score;

    if (goalNumber()) {
      messageWin.classList.remove('hidden');
    }
  }

  if (!haveMoves()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', arrowKeyAction);
  }
}

function fieldChanged(oldField) {
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      if (oldField[x][y] !== field[x][y]) {
        return true;
      }
    }
  }

  return false;
}

function checkZero(row) {
  const newRow = row.filter(x => x !== 0);

  while (newRow.length < cells) {
    newRow.push(0);
  }

  return newRow;
}

function move(row) {
  let newRow = row;

  newRow = checkZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = checkZero(newRow);

  return newRow;
}

function canMove(row) {
  for (let i = 0; i < row.length; i++) {
    const canMerge = (row[i] === row[i + 1] && row[i] !== 0);
    const canSlide = (row[i] === 0 && row[i + 1] !== 0);

    if (canMerge || canSlide) {
      return true;
    }
  }

  return false;
}

function haveMoves() {
  const hasFreeCells = field.some(row => row.some(cell => cell === 0));
  let hasMerged = false;

  for (let x = 0; x < cells - 1; x++) {
    for (let y = 0; y < cells; y++) {
      if (field[x][y] === field[x][y + 1]) {
        hasMerged = true;

        break;
      }
    }
  }

  for (let x = 0; x < cells - 1; x++) {
    for (let y = 0; y < cells; y++) {
      if (field[x][y] === field[x + 1][y]) {
        hasMerged = true;

        break;
      }
    }
  }

  return hasFreeCells || hasMerged;
}

function goalNumber() {
  for (let x = 0; x < cells; x++) {
    for (let y = 0; y < cells; y++) {
      if (field[x][y] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function moveUp() {
  for (let y = 0; y < cells; y++) {
    let row = [
      field[0][y],
      field[1][y],
      field[2][y],
      field[3][y],
    ];

    if (canMove(row)) {
      row = move(row);

      for (let x = 0; x < cells; x++) {
        field[x][y] = row[x];
      }
    }
  }
}

function moveDown() {
  for (let y = 0; y < cells; y++) {
    let row = [
      field[0][y],
      field[1][y],
      field[2][y],
      field[3][y],
    ];

    if (canMove(row)) {
      row = move(row.reverse()).reverse();

      for (let x = 0; x < cells; x++) {
        field[x][y] = row[x];
      }
    }
  }
}

function moveRight() {
  for (let x = 0; x < cells; x++) {
    let row = field[x];

    if (canMove([...row].reverse())) {
      row = move(row.reverse()).reverse();

      for (let y = 0; y < row.length; y++) {
        field[x][y] = row[y];
      }
    }
  }
}

function moveLeft() {
  for (let x = 0; x < cells; x++) {
    let row = field[x];

    if (canMove(row)) {
      row = move(field[x]);

      for (let y = 0; y < row.length; y++) {
        field[x][y] = row[y];
      }
    }
  }
}
