'use strict';

const table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function up(paramArr, index) {
  const arr = paramArr.filter(item => item !== 0);

  for (let i = 0; i < arr.length - 1; i++) {
    const current = arr[i];
    const next = arr[i + 1];

    if (current === next) {
      arr[i] = current * 2;
      scoreValue += arr[i];
      updateScore();
      arr[i + 1] = 0;
    }
  }

  const mergedArr = arr.filter(item => item !== 0);

  table[0][index] = mergedArr[0] || 0;
  table[1][index] = mergedArr[1] || 0;
  table[2][index] = mergedArr[2] || 0;
  table[3][index] = mergedArr[3] || 0;
}

function down(paramArr, index) {
  const arr = paramArr.filter(item => item !== 0);

  for (let i = arr.length - 1; i >= 0; i--) {
    const current = arr[i];
    const prev = arr[i - 1];

    if (current === prev) {
      arr[i] = current * 2;
      scoreValue += arr[i];
      updateScore();
      arr[i - 1] = 0;
    }
  }

  const mergedArr = arr.filter(item => item !== 0);

  while (mergedArr.length < 4) {
    mergedArr.unshift(0);
  }

  table[0][index] = mergedArr[0] || 0;
  table[1][index] = mergedArr[1] || 0;
  table[2][index] = mergedArr[2] || 0;
  table[3][index] = mergedArr[3] || 0;
}

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function messageWin() {
  winMessage.classList = ['message message-win'];
  loseMessage.classList = ['message message-lose hidden'];
  startMessage.classList = ['message message-start hidden'];
}

function messageStart() {
  winMessage.classList = ['message message-win hidden'];
  loseMessage.classList = ['message message-lose hidden'];
  startMessage.classList = ['message message-start'];
}

function messageLose() {
  winMessage.classList = ['message message-win hidden'];
  loseMessage.classList = ['message message-lose'];
  startMessage.classList = ['message message-start hidden'];
}

function noEmptyCell() {
  for (const row of table) {
    for (const cell of row) {
      if (cell === 0) {
        return false;
      }
    }
  }

  return true;
}

function noCellToMerge() {
  for (const row of table) {
    for (let i = 0; i < row.length - 1; i++) {
      const current = row[i];
      const next = row[i + 1];

      if (current === next) {
        return false;
      }
    }
  }

  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      const current = table[k][j];
      const cellNextRow = table[k + 1][j];

      if (current === cellNextRow) {
        return false;
      }
    }
  }

  return true;
}

function loseCheck() {
  if (noEmptyCell() && noCellToMerge()) {
    messageLose();
  }
}

function updateScore() {
  score.textContent = scoreValue;

  for (const row of table) {
    for (const item of row) {
      if (item === 2048) {
        messageWin();
      }
    }
  }
}

let scoreValue = 0;
const score = document.querySelector('.game-score');

score.textContent = scoreValue;

const fields = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

function updateGameFields() {
  for (let i = 0; i < fields.length; i++) {
    const indexRow = Math.floor(i / 4);
    const indexCol = i - (indexRow * 4);
    const tableValue = table[indexRow][indexCol];

    fields[i].textContent = tableValue;

    fields[i].classList = ['field-cell'];

    if (tableValue !== 0) {
      fields[i].classList.add(`field-cell--${tableValue}`);
    }
  }
}

updateGameFields();

function appearingOneRandomCell() {
  const fieldIndex = getRandonCell();
  const rowIndex = Math.floor(fieldIndex / 4);
  const colIndex = fieldIndex - (rowIndex * 4);

  const firstRandomNum = Math.floor(Math.random() * 10);

  if (firstRandomNum === 4) {
    table[rowIndex][colIndex] = 4;
  } else {
    table[rowIndex][colIndex] = 2;
  }
}

function restart() {
  table[0] = [0, 0, 0, 0];
  table[1] = [0, 0, 0, 0];
  table[2] = [0, 0, 0, 0];
  table[3] = [0, 0, 0, 0];

  scoreValue = 0;
  updateScore();
  messageStart();
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';

    appearingOneRandomCell();
    updateGameFields();
    appearingOneRandomCell();
    updateGameFields();
    // console.log(table);
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    restart();
    updateGameFields();
    // console.log(table);
  }
});

function getRandonCell() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  for (let i = 15; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);

    const value = arr[randomIndex];

    const indexRow = Math.floor(value / 4);
    const indexCol = value - (indexRow * 4);

    if (table[indexRow][indexCol] === 0) {
      return value;
    } else {
      arr.splice(randomIndex, 1);
    }
  }
}

