'use strict';

let table;
let score = 0;
const columns = 4;
const rows = 4;
let canPlay = true;

const tableBody = document.querySelector('tbody');
const mainButton = document.querySelector('button');
const displayScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMassage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

displayScore.innerText = score;

mainButton.addEventListener('click', () => {
  mainButton.classList.remove('start');
  mainButton.classList.add('restart');
  mainButton.innerText = 'Restart';

  startMessage.classList.add('hidden');
  winMassage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  score = 0;
  canPlay = true;

  displayScore.innerText = score;

  startGame();
});

document.addEventListener('keyup', handlerMoveCells);

function hasEmptyCell() {
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      if (table[x][y] === 0) {
        return true;
      }
    }
  }

  return false;
}

function getRandomNumber() {
  const number = Math.random() < 0.9
    ? 2
    : 4;

  return number;
}

function setNewNumber() {
  if (!hasEmptyCell()) {
    loseMessage.classList.remove('hidden');

    canPlay = false;

    return;
  }

  let foundEmptyCell = false;

  while (!foundEmptyCell) {
    const x = Math.floor(Math.random() * rows);
    const y = Math.floor(Math.random() * columns);

    if (table[x][y] === 0) {
      const newNumber = getRandomNumber();

      table[x][y] = newNumber;

      const cell = document.getElementById(`${x}-${y}`);

      cell.innerText = newNumber;
      cell.classList.add(`field-cell--${newNumber}`);
      foundEmptyCell = true;
    }
  }
}

function startGame() {
  table = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  [...tableBody.children].forEach((row, rowIndex) => {
    [...row.children].forEach((cell, cellIndex) => {
      cell.id = `${rowIndex}-${cellIndex}`;

      const digit = table[rowIndex][cellIndex];

      updateCell(cell, digit);
    });
  });

  setNewNumber();
  setNewNumber();
}

function updateCell(element, value) {
  element.innerText = '';
  element.classList.value = '';
  element.classList.add('field-cell');

  if (value > 0) {
    element.classList.add(`field-cell--${value}`);
    element.innerText = value;
  }

  if (value === 2048) {
    winMassage.classList.remove('hidden');

    canPlay = false;
  }
}

function handlerMoveCells(e) {
  e.preventDefault();

  if (!canPlay) {
    return;
  }

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      setNewNumber();
      break;

    case 'ArrowRight':
      slideRight();
      setNewNumber();
      break;

    case 'ArrowUp':
      slideUp();
      setNewNumber();
      break;

    case 'ArrowDown':
      slideDown();
      setNewNumber();
      break;
  }
}

function deleteZeros(arr) {
  return arr.filter(digit => digit !== 0);
}

function slide(row) {
  let newRow = deleteZeros(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;

      score += newRow[i];

      displayScore.innerText = score;
    }
  }

  newRow = deleteZeros(newRow);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let x = 0; x < rows; x++) {
    const row = table[x];
    const slidedRow = slide(row);

    table[x] = slidedRow;

    for (let y = 0; y < columns; y++) {
      const cell = document.getElementById(`${x}-${y}`);
      const digit = table[x][y];

      updateCell(cell, digit);
    }
  }
}

function slideRight() {
  for (let x = 0; x < rows; x++) {
    const row = table[x].reverse();
    const slidedRow = slide(row);

    table[x] = slidedRow.reverse();

    for (let y = 0; y < columns; y++) {
      const cell = document.getElementById(`${x}-${y}`);
      const digit = table[x][y];

      updateCell(cell, digit);
    }
  }
}

function slideUp() {
  for (let y = 0; y < columns; y++) {
    const row = [table[0][y], table[1][y], table[2][y], table[3][y]];
    const slidedRow = slide(row);

    for (let x = 0; x < rows; x++) {
      table[x][y] = slidedRow[x];

      const cell = document.getElementById(`${x}-${y}`);
      const digit = table[x][y];

      updateCell(cell, digit);
    }
  }
}

function slideDown() {
  for (let y = 0; y < columns; y++) {
    const row = [table[0][y], table[1][y], table[2][y], table[3][y]].reverse();
    const slidedRow = slide(row).reverse();

    for (let x = 0; x < rows; x++) {
      table[x][y] = slidedRow[x];

      const cell = document.getElementById(`${x}-${y}`);
      const digit = table[x][y];

      updateCell(cell, digit);
    }
  }
}
