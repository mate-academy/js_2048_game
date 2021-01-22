'use strict';

const gameField = document.querySelector('.game-field');
const button = document.querySelector('button');
const allCells = gameField.querySelectorAll('td');
const allRows = gameField.querySelectorAll('tr');
const gameScore = document.querySelector('.game-score');
const messageBox = document.querySelector('.message-container');
let movesCheckerFlag;

for (const cell of allCells) {
  cell.setAttribute('empty', true);
}

function generateMatrix() {
  const matrix = [[], [], [], []];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i].push(+allRows[i].children[j].innerText);
    }
  }

  return matrix;
}

function transferMatrixOnField(matrix) {
  const cells = gameField.querySelectorAll('td');
  const array = matrix.flat();

  for (let i = 0; i < 16; i++) {
    cells[i].innerText = !array[i] ? '' : array[i];
    cells[i].className = '';
    cells[i].classList.add('field-cell', `field-cell--${array[i]}`);

    if (!cells[i].innerText) {
      cells[i].setAttribute('empty', true);
    } else {
      cells[i].setAttribute('empty', false);
    }
  }
}

function checkWin() {
  const fieldCells = gameField.querySelectorAll('td');

  for (const cell of fieldCells) {
    if (cell.innerText === '2048') {
      messageBox.children[1].classList.remove('hidden');
      break;
    }
  }
}

function checkMoves() {
  const matrix = generateMatrix();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (matrix[i][j] === 0) {
        movesCheckerFlag = true; break;
      } else if (i < 3 && matrix[i][j] === matrix[i + 1][j]) {
        movesCheckerFlag = true; break;
      } else if (j < 3 && matrix[i][j] === matrix[i][j + 1]) {
        movesCheckerFlag = true; break;
      } else {
        movesCheckerFlag = false;
      }
    }

    if (movesCheckerFlag) {
      break;
    }
  }

  if (!movesCheckerFlag) {
    gameOver();
  }
}

function gameOver() {
  messageBox.children[0].classList.remove('hidden');
}

function generateTwoFour() {
  const array = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const index = Math.round(Math.random() * 9);

  return array[index];
}

function findRandomEpmtyCell(epmtyCellsQuantity) {
  return Math.floor(Math.random() * epmtyCellsQuantity);
}

function generateNewNumberOnField() {
  const emptyCells = gameField.querySelectorAll('[empty="true"]');

  if (emptyCells.length === 0) {
    countScore();

    return;
  }

  const index = findRandomEpmtyCell(emptyCells.length);

  emptyCells[index].innerText = generateTwoFour();
  emptyCells[index].setAttribute('empty', false);
  emptyCells[index].classList.add(`field-cell--${emptyCells[index].innerText}`);
  countScore();
}

function countScore() {
  let sum = 0;
  const cells = gameField.querySelectorAll('td');

  for (const cell of cells) {
    sum += !cell.innerText ? 0 : +cell.innerText;
  }
  gameScore.innerHTML = `${sum}`;
}

function sumRight(matrix) {
  for (const row of matrix) {
    for (let i = 3; i > 0; i--) {
      if (row[i] === row[i - 1]) {
        row[i] += row[i - 1];
        row[i - 1] = 0;
      }
    }
  }
}

function sumLeft(matrix) {
  for (const row of matrix) {
    for (let i = 0; i < 3; i++) {
      if (row[i] === row[i + 1]) {
        row[i] += row[i + 1];
        row[i + 1] = 0;
      }
    }
  }
}

function sumUp(matrix) {
  const columnMatrix = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      column.unshift(matrix[j][i]);
    }
    columnMatrix.push(column);
  }

  sumRight(columnMatrix);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] = columnMatrix[j][3 - i];
    }
  }
}

function sumDown(matrix) {
  const columnMatrix = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      column.unshift(matrix[j][i]);
    }
    columnMatrix.push(column);
  }
  sumLeft(columnMatrix);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] = columnMatrix[j][3 - i];
    }
  }
}

function slideRight(matrix) {
  for (const row of matrix) {
    const tempArr = row.filter(el => el > 0);
    const emptyCells = 4 - tempArr.length;

    for (let i = 0; i < emptyCells; i++) {
      tempArr.unshift(0);
    }

    for (let i = 0; i < tempArr.length; i++) {
      row[i] = tempArr[i];
    }
  }
}

function slideLeft(matrix) {
  for (const row of matrix) {
    const tempArr = row.filter(el => el > 0);
    const emptyCells = 4 - tempArr.length;

    for (let i = 0; i < emptyCells; i++) {
      tempArr.push(0);
    }

    for (let i = 0; i < tempArr.length; i++) {
      row[i] = tempArr[i];
    }
  }
}

function slideUp(matrix) {
  const columnMatrix = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      column.unshift(matrix[j][i]);
    }
    columnMatrix.push(column);
  }

  slideRight(columnMatrix);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] = columnMatrix[j][3 - i];
    }
  }
}

function slideDown(matrix) {
  const columnMatrix = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      column.unshift(matrix[j][i]);
    }
    columnMatrix.push(column);
  }
  slideLeft(columnMatrix);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      matrix[i][j] = columnMatrix[j][3 - i];
    }
  }
}

function moveRight() {
  const fieldMatrix = generateMatrix();

  slideRight(fieldMatrix);
  sumRight(fieldMatrix);
  slideRight(fieldMatrix);
  transferMatrixOnField(fieldMatrix);
  checkWin();
  generateNewNumberOnField();
  checkMoves();
}

function moveLeft() {
  const fieldMatrix = generateMatrix();

  slideLeft(fieldMatrix);
  sumLeft(fieldMatrix);
  slideLeft(fieldMatrix);
  transferMatrixOnField(fieldMatrix);
  checkWin();
  generateNewNumberOnField();
  checkMoves();
}

function moveUp() {
  const fieldMatrix = generateMatrix();

  slideUp(fieldMatrix);
  sumUp(fieldMatrix);
  slideUp(fieldMatrix);
  transferMatrixOnField(fieldMatrix);
  checkWin();
  generateNewNumberOnField();
  checkMoves();
}

function moveDown() {
  const fieldMatrix = generateMatrix();

  slideDown(fieldMatrix);
  sumDown(fieldMatrix);
  slideDown(fieldMatrix);
  transferMatrixOnField(fieldMatrix);
  checkWin();
  generateNewNumberOnField();
  checkMoves();
}

button.addEventListener('click', e => {
  if (button.className === 'button restart') {
    window.location.reload();
  }

  button.className = 'button restart';
  button.innerText = 'Restart';
  messageBox.children[2].classList.add('hidden');
  movesCheckerFlag = true;
  generateNewNumberOnField();
  countScore();
});

document.addEventListener('keyup', e => {
  e.preventDefault();

  if (!movesCheckerFlag) {
    return;
  };

  switch (e.key) {
    case 'ArrowUp': moveUp(); break;
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowDown': moveDown(); break;
    case 'ArrowRight': moveRight(); break;
    default: break;
  }
});
