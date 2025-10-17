'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

// #region start button //

function getRandomTd(max) {
  return Math.floor(Math.random() * max);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

const button = document.querySelector('.button.start');

button.addEventListener('click', () => {
  // set button state
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  // reset internal state
  score = 0;

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const starter = document.querySelectorAll('td');
  const start = [...starter];

  // clear board DOM
  start.forEach((square) => {
    const classes = [...square.classList];

    classes.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        square.classList.remove(cls);
      }
    });
    square.classList.add('field-cell');
    square.textContent = '';
  });

  // randomiser - place two initial tiles and sync to `board`
  const emptyCells = start.filter((cell) => cell.textContent === '');
  const randomIndex1 = getRandomTd(emptyCells.length);
  const randomValue1 = getRandomNumber();
  // place first
  const firstCell = emptyCells[randomIndex1];

  firstCell.textContent = randomValue1.toString();
  firstCell.classList.add(`field-cell--${randomValue1}`);

  const firstIndex = start.indexOf(firstCell);
  const firstRow = Math.floor(firstIndex / 4);
  const firstCol = firstIndex % 4;

  board[firstRow][firstCol] = randomValue1;

  // place second
  const emptyAfterFirst = start.filter((cell) => cell.textContent === '');

  if (emptyAfterFirst.length > 0) {
    const randomIndex2 = getRandomTd(emptyAfterFirst.length);
    const secondCell = emptyAfterFirst[randomIndex2];
    const randomValue2 = getRandomNumber();

    secondCell.textContent = randomValue2.toString();
    secondCell.classList.add(`field-cell--${randomValue2}`);

    const secondIndex = start.indexOf(secondCell);
    const secondRow = Math.floor(secondIndex / 4);
    const secondCol = secondIndex % 4;

    board[secondRow][secondCol] = randomValue2;
  }

  const startText = document.querySelector('.message.message-start');

  if (startText) {
    startText.classList.add('hidden');
  }

  const winnerText = document.querySelector('.message.message-win');

  if (winnerText) {
    winnerText.classList.add('hidden');
  }

  const loserText = document.querySelector('.message.message-lose');

  if (loserText) {
    loserText.classList.add('hidden');
  }

  const scoreRestart = document.querySelector('.game-score');

  if (scoreRestart) {
    scoreRestart.textContent = score.toString();
  }
});

// #endregion //

// #region keybord navigation //

let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

document.addEventListener('keydown', (move) => {
  if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(move.key)) {
    if (move.key === 'ArrowRight') {
      moveRight();
    }

    if (move.key === 'ArrowLeft') {
      moveLeft();
    }

    if (move.key === 'ArrowUp') {
      moveUp();
    }

    if (move.key === 'ArrowDown') {
      moveDown();
    }
    move.preventDefault();

    // Always check win/lose after the user attempts a move. Some moves
    // might not change the board (moved === false), but the game can still
    // be in a lose state after repeated attempts.
    checkWin();
    checkLose();
  }
});

function moveRight() {
  let moved = false;

  for (let i = 0; i < 4; i++) {
    const originalRow = [...board[i]];
    let row = board[i].filter((val) => val !== 0);

    while (row.length < 4) {
      row.unshift(0);
    }

    for (let j = 3; j > 0; j--) {
      if (row[j] === row[j - 1] && row[j] !== 0) {
        row[j] *= 2;
        row[j - 1] = 0;
        score += row[j];
      }
    }

    row = row.filter((val) => val !== 0);

    while (row.length < 4) {
      row.unshift(0);
    }

    board[i] = row;

    if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
      moved = true;
    }
  }

  if (moved) {
    addNewTile();
    updateBoard();

    // check for win/lose after board update
    checkWin();
    checkLose();

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = score.toString();
    }
  }
}

function moveLeft() {
  let moved = false;

  for (let i = 0; i < 4; i++) {
    const originalRow = [...board[i]];
    let row = board[i].filter((val) => val !== 0);

    while (row.length < 4) {
      row.push(0);
    }

    for (let j = 0; j < 3; j++) {
      if (row[j] === row[j + 1] && row[j] !== 0) {
        row[j] *= 2;
        row[j + 1] = 0;
        score += row[j];
      }
    }
    row = row.filter((val) => val !== 0); // Повторний зсув

    while (row.length < 4) {
      row.push(0);
    }

    board[i] = row;

    if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
      moved = true;
    }
  }

  if (moved) {
    addNewTile();
    updateBoard();

    // check for win/lose after board update
    checkWin();
    checkLose();

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = score.toString();
    }
  }
}

