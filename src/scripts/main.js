'use strict';

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const fields = document.querySelectorAll('.field-cell');

const table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function gameStart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'restart';
}

let scoreValue = 0;

function up(numsArr, index) {
  const arr = numsArr.filter(item => item !== 0);

  for (let i = 0; i < arr.length - 1; i++) {
    const tile = arr[i];
    const nextTile = arr[i + 1];

    if (tile === nextTile) {
      arr[i] = tile * 2;
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

function down(numsArr, index) {
  const arr = numsArr.filter(item => item !== 0);

  for (let i = arr.length - 1; i >= 0; i--) {
    const tile = arr[i];
    const nextTile = arr[i - 1];

    if (tile === nextTile) {
      arr[i] = tile * 2;
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

function left(numsArr) {
  const arr = numsArr.filter(item => item !== 0);

  for (let i = 0; i < arr.length - 1; i++) {
    const tile = arr[i];
    const nextTile = arr[i + 1];

    if (tile === nextTile) {
      arr[i] = tile * 2;
      scoreValue += arr[i];
      updateScore();
      arr[i + 1] = 0;
    }
  }

  const mergedArr = arr.filter(item => item !== 0);

  for (let i = 0; i < table.length; i++) {
    numsArr[i] = mergedArr[i] || 0;
  }
}

function right(numsArr) {
  const arr = numsArr.filter(item => item !== 0);

  for (let i = arr.length - 1; i >= 0; i--) {
    const tile = arr[i];
    const nextTile = arr[i - 1];

    if (tile === nextTile) {
      arr[i] = tile * 2;
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
    numsArr[i] = mergedArr[i] || 0;
  }
}

function showMessage(TypeOfMessage) {
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');

  switch (TypeOfMessage) {
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
    case 'nothing':
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      break;
    default:
      return 0;
  }
}

function notEmptyTile() {
  for (const row of table) {
    for (const tile of row) {
      if (tile === 0) {
        return false;
      }
    }
  }

  return true;
}

function notMergeTile() {
  for (const row of table) {
    for (let i = 0; i < row.length; i++) {
      const tile = row[i];
      const nextTile = row[i + 1];

      if (tile === nextTile) {
        return false;
      }
    }
  }

  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 3; k++) {
      const tile = table[k][j];
      const nextRowTile = table[k + 1][j];

      if (tile === nextRowTile) {
        return false;
      }
    }
  }

  return true;
}

function moveHorizontally(direction) {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (const row of table) {
    direction(row);
  }

  for (let i = 0; i < 16; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);
    const tableValue = table[rowIndex][colIndex];
    const copyTableValue = copyTable[rowIndex][colIndex];

    if (tableValue !== copyTableValue) {
      generateRandomTile();
      updateGameFields();
      break;
    }
  }
}

function moveVertically(direction) {
  const json = JSON.stringify(table);
  const copyTable = JSON.parse(json);

  for (let j = 0; j < 4; j++) {
    direction(
      [table[0][j], table[1][j], table[2][j], table[3][j]], j
    );
  }

  for (let i = 0; i < 16; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);
    const tableValue = table[rowIndex][colIndex];
    const copyTableValue = copyTable[rowIndex][colIndex];

    if (tableValue !== copyTableValue) {
      generateRandomTile();
      updateGameFields();
      break;
    }
  }
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'a': {
      moveHorizontally(left);
      break;
    }

    case 'd': {
      moveHorizontally(right);
      break;
    }

    case 'w': {
      moveVertically(up);
      break;
    }

    case 's': {
      moveVertically(down);
      break;
    }
  }
  loseCheck();
});

function loseCheck() {
  if (notEmptyTile()) {
    if (notMergeTile()) {
      showMessage('lose');
    }
  }
}

// const gameTable = document.querySelector('.game-field');

// let touchStartX = 0;
// let touchStartY = 0;

// document.addEventListener('touchmove', (e) => {
//   e.preventDefault();
// });

// gameTable.addEventListener('touchmove', (e) => {
//   e.preventDefault();
// });

// gameTable.addEventListener('touchstart', (e) => {
//   touchStartX = e.touches[0].clientX;
//   touchStartY = e.touches[0].clientY;
// });

// gameTable.addEventListener('touchend', (e) => {
//   const touchEndX = e.changedTouches[0].clientX;
//   const touchEndY = e.changedTouches[0].clientY;
//   const touchDiffX = touchEndX - touchStartX;
//   const touchDiffY = touchEndY - touchStartY;
//   const breakPoint = 50;

//   if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
//     if (touchDiffX > breakPoint) {
//       moveHorizontally(right);
//       loseCheck();
//     } else if (touchDiffX < -1 * breakPoint) {
//       moveHorizontally(left);
//       loseCheck();
//     } else if (touchDiffY > breakPoint) {
//       moveVertically(down);
//       loseCheck();
//     } else if (touchDiffY < -1 * breakPoint) {
//       moveVertically(up);
//       loseCheck();
//     }

//     switch (true) {
//       case (touchDiffX > breakPoint):
//         moveHorizontally(right);
//         break;
//       case (touchDiffX < -1 * breakPoint):
//         moveHorizontally(left);
//         break;
//       case (touchDiffY > breakPoint):
//         moveVertically(down);
//         break;
//       case (touchDiffY < -1 * breakPoint):
//         moveVertically(up);
//         break;
//       default: return 0;
//     }
//     loseCheck();
//   }
// });

// document.addEventListener('touchmove', (e) => {
//   e.preventDefault();
// });

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

function generateRandomTile() {
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
  for (let i = 0; i < table.length; i++) {
    table[i] = [0, 0, 0, 0];
  }

  scoreValue = 0;
  updateScore();
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    gameStart();
  }
  restart();
  updateGameFields();
  generateRandomTile();
  updateGameFields();
  generateRandomTile();
  updateGameFields();
  showMessage('nothing');
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
