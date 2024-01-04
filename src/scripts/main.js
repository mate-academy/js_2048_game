
'use strict';

let randomNumLog = [];
const board = [];
let rowNum = [];
let colNum = [];
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
  randomNumLog = [];
  messWin.classList.add('hidden');
  messLose.classList.add('hidden');
  messStart.style.display = 'none';
  rowNum = [];
  colNum = [];
}

function showGameOver() {
  let isMoveInRowAv = false;
  let isMoveInColAv = false;

  for (let r = 0; r < rows; r++) {
    rowNum = [Number(board[r][0].innerText),
      Number(board[r][1].innerText),
      Number(board[r][2].innerText),
      Number(board[r][3].innerText),
    ];

    for (let i = 0; i < rowNum.length; i++) {
      if (rowNum[i] === rowNum[i + 1]) {
        isMoveInRowAv = true;
      }
    }
  }

  for (let c = 0; c < columns; c++) {
    colNum = [Number(board[0][c].innerText),
      Number(board[1][c].innerText),
      Number(board[2][c].innerText),
      Number(board[3][c].innerText),
    ];

    for (let i = 0; i < colNum.length; i++) {
      if (colNum[i] === colNum[i + 1]) {
        isMoveInColAv = true;
      }
    }
  }

  if (!isMoveInRowAv && !isMoveInColAv && !hasEmptyTile()) {
    const loseMess = document.querySelector('.message-lose');

    loseMess.classList.remove('hidden');
  }
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

function whichNum(arr) {
  const quantity = arr.length;
  const quantityOfFour = arr.filter(item => item === 4).length;
  const percentOfTwo = Math.ceil((quantityOfFour / quantity) * 100);
  const twoOrFourNum = percentOfTwo >= 10 ? 2 : 4;

  return twoOrFourNum;
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
      const num = whichNum(randomNumLog);

      randomNumLog.push(num);
      tile.innerText = num;
      tile.classList.add('field-cell--' + num.toString());
      stopWhile = true;
    }
  }
}

function setTwo() {
  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (Number(board[r][c].innerText) === 0) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = 2;

      randomNumLog.push(num);
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
  }

  if (e.code === 'ArrowRight') {
    slideRight();
  }

  if (e.code === 'ArrowUp') {
    slideUp();
  }

  if (e.code === 'ArrowDown') {
    slideDown();
  }

  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight'
    || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    btn.classList.add('restart');
    btn.innerHTML = 'Restart';
  }

  showMessageWin();
});

document.addEventListener('keyup', () => {
  showGameOver();
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

function isMovement(arr1, arr2) {
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

function slideLeft() {
  let isAction = false;

  for (let r = 0; r < rows; r++) {
    const rowLeftRight = [Number(board[r][0].innerText),
      Number(board[r][1].innerText),
      Number(board[r][2].innerText),
      Number(board[r][3].innerText)];
    let row = rowLeftRight;

    row = slide(row);

    if (!isMovement(rowLeftRight, row)) {
      isAction = true;
    }
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (isAction) {
    setRandomNum2or4();
  }
}

function slideRight() {
  let isAction = false;

  for (let r = 0; r < rows; r++) {
    const rowLeftRight = [Number(board[r][0].innerText),
      Number(board[r][1].innerText),
      Number(board[r][2].innerText),
      Number(board[r][3].innerText)];
    let row = rowLeftRight;

    row.reverse();
    row = slide(row);

    if (!isMovement(rowLeftRight, row)) {
      isAction = true;
    }

    row.reverse();

    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (isAction) {
    setRandomNum2or4();
  }
}

function slideUp() {
  let isAction = false;

  for (let c = 0; c < columns; c++) {
    const rowUpDown = [Number(board[0][c].innerText),
      Number(board[1][c].innerText),
      Number(board[2][c].innerText),
      Number(board[3][c].innerText)];
    let row = rowUpDown;

    row = slide(row);

    if (!isMovement(rowUpDown, row)) {
      isAction = true;
    }

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

  if (isAction) {
    setRandomNum2or4();
  }
}

function slideDown() {
  let isAction = false;

  for (let c = 0; c < columns; c++) {
    const rowUpDown = [Number(board[0][c].innerText),
      Number(board[1][c].innerText),
      Number(board[2][c].innerText),
      Number(board[3][c].innerText)];
    let row = rowUpDown;

    row.reverse();
    row = slide(row);

    if (!isMovement(rowUpDown, row)) {
      isAction = true;
    }

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

  if (isAction) {
    setRandomNum2or4();
  }
}
