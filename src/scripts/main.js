'use strict';

const gameField = document.querySelector('.game-field');
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
let firstMove;
let score = 0;
const size = 4;
let board;
let startTouchX,
  startTouchY;

window.onload = function() {
  newGame();
};

function newGame() {
  button.addEventListener('click', () => {
    board = initBoard(size);
    addTile();
    addTile();
    gameStatus();
    firstMove = true;

    if (button.classList.contains('restart')) {
      restartGame();
    }
  });
}

function restartGame() {
  board = initBoard(size);

  button.classList.replace('restart', 'start');
  button.textContent = 'Start';
  messageStart.classList.remove('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  score = 0;
  gameScore.textContent = score;

  addTile();
  addTile();
  gameStatus();
}

function initBoard(size) {
  return Array(size).fill(0).map(() => Array(size).fill(0));
}

function isEmpty(board) {
  return board.some(row => row.includes(0));
};

function addTile() {
  if (!isEmpty(board)) {
    return;
  };

  const rows = Math.floor(Math.random() * size);
  const colls = Math.floor(Math.random() * size);

  if (board[rows][colls] === 0) {
    board[rows][colls] = randomNumber();
    updateBoard();
  } else {
    addTile();
  }

  gameStatus();
};

function updateBoard() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const tileNum = board[r][c];
      const tile = gameField.rows[r].cells[c];

      tile.textContent = '';
      tile.classList.value = '';
      tile.classList.add('field-cell');

      if (tileNum > 0) {
        tile.textContent = tileNum;
        tile.classList.add(`field-cell--${tileNum}`);

        if (tileNum >= 8192) {
          tile.classList.add(`field-cell--8192`);
        }
      }
    }
  }
}

const randomNumber = () => {
  return Math.random() < 0.9 ? 2 : 4;
};

function gameStatus() {
  if (win(board)) {
    messageWin.classList.remove('hidden');
  }

  if (!canMove()) {
    messageLose.classList.remove('hidden');
  }
}

function win(board) {
  return board.some(row => row.includes(2048));
}

function removeZero(row) {
  return row.filter(num => num !== 0);
}

function move(row) {
  let newRow = removeZero(row);

  for (let r = 0; r < newRow.length - 1; r++) {
    if (newRow[r] === newRow[r + 1]) {
      newRow[r] *= 2;
      newRow[r + 1] = 0;
      score += newRow[r];
      gameScore.textContent = score;
    }
  }

  newRow = removeZero(newRow);

  while (newRow.length < size) {
    newRow.push(0);
  }

  return newRow;
}

function canMove() {
  if (isEmpty(board)) {
    return true;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      const tile = board[r][c];
      const nextTile = board[r][c + 1];

      if (tile === nextTile) {
        return true;
      }
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      const tile = board[c][r];
      const nextTile = board[c + 1][r];

      if (tile === nextTile) {
        return true;
      }
    }
  }

  return false;
}

function moveLeft() {
  for (let r = 0; r < size; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;
  }

  updateBoard();
}

function moveRight() {
  for (let r = 0; r < size; r++) {
    let row = board[r];

    row.reverse();

    row = move(row);

    board[r] = row.reverse();
  }

  updateBoard();
}

function moveUp() {
  for (let c = 0; c < size; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = move(row);

    for (let r = 0; r < size; r++) {
      board[r][c] = row[r];
    }
  }

  updateBoard();
}

function moveDown() {
  for (let c = 0; c < size; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();

    row = move(row);

    row.reverse();

    for (let r = 0; r < size; r++) {
      board[r][c] = row[r];
    }
  }

  updateBoard();
}

function arraysEqual(arr1, arr2) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (arr1[r][c] !== arr2[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function changeStartRestart() {
  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';
  messageStart.classList.add('hidden');
}

document.addEventListener('touchstart', touchStart, false);
document.addEventListener('touchmove', touchMove, false);

function touchStart(e) {
  const firstTouch = e.touches[0];

  startTouchX = firstTouch.clientX;
  startTouchY = firstTouch.clientY;
}

function touchMove(e) {
  if (!startTouchX || !startTouchY) {
    return false;
  }

  const prevBoard = board.map((row) => [...row]);

  const endTouchX = e.touches[0].clientX;
  const endTouchY = e.touches[0].clientY;
  const deltaX = endTouchX - startTouchX;
  const deltaY = endTouchY - startTouchY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        moveLeft();
      } else {
        moveRight();
      }
      startTouchX = null;
      startTouchY = null;
    }
  } else {
    if (Math.abs(deltaY) > 50) {
      if (deltaY < 0) {
        moveUp();
      } else {
        moveDown();
      }
      startTouchX = null;
      startTouchY = null;
    }
  }

  if (!arraysEqual(board, prevBoard)) {
    if (firstMove) {
      changeStartRestart();
      firstMove = false;
    }
    addTile();
  }
}

document.addEventListener('keyup', e => {
  const key = e.keyCode;

  const prevBoard = board.map((row) => [...row]);

  switch (key) {
    case 37:
    case 65:
      moveLeft();
      break;
    case 39:
    case 68:
      moveRight();
      break;
    case 38:
    case 87:
      moveUp();
      break;
    case 40:
    case 83:
      moveDown();
      break;
  }

  if (!arraysEqual(board, prevBoard)) {
    if (firstMove) {
      changeStartRestart();
      firstMove = false;
    }
    addTile();
  }
});
