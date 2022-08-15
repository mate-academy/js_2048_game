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

const rows = document.querySelector('.game-field>tbody').children;
const gameField = [];

for (let i = 0; i < fieldWidth; i++) {
  gameField.push(rows[i].children);
}

let arrayField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

spawn();
spawn();
render();

function spawn() {
  function randomValue() {
    return Math.random() > 0.9 ? 4 : 2;
  }

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
      for (let j = i + 1; j < noZeroRow.length; j++) {
        if (noZeroRow[j] !== noZeroRow[i]) {
          break;
        }

        noZeroRow[i] *= 2;
        noZeroRow.splice(j, 1);
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
}

function moveLeft() {
  const needSpawn = move(arrayField);

  if (needSpawn) {
    spawn();
  }

  render();
}

function moveUp() {
  rotateLeft();
  moveLeft();
  rotateRight();
  render();
}

function moveDown() {
  rotateLeft();
  moveRight();
  rotateRight();
  render();
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
