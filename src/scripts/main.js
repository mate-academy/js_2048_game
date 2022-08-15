'use strict';

function equals(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

const fieldWidth = 4;

let arrayField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = document.querySelector('.game-field>tbody').children;
const score = document.querySelector('.game-score');
const start = document.querySelector('.button');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLoose = document.querySelector('.message-lose');

const gameField = [];

messageWin.hidden = true;
messageLoose.hidden = true;

for (let i = 0; i < fieldWidth; i++) {
  gameField.push(rows[i].children);
}

start.addEventListener('click', () => {
  arrayField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  spawn(2);
  render();

  start.classList.remove('start');
  start.classList.add('restart');
  start.textContent = 'Restart';

  messageStart.hidden = true;
  messageWin.hidden = true;
  messageLoose.hidden = true;

  score.textContent = '0';
});

function isGameOver() {
  if (arrayField.some(row => row.includes(0))) {
    return;
  }

  let cantMove = true;

  function canMerge() {
    arrayField.forEach(row => {
      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          cantMove = false;
        }
      }
    });
  }

  canMerge();
  rotateLeft();
  canMerge();
  rotateRight();

  if (cantMove) {
    messageLoose.hidden = false;
  }
}

function spawn(count = 1) {
  function randomValue() {
    return Math.random() > 0.9 ? 4 : 2;
  }

  for (let q = 0; q < count; q++) {
    const empties = [];

    arrayField.forEach((row, i) => {
      row.forEach((num, j) => {
        if (num === 0) {
          empties.push([i, j]);
        }
      });
    });

    const position = empties[Math.floor(Math.random() * empties.length)];

    arrayField[position[0]][position[1]] = randomValue();
  }
}

function render() {
  for (let i = 0; i < fieldWidth; i++) {
    for (let j = 0; j < fieldWidth; j++) {
      const current = arrayField[i][j];

      gameField[i][j].className = 'field-cell';
      gameField[i][j].textContent = '';

      if (current === 0) {
        continue;
      }

      gameField[i][j].textContent = current;
      gameField[i][j].classList.add(`field-cell--${current}`);
    }
  }
}

function move(field) {
  let moved = false;

  arrayField = field.map(row => {
    const noZeroRow = row.filter(el => el !== 0);

    for (let i = 0; i < noZeroRow.length; i++) {
      const current = noZeroRow[i];
      const next = noZeroRow[i + 1];

      if (next === current) {
        noZeroRow[i] *= 2;
        score.textContent = +score.textContent + noZeroRow[i];

        if (noZeroRow[i] === 2048) {
          messageWin.hidden = false;
        }

        noZeroRow.splice(i + 1, 1);
        break;
      }
    }

    const resultRow = Object.assign(new Array(fieldWidth).fill(0), noZeroRow);

    if (!equals(row, resultRow)) {
      moved = true;
    }

    return resultRow;
  });

  return moved;
}

function moveRight() {
  const reversedRows = arrayField.map(row => row.reverse());
  const needSpawn = move(reversedRows);

  arrayField = arrayField.map(row => row.reverse());

  if (needSpawn) {
    spawn();
  }

  render();
  isGameOver();
}

function moveLeft() {
  const needSpawn = move(arrayField);

  if (needSpawn) {
    spawn();
  }

  render();
  isGameOver();
}

function moveUp() {
  rotateLeft();
  moveLeft();
  rotateRight();
  render();
  isGameOver();
}

function moveDown() {
  rotateLeft();
  moveRight();
  rotateRight();
  render();
  isGameOver();
}

function rotateRight() {
  const rotated = [];

  for (let i = 0; i < arrayField.length; i++) {
    const column = [];

    for (let j = arrayField.length - 1; j >= 0; j--) {
      column.push(arrayField[j][i]);
    }

    rotated.push(column);
  }

  arrayField = rotated;
}

function rotateLeft() {
  const rotated = [];

  for (let i = arrayField.length - 1; i >= 0; i--) {
    const column = [];

    for (let j = 0; j < arrayField.length; j++) {
      column.push(arrayField[j][i]);
    }

    rotated.push(column);
  }

  arrayField = rotated;
}

document.addEventListener('keydown', (e) => {
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
});