function left(paramArr) {
  const arr = paramArr.filter(item => item !== 0);

  for (let i = 0; i < arr.length - 1; i++) {
    const current = arr[i];
    const next = arr[i + 1];

    if (current === next) {
      arr[i] = current * 2;
      scoreValue += arr[i];
      updateScore();
      arr[i + 1] = 0;
    }
  }

  const mergedArr = arr.filter(item => item !== 0);

  paramArr[0] = mergedArr[0] || 0;
  paramArr[1] = mergedArr[1] || 0;
  paramArr[2] = mergedArr[2] || 0;
  paramArr[3] = mergedArr[3] || 0;
}

function right(paramArr) {
  const arr = paramArr.filter(item => item !== 0);

  for (let i = arr.length - 1; i >= 0; i--) {
    const current = arr[i];
    const prev = arr[i - 1];

    if (current === prev) {
      arr[i] = current * 2;
      scoreValue += arr[i];
      updateScore();
      arr[i - 1] = 0;
    }
  }

  const mergedArr = arr.filter(item => item !== 0);

  while (mergedArr.length < 4) {
    mergedArr.unshift(0);
  }

  paramArr[0] = mergedArr[0] || 0;
  paramArr[1] = mergedArr[1] || 0;
  paramArr[2] = mergedArr[2] || 0;
  paramArr[3] = mergedArr[3] || 0;
}

function moveLeft() {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (const row of table) {
    left(row);
  }

  for (let i = 0; i < 16; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);

    const tableValue = table[rowIndex][colIndex];
    const copyTableValue = copyTable[rowIndex][colIndex];

    if (tableValue !== copyTableValue) {
      appearingOneRandomCell();
      updateGameFields();

      break;
    }
  }
}

function moveRight() {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (const row of table) {
    right(row);
  }

  for (let i = 0; i < 16; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);

    const tableValue = table[rowIndex][colIndex];
    const copyTableValue = copyTable[rowIndex][colIndex];

    if (tableValue !== copyTableValue) {
      appearingOneRandomCell();
      updateGameFields();

      break;
    }
  }
}

function moveUp() {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (let j = 0; j < 4; j++) {
    up([table[0][j], table[1][j], table[2][j], table[3][j]], j);
  }

  for (let i = 0; i < 16; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);

    const tableValue = table[rowIndex][colIndex];
    const copyTableValue = copyTable[rowIndex][colIndex];

    if (tableValue !== copyTableValue) {
      appearingOneRandomCell();
      updateGameFields();

      break;
    }
  }
}

function moveDown() {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (let j = 0; j < 4; j++) {
    down([table[0][j], table[1][j], table[2][j], table[3][j]], j);
  }

  for (let i = 0; i < 16; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);

    const tableValue = table[rowIndex][colIndex];
    const copyTableValue = copyTable[rowIndex][colIndex];

    if (tableValue !== copyTableValue) {
      appearingOneRandomCell();
      updateGameFields();

      break;
    }
  }
}

document.addEventListener('keydown', eventParam => {
  if (eventParam.key === 'ArrowLeft') {
    moveLeft();
    // console.log('left');
    loseCheck();
  }

  if (eventParam.key === 'ArrowRight') {
    moveRight();
    // console.log('right');
    loseCheck();
  }

  if (eventParam.key === 'ArrowUp') {
    moveUp();
    // console.log('up');
    loseCheck();
  }

  if (eventParam.key === 'ArrowDown') {
    moveDown();
    // console.log('down');
    loseCheck();
  }
});

const gameTable = document.querySelector('.game-field');

let touchStartX = 0;
let touchStartY = 0;

gameTable.addEventListener('touchstart', (eventPar) => {
  touchStartX = eventPar.touches[0].clientX;
  touchStartY = eventPar.touches[0].clientY;
});

gameTable.addEventListener('touchend', (eventPar) => {
  const touchEndX = eventPar.changedTouches[0].clientX;
  const touchEndY = eventPar.changedTouches[0].clientY;
  const touchDiffX = touchEndX - touchStartX;
  const touchDiffY = touchEndY - touchStartY;

  if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
    if (touchDiffX > 50) {
      // Swipe right
      moveRight();
      loseCheck();
    } else if (touchDiffX < -50) {
      // Swipe left
      moveLeft();
      loseCheck();
    }
  } else {
    if (touchDiffY > 50) {
      // Swipe down
      moveDown();
      loseCheck();
    } else if (touchDiffY < -50) {
      // Swipe up
      moveUp();
      loseCheck();
    }
  }
});

// document.addEventListener('keydown', event => console.log(event.key));
restart();
