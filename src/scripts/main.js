'use strict';

const button = document.querySelector('.button');

const gameMessageStart = document.querySelector('.message-start');
const gameMessageLose = document.querySelector('.message-lose');
const gameMessageWin = document.querySelector('.message-win');

const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const fieldSize = 4;
const winValue = 2048;

let score = 0;
let field = Array.from({ length: fieldSize }, () => Array(fieldSize).fill(0));
// field[ [], ... , []] - створено масив масивів, в залежності від fieldSize

function initializeGame() {
  score = 0;
  gameScore.textContent = score;

  gameMessageStart.classList.remove('hidden');
  gameMessageLose.classList.add('hidden');
  gameMessageWin.classList.add('hidden');

  clearField();
}

function clearField() {
  const allCells = [];

  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      allCells.push({
        row: rowIndex,
        col: colIndex,
      });
    });
  });

  allCells.forEach((cell) => {
    const { row, col } = cell;

    field[row][col] = 0;
  });
}

function generateCell() {
  const availableCells = [];

  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) {
        availableCells.push({
          row: rowIndex,
          col: colIndex,
        }); // формує масив availableCells з об'єктів-клітинок { row, col }
      }
    });
  });

  if (availableCells.length > 0) {
    const { row, col }
      = availableCells[Math.floor(Math.random() * availableCells.length)];
    // генерує випадкову клітинку для запису випадкового числа

    field[row][col] = Math.random() < 0.9 ? 2 : 4; // генерує випадкове число
    updateField();
  }
}

function updateField() {
  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = cells[rowIndex * fieldSize + colIndex];

      cell.textContent = value > 0 ? value : '';
      // записує в клітинку або число(value) або ''
      cell.className = `field-cell field-cell--${value}`;
      // клітинка в залежності від числа(value) має різний фон
    });
  });
}

function moveCells(direction) {
  let moved = false;

  function rotateField() { // обертання матриці
    field = field[0]
      .map((col, i) => field.map(row => row[i]))
      .reverse();
  }

  function moveRowOrColumn(arr) {
    const nonZero = arr.filter((value) => value !== 0);
    // nonZero - масив без клітинок зі значенням 0
    const result = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const newValue = nonZero[i] * 2;

        result.push(newValue);
        score += newValue;
        // два однакових значення клітинки об'єднуємо, наприклад: 4*2 = 8
        i++;
      } else {
        result.push(nonZero[i]);
      }
    }

    while (result.length < arr.length) {
      result.push(0);
    }

    return result;
  }

  switch (direction) {
    case 'up':
      rotateField();

      for (let i = 0; i < fieldSize; i++) {
        const newRow = moveRowOrColumn(field[i]);

        if (!moved && !arraysEqual(newRow, field[i])) {
          moved = true;
        }
        field[i] = newRow;
      }
      rotateField();
      rotateField();
      rotateField();
      break;

    case 'down':
      rotateField();
      rotateField();
      rotateField();

      for (let i = 0; i < fieldSize; i++) {
        const newRow = moveRowOrColumn(field[i]);

        if (!moved && !arraysEqual(newRow, field[i])) {
          moved = true;
        }
        field[i] = newRow;
      }
      rotateField();
      break;

    case 'left':
      for (let i = 0; i < fieldSize; i++) {
        const newRow = moveRowOrColumn(field[i]);

        if (!moved && !arraysEqual(newRow, field[i])) {
          moved = true;
        }
        field[i] = newRow;
      }
      break;

    case 'right':
      rotateField();
      rotateField();

      for (let i = 0; i < fieldSize; i++) {
        const newRow = moveRowOrColumn(field[i]);

        if (!moved && !arraysEqual(newRow, field[i])) {
          moved = true;
        }
        field[i] = newRow;
      }
      rotateField();
      rotateField();
      break;
  }

  if (moved) {
    updateField(); // записує в клітинку або число або ''
    gameScore.textContent = score; // лічильник балів
    generateCell(); // генерує додаткове число на табло

    if (!canMove()) {
      gameMessageLose.classList.remove('hidden');
      // з'являється напис: You lose! Restart the game?
      // програш
    }

    if (field.flat().includes(winValue)) {
      // в масиві field є клітинка з виграшем (значення winValue)
      gameMessageWin.classList.remove('hidden');
      // з'являється напис: Winner! Congrats! You did it!
      // виграш
    }
  }
}

function canMove() {
  // перевірка чи можна грати далі, чи вже ні
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (field[i][j] === 0) {
        return true; // можна грати
      }

      if (i < fieldSize - 1 && field[i][j] === field[i + 1][j]) {
        return true; // можна грати
      }

      if (j < fieldSize - 1 && field[i][j] === field[i][j + 1]) {
        return true; // можна грати
      }
    }
  }

  return false; // не можна грати, гра закінчена, програш
}

function arraysEqual(arr1, arr2) { // перевірка двох масивів на ідентичність
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true; // два масиви ідентичні - true
}

document.addEventListener('keydown', eventButton => {
  eventButton.preventDefault();

  if (gameMessageStart.classList.contains('hidden')) {
    switch (eventButton.key) {
      case 'ArrowUp':
        moveCells('up');
        break;
      case 'ArrowDown':
        moveCells('down');
        break;
      case 'ArrowLeft':
        moveCells('left');
        break;
      case 'ArrowRight':
        moveCells('right');
        break;
    }
  }
});

button.addEventListener('click', function() {
  initializeGame(); // параметри ініціалізації, score = 0, пусті клітинки

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  gameMessageStart.classList.add('hidden');
  // з'являється напис: Press "Start" to begin game. Good luck!

  generateCell(); // генерує 1-ше початкове випадкове число на табло
  generateCell(); // генерує 2-ше початкове випадкове число на табло
});

initializeGame(); // параметри ініціалізації, score = 0, пусті клітинки
