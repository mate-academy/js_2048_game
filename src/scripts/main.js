'use strict';

let board;
let score = 0;
const ROWS = 4;
const COLUMNS = 4;
const startButton = document.getElementsByClassName('button start')[0];
let gameEnded;

startButton.addEventListener('click', setGame);

function setGame() {
  startGameMessage();
  changeButtontoRestart(startButton);

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  addCell();
  addCell();
  clearScore();
  gameEnded = false;

  let cellIndex = 0;

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const num = board[i][j];
      const cells = document.getElementsByClassName('field-cell')[cellIndex];

      updateCell(num, cells);
      cellIndex++;
    }
  }
}

function updateCell(num, cells) {
  cells.innerText = '';
  cells.classList.value = '';
  cells.classList.add('field-cell');

  if (num > 0) {
    cells.innerText = num;

    if (num <= 2048) {
      cells.classList.add(`field-cell--${num}`);
    }
  }
}

function winGameMessage(boards) {
  if (boards.find((row) => row.includes(2048))) {
    const winMessage = document.getElementById('win-message');

    winMessage.classList.remove('hidden');
    gameEnded = true;
  }
}

function loseGameMessage() {
  if (canMakeMove()) {
    return;
  }

  const loseMessage = document.getElementById('lose-message');

  loseMessage.classList.remove('hidden');
  gameEnded = true;
}

function canMakeMove() {
  if (emptyCellsInBoard()) {
    return true;
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      const currentValue = board[i][j];

      if (j < COLUMNS - 1 && currentValue === board[i][j + 1]) {
        return true;
      }

      if (i < ROWS - 1 && currentValue === board[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function startGameMessage() {
  const startMessage = document.getElementById('start-message');
  const loseMessage = document.getElementById('lose-message');

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

document.addEventListener('keydown', (event) => {
  const name = event.key;
  const previousBoard = JSON.stringify(board);

  if (!gameEnded) {
    switch (name) {
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowLeft':
        moveLeft();
        break;
    }

    if (JSON.stringify(board) !== previousBoard) {
      addCell();
    }

    winGameMessage(board);
    loseGameMessage(board);
  }
});

function move(row) {
  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      updateScore(row[i]);
    }
  }
  row = filterZero(row);

  while (row.length < COLUMNS) {
    row.push(0);
  }

  return row;
}

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function moveLeft() {
  let cellIndex = 0;

  for (let i = 0; i < ROWS; i++) {
    let row = board[i];

    row = move(row);
    board[i] = row;

    for (let j = 0; j < COLUMNS; j++) {
      const cell = document.getElementsByClassName('field-cell')[cellIndex];
      const num = board[i][j];

      updateCell(num, cell);
      cellIndex++;
    }
  }
}

function moveRight() {
  let cellIndex = 0;

  for (let i = 0; i < ROWS; i++) {
    let row = board[i];

    row.reverse();
    row = move(row).reverse();
    board[i] = row;

    for (let j = 0; j < COLUMNS; j++) {
      const cell = document.getElementsByClassName('field-cell')[cellIndex];
      const num = board[i][j];

      updateCell(num, cell);
      cellIndex++;
    }
  }
}

function moveUp() {
  for (let i = 0; i < COLUMNS; i++) {
    let column = board.map((d) => d[i]);

    column = move(column);

    for (let j = 0; j < ROWS; j++) {
      board[j][i] = column[j];

      const cell
      = document.getElementsByClassName('field-cell')[j * COLUMNS + i];
      const num = board[j][i];

      updateCell(num, cell);
    }
  }
}

function moveDown() {
  for (let i = 0; i < COLUMNS; i++) {
    let column = board.map((d) => d[i]);

    column.reverse();
    column = move(column);
    column.reverse();

    for (let j = 0; j < ROWS; j++) {
      board[j][i] = column[j];

      const cell
      = document.getElementsByClassName('field-cell')[j * COLUMNS + i];
      const num = board[j][i];

      updateCell(num, cell);
    }
  }
}

function updateScore(num) {
  score += num;
  document.getElementsByClassName('game-score')[0].innerHTML = score;
}

function generateCellNumber() {
  const num = Math.random();

  if (num < 0.9) {
    return 2;
  }

  return 4;
}

function addCell() {
  let found = false;

  if (!emptyCellsInBoard()) {
    return;
  }

  while (!found) {
    const i = Math.floor(Math.random() * ROWS);
    const j = Math.floor(Math.random() * COLUMNS);

    if (board[i][j] === 0) {
      const newCell = generateCellNumber();
      const cell = document.getElementsByClassName('field-cell')[i * ROWS + j];

      board[i][j] = newCell;
      updateCell(newCell, cell);

      found = true;
    }
  }
}

function emptyCellsInBoard() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function changeButtontoRestart(startbutton) {
  startbutton.innerText = 'Restart';
  startbutton.classList.remove('start');
  startbutton.classList.add('restart');
}

function clearScore() {
  score = 0;
  document.getElementsByClassName('game-score')[0].innerHTML = score;
}
