'use strict';

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const fieldRows = document.querySelectorAll('.field-row');

const size = 4;
let score = 0;
let field = clearField();

function clearField() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function fillRandomCell() {
  const row = Math.floor(Math.random() * size);
  const cell = Math.floor(Math.random() * size);

  (field[row][cell] === 0)
    ? field[row][cell] = Math.random() > 0.1 ? 2 : 4
    : fillRandomCell();
}

function fillGameField() {
  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      const currentRenderCell = fieldRows[row].children[cell];
      const currentCell = field[row][cell];

      currentRenderCell.innerText = currentCell || '';

      currentRenderCell.className = currentCell
        ? `field-cell field-cell--${currentCell}`
        : 'field-cell';

      if (currentCell === 2048) {
        document.removeEventListener('keydown', handleArrows);
        winMessage.classList.remove('hidden');
      }
    }
  }

  gameScore.innerText = score;
  checkGameOver();
}

function checkGameOver() {
  let gameOver = true;
  const transposedField = transpose([...field]);
  const fieldContainsZero = field.some(row => row.includes(0));

  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size - 1; cell++) {
      if (field[row][cell] === field[row][cell + 1]
        || transposedField[row][cell] === transposedField[row][cell + 1]) {
        gameOver = false;
      }
    }
  }

  if (gameOver && !fieldContainsZero) {
    document.removeEventListener('keydown', handleArrows);
    loseMessage.classList.remove('hidden');
  }
}

function transpose(arr) {
  return arr.map((_, columnIndex) => arr.map(row => row[columnIndex]));
}

function mergeRowCells(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row.splice(i + 1, 1);
      score += row[i];
    }
  }

  while (row.length < size) {
    row.push(0);
  }

  return row;
}

function removeZeros(arr) {
  return arr.filter(value => value !== 0);
}

function clickArrowLeft() {
  for (let row = 0; row < size; row++) {
    const filledCells = removeZeros(field[row]);

    mergeRowCells(filledCells);
    field[row] = filledCells;
  }
}

function clickArrowRight() {
  for (let row = 0; row < size; row++) {
    const filledCells = removeZeros(field[row].reverse());

    mergeRowCells(filledCells);
    field[row] = filledCells.reverse();
  }
}

function clickArrowUp() {
  field = transpose(field);
  clickArrowLeft();
  field = transpose(field);
}

function clickArrowDown() {
  field = transpose(field);
  clickArrowRight();
  field = transpose(field);
}

function fillFieldCells() {
  fillRandomCell();
  fillGameField();
}

function handleArrows(e) {
  switch (e.key) {
    case 'ArrowLeft':
      clickArrowLeft();
      fillFieldCells();
      break;

    case 'ArrowRight':
      clickArrowRight();
      fillFieldCells();
      break;

    case 'ArrowUp':
      clickArrowUp();
      fillFieldCells();
      break;

    case 'ArrowDown':
      clickArrowDown();
      fillFieldCells();
      break;
  }
}

startButton.addEventListener('click', () => {
  document.addEventListener('keydown', handleArrows);
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (startButton.innerText === 'Start') {
    startButton.innerText = 'Restart';
    startButton.classList.replace('start', 'restart');
    startMessage.hidden = true;
  } else {
    field = clearField();
    score = 0;
  }

  fillRandomCell();
  fillFieldCells();
});
