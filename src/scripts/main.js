'use strict';

const table = document.querySelector('tbody');
const startButton = document.querySelector('.start');
const scoreGame = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const rows = 4;
const cols = 4;
let field;

let score = 0;

startButton.addEventListener('click', startGame);

function setRundomNumber() {
  const twoOrFour = Math.random() < 0.2 ? 4 : 2;

  let found = false;

  while (!found) {
    const rowInd = Math.floor(Math.random() * 4);
    const colInd = Math.floor(Math.random() * 4);

    if (field[rowInd][colInd] === 0) {
      field[rowInd][colInd] = twoOrFour;
      found = true;
    }
  }

  updateGame();
};

function startGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  startButton.innerText = 'Restart';
  startButton.classList.replace('start', 'restart');
  messageStart.classList.add('hidden');

  setRundomNumber();
  setRundomNumber();
};

document.addEventListener('keyup', e => {
  if (startButton.classList.contains('start')) {
    return;
  }

  const fieldCopy = field.map(arr => arr.slice());

  switch (e.code) {
    case 'ArrowLeft': slideLeft(); break;
    case 'ArrowRight': slideRight(); break;
    case 'ArrowUp': slideUp(); break;
    case 'ArrowDown': slideDown(); break;
    default: break;
  }

  if (!isFieldChanged(field, fieldCopy)) {
    setRundomNumber();
  }

  updateGame();
});

function updateGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentTile = table.rows[r].cells[c];
      const valueOfTile = field[r][c];

      currentTile.innerText = '';
      currentTile.classList.value = '';
      currentTile.className = `field-cell`;

      if (valueOfTile > 0) {
        currentTile.innerText = valueOfTile;
        currentTile.classList.add(`field-cell--${valueOfTile}`);
      }

      if (valueOfTile === 2048) {
        messageWin.classList.remove('hidden');
        startButton.classList.replace('restart', 'start');
        startButton.innerText = 'Start';
      }
    }
  }
  scoreGame.innerText = score;

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
    startButton.innerText = 'Start';
  }
};

function filterZero(row) {
  return row.filter(el => el !== 0);
}

function slide(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }
  newRow = filterZero(newRow);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
};

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = slide(row);
    field[r] = row;
  }
};

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = field[r].reverse();

    row = slide(row);
    field[r] = row.reverse();
  }
}

function slideUp() {
  for (let i = 0; i < cols; i++) {
    let row = [field[0][i], field[1][i], field[2][i], field[3][i]];

    row = slide(row);
    field[0][i] = row[0];
    field[1][i] = row[1];
    field[2][i] = row[2];
    field[3][i] = row[3];
  }
}

function slideDown() {
  for (let i = 0; i < cols; i++) {
    let row = [field[0][i], field[1][i], field[2][i], field[3][i]].reverse();

    row = slide(row).reverse();
    field[0][i] = row[0];
    field[1][i] = row[1];
    field[2][i] = row[2];
    field[3][i] = row[3];
  }
}

function isGameOver() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c] === 0) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols; c++) {
      if (field[r][c] === field[r + 1][c]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      if (field[r][c] === field[r][c + 1]) {
        return false;
      }
    }
  }

  return true;
}

function isFieldChanged(fieldGame, fieldCopy) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (fieldGame[r][c] === fieldCopy[r][c]) {
        return false;
      }
    }
  }

  return true;
};
