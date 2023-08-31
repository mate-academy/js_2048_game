'use strict';

let matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const message = [
  document.querySelector('.message-start'),
  document.querySelector('.message-win'),
  document.querySelector('.message-lose'),
];
const buttonStart = document.querySelector('.start');
const gameFieldCells = document.querySelectorAll('.field-cell');
const infoScore = document.querySelector('.game-score');
let gameScore = +(infoScore.textContent);
const ROW_LENGTH = 4;
const PROBILITY_NUMBER = 0.1;

addRandomCell();
addRandomCell();

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    goStart();
  } else {
    goEnd();
  }
});

function goStart() {
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.textContent = 'restart';

  message[0].classList.add('hidden');
  addRandomCell();
};

function goEnd() {
  buttonStart.classList.remove('restart');
  buttonStart.classList.add('start');
  buttonStart.textContent = 'start';

  message[0].classList.remove('hidden');

  matrix = matrix.map(row => row.map(() => 0));

  gameFieldCells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });
  gameScore = 0;
  addRandomCell();
  addRandomCell();
};

function addRandomCell() {
  const emptyCells = [];

  matrix.forEach((row, rowIndex) => {
    row.forEach((cellValue, colIndex) => {
      if (cellValue === 0) {
        emptyCells.push({
          row: rowIndex,
          col: colIndex,
        });
      }
    });
  });

  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomNumber = Math.random() < PROBILITY_NUMBER ? 4 : 2;
    const randomCell = emptyCells[randomIndex];

    matrix[randomCell.row][randomCell.col] = randomNumber;

    const index = randomCell.row * 4 + randomCell.col;

    gameFieldCells[index].textContent = `${randomNumber}`;
    gameFieldCells[index].classList.add(`field-cell--${randomNumber}`);
  }
}

function upgradeFeilds() {
  gameFieldCells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  matrix.forEach((row, rowIndex) => {
    row.forEach((cellValue, collIndex) => {
      const index = rowIndex * 4 + collIndex;

      if (cellValue !== 0) {
        gameFieldCells[index].textContent = `${cellValue}`;
        gameFieldCells[index].classList.add(`field-cell--${cellValue}`);
      }
    });
  });

  infoScore.textContent = gameScore;
}

document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowLeft':
      return moveLeft();

    case 'ArrowRight':
      return moveRight();

    case 'ArrowUp':
      return moveUp();

    case 'ArrowDown':
      return moveDown();
  }
});

function moveLeft() {
  let count = 0;

  const result = matrix.map(row => {
    return row.filter(col => col !== 0);
  });

  result.forEach(row => {
    row.forEach((col, index) => {
      if (row[index] === row[index + 1]) {
        row[index] = row[index] * 2;
        count += row[index];
        row.splice(index + 1, 1);
      }
    });
  });
  gameScore += count;
  count = 0;

  result.forEach(row => {
    while (row.length < ROW_LENGTH) {
      row.push(0);
    }
  });

  matrix = result;
  upgradeFeilds();
  addRandomCell();
}

function moveRight() {
  addRandomCell();
}

function moveUp() {
  addRandomCell();
}

function moveDown() {
  addRandomCell();
}
