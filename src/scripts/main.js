'use strict';

const btnStart = document.querySelector('.start');
const cells = document.querySelector('tbody');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');

const CELLS_IN_ROW = 4;
let field;
let scoreCount;

btnStart.addEventListener('click', () => {
  if (btnStart.classList.contains('start')) {
    btnStart.classList.remove('start');
    btnStart.classList.add('restart');
    btnStart.textContent = 'Restart';
    startMessage.classList.add('hidden');
    startGame();
  } else {
    startGame();
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }
});

function startGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  scoreCount = 0;
  rndCell();
  keyboardListener();
}

function rndCell() {
  while (true) {
    const rowIdx = Math.floor(Math.random() * CELLS_IN_ROW);
    const columnIdx = Math.floor(Math.random() * CELLS_IN_ROW);

    if (field[rowIdx][columnIdx] === 0) {
      field[rowIdx][columnIdx] = Math.random() < 0.9 ? 2 : 4;
      break;
    }
  }

  renderCells();
}

function renderCells() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    for (let j = 0; j < CELLS_IN_ROW; j++) {
      cells.rows[i].cells[j].className = '';
      cells.rows[i].cells[j].classList.add(`field-cell`);
      cells.rows[i].cells[j].classList.add(`field-cell--${field[i][j]}`);
      cells.rows[i].cells[j].textContent = field[i][j] || '';
    }
  }
}

function keyboardListener() {
  document.addEventListener('keydown', keyAction);
}

function keyAction(e) {
  const compareField = JSON.parse(JSON.stringify(field));

  switch (e.key) {
    case 'ArrowUp':
      ArrowUp();
      break;

    case 'ArrowDown':
      ArrowDown();
      break;

    case 'ArrowRight':
      ArrowRight();
      break;

    case 'ArrowLeft':
      ArrowLeft();
      break;

    default:
      break;
  }

  if (hasFieldChanged(compareField)) {
    rndCell();
    score.textContent = scoreCount;
  }

  if (!haveMoves()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', keyAction);
  }

  if (isWin()) {
    winMessage.classList.remove('hidden');
  }
}

function ArrowUp() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    let newRow = [
      field[0][i],
      field[1][i],
      field[2][i],
      field[3][i],
    ];

    if (canMove(newRow)) {
      newRow = move(newRow);

      for (let j = 0; j < newRow.length; j++) {
        field[j][i] = newRow[j];
      }
    }
  }
}

function ArrowDown() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    let newRow = [
      field[0][i],
      field[1][i],
      field[2][i],
      field[3][i],
    ];

    if (canMove([...newRow].reverse())) {
      newRow = move(newRow.reverse()).reverse();

      for (let j = 0; j < newRow.length; j++) {
        field[j][i] = newRow[j];
      }
    }
  }
}

function ArrowLeft() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    let newRow = field[i];

    if (canMove(newRow)) {
      newRow = move(field[i]);

      for (let j = 0; j < newRow.length; j++) {
        field[i][j] = newRow[j];
      }
    }
  }
}

function ArrowRight() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    let newRow = field[i];

    if (canMove([...newRow].reverse())) {
      newRow = move(newRow.reverse()).reverse();

      for (let j = 0; j < newRow.length; j++) {
        field[i][j] = newRow[j];
      }
    }
  }
}

function move(row) {
  let newRow = replaceZeros(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
      newRow[i] = newRow[i] * 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];
    }
  }

  newRow = replaceZeros(newRow);

  return newRow;
}

function canMove(row) {
  for (let i = 0; i < row.length - 1; i++) {
    const canMerge = (row[i] === row[i + 1]) && (row[i] !== 0);
    const canSlide = (row[i] === 0) && (row[i + 1] !== 0);

    if (canMerge || canSlide) {
      return true;
    }
  }

  return false;
}

function haveMoves() {
  const haveFreeCells = field.some(row => row.some(cell => cell === 0));
  let haveMerges = false;

  for (let i = 0; i < CELLS_IN_ROW; i++) {
    for (let j = 0; j < CELLS_IN_ROW - 1; j++) {
      if (field[i][j] === field[i][j + 1]) {
        haveMerges = true;
        break;
      }
    }
  }

  for (let i = 0; i < CELLS_IN_ROW - 1; i++) {
    for (let j = 0; j < CELLS_IN_ROW; j++) {
      if (field[i][j] === field[i + 1][j]) {
        haveMerges = true;
        break;
      }
    }
  }

  return haveFreeCells || haveMerges;
}

function isWin() {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    for (let j = 0; j < CELLS_IN_ROW; j++) {
      if (field[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function replaceZeros(row) {
  const newRow = row.filter(num => num !== 0);

  while (newRow.length < CELLS_IN_ROW) {
    newRow.push(0);
  }

  return newRow;
}

function hasFieldChanged(compareField) {
  for (let i = 0; i < CELLS_IN_ROW; i++) {
    for (let j = 0; j < CELLS_IN_ROW; j++) {
      if (compareField[i][j] !== field[i][j]) {
        return true;
      }
    }
  }

  return false;
}
