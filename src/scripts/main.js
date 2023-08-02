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

  startGame();
});

function startGame() {
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

function placeTiles() {
  while (hasEmptyTile()) {
    const randomRow = Math.floor((Math.random() * cellsInRow));
    const randomCol = Math.floor((Math.random() * cellsInRow));

    if (board[randomRow][randomCol] === 0) {
      const numb = Math.random() < 0.8 ? 2 : 4;

      board[randomRow][randomCol] = numb;
      break;
    }
  }

  setCells();
}

function hasEmptyTile() {
  for (let i = 0; i < cellsInRow; i++) {
    if (board[i].includes(0)) {
      return true;
    }
  }

  return false;
}

function loseGame() {
  if (hasEmptyTile()) {
    return false;
  }

  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < cellsInRow - 1; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function setCells() {
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      const currentCell = gameField.rows[i].cells[j];
      const num = board[i][j];

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

  if (loseGame()) {
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
  for (let i = 0; i < cellsInRow; i++) {
    let row = board[i];

    row = slide(row);
    board[i] = row;
  }
}

function slideRight() {
  for (let i = 0; i < cellsInRow; i++) {
    let row = board[i].reverse();

    row = slide(row).reverse();
    board[i] = row;
  }
}

function slideUp() {
  for (let i = 0; i < cellsInRow; i++) {
    let col = [board[0][i], board[1][i], board[2][i], board[3][i]];

    col = slide(col);

    for (let j = 0; j < cellsInRow; j++) {
      board[j][i] = col[j];
    }
  }
}

function slideDown() {
  for (let i = 0; i < cellsInRow; i++) {
    let col = [board[0][i], board[1][i], board[2][i], board[3][i]].reverse();

    col = slide(col).reverse();

    for (let j = 0; j < cellsInRow; j++) {
      board[j][i] = col[j];
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
