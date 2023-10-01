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
  start.addEventListener('click', () => {
    if (!gameRunning) {
      gameOverMessage.classList.add('hidden');

      setGame();
      gameRunning = true;

      start.classList.remove('start');
      start.classList.add('restart');
      start.innerText = 'Restart';
      startText.textContent = '';

      checkForGameWin();
    } else {
      stopGame();

      start.classList.remove('restart');
      start.classList.add('start');
      start.innerText = 'Start';

      gameOverMessage.classList.add('hidden');
    }
  });
};

function stopGame() {
  const boardElement = document.getElementById('board');

  boardElement.innerHTML = '';
  score = 0;
  document.getElementById('score').innerText = score;

  gameRunning = false;
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

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

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

  setTwo();
  setTwo();

  checkForGameLoss();
}

function checkForGameLoss() {
  if (!hasEmptyTile() && !canMergeTiles()) {
    gameLose();
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
  document.getElementById('score').innerText = score;
});

function filterZero(row) {
  return row.filter(num => num !== 0);
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

  checkForGameLoss();
}

function slideRight() {
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

  checkForGameLoss();
}

function slideUp() {
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

  checkForGameLoss();
}

function slideDown() {
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

  checkForGameLoss();
}
