'use strict';

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');
let score = 0;
let field = fieldOfZeros();

function fieldOfZeros() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function fillRandomCell() {
  const row = Math.floor(Math.random() * 4);
  const cell = Math.floor(Math.random() * 4);

  (field[row][cell] === 0)
    ? field[row][cell] = (Math.floor(Math.random() * 100) > 10 ? 2 : 4)
    : fillRandomCell();
}

function fillGameField() {
  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      fieldRows[row].children[cell].innerText = field[row][cell] || '';

      fieldRows[row].children[cell].className
      = `field-cell field-cell--${field[row][cell]}`;

      if (field[row][cell] === 2048) {
        document.removeEventListener('keydown', listenerForArrows);
        messageWin.classList.remove('hidden');
      };
    }
  }
  gameScore.innerText = score;
  checkGameOver();
}

function mergeCellsOfRow(row) {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  while (row.length < 4) {
    row.push(0);
  }

  return row;
}

function clickArrowLeft() {
  for (let row = 0; row < 4; row++) {
    const filledCells = field[row].filter(value => value !== 0);

    mergeCellsOfRow(filledCells);
    field[row] = filledCells;
  }
}

function clickArrowRight() {
  for (let row = 0; row < 4; row++) {
    const filledCells = field[row].reverse().filter(value => value !== 0);

    mergeCellsOfRow(filledCells);
    field[row] = filledCells.reverse();
  }
}

function transpose(arr) {
  return arr.map((value, column) => arr.map(row => row[column]));
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

function checkGameOver() {
  let gameOver = true;
  const transposedField = transpose([...field]);
  const fieldContainsZero = field.some(item => item.includes(0));

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 3; cell++) {
      if (field[row][cell] === field[row][cell + 1]
        || transposedField[row][cell] === transposedField[row][cell + 1]) {
        gameOver = false;
      }
    }
  }

  if (gameOver && !fieldContainsZero) {
    document.removeEventListener('keydown', listenerForArrows);
    messageLose.classList.remove('hidden');
  };
}

function listenerForArrows(e) {
  switch (e.key) {
    case 'ArrowLeft' :
      clickArrowLeft();
      fillRandomCell();
      fillGameField();
      break;

    case 'ArrowRight' :
      clickArrowRight();
      fillRandomCell();
      fillGameField();
      break;

    case 'ArrowUp' :
      clickArrowUp();
      fillRandomCell();
      fillGameField();
      break;

    case 'ArrowDown' :
      clickArrowDown();
      fillRandomCell();
      fillGameField();
      break;
  }
}

button.addEventListener('click', (e) => {
  document.addEventListener('keydown', listenerForArrows);
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (button.innerText === 'Start') {
    button.innerText = 'Restart';
    button.classList.replace('start', 'restart');
    messageStart.hidden = true;
  } else {
    field = fieldOfZeros();
    score = 0;
  }

  fillRandomCell();
  fillRandomCell();
  fillGameField();
});
