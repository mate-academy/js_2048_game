'use strict';

let board;
let score = 0;
let gameRunning = false;
const rows = 4;
const columns = 4;
const start = document.querySelector('.start');
const startText = document.querySelector('.message_start');
const gameOverMessage = document.querySelector('.message_lose');

window.onload = function() {
  initializeBoard();

  start.addEventListener('click', () => {
    if (!gameRunning || isGameLost()) {
      gameOverMessage.classList.add('hidden');
      score = 0;
      document.getElementById('score').innerText = score;

      setGame();
      gameRunning = true;

      start.classList.remove('start');
      start.classList.add('restart');
      start.innerText = 'Restart';
      startText.classList.remove('message_start');
      startText.classList.add('hidden');

      checkForGameWin();
    } else {
      resetGame();
    }
  });
};

function resetGame() {
  stopGame();
  setGame();
  gameRunning = true;
  startText.classList.remove('message_start');
  startText.classList.add('hidden');
  start.innerText = 'Restart';
  score = 0;
  document.getElementById('score').innerText = score;
}

function stopGame() {
  const boardElement = document.getElementById('board');

  boardElement.innerHTML = '';
  score = 0;
  document.getElementById('score').innerText = score;
}

function checkForGameWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      if (tile.classList.contains('x2048')) {
        gameWin();

        return;
      }
    }
  }
}

function gameWin() {
  startText.innerText = 'Winner! Congrats! You did it!';
}

function initializeBoard() {
  board = Array.from({ length: rows }, () => Array(columns).fill(0));

  const boardElement = document.getElementById('board');

  boardElement.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);

      boardElement.append(tile);
    }
  }
}

function setGame() {
  initializeBoard();

  setInitialTiles(2);

  checkForGameLoss();
}

function setInitialTiles(count) {
  for (let i = 0; i < count; i++) {
    if (!hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * columns);

      if (board[r][c] === 0) {
        board[r][c] = 2;

        const tile = document.getElementById(r.toString() + '-' + c.toString());

        tile.innerText = '2';
        tile.classList.add('x2');
        found = true;
      }
    }
  }
}

function checkForGameLoss() {
  if (!hasEmptyTile() && !canMergeTiles()) {
    gameLose();
  }
}

function isGameLost() {
  return !hasEmptyTile() && !canMergeTiles();
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

function canMergeTiles() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentValue = board[r][c];

      if (
        (r > 0 && board[r - 1][c] === currentValue)
        || (r < rows - 1 && board[r + 1][c] === currentValue)
        || (c > 0 && board[r][c - 1] === currentValue)
        || (c < columns - 1 && board[r][c + 1] === currentValue)
      ) {
        return true;
      }
    }
  }

  return false;
}

function setTwo() {
  if (!gameRunning) {
    return;
  }

  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const randomNumber = Math.random();

      const tileValue = randomNumber < 0.9 ? 2 : 4;

      board[r][c] = tileValue;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = tileValue.toString();
      tile.classList.add('x' + tileValue.toString());
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 4096) {
      tile.classList.add('x' + num.toString());
    } else {
      tile.classList.add('x8192');
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
  } else if (e.code === 'ArrowRight') {
    slideRight();
  } else if (e.code === 'ArrowUp') {
    slideUp();
  } else if (e.code === 'ArrowDown') {
    slideDown();
  }
  document.getElementById('score').innerText = score;
});

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  const newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function gameLose() {
  gameOverMessage.classList.remove('hidden');
  gameRunning = false;
}

function slideLeft() {
  if (canSlideLeft()) {
    for (let r = 0; r < rows; r++) {
      let row = board[r];

      row = slide(row);

      board[r] = row;

      for (let c = 0; c < columns; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        updateTile(tile, num);
      }
    }

    setTwo();
    checkForGameLoss();
  }
}

function slideRight() {
  if (canSlideRight()) {
    for (let r = 0; r < rows; r++) {
      let row = board[r];

      row.reverse();

      row = slide(row);

      row.reverse();

      board[r] = row;

      for (let c = 0; c < columns; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        updateTile(tile, num);
      }
    }

    setTwo();
    checkForGameLoss();
  }
}

function slideUp() {
  if (canSlideUp()) {
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

      row = slide(row);

      for (let r = 0; r < columns; r++) {
        board[r][c] = row[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        updateTile(tile, num);
      }
    }

    setTwo();
    checkForGameLoss();
  }
}

function slideDown() {
  if (canSlideDown()) {
    for (let c = 0; c < columns; c++) {
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

      row.reverse();

      row = slide(row);

      row.reverse();

      for (let r = 0; r < columns; r++) {
        board[r][c] = row[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = board[r][c];

        updateTile(tile, num);
      }
    }

    setTwo();
    checkForGameLoss();
  }
}

function canSlideLeft() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentValue = board[r][c];

      if (currentValue !== 0) {
        if (c > 0 && (board[r][c - 1] === 0
          || board[r][c - 1] === currentValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

function canSlideRight() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentValue = board[r][c];

      if (currentValue !== 0) {
        if (c < columns - 1 && (board[r][c + 1] === 0
          || board[r][c + 1] === currentValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

function canSlideUp() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      const currentValue = board[r][c];

      if (currentValue !== 0) {
        if (r > 0 && (board[r - 1][c] === 0
          || board[r - 1][c] === currentValue)) {
          return true;
        }
      }
    }
  }

  return false;
}

function canSlideDown() {
  for (let c = 0; c < columns; c++) {
    for (let r = rows - 1; r >= 0; r--) {
      const currentValue = board[r][c];

      if (currentValue !== 0) {
        if (r < rows - 1 && (board[r + 1][c] === 0
          || board[r + 1][c] === currentValue)) {
          return true;
        }
      }
    }
  }

  return false;
}
