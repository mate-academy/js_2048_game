'use strict';

const buttonToPlay = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const scoreCounter = document.querySelector('.game-score');

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
    // const randomIndex = getRandomIndex(fieldCells.length - 1);

    // fieldCells[randomIndex].classList.add('field-cell--2');
    // fieldCells[randomIndex].innerHTML = '2';
    spawnNewNumber(2);
  }

  paintCell();
}

function getRandomIndex(max) {
  let index;
  // Масив для зберігання вибраних рандомних індексів
  const chosenIndexes = [];

  do {
    index = Math.floor(Math.random() * 15);
  } while (chosenIndexes.includes(index));

  chosenIndexes.push(index);

  return index;
}

function spawnNewNumber(numberToSpawn) {
  const emptyCells = [];

  iterateMatrix(element => {
    if (element.innerHTML === '') {
      emptyCells.push(element);
    }
  });

  if (emptyCells.length > 0) {
    const randomIndex = getRandomIndex(emptyCells.length - 1);
    const randomNumber = numberToSpawn;
    // Імітована ймовірність для числа 2 і 4

    emptyCells[randomIndex].innerHTML = randomNumber;
  }
}

function paintCell() {
  iterateMatrix((element) => {
    for (let num = 2; num <= 2048; num *= 2) {
      if (parseInt(element.innerHTML) === num) {
        const classStr = 'field-cell--' + num;

        element.classList.add(classStr);
      }
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
  arrElement.classList.remove(...arrElement.classList);
  arrElement.classList.add('field-cell');
}

function iterateMatrix(callback) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      callback(matrix[i][j]);
    }
  }
}

function callMove() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      moveUp();
      paintCell();
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

function moveRight() {
  const pastValues = createMatrixValueCopy();

  for (let i = 0; i < matrix.length; i++) {
    let merged = false;

    for (let j = matrix[i].length - 2; j >= 0; j--) {
      if (matrix[i][j].innerHTML !== '') {
        let k = j + 1;

        while (k < matrix[i].length && matrix[i][k].innerHTML === '') {
          matrix[i][k].innerHTML = matrix[i][k - 1].innerHTML;
          restoreCell(matrix[i][k - 1]);
          k++;
        }

        while (k < matrix[i].length) {
          if (!merged && compareCells(matrix[i][k], matrix[i][k - 1])) {
            matrix[i][k].innerHTML
            = `${parseInt(matrix[i][k].innerHTML) * 2}`;
            matrix[i][k - 1].innerHTML = '';
            restoreCell(matrix[i][k - 1]);

            score += parseInt(matrix[i][k].innerHTML);

            // Встановлюємо прапорець "merged" на t
            merged = true;
          } else {
            merged = false; // Скидаємо прапорець, якщо злиття не відбулось
          }
          k++;
        }
      }
    }
  }

  // Генеруємо нове число після зсуву

  const newValues = createMatrixValueCopy();

  if (isChanged(pastValues, newValues)) {
    spawnNewNumber(requiredNumber());
    paintCell();
  }

  paintCell();
}

function moveLeft() {
  const pastValues = createMatrixValueCopy();

  for (let i = 0; i < matrix.length; i++) {
    let merged = false;

    for (let j = 1; j < matrix[i].length; j++) {
      if (matrix[i][j].innerHTML !== '') {
        let k = j - 1;

        while (k >= 0 && matrix[i][k].innerHTML === '') {
          matrix[i][k].innerHTML = matrix[i][k + 1].innerHTML;
          restoreCell(matrix[i][k + 1]);
          k--;
        }

        while (k >= 0) {
          if (!merged && compareCells(matrix[i][k], matrix[i][k + 1])) {
            matrix[i][k].innerHTML = `${parseInt(matrix[i][k].innerHTML) * 2}`;
            matrix[i][k + 1].innerHTML = '';
            restoreCell(matrix[i][k + 1]);

            score += parseInt(matrix[i][k].innerHTML);

            // Встановлюємо прапорець "merged" на true
            merged = true;
          } else {
            merged = false; // Скидаємо прапорець, якщо злиття не відбулось
          }
          k--;
        }
      }
    }
  }

  // Генеруємо нове число після зсуву

  const newValues = createMatrixValueCopy();

  if (isChanged(pastValues, newValues)) {
    spawnNewNumber(requiredNumber());
    paintCell();
  }

  paintCell();
}

function moveUp() {
  const pastValues = createMatrixValueCopy();

  for (let j = 0; j < matrix[0].length; j++) {
    let merged = false;

    for (let i = 1; i < matrix.length; i++) {
      if (matrix[i][j].innerHTML !== '') {
        let k = i - 1;

        while (k >= 0 && matrix[k][j].innerHTML === '') {
          matrix[k][j].innerHTML = matrix[k + 1][j].innerHTML;
          restoreCell(matrix[k + 1][j]);
          k--;
        }

        while (k >= 0) {
          if (!merged && compareCells(matrix[k][j], matrix[k + 1][j])) {
            matrix[k][j].innerHTML = `${parseInt(matrix[k][j].innerHTML) * 2}`;
            matrix[k + 1][j].innerHTML = '';
            restoreCell(matrix[k + 1][j]);

            score += parseInt(matrix[k][j].innerHTML);

            // Встановлюємо прапорець "merged" на true
            merged = true;
          } else {
            merged = false; // Скидаємо прапорець, якщо злиття не відбулось
          }
          k--;
        }
      }
    }
  }

  const newValues = createMatrixValueCopy();

  if (isChanged(pastValues, newValues)) {
    spawnNewNumber(requiredNumber());
    paintCell();
  }
  paintCell();
}

function moveDown() {
  const pastValues = createMatrixValueCopy();

  for (let j = 0; j < matrix[0].length; j++) {
    let merged = false;

    for (let i = matrix.length - 2; i >= 0; i--) {
      if (matrix[i][j].innerHTML !== '') {
        let k = i + 1;

        while (k < matrix.length && matrix[k][j].innerHTML === '') {
          matrix[k][j].innerHTML = matrix[k - 1][j].innerHTML;
          restoreCell(matrix[k - 1][j]);
          k++;
        }

        while (k < matrix.length) {
          if (!merged && compareCells(matrix[k][j], matrix[k - 1][j])) {
            matrix[k][j].innerHTML = `${parseInt(matrix[k][j].innerHTML) * 2}`;
            matrix[k - 1][j].innerHTML = '';
            restoreCell(matrix[k - 1][j]);

            score += parseInt(matrix[k][j].innerHTML);

            // Встановлюємо прапорець "merged" на true
            merged = true;
          } else {
            merged = false; // Скидаємо прапорець, якщо злиття не відбулось
          }
          k++;
        }
      }
    }
  }

  const newValues = createMatrixValueCopy();

  if (isChanged(pastValues, newValues)) {
    spawnNewNumber(requiredNumber());
    paintCell();
  }

  paintCell();
}

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
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (matrix[r][c].innerHTML === '') {
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
