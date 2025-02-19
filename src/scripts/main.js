'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector(
  '.message-container p:nth-child(3)',
);
const messageWin = document.querySelector('.message-container p:nth-child(2)');
const messageLose = document.querySelector('.message-container p:nth-child(1)');

// Write your code here
Game.prototype.getState = function () {
  // eslint-disable-next-line no-console
  console.log(this.state);

  return this.state;
};

Game.prototype.getScore = function () {
  return this.score;
};

Game.prototype.getStatus = function () {
  if (this.state === Game.prototype.initialState) {
    return 'idle';
  }

  this.state.forEach((line) => {
    if (line.includes(2048)) {
      return 'win';
    }
  });

  if (!this.canMerge() && this.getEmptyCells().length === 0) {
    return 'lose';
  }

  return 'playing';
};

Game.prototype.moveLeft = function () {
  let wasMerged = false;
  const canMove = [true, true, true, true];

  for (let i = 0; i < this.state.length; i++) {
    const rowCopy = [...this.state[i]];
    let row = this.state[i].filter((num) => num !== 0);

    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        row[j + 1] = 0;
        this.score += row[j];
        wasMerged = true;
      }
    }

    row = row.filter((num) => num !== 0);

    while (row.length < this.state[i].length) {
      row.push(0);
    }

    if (row.every((value, index, array) => value === rowCopy[index])) {
      canMove[i] = false;
    }

    this.state[i] = row;
  }

  if (wasMerged || canMove.includes(true)) {
    this.addNumber();
    this.getState();
  }

  this.moveUtil();
};

Game.prototype.moveRight = function () {
  let wasMerged = false;
  const canMove = [true, true, true, true];

  for (let i = 0; i < this.state.length; i++) {
    const rowCopy = [...this.state[i]];
    let row = this.state[i].filter((num) => num !== 0);

    for (let j = row.length - 1; j > 0; j--) {
      if (row[j] === row[j - 1]) {
        row[j] *= 2;
        row[j - 1] = 0;
        wasMerged = true;
        this.score += row[j];
      }
    }

    row = row.filter((num) => num !== 0);

    while (row.length < this.state[i].length) {
      row.unshift(0);
    }

    if (row.every((value, index, array) => value === rowCopy[index])) {
      canMove[i] = false;
    }

    this.state[i] = row;
  }

  if (wasMerged || canMove.includes(true)) {
    this.addNumber();
    this.getState();
  }

  this.moveUtil();
};

Game.prototype.moveUp = function () {
  let wasMerged = false;
  const canMove = [true, true, true, true];

  for (let j = 0; j < this.state.length; j++) {
    let column = [];

    for (let i = 0; i < this.state.length; i++) {
      column.push(this.state[i][j]);
    }

    const columnCopy = [...column];

    column = column.filter((num) => num !== 0);

    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        column[i + 1] = 0;
        this.score += column[i];
        wasMerged = true;
      }
    }

    column = column.filter((num) => num !== 0);

    while (column.length < this.state.length) {
      column.push(0);
    }

    if (column.every((value, index, array) => value === columnCopy[index])) {
      canMove[j] = false;
    }

    for (let i = 0; i < this.state.length; i++) {
      this.state[i][j] = column[i];
    }
  }

  if (wasMerged || canMove.includes(true)) {
    this.addNumber();
    this.getState();
  }

  this.moveUtil();
};

Game.prototype.moveDown = function () {
  let wasMerged = false;
  const canMove = [true, true, true, true];

  for (let j = 0; j < this.state.length; j++) {
    let column = [];

    for (let i = 0; i < this.state.length; i++) {
      column.push(this.state[i][j]);
    }

    const columnCopy = [...column];

    column = column.filter((num) => num !== 0);

    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1]) {
        column[i] *= 2;
        column[i - 1] = 0;
        wasMerged = true;
        this.score += column[i];
      }
    }

    column = column.filter((num) => num !== 0);

    while (column.length < this.state.length) {
      column.unshift(0);
    }

    if (column.every((value, index) => value === columnCopy[index])) {
      canMove[j] = false;
    }

    for (let i = 0; i < this.state.length; i++) {
      this.state[i][j] = column[i] || 0;
    }
  }

  if (wasMerged || canMove.includes(true)) {
    this.addNumber();
    this.getState();
  }

  this.moveUtil();
};

