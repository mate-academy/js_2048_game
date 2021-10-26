
'use strict';
// write your code here

const boardGame = document.querySelector('.game-field');
const btnStart = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const scoreBoard = document.querySelector('.game-score');
const controls = document.querySelector('.controls');
let score = 0;
const win = 2048;
const width = 4;

function matrix() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]
}

let grid = matrix();

// create button restart

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
  getRandomNumber();
  getRandomNumber();
  createBoard();

  document.addEventListener('keyup', control);
}
btnRestart.addEventListener('click', getReset);

function getReset() {
  grid = matrix();
  getStart();
  scoreBoard.innerText = 0;
  score = 0;
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
};

// create board game
function createBoard() {

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      const cell = boardGame.rows[i].cells[j];

      cell.classList = ('field-cell');
      cell.textContent = `${grid[i][j]}`;

      if (grid[i][j] > 0) {
        cell.classList.add(`field-cell--${grid[i][j]}`);
        cell.textContent = `${grid[i][j]}`;
      } else {
        cell.textContent = '';
      }
    }
  };
}

// generate random number
function getRandomNumber() {
  const firstIndex = Math.floor(Math.random() * width);
  const secondIndex = Math.floor(Math.random() * width);

  if (grid[firstIndex][secondIndex] === 0) {
    grid[firstIndex][secondIndex] = Math.random() <= 0.9 ? 2 : 4;
    checkLose();
  } else {
    getRandomNumber();
  }
  
}

// move
function sliding(row) {
  let filterRows = row.filter(num => num > 0);
  const emptyCell = width - filterRows.length;
  const zeroesArr = Array(emptyCell).fill(0);

  filterRows = [...zeroesArr, ...filterRows];

  return filterRows;
}

function copyGrid(arrGrid) {
  const extraGrid = matrix();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {

      extraGrid[i][j] = arrGrid[i][j];
    }
  }

  return extraGrid;
}

function compare(a, b) {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if (a[i][j] !== b[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function getMove(direction) {
  let flip = false;
  let rotate = false;

  switch (direction) {
    case 'ArrowRight':
      break;
    case 'ArrowLeft':
      grid = flipGrid(grid);
      flip = true;
      break;
    case 'ArrowDown':
      grid = rotateGrid(grid, 1);
      rotate = true;
      break;
    case 'ArrowUp':
      grid = rotateGrid(grid, 1);
      grid = flipGrid(grid);
      flip = true;
      rotate = true;
      break;
    default:
      break;
  }

  const past = copyGrid(grid);

  for (let i = 0; i < width; i++) {
    grid[i] = sliding(grid[i]);
    getSumOfNumber(grid[i]);
    grid[i] = sliding(grid[i]);
}

  const changed = compare(past, grid);

  if (flip) {
    grid = flipGrid(grid);
}

  if (rotate) {
    grid = rotateGrid(grid, -1);
}

  if (changed) {
    getRandomNumber();
  }
}

function flipGrid() {
  grid.map(arr => arr.reverse());

  return grid;
}

function rotateGrid(gridArr, direction) {
  const newGrid = matrix();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if (direction === 1) {
        newGrid[i][j] = gridArr[j][i];
      } else {
        newGrid[j][i] = gridArr[i][j];
      }
    }
  }

  return newGrid;
}

// // the sum of two the same numbers
function getSumOfNumber(row) {
  for (let i = width - 1; i >= 1; i--) { 
    if (row[i] === row[i - 1]) {
      row[i] = row[i] + row[i - 1];
      row[i - 1] = 0;
    }
    score += row[i];
  }

  scoreBoard.innerText = score;

  checkOnWin();

  return row;
}

function control(e) {
  switch (e.key) {
    case 'ArrowLeft':
      getMove('ArrowLeft');
      createBoard();
      break;
    case 'ArrowUp':
      getMove('ArrowUp');
      createBoard();
      break;
    case 'ArrowRight':
      getMove('ArrowRight');
      createBoard();
      break;
    case 'ArrowDown':
      getMove('ArrowDown');
      createBoard();
      break;
}
}

function checkOnWin() {
  grid.map((el, i) => {
    if (el[i] === win) {
      winMessage.classList.remove('hidden');
      btnStart.classList.remove('restart');
      btnStart.classList.add('start');
      document.removeEventListener('keyup', control);
    }
  });
}

function checkLose() {
  let count = 0;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      if (grid[i][j] === 0) {
        count++;
      }
    }
  }

  if (count === 0) {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    document.removeEventListener('keyup', control);
  }
};