'use strict';

const button = document.querySelector('.button');
const fieldRows = document.querySelector('tbody');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let field;
let score;
const cellsInRow = 4;

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

function startGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  gameScore.textContent = score;
  spawnRandomCell();
  startKeyboardListener();
}

function spawnRandomCell() {
  while (true) {
    const rowIndex = Math.floor(Math.random() * cellsInRow);
    const columnIndex = Math.floor(Math.random() * cellsInRow);

    if (field[rowIndex][columnIndex] === 0) {
      field[rowIndex][columnIndex] = Math.random() >= 0.9 ? 4 : 2;
      break;
    }
  }

  renderCells();
};

function renderCells() {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      fieldRows.rows[r].cells[c].className = '';
      fieldRows.rows[r].cells[c].classList.add(`field-cell`);
      fieldRows.rows[r].cells[c].classList.add(`field-cell--${field[r][c]}`);
      fieldRows.rows[r].cells[c].textContent = field[r][c] || '';
    }
  }
}

function startKeyboardListener() {
  document.addEventListener('keydown', arrowKeyAction);
}

function arrowKeyAction(e) {
  const oldField = JSON.parse(JSON.stringify(field));

  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;
  }

  if (hasFieldChanged(oldField)) {
    spawnRandomCell();
    gameScore.textContent = score;
  }

  if (!haveMoves()) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', arrowKeyAction);
  }

  if (isWin()) {
    messageWin.classList.remove('hidden');
  }
}

function filterZero(row) {
  const newRow = row.filter(r => r !== 0);

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
}

function move(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZero(newRow);

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

  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow - 1; c++) {
      if (field[r][c] === field[r][c + 1]) {
        haveMerges = true;
        break;
      }
    }
  }

  for (let r = 0; r < cellsInRow - 1; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (field[r][c] === field[r + 1][c]) {
        haveMerges = true;
        break;
      }
    }
  }

  return haveFreeCells || haveMerges;
}

function isWin() {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (field[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function hasFieldChanged(oldField) {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (oldField[r][c] !== field[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function moveRight() {
  for (let r = 0; r < cellsInRow; r++) {
    let row = field[r];

    if (canMove([...row].reverse())) {
      row = move(row.reverse()).reverse();

      for (let c = 0; c < row.length; c++) {
        field[r][c] = row[c];
      }
    }
  }
}

function moveLeft() {
  for (let r = 0; r < cellsInRow; r++) {
    let row = field[r];

    if (canMove(row)) {
      row = move(field[r]);

      for (let c = 0; c < row.length; c++) {
        field[r][c] = row[c];
      }
    }
  }
}

function moveUp() {
  for (let c = 0; c < cellsInRow; c++) {
    let row = [
      field[0][c],
      field[1][c],
      field[2][c],
      field[3][c],
    ];

    if (canMove(row)) {
      row = move(row);

      for (let r = 0; r < cellsInRow; r++) {
        field[r][c] = row[r];
      }
    }
  }
}

function moveDown() {
  for (let c = 0; c < cellsInRow; c++) {
    let row = [
      field[0][c],
      field[1][c],
      field[2][c],
      field[3][c],
    ];

    if (canMove([...row].reverse())) {
      row = move(row.reverse()).reverse();

      for (let r = 0; r < cellsInRow; r++) {
        field[r][c] = row[r];
      }
    }
  }
}
