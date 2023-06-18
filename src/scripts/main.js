'use strict';

let board;
let score = 0;
const rows = 4;
const columns = 4;
const buttonStart = document.querySelector('.start');

buttonStart.addEventListener('click', () => {
  restartGame();
  setTwo();
  setTwo();
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.start').textContent = 'Restart';
  document.querySelector('.start').classList.add('restart');
});

function restartGame() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.getElementById(`${i}-${j}`);

      board[i][j] = 0;

      const num = board[i][j];

      updateCell(cell, num);

      document.querySelector('.game-score').textContent = 0;
      document.querySelector('.message-lose').classList.add('hidden');
    }
  }
}

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');

      cell.id = `${i}-${j}`;

      const num = board[i][j];

      updateCell(cell, num);

      document.querySelector('.game-field').append(cell);
    }
  }
}

function updateCell(cell, num) {
  cell.textContent = '';
  cell.classList = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.textContent = num;

    if (num <= 1024) {
      cell.classList.add(`field-cell--${num}`);
    } else {
      cell.classList.add(`field-cell--2048`);
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') {
    slideLeft();
    setTwo();
  } else if (e.key === 'ArrowRight') {
    slideRight();
    setTwo();
  } else if (e.key === 'ArrowUp') {
    slideUp();
    setTwo();
  } else if (e.key === 'ArrowDown') {
    slideDown();
    setTwo();
  }

  document.querySelector('.game-score').textContent = score;

  setTimeout(function() {
    if (gameOver()) {
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }, 1000);
});

function filterZero(row) {
  return row.filter(item => item !== 0);
}

function slide(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }

    if (newRow[i] === 2048) {
      document.querySelector('.message-win').classList.remove('hidden');
    }
  }
  newRow = filterZero(newRow);

  while (newRow.length < rows) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    row = slide(row);
    board[i] = row;

    for (let j = 0; j < columns; j++) {
      const cell = document.getElementById(`${i}-${j}`);
      const num = board[i][j];

      updateCell(cell, num);
    }
  }
}

function slideRight() {
  for (let i = 0; i < rows; i++) {
    let row = board[i];

    row.reverse();

    row = slide(row);
    row.reverse();
    board[i] = row;

    for (let j = 0; j < columns; j++) {
      const cell = document.getElementById(`${i}-${j}`);
      const num = board[i][j];

      updateCell(cell, num);
    }
  }
}

function slideUp() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row = slide(row);

    for (let j = 0; j < rows; j++) {
      board[j][i] = row[j];

      const cell = document.getElementById(`${j}-${i}`);
      const num = board[j][i];

      updateCell(cell, num);
    }
  }
}

function slideDown() {
  for (let i = 0; i < columns; i++) {
    let row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let j = 0; j < rows; j++) {
      board[j][i] = row[j];

      const cell = document.getElementById(`${j}-${i}`);
      const num = board[j][i];

      updateCell(cell, num);
    }
  }
}

function hasEmptyCell() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setTwo() {
  if (!hasEmptyCell()) {
    return;
  };

  let found = false;

  while (!found) {
    const i = Math.floor(Math.random() * columns);
    const j = Math.floor(Math.random() * rows);

    if (board[i][j] === 0) {
      const cell = document.getElementById(`${i}-${j}`);

      if (Math.random() <= 0.1) {
        board[i][j] = 4;
        cell.textContent = '4';
        cell.classList.add('field-cell--4');
      } else {
        board[i][j] = 2;
        cell.textContent = '2';
        cell.classList.add('field-cell--2');
      }
      found = true;
    }
  }
}

function gameOver() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const current = board[i][j];

      if ((i + 1 < columns && current === board[i + 1][j])
      || (j + 1 < rows && current === board[i][j + 1])) {
        return false;
      }
    }
  }

  return true;
}

setGame();
