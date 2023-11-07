'use strict';

const button = document.querySelector('.button');
const gameMessageWin = document.querySelector('.message-win');
const gameMessageLose = document.querySelector('.message-lose');
const gameMessageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const fieldSize = 4;
const winValue = 2048;
let score = 0;
let field = Array.from({ length: fieldSize }, () => Array(fieldSize).fill(0));

// Функція для ініціалізації гри.
function initializeGame() {
  score = 0;
  gameScore.textContent = score;
  gameMessageWin.classList.add('hidden');
  gameMessageLose.classList.add('hidden');
  gameMessageStart.classList.remove('hidden');
  clearField();
}

// Функція для очищення поля гри.
function clearField() {
  const allCells = [];

  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      allCells.push({
        row: rowIndex, col: colIndex,
      });
    });
  });

  allCells.forEach((cell) => {
    const { row, col } = cell;

    field[row][col] = 0;
  });
}

// Функція для генерації нової клітинки.
function generateCell() {
  const availableCells = [];

  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (value === 0) {
        availableCells.push({
          row: rowIndex, col: colIndex,
        });
      }
    });
  });

  if (availableCells.length > 0) {
    const { row, col }
      = availableCells[Math.floor(Math.random() * availableCells.length)];

    field[row][col] = Math.random() < 0.9 ? 2 : 4;
    updateField();
  }
}

// Функція для оновлення відображення поля гри.
function updateField() {
  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = cells[rowIndex * fieldSize + colIndex];

      cell.textContent = value > 0 ? value : '';
      cell.className = `field-cell field-cell--${value}`;
    });
  });
}

// Функція для руху клітинок у вказаному напрямку.
function moveCells(direction) {
  let moved = false;

  function rotateField() {
    field = field[0].map((col, i) => field.map(row => row[i])).reverse();
  }

  function moveRowOrColumn(arr) {
    const nonZero = arr.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < nonZero.length; i++) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const newValue = nonZero[i] * 2;

        result.push(newValue);
        score += newValue;
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
    updateField();
    gameScore.textContent = score;
    generateCell();

    if (field.flat().includes(winValue)) {
      gameMessageWin.classList.remove('hidden');
    }

    if (!canMove()) {
      gameMessageLose.classList.remove('hidden');
    }
  }
}

// Перевірка можливості подальших ходів.
function canMove() {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (field[i][j] === 0) {
        return true;
      }

      if (j < fieldSize - 1 && field[i][j] === field[i][j + 1]) {
        return true;
      }

      if (i < fieldSize - 1 && field[i][j] === field[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

// Функція для порівняння двох масивів.
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

// Обробка натискання клавіш для руху клітинок.
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

// Обробка натискання кнопки "Start/Restart".
button.addEventListener('click', function() {
  initializeGame();
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  gameMessageStart.classList.add('hidden');
  generateCell();
  generateCell();
});

// Ініціалізуємо гру при завантаженні сторінки.
initializeGame();
