'use strict';

const buttonToPlay = document.querySelector('.button');
const startMessage = document.querySelector('.message_start');
const winMessage = document.querySelector('.message_win');
const loseMessage = document.querySelector('.message_lose');
const scoreCounter = document.querySelector('.game_score');

const tableRows = document.querySelector('tbody').rows;

const fieldCells = document.querySelectorAll('td');

const matrix = createMatrix();
let score = 0;

buttonToPlay.addEventListener('click', () => {
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  score = 0;

  if (buttonToPlay.classList.contains('start')) {
    spawnStartNumber();
    buttonToPlay.classList.remove('start');
    buttonToPlay.classList.add('restart');
    buttonToPlay.innerHTML = 'Restart';
  }

  if (buttonToPlay.classList.contains('restart')) {
    iterateMatrix(element => restoreCell(element));
    spawnStartNumber();
  }
});

callMove();

function gameResult() {
  iterateMatrix((element) => {
    if (parseInt(element.innerHTML) === 2048) {
      winMessage.classList.remove('hidden');
    }
  });

  if (!gameLost()) {
    loseMessage.classList.remove('hidden');
  }
}

function createMatrix() {
  let rowIndex = 0;
  let colIndex = 0;

  const cols = 4;
  const array = [];

  for (let i = 0; i < fieldCells.length; i++) {
    if (!array[rowIndex]) {
      array[rowIndex] = [];
    }

    array[rowIndex].push(fieldCells[i]);

    colIndex++;

    if (colIndex === cols) {
      rowIndex++;
      colIndex = 0;
    }
  }

  return array;
}

function spawnStartNumber() {
  for (let i = 0; i < 2; i++) {
    spawnNewNumber(2);
  }

  paintCell();
}

function spawnNewNumber(numberToSpawn) {
  if (!checkForEmpty()) {
    return;
  }

  const randomValue = Math.random() < 0.9 ? 2 : 4;

  while (true) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (matrix[row][col].innerHTML === '') {
      matrix[row][col].innerHTML = randomValue;
      break;
    }

    updateGame();
  }
}

function paintCell() {
  iterateMatrix((element) => {
    const cellValue = element.innerHTML;

    if (cellValue !== '') {
      element.classList = `field_cell field_cell--${cellValue}`;
    } else {
      element.classList = 'field_cell';
    }
  });
}

function compareCells(element1, element2) {
  for (let num = 2; num <= 2048; num *= 2) {
    if (parseInt(element1.innerHTML) === num
    && parseInt(element2.innerHTML) === num) {
      return true;
    }
  }
}

function restoreCell(arrElement) {
  arrElement.innerHTML = '';
  arrElement.classList.remove(`field_cell--${arrElement.innerHTML}`);
}

function iterateMatrix(callback) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      callback(matrix[i][j]);
    }
  }
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field_cell');

  if (num > 0) {
    cell.innerText = num.toString();
    cell.classList.add(`field_cell--${num.toString()}`);
  }
}

function updateGame() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const currentCell = tableRows[r].cells[c];
      const num = parseInt(matrix[r][c].innerHTML);

      updateCell(currentCell, num);
    }
  }

  scoreCounter.innerText = score.toString();
}

function callMove() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      moveUp();
    }

    if (e.key === 'ArrowDown') {
      moveDown();
    }

    if (e.key === 'ArrowRight') {
      moveRight();
    }

    if (e.key === 'ArrowLeft') {
      moveLeft();
    }

    gameResult();

    scoreCounter.innerText = score.toString();

    paintCell();
  });
}

