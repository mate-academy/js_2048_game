/* eslint-disable no-console */
'use strict';

const gameFieldElement = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startBtn = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const rows = 4;
const columns = 4;
let score = 0;

let gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameStarted = false;

startBtn.addEventListener('click', () => {
  if (gameStarted) {
    while (gameFieldElement.firstChild) {
      gameFieldElement.removeChild(gameFieldElement.firstChild);
    }

    gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  messageStart.classList.add('hidden');
  setGame();
  addTile();
  addTile();
  gameStarted = true;

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
  score = 0;
});

const setGame = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');

      cell.id = `${r}-${c}`;

      const num = gameField[r][c];

      updateCell(cell, num);
      gameFieldElement.append(cell);
    }
  }
};

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function isWon() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function addTile() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);
    const num = Math.random() > 0.1 ? 2 : 4;

    if (gameField[r][c] === 0) {
      gameField[r][c] = num;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = num.toString();
      tile.classList.add('field-cell--' + num);
      found = true;
    }
  }
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;
    cell.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
  }

  if (e.code === 'ArrowRight') {
    slideRight();
  }

  if (e.code === 'ArrowUp') {
    slideUp();
  }

  if (e.code === 'ArrowDown') {
    slideDown();
  }

  if (isWon()) {
    messageWin.classList.remove('hidden');
  }

  if (isLost()) {
    messageLose.classList.remove('hidden');
  }
});

function isLost() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (gameField[r][c] === gameField[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === gameField[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function updateGameField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  }
}

function slide(row) {
  let slidedRow = row.filter(num => num !== 0);

  for (let c = 0; c < columns - 1; c++) {
    if (slidedRow[c] === slidedRow[c + 1]) {
      slidedRow[c] *= 2;
      slidedRow[c + 1] = 0;
      score += +slidedRow[c] | 0;
      gameScore.innerText = score;
    }
  }
  slidedRow = slidedRow.filter(num => num !== 0 && !isNaN(num));

  while (slidedRow.length < columns) {
    slidedRow.push(0);
  };

  return slidedRow;
}

function slideLeft() {
  const fieldCopy = [...gameField];

  console.log(gameField);
  console.log(fieldCopy);

  for (let r = 0; r < rows; r++) {
    let row = fieldCopy[r];

    row = slide(row);
    fieldCopy[r] = row;
  };

  if (fieldCopy.toString() !== gameField.toString()) {
    gameField = fieldCopy;

    updateGameField();
    addTile();
  }

  if (!hasEmptyTile) {
    messageLose.classList.remove('hidden');
  }
};

function slideRight() {
  const fieldCopy = [...gameField];

  for (let r = 0; r < rows; r++) {
    let row = fieldCopy[r];

    row = row.reverse();
    row = slide(row);

    const newRow = row.reverse();

    fieldCopy[r] = newRow;
  };

  const reversedField = [];

  for (const row of gameField) {
    const newRow = row.reverse();

    reversedField.push(newRow);
  }

  if (fieldCopy.toString() !== reversedField.toString()) {
    gameField = fieldCopy;

    updateGameField();
    addTile();
  }
};

function slideUp() {
  const fieldCopy = [...gameField];

  console.log(gameField);
  console.log(fieldCopy);

  for (let c = 0; c < rows; c++) {
    let row = [
      fieldCopy[0][c],
      fieldCopy[1][c],
      fieldCopy[2][c],
      fieldCopy[3][c],
    ];

    row = slide(row);

    for (let index = 0; index < rows; index++) {
      fieldCopy[index][c] = row[index];
    }
  };

  if (fieldCopy.toString() !== gameField.toString()) {
    gameField = fieldCopy;

    updateGameField();
    addTile();
  }
};

function slideDown() {
  for (let c = 0; c < rows; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row = slide(row.reverse());
    row = row.reverse();

    for (let index = 0; index < rows; index++) {
      gameField[index][c] = row[index];
    }
  };

  updateGameField();
};
