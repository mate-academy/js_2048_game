/* eslint-disable no-param-reassign */
'use strict';

const [startBtn, stopBtn] = document.querySelectorAll('.button');
const [loseMessage, winMessage, startMessage]
  = document.querySelectorAll('.message');
const cells = [...document.getElementsByClassName('field_cell')];
const cellsMatrix = [];
const score = document.getElementById('score');

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let cellsIndex = 0;

class Cell {
  constructor(index, currentNumber = 0) {
    this.currentNumber = currentNumber;
    this.htmlElement = cells[index];
  }

  setNumber(number) {
    this.htmlElement.classList.remove(`field_cell--${this.currentNumber}`);
    this.currentNumber = number;
    this.htmlElement.classList.add(`field_cell--${this.currentNumber}`);

    return this;
  }
}

for (let i = 0; i < 4; i++) {
  cellsMatrix[i] = [];

  for (let y = 0; y < 4; y++) {
    cellsMatrix[i].push(new Cell(cellsIndex));
    cellsIndex++;
  }
}

let gameScore = 0;

startBtn.addEventListener('click', () => {
  startBtn.classList.toggle('hidden');
  stopBtn.classList.toggle('hidden');
  startMessage.classList.toggle('hidden');

  window.addEventListener('keydown', eventListener);

  spawnCell();
});

stopBtn.addEventListener('click', function() {
  for (const row of board) {
    row.fill(0, 0, 4);
  }

  gameScore = 0;
  scoreUpdate(gameScore);
  updateNumbers();
  spawnCell();

  loseMessage.classList.add('hidden');

  window.addEventListener('keydown', eventListener);
});

function eventListener(key) {
  switch (key.code) {
    case 'ArrowUp':
      moveCellsUp();
      spawnCell();
      break;

    case 'ArrowDown':
      moveCellsDown();
      spawnCell();
      break;

    case 'ArrowRight':
      moveCellsRight();
      spawnCell();
      break;

    case 'ArrowLeft':
      moveCellsLeft();
      spawnCell();
      break;
  }
}

function moveCellsUp() {
  for (const rowIndex in board) {
    let column = [
      board[0][rowIndex],
      board[1][rowIndex],
      board[2][rowIndex],
      board[3][rowIndex],
    ];

    column = moveInRow(column);

    for (const cellIndex in column) {
      board[cellIndex][rowIndex] = column[cellIndex];
    }
  }

  updateNumbers();
}

function moveCellsDown() {
  for (const rowIndex in board) {
    let column = [
      board[0][rowIndex],
      board[1][rowIndex],
      board[2][rowIndex],
      board[3][rowIndex],
    ];

    column = moveInRow(column.reverse());
    column.reverse();

    for (const cellIndex in column) {
      board[cellIndex][rowIndex] = column[cellIndex];
    }
  }

  updateNumbers();
}

function moveCellsLeft() {
  for (const index in board) {
    board[index] = moveInRow(board[index]);
  }

  updateNumbers();
}

function moveCellsRight() {
  for (const index in board) {
    board[index] = moveInRow(board[index].reverse());
    board[index].reverse();
  }

  updateNumbers();
}

function moveInRow(row) {
  row = filterZero(row);

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      gameScore += row[i];

      if (row[i] === 2048) {
        wonGame();
      }

      row[i + 1] = 0;
    }
  }

  row = filterZero(row);

  for (let i = row.length; i < 4; i++) {
    row.push(0);
  }

  scoreUpdate(gameScore);

  return row;
}

function countZeroes(row) {
  const numberOfZeroes = row.reduce((totalNumber, cell) => {
    if (cell === 0) {
      return totalNumber + 1;
    }

    return totalNumber;
  }, 0);

  return numberOfZeroes;
}

function filterZero(row) {
  return row.filter(cell => cell !== 0);
}

function updateNumbers() {
  cellsMatrix.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      cell.setNumber(board[rowIndex][cellIndex]);
    });
  });
}

function spawnCell() {
  const freeCells = board.reduce((total, row) => total + countZeroes(row), 0);

  if (freeCells === 0) {
    return lostGame();
  }

  let zeroIndex = Math.floor(Math.random() * freeCells);

  const chanseToSpawn4 = Math.floor(Math.random() * 100);

  const chooseStartNumber = chanseToSpawn4 <= 10 ? 4 : 2;

  for (let i = 0; i < board.length; i++) {
    let changed = false;

    for (let y = 0; y < board[i].length; y++) {
      if (board[i][y] === 0) {
        if (zeroIndex === 0) {
          board[i][y] = chooseStartNumber;
          changed = true;
          break;
        }

        zeroIndex -= 1;
      }
    }

    if (changed) {
      break;
    }
  }

  updateNumbers();

  return true;
}

function scoreUpdate(number) {
  score.innerHTML = number;
}

function lostGame() {
  loseMessage.classList.remove('hidden');
  window.removeEventListener('keydown', eventListener);
}

function wonGame() {
  winMessage.classList.remove('hidden');
  window.removeEventListener('keydown', eventListener);
}
