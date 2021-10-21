
'use strict';
// write your code here

const boardCell = [...document.querySelectorAll('.field-cell')];
const btnStart = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const scoreBoard = document.querySelector('.game-score');
const controls = document.querySelector('.controls');
let score = 0;
const win = '2048';
const grid = [];
const width = 4;
let randomNumber = 0;
const btnRestart = document.createElement('button');

function createRestartButton() {
  btnRestart.classList.add('restart', 'button');
  btnRestart.textContent = 'Restart';

  return btnRestart;
}

btnStart.addEventListener('click', getStart);

function getStart() {
  btnStart.remove();
  controls.append(createRestartButton());
  startMessage.classList.add('hidden');
  document.addEventListener('keyup', control);

  boardCell.map((el) => {
    el.className = 'field-cell';
  });
  createBoard();
  getSumOfNumber();
}
btnRestart.addEventListener('click', getReset);

function getReset() {
  getStart();
  scoreBoard.innerText = 0;
  score = 0;
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
};

// create board game
function createBoard() {
  for (let i = 0; i < boardCell.length; i++) {
    boardCell[i].innerText = 0;
    grid.push(boardCell[i]);
  }
  getRandomNumber();
  getRandomNumber();
}

// generate random number
function getRandomNumber() {
  randomNumber = Math.floor(Math.random() * grid.length);

  if (grid[randomNumber].innerText === '0') {
    grid[randomNumber].innerText = Math.random() <= 0.9 ? 2 : 4;
    getColor(grid[randomNumber]);
    checkLose();
  } else {
    getRandomNumber();
  }
}
// move

function moveHorizontal(move) {
  let newRow = [];

  for (let i = 0; i < width * width; i += width) {
    let filterRows = [];

    for (let j = 0; j < width; j++) {
      filterRows.push(Number(grid[i + j].innerText));
    }
    filterRows = filterRows.filter(num => num > 0);

    const emptyCell = width - filterRows.length;
    const zeroesArr = Array(emptyCell).fill(0);

    if (!move) {
      newRow = [...zeroesArr, ...filterRows];
    } else {
      newRow = [...filterRows, ...zeroesArr];
    }

    for (let k = 0; k < newRow.length; k++) {
      grid[i + k].innerText = newRow[k];
      getColor(grid[i + k]);
    }
  }
}

function moveVertical(move) {
  let newRow = [];

  for (let i = 0; i < width; i++) {
    let filteredColumn = [];

    for (let j = 0; j < width * width; j += width) {
      filteredColumn.push(Number(grid[i + j].innerText));
    }
    filteredColumn = filteredColumn.filter(num => num > 0);

    const emptyCell = width - filteredColumn.length;
    const zeroesArr = Array(emptyCell).fill(0);

    if (!move) {
      newRow = [...zeroesArr, ...filteredColumn];
    } else {
      newRow = [...filteredColumn, ...zeroesArr];
    }

    for (let k = 0; k < newRow.length; k++) {
      grid[i + (width * k)].innerText = newRow[k];
      getColor(grid[i + (width * k)]);
    }
  }
}
// the sum of two the same numbers

function getSumOfNumber(len, index) {
  let sum = 0;

  for (let i = 0; i < len; i++) {
    if (Number(grid[i].innerText) === Number(grid[i + index].innerText)) {
      sum = Number(grid[i].innerText) + Number(grid[i + index].innerText);
      grid[i].innerText = sum;
      grid[i + index].innerText = 0;
      score += sum;
    }
    scoreBoard.innerText = score;
  }
  checkOnWin();
}

function control(e) {
  switch (e.key) {
    case 'ArrowLeft':
      moveHorizontal(1);
      getSumOfNumber(grid.length - 1, 1);
      moveHorizontal(1);
      getRandomNumber();
      break;
    case 'ArrowUp':
      moveVertical(1);
      getSumOfNumber(grid.length - width, width);
      moveVertical(1);
      getRandomNumber();
      break;
    case 'ArrowRight':
      moveHorizontal();
      getSumOfNumber(grid.length - 1, 1);
      moveHorizontal();
      getRandomNumber();
      break;
    case 'ArrowDown':
      moveVertical();
      getSumOfNumber(grid.length - width, width);
      moveVertical();
      getRandomNumber();
      break;
  }
}

function checkOnWin() {
  grid.map((el) => {
    if (el.innerText === win) {
      winMessage.classList.remove('hidden');
      btnStart.classList.remove('restart');
      btnStart.classList.add('start');
      document.removeEventListener('keyup', control);
    }
  });
}

function checkLose() {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].innerText === '0') {
      count++;
    }
  }

  if (count === 0) {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    document.removeEventListener('keyup', control);
  }
};

function getColor(item) {
  item.className = `field-cell
  field-cell--${Number(item.innerText)}`;
};
