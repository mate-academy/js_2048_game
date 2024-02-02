'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
let hasWon = false;
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function initializeBoard() {
  return Array.from({ length: rows }, () => Array(columns).fill(0));
}

function createTile(r, c) {
  const tile = document.createElement('div');

  tile.id = r + '-' + c;
  document.getElementById('board').append(tile);

  return tile;
}

function setGame() {
  board = initializeBoard();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = createTile(r, c);

      updateTile(tile, board[r][c]);
    }
  }
}

function restartGame() {
  board = initializeBoard();
  score = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r + '-' + c);

      updateTile(tile, board[r][c]);
    }
  }

  setTwo();
  setTwo();

  document.getElementById('score').innerText = score;

  messageLose.style.display = 'none';
}

function startGame() {
  restartGame();
  messageStart.style.display = 'none';
  document.getElementById('startButton').textContent = 'Restart';

  const buttonReset = document.querySelector('.start');

  buttonReset.classList.remove('start');
  buttonReset.classList.add('restart');
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.className = 'tile';

  if (num > 0) {
    tile.innerText = num.toString();

    if (num === 2048) {
      hasWon = true;
    }

    if (num <= 4096) {
      tile.classList.add('x' + num.toString());
    } else {
      tile.classList.add('x8192');
    }
  }
}

function isGameOver() {
  return !hasEmptyTile() && !canAddNumbers();
}

function canAddNumbers() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if ((c < columns - 1 && board[r][c] === board[r][c + 1])
        || (r < rows - 1 && board[r][c] === board[r + 1][c])) {
        return true;
      }
    }
  }

  return false;
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(rowSlide) {
  let row = rowSlide;

  row = filterZero(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    board[r] = row.reverse();

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r + '-' + c);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;

      const tile = document.getElementById(r + '-' + c);

      tile.innerText = '2';
      tile.classList.add('x2');
      found = true;
    }
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

document.addEventListener('DOMContentLoaded', function() {
  setGame();

  const button = document.getElementById('startButton');

  button.textContent = 'Start';
  button.addEventListener('click', startGame);
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    setTwo();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setTwo();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setTwo();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setTwo();
  }

  if (isGameOver()) {
    messageLose.classList.add('text-centered');

    setTimeout(() => {
      messageLose.style.display = 'block';
      messageLose.classList.remove('text-centered');
      messageLose.classList.add('text-hidden');
    }, 1000);

    setTimeout(() => {
      messageStart.textContent = 'Press "Restart" to begin game. Good luck!';
      messageStart.style.display = 'block';
    }, 2000);
  }

  if (hasWon) {
    messageWin.style.opacity = '1';
  }
  document.getElementById('score').innerText = score;
});

// eslint-disable-next-line no-unused-vars
function toggleRule() {
  const rule = document.getElementById('rule');

  rule.classList.toggle('rule-visible');
}

