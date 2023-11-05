'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const button = document.querySelector('.button');
let gameStarted = false;
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const UP = 'ArrowUp';
const DOWN = 'ArrowDown';

window.onload = function() {
  setGame();
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.classList.add('field-cell');
      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.querySelector('.game-field').append(tile);
    }
  }

  gameStarted = false;
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keyup', e => {
  if (!gameStarted) {
    return;
  }

  switch (e.code) {
    case LEFT:
      slideLeft();
      break;

    case RIGHT:
      slideRight();
      break;

    case UP:
      slideUp();
      break;

    case DOWN:
      slideDown();
      break;
  }

  document.querySelector('.game-score').innerHTML = score;

  if (isGameOver()) {
    loseMessage.classList.remove('hidden');
  }

  if (isWinner()) {
    winMessage.classList.remove('hidden');
  }
});

// for mobile-devices
let startX, startY, endX, endY;

document.addEventListener('touchstart', e => {
  if (!gameStarted) {
    return;
  }

  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
});

document.addEventListener('touchend', e => {
  if (!gameStarted) {
    return;
  }

  endX = e.changedTouches[0].pageX;
  endY = e.changedTouches[0].pageY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const minSwipeDistance = 20;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        slideRight();
      } else {
        slideLeft();
      }
    }
  } else {
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        slideDown();
      } else {
        slideUp();
      }
    }
  }

  document.querySelector('.game-score').innerHTML = score;

  if (isGameOver()) {
    loseMessage.classList.remove('hidden');
  }

  if (isWinner()) {
    winMessage.classList.remove('hidden');
  }
});

button.addEventListener('click', () => {
  if (gameStarted) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerHTML = 'Start';
    gameStarted = false;
    resetGame();
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    startMessage.classList.add('hidden');
    gameStarted = true;
    setNum();
    setNum();
  }
});

function resetGame() {
  score = 0;
  document.querySelector('.game-score').innerHTML = score;
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.remove('hidden');

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateTile(tile, 0);
    }
  }
}

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = filterZeros(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZeros(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row = slide(row);
    board[r] = row;

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
};

function slideRight() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
};

function slideUp() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row = slide(row);

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
}

function slideDown() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setNum() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = Math.random() < 0.9 ? 2 : 4;

      board[r][c] = num;
      tile.innerText = num;
      tile.classList.add(`field-cell--${num}`);
      found = true;
    }
  }
}

function isGameOver() {
  const fullBoard = !hasEmptyTile();
  let move = true;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (c > 0 && board[r][c] === board[r][c - 1]) {
        move = false;
      } else if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        move = false;
      } else if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        move = false;
      } else if (r > 0 && board[r][c] === board[r - 1][c]) {
        move = false;
      }
    }
  }

  return move && fullBoard;
}

function isWinner() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
