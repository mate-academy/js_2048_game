'use strict';

const fieldCells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageRules = document.querySelector('.message-rules');

const emptyGameField = () => [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let gameField = emptyGameField();

const rows = 4;
const cols = 4;

function hasEmptyCell() {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (gameField[x][y] === 0) {
        return true;
      }
    }
  }

  return false;
}

function randomizer() {
  if (!hasEmptyCell()) {
    return;
  }

  let foundStatus = false;

  while (!foundStatus) {
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * cols);

    if (gameField[x][y] === 0) {
      gameField[x][y] = Math.random() < 0.1 ? 4 : 2;

      const cell = document.getElementById(`${x}-${y}`);

      cell.innerText = '2';
      cell.classList.add('field-cell--2');

      foundStatus = true;
    }
  }
}

function updateCell(cell, value) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (value > 0) {
    cell.innerText = value;
    cell.classList.add(`field-cell--${value}`);
  }
}

function move(row) {
  const filterZero = (el) => el.filter(value => value !== 0);

  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      gameScore.innerText = `${+gameScore.innerText + newRow[i]}`;
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < cols) {
    newRow.push(0);
  }

  return newRow;
}

function verticalMove(direction) {
  for (let y = 0; y < cols; y++) {
    let row = [
      gameField[0][y],
      gameField[1][y],
      gameField[2][y],
      gameField[3][y],
    ];

    if (direction === 'up') {
      row = move(row);
    } else {
      row.reverse();
      row = move(row);
      row.reverse();
    }

    for (let x = 0; x < cols; x++) {
      gameField[x][y] = row[x];

      const cell = document.getElementById(`${x}-${y}`);
      const value = gameField[x][y];

      updateCell(cell, value);
    }
  }
}

function horizontalMove(direction) {
  for (let x = 0; x < rows; x++) {
    let row = gameField[x];

    if (direction === 'left') {
      row = move(row);

      gameField[x] = row;
    } else {
      row.reverse();
      row = move(row);
      row.reverse();

      gameField[x] = row;
    }

    for (let y = 0; y < cols; y++) {
      const cell = document.getElementById(`${x}-${y}`);
      const value = gameField[x][y];

      updateCell(cell, value);
    }
  }
};

function gameStart() {
  gameField = emptyGameField();

  let cellIndex = 0;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      fieldCells[cellIndex].id = `${x}-${y}`;

      const value = gameField[x][y];

      updateCell(fieldCells[cellIndex], value);

      cellIndex++;
    }
  }

  randomizer();
  randomizer();
}

function gameWin() {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (gameField[x][y] === 2048) {
        messageWin.classList.remove('hidden');
        messageRules.classList.add('hidden');

        if (button.classList.contains('restart')) {
          button.classList.replace('restart', 'start');

          button.innerText = 'Start';
        }
      }
    }
  }
}

function gameOver() {
  if (hasEmptyCell()) {
    return;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols - 1; y++) {
      if (gameField[x][y] === gameField[x][y + 1]
        || gameField[y][x] === gameField[y + 1][x]) {
        return;
      }
    }
  }

  if (button.classList.contains('restart')) {
    button.classList.replace('restart', 'start');

    button.innerText = 'Start';
  }

  messageRules.classList.add('hidden');
  messageLose.classList.remove('hidden');
}

button.addEventListener('click', () => {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageRules.classList.remove('hidden');

  gameScore.innerText = '0';

  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');

    button.innerText = 'Restart';
  }

  gameStart();
});

document.addEventListener('keyup', (key) => {
  if (button.classList.contains('restart')) {
    if (key.code === 'ArrowUp') {
      verticalMove('up');
      randomizer();
    }

    if (key.code === 'ArrowDown') {
      verticalMove('down');
      randomizer();
    }

    if (key.code === 'ArrowLeft') {
      horizontalMove('left');
      randomizer();
    }

    if (key.code === 'ArrowRight') {
      horizontalMove('right');
      randomizer();
    }
  }

  gameWin();
  gameOver();
});
