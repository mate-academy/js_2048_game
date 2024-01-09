'use strict';

const startMessage = document.querySelector('.message-start');
const winnerMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const buttonStart = document.querySelector('.button');
const fieldRows = Array.from(document.querySelectorAll('.field-row'));

const size = 4;
let score = 0;
let field = clearField();

function clearField() {
  return Array.from({ length: size },
    () => Array(size).fill(0));
}

function createRandomNumb() {
  const emptyCells = [];

  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      if (field[row][cell] === 0) {
        emptyCells.push({
          row, cell,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const value = Math.random() > 0.1 ? 2 : 4;

    field[randomCell.row][randomCell.cell] = value;
  }
}

function changedGameField() {
  field.forEach((row, rowIndex) => {
    row.forEach((currentCell, cellIndex) => {
      const renderCell = fieldRows[rowIndex].children[cellIndex];

      renderCell.innerText = currentCell || '';

      renderCell.className = `field-cell${currentCell
        ? ` field-cell--${currentCell}`
        : ''}`;

      checkWin(currentCell);
    });
  });

  gameScore.innerText = score;
  gameOver();
}

function gameOver() {
  const hasEmptyCells = field.some((row) => row.includes(0));

  if (!hasEmptyCells && !mergeCells()) {
    document.removeEventListener('keydown', pushedArrows);
    loseMessage.classList.remove('hidden');
  }
}

function mergeCells() {
  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size - 1; cell++) {
      if (field[row][cell] === field[row][cell + 1]
        || field[cell][row] === field[cell + 1][row]) {
        return true;
      }
    }
  }

  return false;
}

function transposition(arr) {
  return arr[0].map((_, i) => arr.map(row => row[i]));
}

function joinCells(row) {
  const withoutZeroCells = row.filter(value => value !== 0);

  for (let i = 0; i < withoutZeroCells.length - 1; i++) {
    if (withoutZeroCells[i] === withoutZeroCells[i + 1]) {
      withoutZeroCells[i] *= 2;
      score += withoutZeroCells[i];
      withoutZeroCells.splice(i + 1, 1);
    }
  }

  return [
    ...withoutZeroCells,
    ...Array(size - withoutZeroCells.length).fill(0),
  ];
}

function arrowLeft() {
  field.forEach((row, rowIndex) => {
    field[rowIndex] = joinCells(row);
  });
}

function arrowRight() {
  field.forEach((row, rowIndex) => {
    const reversedRow = [...row].reverse();
    const joinedRow = joinCells(reversedRow);

    field[rowIndex] = joinedRow.reverse();
  });
}

function arrowUp() {
  field = transposition(field);
  arrowLeft();
  field = transposition(field);
}

function arrowDown() {
  field = transposition(field);
  arrowRight();
  field = transposition(field);
}

function fillAllCels() {
  createRandomNumb();
  changedGameField();
}

function pushedArrows(element) {
  const originalField = JSON.stringify(field);

  switch (element.key) {
    case 'ArrowLeft':
      arrowLeft();
      break;

    case 'ArrowRight':
      arrowRight();
      break;

    case 'ArrowUp':
      arrowUp();
      break;

    case 'ArrowDown':
      arrowDown();
      break;

    default:
      return;
  }

  if (JSON.stringify(field) !== originalField) {
    fillAllCels();
  }
}

function checkWin(parm) {
  if (parm === 2048) {
    winnerMessage.classList.remove('hidden');
    document.removeEventListener('keydown', pushedArrows);
  }
}

buttonStart.addEventListener('click', () => {
  document.addEventListener('keydown', pushedArrows);
  winnerMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (buttonStart.innerText === 'Start') {
    buttonStart.innerText = 'Restart';
    buttonStart.classList.replace('start', 'restart');
    startMessage.hidden = true;
  } else {
    field = clearField();
    score = 0;
  }

  createRandomNumb();
  fillAllCels();
});
