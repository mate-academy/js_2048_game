'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;

const button = document.querySelector('.start');

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    score = 0;
    document.querySelector('.score').innerText = 0;
    document.querySelector('.message-lose').classList.add('hidden');
  }

  document.querySelector('#board').innerHTML = '';
  setGame();
  setTwo();
  setTwo();

  document.querySelector('.message-start').classList.add('hidden');

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';
});

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

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.getElementById('board').append(tile);
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

function setTwo() {
  if (!hasEmptyTile()) {
    loseCheck();

    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const randomNums = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

      board[r][c] = randomNums[Math.floor(Math.random() * 10)];

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = board[r][c];
      tile.classList.add('x' + board[r][c].toString());
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
    tile.classList.add('x' + num.toString());
  }
}

document.addEventListener('keyup', (e) => {
  if (button.classList.contains('restart')) {
    switch (e.code) {
      case 'ArrowLeft':
        slideLeft();
        setTwo();
        break;
      case 'ArrowRight':
        slideRight();
        setTwo();
        break;
      case 'ArrowUp':
        slideUp();
        setTwo();
        break;
      case 'ArrowDown':
        slideDown();
        setTwo();
    }
  }
  document.querySelector('.score').innerText = score;
});

function filterZero(argRow) {
  return argRow.filter(num => num);
}

function slideCheck(argRow) {
  let copyRow = filterZero(argRow);

  for (let i = 0; i < copyRow.length - 1; i++) {
    if (copyRow[i] === copyRow[i + 1]) {
      copyRow[i] *= 2;
      copyRow[i + 1] = 0;
    }
  }

  copyRow = filterZero(copyRow);

  while (copyRow.length < columns) {
    copyRow.push(0);
  }

  return copyRow;
}

function slide(argRow) {
  let copyRow = filterZero(argRow);

  for (let i = 0; i < copyRow.length - 1; i++) {
    if (copyRow[i] === copyRow[i + 1]) {
      copyRow[i] *= 2;
      copyRow[i + 1] = 0;
      score += copyRow[i];
    }
  }

  copyRow = filterZero(copyRow);

  while (copyRow.length < columns) {
    copyRow.push(0);
  }

  return copyRow;
}

function slideLeftCheck() {
  const result = [];

  for (let r = 0; r < rows; r++) {
    const row1 = [...board[r]];

    const row2 = slideCheck(row1);

    result.push(JSON.stringify(row1) === JSON.stringify(row2));
  }

  return result.includes(false);
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        document.querySelector('.message-win').classList.toggle('hidden');
      }

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRightCheck() {
  const result = [];

  for (let r = 0; r < rows; r++) {
    const row1 = [...board[r]];

    const row2 = slideCheck(row1);

    result.push(JSON.stringify(row1) === JSON.stringify(row2));
  }

  return result.includes(false);
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        document.querySelector('.message-win').classList.toggle('hidden');
      }

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUpCheck() {
  const result = [];

  for (let c = 0; c < columns; c++) {
    const row1 = [...[board[0][c], board[1][c], board[2][c], board[3][c]]];

    const row2 = slideCheck(row1);

    result.push(JSON.stringify(row1) === JSON.stringify(row2));
  }

  return result.includes(false);
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      if (board[r][c] === 2048) {
        document.querySelector('.message-win').classList.toggle('hidden');
      }

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDownCheck() {
  const result = [];

  for (let c = 0; c < columns; c++) {
    const row1 = [...[board[0][c], board[1][c], board[2][c], board[3][c]]];

    const row2 = slideCheck(row1);

    result.push(JSON.stringify(row1) === JSON.stringify(row2));
  }

  return result.includes(false);
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      if (board[r][c] === 2048) {
        document.querySelector('.message-win').classList.toggle('hidden');
      }

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function loseCheck() {
  if (!slideLeftCheck() && !slideRightCheck()
       && !slideUpCheck() && !slideDownCheck()) {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}
