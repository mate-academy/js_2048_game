'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const field = document.querySelector('tbody');
const button = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

button.addEventListener('click', () => {
  score = 0;
  document.querySelector('.game-score').innerText = score;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');

    setGame();
    enableEventListeners();
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    setGame();
  }
});

const Directions = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
};

function enableEventListeners() {
  document.addEventListener('keyup', (e) => {
    const prevBoard = JSON.stringify(board);

    if (e.code === Directions.ArrowLeft || e.code === Directions.ArrowRight) {
      slideHorizontally(e.code);
    }

    if (e.code === Directions.ArrowUp || e.code === Directions.ArrowDown) {
      transpose();
      slideHorizontally(e.code);
      transpose();
    }

    updateBoard();

    const currentBoard = JSON.stringify(board);

    if (prevBoard !== currentBoard) {
      setNewNumber();
    }

    document.querySelector('.game-score').innerText = score;
  });
}

function setGame() {
  board = Array.from({ length: rows },
    () => Array.from({ length: columns }, () => 0));

  updateBoard();
  setNewNumber();
  setNewNumber();
}

function setNewNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const row = Math.floor(Math.random() * rows);
    const cell = Math.floor(Math.random() * columns);

    if (board[row][cell] === 0) {
      const gameCell = field.rows[row].cells[cell];

      board[row][cell] = randomizeNumber();
      gameCell.innerText = board[row][cell];
      gameCell.classList.add(`field-cell--${board[row][cell]}`);

      found = true;
    }
  }
}

function hasEmptyCell() {
  return board.some(row => row.some(cell => cell === 0));
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.className = 'field-cell';

  if (num > 0) {
    cell.innerText = num.toString();
    cell.classList.add(`field-cell--${num}`);

    if (num === 2048) {
      messageWin.classList.remove('hidden');
    }
  }

  looseGame();
}

function slide(row) {
  let filteredRow = row.filter(num => num !== 0);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score += filteredRow[i];
    }
  }

  filteredRow = filteredRow.filter(num => num !== 0);

  while (filteredRow.length < columns) {
    filteredRow.push(0);
  }

  return filteredRow;
}

function randomizeNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
}

function looseGame() {
  if (hasEmptyCell()) {
    return;
  }

  for (let row = 0; row < rows; row++) {
    for (let cell = 0; cell < columns - 1; cell++) {
      const isNextSame = board[row][cell] === board[row][cell + 1];
      const isBelowSame = board[cell][row] === board[cell + 1][row];

      if (isNextSame || isBelowSame) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

function transpose() {
  board = board[0].map((_, i) => board.map(row => row[i]));
}

function slideHorizontally(side) {
  for (let row = 0; row < rows; row++) {
    let newRow = [...board[row]];

    if (isMoveLeftOrUp(side)) {
      newRow = slide(newRow);
    }

    if (isMoveRightOrDown(side)) {
      newRow.reverse();
      newRow = slide(newRow);
      newRow.reverse();
    }

    board[row] = newRow;

    for (let cell = 0; cell < columns; cell++) {
      const gameCell = field.rows[row].cells[cell];
      const num = board[row][cell];

      updateCell(gameCell, num);
    }
  }
}

function isMoveLeftOrUp(side) {
  return side === Directions.ArrowLeft || side === Directions.ArrowUp;
}

function isMoveRightOrDown(side) {
  return side === Directions.ArrowRight || side === Directions.ArrowDown;
}

function updateBoard() {
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      updateCell(field.rows[rowIndex].cells[cellIndex], cell);
    });
  });
}
