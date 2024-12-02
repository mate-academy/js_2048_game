'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
let board;
let score = 0;
const rows = 4;
const column = 4;

window.onload = function () {
  initialState();
};

function initialState() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  addNewNumber();
  addNewNumber();
  updateGameField(); // оновлюю таблицю
}

function updateGameField() {
  const fieldRows = document.querySelectorAll('.field-row');

  if (!fieldRows || fieldRows.length === 0) {
    return;
  }

  for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    const cells = fieldRows[rowIdx].children; // Клітинки у поточному рядку

    for (let colIdx = 0; colIdx < column; colIdx++) {
      const cell = cells[colIdx];
      const num = board[rowIdx][colIdx];

      updateCell(cell, num);
    }
  }
  // оновлюю рахунок
  document.getElementById('game-score').textContent = `Score: ${score}`;
}

function updateCell(cell, num) {
  cell.textContent = '';
  cell.classList.value = 'cell';

  if (num > 0) {
    cell.textContent = num;

    if (num <= 1024) {
      cell.classList.add(`x${num}`);
    } else {
      cell.classList.add('x2048');
    }
  }
}

document.addEventListener('keyup', (e) => {
  let moved = false;

  if (e.code === 'ArrowLeft') {
    moved = moveLeft();
  }

  if (moved) {
    addNewNumber(); // додаю число якщо був рух
    updateGameField(); // оновлюю
  }
});

function filterZero(inputRow) {
  return inputRow.filter((num) => num !== 0);
}

function slide(inputRow) {
  const row = [...filterZero(inputRow)];

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2; // об'єдную числа
      score += row[i]; // додаю до рахунку
      row[i + 1] = 0;
    }
  }

  return filterZero(row).concat(Array(column - row.length).fill(0));
}

function moveLeft() {
  let moved = false;

  for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    const originalRow = [...board[rowIdx]]; // зберігаю початковий стан рядка
    const newRow = slide(board[rowIdx]);

    if (newRow.toString() !== originalRow.toString()) {
      moved = true; // якщо рядок змінився значить був рух
    }

    board[rowIdx] = newRow; // оновлюю рядок
  }

  return moved; // повертаю true, якщо був рух
}

function addNewNumber() {
  const emptyCells = [];

  for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    for (let colIdx = 0; colIdx < column; colIdx++) {
      if (board[rowIdx][colIdx] === 0) {
        emptyCells.push({ r: rowIdx, c: colIdx });
      }
    }
  }

  if (emptyCells.length === 0) {
    return; // якщо немає місця, нічого не додає
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { r, c } = emptyCells[randomIndex];

  board[r][c] = Math.random() < 0.9 ? 2 : 4; // випадкове число 2 або 4
}
