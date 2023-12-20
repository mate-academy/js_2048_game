/* eslint-disable no-console */
'use strict';

'use strict';

const board = [];
const scoreTotal = document.querySelector('.game-score');
const messWin = document.querySelector('.message-win');
const messLose = document.querySelector('.message-lose');
const messStart = document.querySelector('.message-start');
const btn = document.querySelector('.button');

let score = 0;
const rows = 4;
const columns = 4;

btn.addEventListener('click', () => {
  setBoard();
  clearAll();
  setGame();
  setTwo();
  setTwo();
});

function setGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = board[r][c];

      tile.id = `${r}-${c}`;

      const num = tile.innerText;

      updateTile(tile, num);
    }
  }
}

function setBoard() {
  const arrBoard = document.getElementsByClassName('field-cell');

  board[0] = [arrBoard[0], arrBoard[1], arrBoard[2], arrBoard[3]];
  board[1] = [arrBoard[4], arrBoard[5], arrBoard[6], arrBoard[7]];
  board[2] = [arrBoard[8], arrBoard[9], arrBoard[10], arrBoard[11]];
  board[3] = [arrBoard[12], arrBoard[13], arrBoard[14], arrBoard[15]];
}

function clearAll() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      board[r][c].innerText = '';
    }
  }
  score = 0;
  scoreTotal.innerText = 0;
  messWin.classList.add('hidden');
  messLose.classList.add('hidden');
  messStart.style.display = 'none';
}

function showMessageWin() {
  setBoard();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (Number(board[r][c].innerText) === 2048) {
        messWin.classList.remove('hidden');
      }
    }
  }
}

function showMessageGameOver() {
  if (!hasEmptyTile()) {
    messLose.classList.remove('hidden');
  }
}

function hasEmptyTile() {
  setBoard();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (Number(board[r][c].innerText) === 0) {
        return true;
      }
    }
  }

  return false;
}

function setRandomNum2or4() {
  if (!hasEmptyTile()) {
    return;
  }

  let stopWhile = false;

  while (!stopWhile) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (Number(board[r][c].innerText) === 0) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = Math.random() * 1000 <= 900 ? 2 : 4;

      tile.innerText = num;
      tile.classList.add('field-cell--' + num.toString());
      stopWhile = true;
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

    if (Number(board[r][c].innerText) === 0) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = 2;

      tile.innerText = num;
      tile.classList.add('field-cell--' + num.toString());
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;

    if (num <= 2048) {
      tile.classList.add('field-cell--' + num.toString());
    } else {
      tile.classList.add('field-cell--8192');
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    setRandomNum2or4();
  }

  if (e.code === 'ArrowRight') {
    slideRight();
    setRandomNum2or4();
  }

  if (e.code === 'ArrowUp') {
    slideUp();
    setRandomNum2or4();
  }

  if (e.code === 'ArrowDown') {
    slideDown();
    setRandomNum2or4();
  }

  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight'
    || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    btn.classList.add('restart');
    btn.innerHTML = 'Restart';
  }

  showMessageWin();
  showMessageGameOver();
});

function filterZero(row) {
  const newRow = row.filter(item => item !== 0);

  return newRow;
}

function slide(row) {
  const newRow = filterZero(row);

  for (let r = 0; r < newRow.length - 1; r++) {
    if (newRow[r] === newRow[r + 1]) {
      newRow[r] *= 2;
      newRow[r + 1] = 0;
      score += newRow[r];
      scoreTotal.innerText = score;
    }
  }

  const modNewRow = filterZero(newRow);

  while (modNewRow.length < columns) {
    modNewRow.push(0);
  }

  return modNewRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    const rowLeftRight = [Number(board[r][0].innerText),
      Number(board[r][1].innerText),
      Number(board[r][2].innerText),
      Number(board[r][3].innerText)];
    let row = rowLeftRight;

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    const rowLeftRight = [Number(board[r][0].innerText),
      Number(board[r][1].innerText),
      Number(board[r][2].innerText),
      Number(board[r][3].innerText)];
    let row = rowLeftRight;

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
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    const rowUpDown = [Number(board[0][c].innerText),
      Number(board[1][c].innerText),
      Number(board[2][c].innerText),
      Number(board[3][c].innerText)];
    let row = rowUpDown;

    row = slide(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < columns; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    const rowUpDown = [Number(board[0][c].innerText),
      Number(board[1][c].innerText),
      Number(board[2][c].innerText),
      Number(board[3][c].innerText)];
    let row = rowUpDown;

    row.reverse();
    row = slide(row);
    row.reverse();
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < columns; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}