function forMoves(startIndex, endIndex, startFunction, moveFunction) {
  const pastValues = createMatrixValueCopy();

  for (let i = startIndex; i !== endIndex; i = moveFunction(i)) {
    let merged = false;

    for (let j = startFunction(i); j !== endIndex; j = moveFunction(j)) {
      if (matrix[i][j].innerHTML !== '') {
        let k = moveFunction(j);

        while (k !== endIndex && matrix[i][k].innerHTML === '') {
          matrix[i][k].innerHTML = matrix[i][k - moveFunction(1)].innerHTML;
          restoreCell(matrix[i][k - moveFunction(1)]);
          k = moveFunction(k);
        }

        while (k !== endIndex) {
          if (!merged
            && compareCells(matrix[i][k], matrix[i][k - moveFunction(1)])) {
            matrix[i][k].innerHTML = `${parseInt(matrix[i][k].innerHTML) * 2}`;
            matrix[i][k - moveFunction(1)].innerHTML = '';
            restoreCell(matrix[i][k - moveFunction(1)]);

            score += parseInt(matrix[i][k].innerHTML);

            // Встановлюємо прапорець "merged" на true
            merged = true;
          } else {
            merged = false; // Скидаємо прапорець, якщо злиття не відбулось
          }
          k = moveFunction(k);
        }
      }
    }
  }

  const newValues = createMatrixValueCopy();

  if (isChanged(pastValues, newValues)) {
    spawnNewNumber(requiredNumber());
  }

  updateGame();
}

function moveRight() {
  forMoves(0, matrix.length, i => i, j => j - 1);
}

function moveLeft() {
  forMoves(0, matrix.length, i => i, j => j + 1);
}

function moveUp() {
  forMoves(0, matrix[0].length, j => j, i => i + 1);
}

function moveDown() {
  forMoves(matrix.length - 1, -1, j => j, i => i - 1);
}

// function moveRight() {
//   const pastValues = createMatrixValueCopy();

//   for (let i = 0; i < matrix.length; i++) {
//     let merged = false;

//     for (let j = matrix[i].length - 2; j >= 0; j--) {
//       if (matrix[i][j].innerHTML !== '') {
//         let k = j + 1;

//         while (k < matrix[i].length && matrix[i][k].innerHTML === '') {
//           matrix[i][k].innerHTML = matrix[i][k - 1].innerHTML;
//           restoreCell(matrix[i][k - 1]);
//           k++;
//         }

//         while (k < matrix[i].length) {
//           if (!merged && compareCells(matrix[i][k], matrix[i][k - 1])) {
//             matrix[i][k].innerHTML = `${parseInt(matrix[i][k].innerHTML) * 2}`;
//             matrix[i][k - 1].innerHTML = '';
//             restoreCell(matrix[i][k - 1]);

//             score += parseInt(matrix[i][k].innerHTML);

//             // Встановлюємо прапорець "merged" на t
//             merged = true;
//           } else {
//             merged = false; // Скидаємо прапорець, якщо злиття не відбулось
//           }
//           k++;
//         }
//       }
//     }
//   }

//   const newValues = createMatrixValueCopy();

//   if (isChanged(pastValues, newValues)) {
//     spawnNewNumber(requiredNumber());
//   }

//   updateGame();
// }

// function moveLeft() {
//   const pastValues = createMatrixValueCopy();

//   for (let i = 0; i < matrix.length; i++) {
//     let merged = false;

//     for (let j = 1; j < matrix[i].length; j++) {
//       if (matrix[i][j].innerHTML !== '') {
//         let k = j - 1;

//         while (k >= 0 && matrix[i][k].innerHTML === '') {
//           matrix[i][k].innerHTML = matrix[i][k + 1].innerHTML;
//           restoreCell(matrix[i][k + 1]);
//           k--;
//         }

//         while (k >= 0) {
//           if (!merged && compareCells(matrix[i][k], matrix[i][k + 1])) {
//             matrix[i][k].innerHTML = `${parseInt(matrix[i][k].innerHTML) * 2}`;
//             matrix[i][k + 1].innerHTML = '';
//             restoreCell(matrix[i][k + 1]);

//             score += parseInt(matrix[i][k].innerHTML);

//             // Встановлюємо прапорець "merged" на true
//             merged = true;
//           } else {
//             merged = false; // Скидаємо прапорець, якщо злиття не відбулось
//           }
//           k--;
//         }
//       }
//     }
//   }