function transpose(matrix) {
  const reverse = [];

  for (let j = 0; j < 4; j++) {
    const newRow = [];

    for (let i = 0; i < 4; i++) {
      newRow.push(matrix[i][j]);
    }
    reverse.push(newRow);
  }

  return reverse;
}

function moveUp() {
  let moved = false;

  board = transpose(board);

  for (let i = 0; i < 4; i++) {
    const originalRow = [...board[i]];
    let row = board[i].filter((val) => val !== 0);

    while (row.length < 4) {
      row.unshift(0);
    }

    for (let j = 0; j < 3; j++) {
      if (row[j] === row[j + 1] && row[j] !== 0) {
        row[j] *= 2;
        row[j + 1] = 0;
        score += row[j];
      }
    }
    row = row.filter((val) => val !== 0);

    while (row.length < 4) {
      row.push(0);
    }

    board[i] = row;

    if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
      moved = true;
    }
  }
  board = transpose(board);

  if (moved) {
    addNewTile();
    updateBoard();

    // check for win/lose after board update
    checkWin();
    checkLose();

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = score.toString();
    }
  }
}

function moveDown() {
  let moved = false;

  board = transpose(board);

  for (let i = 0; i < 4; i++) {
    const originalRow = [...board[i]];
    let row = board[i].filter((val) => val !== 0);

    while (row.length < 4) {
      row.unshift(0);
    }

    for (let j = 3; j > 0; j--) {
      if (row[j] === row[j - 1] && row[j] !== 0) {
        row[j] *= 2;
        row[j - 1] = 0;
        score += row[j];
      }
    }
    row = row.filter((val) => val !== 0);

    while (row.length < 4) {
      row.unshift(0);
    }
    board[i] = row;

    if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
      moved = true;
    }
  }
  board = transpose(board);

  if (moved) {
    addNewTile();
    updateBoard();

    // check for win/lose after board update
    checkWin();
    checkLose();

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = score.toString();
    }
  }
}

// #endregion //
function updateBoard() {
  const allTd = document.querySelectorAll('td');

  allTd.forEach((td) => {
    td.textContent = '';
    td.className = 'field-cell';
  });

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const tdIndex = i * 4 + j;
      const td = allTd[tdIndex];

      if (board[i][j] !== 0) {
        td.textContent = board[i][j];
        td.classList.add(`field-cell--${board[i][j]}`);
      }
    }
  }
}

function addNewTile() {
  const newTilePlace = document.querySelectorAll('td');
  const newTile = [...newTilePlace];

  const freSpace = newTile.filter((tile) => tile.textContent === '');

  if (freSpace.length === 0) {
    return;
  }

  const randomInd = getRandomTd(freSpace.length);
  const randomVal1 = Math.random() < 0.9 ? 2 : 4;

  freSpace[randomInd].textContent = randomVal1.toString();
  freSpace[randomInd].classList.add(`field-cell--${randomVal1}`);

  const tdIndex = newTile.indexOf(freSpace[randomInd]); // ai порадив додати
  const row = Math.floor(tdIndex / 4);
  const col = tdIndex % 4;

  board[row][col] = randomVal1;
}

// #region data //
const scoreVal = document.querySelector('.game-score');

scoreVal.textContent = score;

function checkWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 2048) {
        const winnerText = document.querySelector('.message.message-win');

        if (winnerText) {
          winnerText.classList.remove('hidden');
        }

        return true;
      }
    }
  }

  return false;
}

function checkLose() {
  // if there is any empty cell - not lose
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }

  // no empty cells - check if any merge possible
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cur = board[i][j];

      if (i < 3 && board[i + 1][j] === cur) {
        return false;
      }

      if (j < 3 && board[i][j + 1] === cur) {
        return false;
      }
    }
  }

  const loserText = document.querySelector('.message.message-lose');

  if (loserText) {
    loserText.classList.remove('hidden');
  }

  return true;
}
