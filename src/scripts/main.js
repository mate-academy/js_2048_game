'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;

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

  // board = [
  //   [0, 0, 0, 0],
  //   [0, 2, 4, 8],
  //   [16, 32, 64, 128],
  //   [256, 512, 1024, 1024],
  // ];

  const tbody = document.getElementById('tbody');

  for (let r = 0; r < rows; r++) {
    const row = document.createElement('tr');
    const rowId = `field_row_${r}`;

    row.setAttribute('id', rowId);
    tbody.appendChild(row);

    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('td');

      cell.setAttribute('id', 'field_cell');
      row.appendChild(cell);

      cell.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateCell(cell, num);
      document.getElementById(rowId).appendChild(cell);
    }
  }

  document.getElementById('start_button').addEventListener('click', () => {
    document.getElementById('start_button').classList.remove('start');
    document.getElementById('start_button').innerHTML = 'Restart';
    document.getElementById('start_button').classList.remove('restart');
    document.getElementsByClassName('message')[2].classList.add('hidden');
    setTwo();
    setTwo();
  });
};

function hasEmptyCell() {
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
  if (!hasEmptyCell()) {
    document.getElementsByClassName('message')[0].classList.remove('hidden');

    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    const rand = Math.random(1);

    if (board[r][c] === 0) {
      board[r][c] = rand > 0.5 ? 2 : 4;

      const value = board[r][c];

      const cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = value;
      cell.classList.add('field_cell--2');
      found = true;
    }
  }
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = ''; // clear classes
  cell.classList.add('field_cell');

  if (num > 0) {
    cell.innerText = num;

    if (num <= 2048) {
      cell.classList.add('field_cell--' + num.toString());
    } else {
      cell.classList.remove('field_cell--' + num.toString());
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

function filterZeroes(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  // eslint-disable-next-line no-param-reassign
  row = filterZeroes(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];

      if (row[i] === 2048) {
        document.getElementsByClassName('message')[1]
          .classList.remove('hidden');
      }
    }
  }

  // eslint-disable-next-line no-param-reassign
  row = filterZeroes(row);

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
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
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
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
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

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateCell(cell, num);
    }
  }
}
