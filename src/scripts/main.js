'use strict';

const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

let board;
const rows = 4;
const columns = 4;

button.addEventListener('click', () => {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  score.textContent = '0';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  setGame();
});

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let i = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cells[i].id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(cells[i], num);

      i++;
    }
  }

  setTwo();
  setTwo();
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
    return;
  }

  let isFound = false;

  while (!isFound) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = Math.random() < 0.1 ? 4 : 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';
      tile.classList.add('field-cell--2');
      isFound = true;
    }
  }
  lose();
  win();
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
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let roww = filterZero(row);

  for (let i = 0; i < roww.length; i++) {
    if (roww[i] === roww[i + 1]) {
      roww[i] *= 2;
      roww[i + 1] = 0;
      score.textContent = `${+score.textContent + roww[i]}`;
    }
  }

  roww = filterZero(roww);

  while (roww.length < columns) {
    roww.push(0);
  }

  return roww;
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
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(`${r}-${c}`);
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
    board[0][c] = row[0];
    board[1][c] = row[1];
    board[2][c] = row[2];
    board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function lose() {
  if (hasEmptyTile()) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[c][r] === board[c + 1][r] || board[r][c] === board[r][c + 1]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

function win() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}
