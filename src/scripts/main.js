'use strict';

let field;
let score = 0;
const rows = 4;
const columns = 4;
let gameIsWorking;

const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

window.onload = function() {
  setGame();
  gameIsWorking = false;

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);
};

function setGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  gameScore.innerText = '0';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');

      cell.id = `${r}-${c}`;

      const num = field[r][c];

      updateCell(cell, num);
      document.querySelector('.game-field').append(cell);
    }
  }
};

function generateTwoOrFour() {
  if (!hasZero()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);
    const twoOrFour = Math.random() < 0.1 ? 4 : 2;

    if (field[r][c] === 0) {
      field[r][c] = twoOrFour;

      const cell = document.getElementById(`${r}-${c}`);

      cell.innerText = `${twoOrFour}`;
      cell.classList.add(`field-cell--${twoOrFour}`);
      found = true;
    }
  }
};

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = 'field-cell';

  if (num > 0) {
    cell.innerText = num;

    if (num <= 2048) {
      cell.classList.add(`field-cell--${num}`);
    }
  }
};

function removeZeroes(row) {
  return row.filter(num => num !== 0);
};

function startGame() {
  gameIsWorking = true;

  startButton.classList.add('hidden');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  restartButton.classList.remove('hidden');

  generateTwoOrFour();
  generateTwoOrFour();
};

function restartGame() {
  gameField.innerHTML = '';
  setGame();
  startGame();
};

function hasZero() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
};

function has2048() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function isGameOver() {
  if (hasZero()) {
    return false;
  }

  for (let r = rows - 1; r > 0; r--) {
    for (let c = columns - 1; c > 0; c--) {
      const cell = field[r][c];

      if (cell !== 0
        && (cell === field[r - 1][c] || cell === field[r][c - 1])) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns - 1; c++) {
      const cell = field[r][c];

      if (cell !== 0
        && (cell === field[r + 1][c] || cell === field[r][c + 1])) {
        return false;
      }
    }
  }

  return true;
}

function move(row) {
  let updatedRow = removeZeroes(row);

  for (let i = 0; i < updatedRow.length - 1; i++) {
    if (updatedRow[i] === updatedRow[i + 1]) {
      updatedRow[i] *= 2;
      updatedRow[i + 1] = 0;
      score += updatedRow[i];
    }
  }

  updatedRow = removeZeroes(updatedRow);

  while (updatedRow.length < columns) {
    updatedRow.push(0);
  }

  return updatedRow;
};

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = move(row);
    field[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`${r}-${c}`);
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
};

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = move(row.reverse());
    field[r] = row.reverse();

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`${r}-${c}`);
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
};

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row = move(row);

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];

      const cell = document.getElementById(`${r}-${c}`);
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
};

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row = move(row.reverse());
    row.reverse();

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];

      const cell = document.getElementById(`${r}-${c}`);
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
};

document.addEventListener('keyup', (e) => {
  if (gameIsWorking) {
    switch (e.code) {
      case 'ArrowLeft':
        moveLeft();
        generateTwoOrFour();
        break;

      case 'ArrowRight':
        moveRight();
        generateTwoOrFour();
        break;

      case 'ArrowUp':
        moveUp();
        generateTwoOrFour();
        break;

      case 'ArrowDown':
        moveDown();
        generateTwoOrFour();
        break;

      default:
        return;
    }
  }

  if (isGameOver()) {
    gameIsWorking = false;
    messageLose.classList.remove('hidden');

    return;
  }

  if (has2048()) {
    gameIsWorking = false;
    messageWin.classList.remove('hidden');

    return;
  }

  gameScore.innerText = score;
});
