'use strict';

let board;
const score = document.querySelector('.game-score');
let count = 0;
const rows = 4;
const columns = 4;
const startBtn = document.querySelector('.start');

startBtn.onclick = setGame;

function setGame() {
  document.getElementById('board').innerHTML = '';
  startBtn.textContent = 'Restart';
  startBtn.classList.add('restart');
  document.querySelector('.message-start').style.visibility = 'hidden';
  count = 0;

  if (document.querySelector('.message-lose').style.visibility === 'visible') {
    document.querySelector('.message-lose').style.visibility = 'hidden';
  }

  if (document.querySelector('.message-win').style.visibility === 'visible') {
    document.querySelector('.message-win').style.visibility = 'hidden';
  }

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const tile = document.createElement('div');

      tile.id = row.toString() + '-' + col.toString();

      const num = board[row][col];

      UpdateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }

  setRandomCeil();
  setRandomCeil();
}

function areYouWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        document.querySelector('.message-win').style.visibility = 'visible';
      }
    }
  }
}

function areYouLose() {
  let availableMoves = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        availableMoves++;

        return;
      }

      if (c > 0 && board[r][c] === board[r][c - 1]) {
        availableMoves++;

        return;
      }

      if (r > 0 && board[r][c] === board[r - 1][c]) {
        availableMoves++;

        return;
      }
    }
  }

  if (availableMoves === 0) {
    document.querySelector('.message-lose').style.visibility = 'visible';
    document.removeEventListener('keyup');
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
};

function setRandomCeil() {
  if (!hasEmptyTile()) {
    document.querySelector('.message-lose').style.visibility = 'visible';
    document.removeEventListener('keyup');

    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const num = Math.random() < 0.1 ? 4 : 2;

      board[r][c] = num;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.textContent = num;
      tile.classList.add('field-cell--' + num);
      found = true;
    }
  }
}

function UpdateTile(tile, num) {
  tile.textContent = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.textContent = num.toString();

    if (num <= 2048) {
      tile.classList.add('field-cell--' + num.toString());
    };

    if (num > 2048) {
      tile.classList.add('field-cell--2048');
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    setRandomCeil();
  }

  if (e.code === 'ArrowRight') {
    slideRight();
    setRandomCeil();
  }

  if (e.code === 'ArrowUp') {
    slideUp();
    setRandomCeil();
  }

  if (e.code === 'ArrowDown') {
    slideDown();
    setRandomCeil();
  }

  score.textContent = count;
  areYouWin();
  areYouLose();
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let slidedRow = filterZero(row);

  for (let i = 0; i < slidedRow.length - 1; i++) {
    if (slidedRow[i] === slidedRow[i + 1]) {
      slidedRow[i] *= 2;
      slidedRow[i + 1] = 0;

      count += slidedRow[i];
    }
  }

  slidedRow = filterZero(slidedRow);

  while (slidedRow.length < columns) {
    slidedRow.push(0);
  }

  return slidedRow;
}

function slideLeft() {
  let canSlide = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row = slide(row);
    board[r] = row;

    if (!arraysEqual(originalRow, row)) {
      canSlide = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      UpdateTile(tile, num);
    }
  }

  if (!canSlide) {
    disableKeyupEvent();
  }
}

function slideRight() {
  let canSlide = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);

    board[r] = row.reverse();

    if (!arraysEqual(originalRow, row)) {
      canSlide = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      UpdateTile(tile, num);
    }
  }

  if (!canSlide) {
    disableKeyupEvent();
  }
}

function slideUp() {
  let canSlide = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      UpdateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      canSlide = true;
    }
  }

  if (!canSlide) {
    disableKeyupEvent();
  }
}

function slideDown() {
  let canSlide = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      UpdateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      canSlide = true;
    }
  }

  if (!canSlide) {
    disableKeyupEvent();
  }
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

function disableKeyupEvent() {
  document.removeEventListener('keyup');
}