Game.prototype.restart = function () {
  this.state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  startButton.className = 'button start';
  startButton.innerHTML = 'Start';
  this.score = 0;
  score.innerHTML = this.score;
  this.fillCells();

  messageStart.className = 'message message-start';
  messageWin.className = 'message message-win hidden';
  messageLose.className = 'message message-lose hidden';
};

Game.prototype.getRandomNumber = function () {
  const randomNumbersPool = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const randomNumIndex = Math.floor(Math.random() * 10);

  return randomNumbersPool[randomNumIndex];
};

Game.prototype.addNumber = function () {
  if (this.getEmptyCells().length !== 0) {
    const emptyCellsPool = this.getEmptyCells();
    const randomCellIndex = Math.floor(Math.random() * emptyCellsPool.length);
    const randomEmptyCell = emptyCellsPool[randomCellIndex];

    this.state[randomEmptyCell[0]][randomEmptyCell[1]] = this.getRandomNumber();
  }
};

Game.prototype.canMerge = function () {
  for (let i = 0; i < this.state.length; i++) {
    for (let j = 0; j < this.state.length; j++) {
      if (
        j < this.state.length - 1 &&
        this.state[i][j] === this.state[i][j + 1]
      ) {
        return true;
      }

      if (
        i < this.state.length - 1 &&
        this.state[i][j] === this.state[i + 1][j]
      ) {
        return true;
      }
    }
  }

  return false;
};

Game.prototype.getEmptyCells = function () {
  const emptyCellsArray = [];

  for (let i = 0; i < this.state.length; i++) {
    for (let j = 0; j < this.state[i].length; j++) {
      if (this.state[i][j] === 0) {
        emptyCellsArray.push([i, j]);
      }
    }
  }

  return emptyCellsArray;
};

Game.prototype.start = function () {
  this.addNumber();
  this.addNumber();
  this.fillCells();
  this.getState();
  messageStart.className = 'message message-start hidden';
};

Game.prototype.fillCells = function () {
  const table = document.querySelector('.game-field');
  const tableCells = table.querySelectorAll('.field-cell');

  for (let i = 0; i < this.state.length; i++) {
    for (let j = 0; j < this.state[i].length; j++) {
      const cellndex = i * 4 + j;

      if (this.state[i][j] === 0) {
        tableCells[cellndex].className = 'field-cell';
        tableCells[cellndex].innerHTML = '';
      }

      if (this.state[i][j] !== 0) {
        tableCells[cellndex].className =
          `field-cell field-cell--${this.state[i][j]}`;
        tableCells[cellndex].innerHTML = this.state[i][j];
      }
    }
  }
};

Game.prototype.toggleButton = function () {
  if (this.getStatus() === 'idle') {
    startButton.className = 'button start';
    startButton.innerHTML = 'Start';
  } else {
    startButton.className = 'button restart';
    startButton.innerHTML = 'Restart';
  }
};

Game.prototype.moveUtil = function () {
  this.toggleButton();
  this.fillCells();
  score.innerHTML = this.score;

  if (this.getStatus() === 'win') {
    messageWin.className = 'message message-win';
  }

  if (this.getStatus() === 'lose') {
    messageLose.className = 'message message-lose';
  }
};

startButton.addEventListener('click', () => {
  if (startButton.className === 'button start') {
    game.start();
  }

  if (startButton.className === 'button restart') {
    game.restart();
  }
});

window.addEventListener('keydown', checkKeyPressed, false);

function checkKeyPressed(evt) {
  if (evt.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (evt.key === 'ArrowRight') {
    game.moveRight();
  }

  if (evt.key === 'ArrowUp') {
    game.moveUp();
  }

  if (evt.key === 'ArrowDown') {
    game.moveDown();
  }

  game.fillCells();
}
