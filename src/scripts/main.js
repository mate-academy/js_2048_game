'use strict';

const button = document.querySelector('.button');
const winMessage = document.querySelector('.message_win');
const loseMessage = document.querySelector('.message_lose');
const startMessage = document.querySelector('.message_start');
const gameScore = document.querySelector('.game_score');
const gameField = document.querySelector('.game_field');

const size = 4;
let score = 0;
let board;
let leftMove = true;

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  startGame();
});

function isEmptyCells() {
  return board.some(row => row.includes(0));
}

function placeCells() {
  if (leftMove) {
    while (isEmptyCells()) {
      const randomCol = Math.floor(Math.random() * size);
      const randomRow = Math.floor(Math.random() * size);

      if (board[randomRow][randomCol] === 0) {
        const digit = Math.random() < 0.9 ? 2 : 4;

        board[randomRow][randomCol] = digit;
        setSells();
        break;
      }
    }

    leftMove = false;
  } else if (!isEmptyCells() && gameLoosed()) {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
  }

  leftMove = true;
}

function gameLoosed() {
  if (isEmptyCells()) {
    return false;
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - 1; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }

  for (let i = 0; i < size - 1; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

function setSells() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const currentCell = gameField.rows[i].cells[j];
      const num = board[i][j];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.classList.add('field_cell');

      if (num > 0) {
        currentCell.innerText = num;
        currentCell.classList.add(`field_cell--${num}`);
      }

      if (num === 2048) {
        winMessage.classList.remove('hidden');
        button.classList.replace('restart', 'start');
      }
    }
  }

  if (gameLoosed()) {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
  }
}

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  gameScore.innerText = score;

  setSells();
  placeCells();
  placeCells();
  leftMove = true;
}

function move(row) {
  let newRow = deleteEmptyCells(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      gameScore.innerText = score;
    }
  }

  newRow = deleteEmptyCells(newRow);

  while (newRow.length < size) {
    newRow.push(0);
  }

  return newRow;
}

function deleteEmptyCells(row) {
  return row.filter(num => num !== 0);
}

function copyBoard(clone) {
  return clone.map(row => row.slice());
}

function isBoardSame(board1, board2) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board1[i][j] !== board2[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function slideLeft() {
  const previousBoard = copyBoard(board);

  for (let k = 0; k < size; k++) {
    board[k] = move(board[k]);
  }

  leftMove = !isBoardSame(board, previousBoard);
}

function slideUp() {
  const previousBoard = copyBoard(board);

  for (let i = 0; i < size; i++) {
    const column = [
      board[0][i],
      board[1][i],
      board[2][i],
      board[3][i],
    ];
    const newColumn = move(column);

    for (let k = 0; k < size; k++) {
      board[k][i] = newColumn[k];
    }
  }

  leftMove = !isBoardSame(board, previousBoard);
}

function slideDown() {
  const previousBoard = copyBoard(board);

  for (let c = 0; c < size; c++) {
    const column = [
      board[0][c],
      board[1][c],
      board[2][c],
      board[3][c],
    ].reverse();
    const newColumn = move(column).reverse();

    for (let b = 0; b < size; b++) {
      board[b][c] = newColumn[b];
    }
  }

  leftMove = !isBoardSame(board, previousBoard);
}

function slideRight() {
  const previousBoard = copyBoard(board);

  for (let x = 0; x < size; x++) {
    board[x] = move(board[x].reverse()).reverse();
  }

  leftMove = !isBoardSame(board, previousBoard);
}

document.addEventListener('keydown', (el) => {
  el.preventDefault();

  switch (el.code) {
    case 'ArrowLeft':
      slideLeft();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;
  }

  placeCells();
  setSells();
});
