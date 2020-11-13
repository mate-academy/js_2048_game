'use strict';

const tbody = document.querySelector('table').tBodies[0].children;
const allCell = document.querySelectorAll('td');
const startGame = document.querySelector('.start');
const blockScore = document.querySelector('.game-score');
const youWin = document.querySelector('.message-win');
const youLose = document.querySelector('.message-lose');
const messStart = document.querySelector('.message-start');
const width = 4;
let score = 0;
let allEmptyCell = [];
let countBusyCell = false;
let oldArray = [];
let randomCell = 0;
let matrix = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];

const rotateMatrix = arrMatrix => {
  matrix = arrMatrix.map((row, i) =>
    row.map((val, j) => arrMatrix[arrMatrix.length - 1 - j][i])
  );

  return matrix;
};

function generateRandomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  if (max === 1) {
    return 0;
  }

  return Math.round(rand);
}

function render() {
  for (let y = 0; y < matrix.length; y++) {
    for (let k = 0; k < matrix[y].length; k++) {
      tbody[y].children[k].innerHTML = matrix[y][k];
    }
  }
  addOrRemoveClass();
}

function generateNumInCell() {
  const newDiv = document.createElement('div');

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === '') {
        allEmptyCell.push({
          x: i,
          y: j,
        });
      }
    }
  }

  if (youLoseNow() && allEmptyCell.length === 0) {
    youLose.classList.remove('hidden');
  }

  if (countBusyCell) {
    return;
  }

  randomCell = generateRandomInteger(0, allEmptyCell.length - 1);

  matrix[allEmptyCell[randomCell].x][allEmptyCell[randomCell].y]
  = Math.random() >= 0.9 ? 4 : 2;

  newDiv.textContent
  = matrix[allEmptyCell[randomCell].x][allEmptyCell[randomCell].y];

  tbody[allEmptyCell[randomCell].x]
    .children[allEmptyCell[randomCell].y].innerHTML
  = matrix[allEmptyCell[randomCell].x][allEmptyCell[randomCell].y];

  if (newDiv.textContent === '4') {
    tbody[allEmptyCell[randomCell].x]
      .children[allEmptyCell[randomCell].y].className = 'field-cell';

    tbody[allEmptyCell[randomCell].x]
      .children[allEmptyCell[randomCell].y].classList.add('field-cell--4');
  } else {
    tbody[allEmptyCell[randomCell].x]
      .children[allEmptyCell[randomCell].y].className = 'field-cell';

    tbody[allEmptyCell[randomCell].x]
      .children[allEmptyCell[randomCell].y].classList.add('field-cell--2');
  }

  allEmptyCell = [];
  oldArray = [];
  allCell.forEach(item => oldArray.push(item.innerText));
};

function combineRowRight() {
  clickArrowRight();

  for (let y = matrix.length - 1; y >= 0; y--) {
    for (let k = matrix[y].length - 1; k >= 0; k--) {
      if (matrix[y][k - 1] === undefined) {
        break;
      }

      if (matrix[y][k] === matrix[y][k - 1]
        && matrix[y][k] !== '') {
        const totalValue = parseInt(matrix[y][k])
        + parseInt(matrix[y][k - 1]);

        score += totalValue;
        blockScore.innerText = score;

        isYouWin();

        matrix[y][k] = totalValue;
        matrix[y][k - 1] = '';
      } else {
        continue;
      }
    }
  }
  clickArrowRight();
}

function clickArrowRight() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (j % 4 === 0) {
        const totalOne = matrix[i][j];
        const totalTwo = matrix[i][j + 1];
        const totalThree = matrix[i][j + 2];
        const totalFour = matrix[i][j + 3];

        const Row = [totalOne, totalTwo, totalThree, totalFour];

        const filteredRow = Row.filter(item => item);
        const missing = width - filteredRow.length;
        const empty = new Array(missing).fill('');

        const newRow = empty.concat(filteredRow);

        matrix[i][j] = newRow[0];
        matrix[i][j + 1] = newRow[1];
        matrix[i][j + 2] = newRow[2];
        matrix[i][j + 3] = newRow[3];
      }
    }
  }
}

function addOrRemoveClass() {
  for (let k = 0; k < allCell.length; k++) {
    // console.log(allCell)
    allCell[k].className = 'field-cell';

    allCell[k] === ''
      ? allCell[k].className = 'field-cell'
      : allCell[k].classList.add(`field-cell--${allCell[k].innerText}`);
  }
}

startGame.addEventListener('click', () => {
  messStart.setAttribute('hidden', 'hidden');
  startGame.innerText = 'Restart';
  startGame.classList.remove('start');
  startGame.classList.add('restart');
  youLose.classList.add('hidden');
  youWin.classList.add('hidden');
  score = 0;
  blockScore.innerText = score;
  cleanTable();
  render();
  countBusyCell = false;
  generateNumInCell();
  generateNumInCell();
});

function lookChanged() {
  for (let t = 0; t < oldArray.length; t++) {
    if (oldArray[t] === allCell[t].innerText) {
      continue;
    } else {
      return false;
    }
  }

  return true;
}

function cleanTable() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = '';
    }
  }
}

function youLoseNow() {
  for (let i = 0; i <= matrix.length - 1;) {
    const row = matrix[i];

    for (let j = 0; j <= row.length - 1;) {
      if (matrix[i + 1] === undefined) {
        if (row[j] === row[j + 1]) {
          return false;
        }
      }

      if (i === 3) {
        if (row[j] === row[j + 1]
          || row[j + 1] === row[j + 2]
          || row[j + 2] === row[j + 3]) {
          return false;
        }

        return true;
      }

      if (j === 3) {
        if (row[j] === matrix[i + 1][j]
          || row[j] === matrix[i + 1][j]) {
          return false;
        }
        j++;
        continue;
      }

      if (row[j] === row[j + 1]
        || row[j] === matrix[i + 1][j]) {
        return false;
      }

      j++;
    }
    i++;
  }

  return true;
}

function isYouWin() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (+matrix[i][j] >= 2048) {
        youWin.classList.remove('hidden');
      }
    }
  }
}

document.addEventListener('keydown', (event) => {
  const eventCode = event.code;

  switch (eventCode) {
    case 'ArrowRight':
      keyRight();
      break;
    case 'ArrowLeft':
      keyLeft();
      break;
    case 'ArrowUp':
      keyUp();
      break;
    case 'ArrowDown':
      keyDown();
      break;
  }
});

function keyRight() {
  combineRowRight();
  render();
  countBusyCell = lookChanged();
  generateNumInCell();
}

function keyLeft() {
  rotateMatrix(matrix);
  rotateMatrix(matrix);
  combineRowRight();
  rotateMatrix(matrix);
  rotateMatrix(matrix);
  render();
  countBusyCell = lookChanged();
  generateNumInCell();
}

function keyUp() {
  rotateMatrix(matrix);
  combineRowRight();
  rotateMatrix(matrix);
  rotateMatrix(matrix);
  rotateMatrix(matrix);
  render();
  countBusyCell = lookChanged();
  generateNumInCell();
}

function keyDown() {
  rotateMatrix(matrix);
  rotateMatrix(matrix);
  rotateMatrix(matrix);
  combineRowRight();
  rotateMatrix(matrix);
  render();
  countBusyCell = lookChanged();
  generateNumInCell();
}