//   const newValues = createMatrixValueCopy();

//   if (isChanged(pastValues, newValues)) {
//     spawnNewNumber(requiredNumber());
//   }

//   updateGame();
// }

// function moveUp() {
//   const pastValues = createMatrixValueCopy();

//   for (let j = 0; j < matrix[0].length; j++) {
//     let merged = false;

//     for (let i = 1; i < matrix.length; i++) {
//       if (matrix[i][j].innerHTML !== '') {
//         let k = i - 1;

//         while (k >= 0 && matrix[k][j].innerHTML === '') {
//           matrix[k][j].innerHTML = matrix[k + 1][j].innerHTML;
//           restoreCell(matrix[k + 1][j]);
//           k--;
//         }

//         while (k >= 0) {
//           if (!merged && compareCells(matrix[k][j], matrix[k + 1][j])) {
//             matrix[k][j].innerHTML = `${parseInt(matrix[k][j].innerHTML) * 2}`;
//             matrix[k + 1][j].innerHTML = '';
//             restoreCell(matrix[k + 1][j]);

//             score += parseInt(matrix[k][j].innerHTML);

//             // Встановлюємо прапорець "merged" на true
//             merged = true;
//           } else {
//             merged = false; // Скидаємо прапорець, якщо злиття не відбулось
//           }
//           k--;
//         }
//       }
//     }
//   }

//   const newValues = createMatrixValueCopy();

//   if (isChanged(pastValues, newValues)) {
//     spawnNewNumber(requiredNumber());
//   }

//   updateGame();
// }

// function moveDown() {
//   const pastValues = createMatrixValueCopy();

//   for (let j = 0; j < matrix[0].length; j++) {
//     let merged = false;

//     for (let i = matrix.length - 2; i >= 0; i--) {
//       if (matrix[i][j].innerHTML !== '') {
//         let k = i + 1;

//         while (k < matrix.length && matrix[k][j].innerHTML === '') {
//           matrix[k][j].innerHTML = matrix[k - 1][j].innerHTML;
//           restoreCell(matrix[k - 1][j]);
//           k++;
//         }

//         while (k < matrix.length) {
//           if (!merged && compareCells(matrix[k][j], matrix[k - 1][j])) {
//             matrix[k][j].innerHTML = `${parseInt(matrix[k][j].innerHTML) * 2}`;
//             matrix[k - 1][j].innerHTML = '';
//             restoreCell(matrix[k - 1][j]);

//             score += parseInt(matrix[k][j].innerHTML);

//             // Встановлюємо прапорець "merged" на true
//             merged = true;
//           } else {
//             merged = false; // Скидаємо прапорець, якщо злиття не відбулось
//           }
//           k++;
//         }
//       }
//     }
//   }

//   const newValues = createMatrixValueCopy();

//   if (isChanged(pastValues, newValues)) {
//     spawnNewNumber(requiredNumber());
//   }

//   updateGame();
// }

function isChanged(matrixA, matrixB) {
  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixA[i].length; j++) {
      if (matrixA[i][j] !== matrixB[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function createMatrixValueCopy() {
  const matrixValueCopy
  = Array(matrix.length).fill(null).map(() => Array(matrix[0].length));

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrixValueCopy[i][j] = matrix[i][j].innerHTML;
    }
  }

  return matrixValueCopy;
}

function gameLost() {
  let check = false;
  const copyMatrixValue = createMatrixValueCopy();

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      if (copyMatrixValue[r][c] === copyMatrixValue[r + 1][c]
        || copyMatrixValue[r][c] === copyMatrixValue[r][c + 1]) {
        check = true;
      }
    }
  }

  if (!check && !checkForEmpty()) {
    return false;
  }

  return true;
}

function checkForEmpty() {
  const newValues = createMatrixValueCopy();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (newValues[r][c] === '') {
        return true;
      }
    }
  }

  return false;
}

function requiredNumber() {
  const requiredNumberIn = Math.random() < 0.9 ? 2 : 4;

  return requiredNumberIn;
}
