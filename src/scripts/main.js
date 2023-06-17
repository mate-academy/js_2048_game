'use strict';

const gameField = document.querySelector('tbody');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const cellsInRow = 4;
let scoreCount = 0;
let board;

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  startTheGame();
});

function hasEmptyTile() {
  for (let i = 0; i < cellsInRow; i++) {
    if (board[i].includes(0)) {
      return true;
    }
  }

  return false;
}

function placeTiles() {
  while (hasEmptyTile()) {
    const randomRow = Math.floor((Math.random() * cellsInRow));
    const randomCol = Math.floor((Math.random() * cellsInRow));

    if (board[randomRow][randomCol] === 0) {
      const numb = Math.random() < 0.9 ? 2 : 4;

      board[randomRow][randomCol] = numb;
      break;
    }
  }

  setCells();
}

function startTheGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  scoreCount = 0;
  gameScore.innerText = scoreCount;

  placeTiles();
  placeTiles();
}

function loseTheGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < cellsInRow - 1; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function setCells() {
  for (let r = 0; r < cellsInRow; r++) {
    for (let c = 0; c < cellsInRow; c++) {
      const currentCell = gameField.rows[r].cells[c];
      const num = board[r][c];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field-cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field-cell--${num}`);
      }

      if (num === 2048) {
        messageWin.classList.remove('hidden');
        button.classList.replace('restart', 'start');
      }
    }
  }

  if (loseTheGame()) {
    messageLose.classList.remove('hidden');
  }
}

function removeEmptyTiles(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = removeEmptyTiles(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];

      gameScore.innerText = scoreCount;
    }
  }

  newRow = removeEmptyTiles(newRow);

  while (newRow.length < cellsInRow) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let r = 0; r < cellsInRow; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;
  }
}

function slideRight() {
  for (let r = 0; r < cellsInRow; r++) {
    let row = board[r].reverse();

    row = slide(row).reverse();
    board[r] = row;
  }
}

function slideUp() {
  for (let c = 0; c < cellsInRow; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

    column = slide(column);

    for (let r = 0; r < cellsInRow; r++) {
      board[r][c] = column[r];
    }
  }
}

function slideDown() {
  for (let c = 0; c < cellsInRow; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();

    column = slide(column).reverse();

    for (let r = 0; r < cellsInRow; r++) {
      board[r][c] = column[r];
    }
  }
}

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      slideLeft();
      placeTiles();
      break;

    case 'ArrowRight':
      slideRight();
      placeTiles();
      break;

    case 'ArrowUp':
      slideUp();
      placeTiles();
      break;

    case 'ArrowDown':
      slideDown();
      placeTiles();
      break;
  }

  setCells();
});
