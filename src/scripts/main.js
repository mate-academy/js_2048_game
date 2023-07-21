'use strict';

const button = document.querySelector('.button');
const cells = document.querySelector('tbody');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');

const cellsInRow = 4;
let field;
let scoreCount;

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
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
  score.textContent = scoreCount;
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
}

function renderCells() {
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      cells.rows[i].cells[j].className = '';
      cells.rows[i].cells[j].classList.add(`field-cell`);
      cells.rows[i].cells[j].classList.add(`field-cell--${field[i][j]}`);
      cells.rows[i].cells[j].textContent = field[i][j] || '';
    }
  }
}

function startKeyboardListener() {
  document.addEventListener('keydown', arrowKeyAction);
}

function arrowKeyAction(e) {
  const oldField = JSON.parse(JSON.stringify(field));

  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
  }

  if (hasFieldChanged(oldField)) {
    spawnRandomCell();
    score.textContent = scoreCount;
  }

  if (!haveMoves()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', arrowKeyAction);
  }

  if (isWin()) {
    winMessage.classList.remove('hidden');
  }
}

function moveUp() {
  for (let i = 0; i < cellsInRow; i++) {
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

function moveDown() {
  for (let i = 0; i < cellsInRow; i++) {
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

function moveLeft() {
  for (let i = 0; i < cellsInRow; i++) {
    let newRow = field[i];

    if (canMove(newRow)) {
      newRow = move(field[i]);

      for (let j = 0; j < newRow.length; j++) {
        field[i][j] = newRow[j];
      }
    }
  }
}

function moveRight() {
  for (let i = 0; i < cellsInRow; i++) {
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

  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow - 1; j++) {
      if (field[i][j] === field[i][j + 1]) {
        haveMerges = true;
        break;
      }
    }
  }

  for (let i = 0; i < cellsInRow - 1; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (field[i][j] === field[i + 1][j]) {
        haveMerges = true;
        break;
      }
    }
  }

  return haveFreeCells || haveMerges;
}

function isWin() {
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (field[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function replaceZeros(row) {
  const newRow = row.filter(num => num !== 0);

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
}

function hasFieldChanged(oldField) {
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (oldField[i][j] !== field[i][j]) {
        return true;
      }
    }
  }

  return false;
}
