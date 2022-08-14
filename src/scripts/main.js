'use strict';

const fieldWidth = 4;

const rows = document.querySelector('.game-field>tbody').children;
const gameField = [];

for (let i = 0; i < fieldWidth; i++) {
  gameField.push(rows[i].children);
}

let arrayField = [
  [2, 4, 2, 8],
  [16, 32, 2, 2],
  [2, 2, 8, 2],
  [4, 4, 4, 2],
];

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

render();

function move(field) {
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

    return Object.assign(new Array(fieldWidth).fill(0), noZeroRow);
  });
}

function moveRight() {
  const reversedRows = arrayField.map(row => row.reverse());

  move(reversedRows);
  arrayField = arrayField.map(row => row.reverse());
  render();
}

function moveLeft() {
  move(arrayField);
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
