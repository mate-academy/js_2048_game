'use strict';

const button = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const counter = document.querySelector('.game-score');

const rows = document.querySelectorAll('tr');
const cells = document.querySelectorAll('td');

const tableSize = 4;

const arrayCells = new Array(tableSize);

for (let i = 0; i < arrayCells.length; i++) {
  arrayCells[i] = new Array(tableSize).fill(0);
}

let handleKeyDown = false;

button.addEventListener('click', e => {
  handleKeyDown = true;

  if (!button.classList.contains('restart')) {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
    messageStart.classList.add('hidden');
  } else {
    for (const element of arrayCells) {
      element.fill(0);
    }

    updateTable();
  }

  generateRandomCell();
  generateRandomCell();
});

function generateRandomCell() {
  let rowIndex, cellIndex;

  do {
    rowIndex = Math.floor(Math.random() * tableSize);
    cellIndex = Math.floor(Math.random() * tableSize);
  } while (arrayCells[rowIndex][cellIndex] !== 0);

  if (arrayCells[rowIndex][cellIndex] === 0) {
    const newValue = Math.random() < 0.75 ? 2 : 4;

    arrayCells[rowIndex][cellIndex] = newValue;

    const cell = rows[rowIndex].children[cellIndex];

    cell.textContent = newValue;
    cell.classList.add(`field-cell--${newValue}`);
  }
}

document.addEventListener('keydown', e => {
  if (handleKeyDown) {
    switch (e.key) {
      case 'ArrowRight':
        moveRight();
        generateRandomCell();
        break;

      case 'ArrowLeft':
        moveLeft();
        generateRandomCell();
        break;

      case 'ArrowUp':
        moveUp();
        generateRandomCell();
        break;

      case 'ArrowDown':
        moveDown();
        generateRandomCell();
        break;

      default:
        throw new Error('The wrong button was pressed');
    }
  }
});

function moveRight() {
  let movedRight = false;

  for (let i = 0; i < tableSize; i++) {
    for (let j = tableSize - 2; j >= 0; j--) {
      if (arrayCells[i][j] !== 0) {
        let k = j;

        while (k < tableSize - 1) {
          if (arrayCells[i][k + 1] === 0) {
            arrayCells[i][k + 1] = arrayCells[i][k];
            arrayCells[i][k] = 0;
            k++;
            movedRight = true;
          } else if (arrayCells[i][k + 1] === arrayCells[i][k]) {
            arrayCells[i][k + 1] *= 2;
            arrayCells[i][k] = 0;
            movedRight = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (movedRight) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function moveLeft() {
  let movedLeft = false;

  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (arrayCells[i][j] !== 0) {
        let k = j;

        while (k > 0) {
          if (arrayCells[i][k - 1] === 0) {
            arrayCells[i][k - 1] = arrayCells[i][k];
            arrayCells[i][k] = 0;
            k--;
            movedLeft = true;
          } else if (arrayCells[i][k - 1] === arrayCells[i][k]) {
            arrayCells[i][k - 1] *= 2;
            arrayCells[i][k] = 0;
            movedLeft = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (movedLeft) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function moveUp() {
  let movedUp = false;

  for (let j = 0; j < tableSize; j++) {
    for (let i = 1; i < tableSize; i++) {
      if (arrayCells[i][j] !== 0) {
        let k = i;

        while (k > 0) {
          if (arrayCells[k - 1][j] === 0) {
            arrayCells[k - 1][j] = arrayCells[k][j];
            arrayCells[k][j] = 0;
            k--;
            movedUp = true;
          } else if (arrayCells[k - 1][j] === arrayCells[k][j]) {
            arrayCells[k - 1][j] *= 2;
            arrayCells[k][j] = 0;
            movedUp = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (movedUp) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function moveDown() {
  let movedDown = false;

  for (let j = 0; j < tableSize; j++) {
    for (let i = tableSize - 2; i >= 0; i--) {
      if (arrayCells[i][j] !== 0) {
        let k = i;

        while (k < tableSize - 1) {
          if (arrayCells[k + 1][j] === 0) {
            arrayCells[k + 1][j] = arrayCells[k][j];
            arrayCells[k][j] = 0;
            k++;
            movedDown = true;
          } else if (arrayCells[k + 1][j] === arrayCells[k][j]) {
            arrayCells[k + 1][j] *= 2;
            arrayCells[k][j] = 0;
            movedDown = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (movedDown) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function updateTable() {
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  for (let i = 0; i < arrayCells.length; i++) {
    for (let j = 0; j < arrayCells[i].length; j++) {
      const cell = rows[i].children[j];
      const value = arrayCells[i][j];

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  const score = calculateScore();

  counter.textContent = score;
}

function checkWin() {
  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (arrayCells[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function checkGameOver() {
  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (arrayCells[i][j] === 0) {
        return false;
      }
    }
  }

  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (i < tableSize - 1 && arrayCells[i][j] === arrayCells[i + 1][j]) {
        return false;
      }

      if (j < tableSize - 1 && arrayCells[i][j] === arrayCells[i][j + 1]) {
        return false;
      }
    }
  }

  return true;
}

function calculateScore() {
  let score = 0;

  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      score += arrayCells[i][j];
    }
  }

  return score;
}
