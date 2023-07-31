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

  for (let i = 0; i < table.length; i++) {
    table[i][index] = mergedArr[i] || 0;
  }
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

  for (let i = 0; i < table.length; i++) {
    table[i][index] = mergedArr[i] || 0;
  }
}

function showMessage(messageType) {
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  switch (messageType) {
    case 'win':
      winMessage.classList.remove('hidden');
      loseMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      break;
    case 'lose':
      winMessage.classList.add('hidden');
      loseMessage.classList.remove('hidden');
      startMessage.classList.add('hidden');
      break;
    case 'start':
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      startMessage.classList.remove('hidden');
      break;
    default:
      return 0;
  }
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
  if (noEmptyCell()) {
    if (noCellToMerge()) {
      showMessage('lose');
    }
  }
}

function updateScore() {
  score.textContent = scoreValue;

  for (const row of table) {
    for (const item of row) {
      if (item === 2048) {
        showMessage('win');
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

    if (tableValue === 0) {
      fields[i].textContent = '';
    } else {
      fields[i].textContent = tableValue;
    }

    fields[i].classList = ['field-cell'];

    if (tableValue !== 0) {
      fields[i].classList.add(`field-cell--${tableValue}`);
    }
  }
}

function appearingOneRandomCell() {
  const [rowIndex, columnIndex] = getRandonCell();

  const firstRandomNum = Math.floor(Math.random() * 10);

  if (firstRandomNum === 4) {
    table[rowIndex][columnIndex] = 4;
  } else {
    table[rowIndex][columnIndex] = 2;
  }
}

function restart() {
  table[0] = [0, 0, 0, 0];
  table[1] = [0, 0, 0, 0];
  table[2] = [0, 0, 0, 0];
  table[3] = [0, 0, 0, 0];

  scoreValue = 0;
  updateScore();
  showMessage('start');
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    gameStart();
  } else {
    restart();
    updateGameFields();
    appearingOneRandomCell();
    updateGameFields();
    appearingOneRandomCell();
    updateGameFields();
  }
});

function getRandonCell() {
  const emptyCells = [];

  table.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === 0) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    });
  });

  return emptyCells[Math.floor(Math.random() * (emptyCells.length - 1))];
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

  for (let i = 0; i < table.length; i++) {
    paramArr[i] = mergedArr[i] || 0;
  }
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

  for (let i = 0; i < table.length; i++) {
    paramArr[i] = mergedArr[i] || 0;
  }
}

function moveHorizontally(directionFunctionName) {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (const row of table) {
    directionFunctionName(row);
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

function moveVertically(directionFunctionName) {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (let j = 0; j < 4; j++) {
    directionFunctionName(
      [table[0][j], table[1][j], table[2][j], table[3][j]], j
    );
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

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') {
    moveHorizontally(left);
  }

  if (e.key === 'ArrowRight') {
    moveHorizontally(right);
  }

  if (e.key === 'ArrowUp') {
    moveVertically(up);
  }

  if (e.key === 'ArrowDown') {
    moveVertically(down);
  }

  loseCheck();
});

const gameTable = document.querySelector('.game-field');

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
});

gameTable.addEventListener('touchmove', (e) => {
  e.preventDefault();
});

gameTable.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

gameTable.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const touchDiffX = touchEndX - touchStartX;
  const touchDiffY = touchEndY - touchStartY;
  const breakPoint = 50;

  if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
    if (touchDiffX > breakPoint) {
      moveHorizontally(right);
      loseCheck();
    } else if (touchDiffX < -1 * breakPoint) {
      moveHorizontally(left);
      loseCheck();
    }
  } else {
    if (touchDiffY > breakPoint) {
      moveVertically(down);
      loseCheck();
    } else if (touchDiffY < -1 * breakPoint) {
      moveVertically(up);
      loseCheck();
    }
  }
});

document.addEventListener('touchmove', (e) => {
  e.preventDefault();
});

function gameStart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'restart';

  appearingOneRandomCell();
  updateGameFields();
  appearingOneRandomCell();
  updateGameFields();
}
