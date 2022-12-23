'use strict';

let board;
const rowsCount = 4;
const columnsCount = 4;
const score = document.querySelector('.game-score');
const cell = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

button.addEventListener('click', () => {
  if (button.textContext === 'Start') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  score.textContext = '0';
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

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

  for (let r = 0; r < rowsCount; r++) {
    for (let c = 0; c < columnsCount; c++) {
      cell[i].id = `${r}-${c}`;

      const num = board[r][c];

      updateTile(cell[i], num);
      i++;
    }
  }

  setRandom();
  setRandom();
  document.addEventListener('keyup', handleChange);
}

function hasEmptyTile() {
  for (let r = 0; r < rowsCount; r++) {
    for (let c = 0; c < columnsCount; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setRandom() {
  if (!hasEmptyTile()) {
    return;
  }

  let isFound = false;

  while (!isFound) {
    const r = Math.floor(Math.random() * rowsCount);
    const c = Math.floor(Math.random() * columnsCount);

    if (board[r][c] === 0) {
      board[r][c] = Math.random() < 0.1 ? 4 : 2;

      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = '2';
      tile.classList.add('field-cell--2');
      isFound = true;
    }
  }
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

const handleChange = (e) => {
  switch (e.code) {
    case 'ArrowLeft': {
      slideLeftAndRight(true);
      setRandom();

      break;
    }

    case 'ArrowRight': {
      slideLeftAndRight(false);
      setRandom();

      break;
    }

    case 'ArrowUp': {
      slideUpAndDown(true);
      setRandom();

      break;
    }

    case 'ArrowDown': {
      slideUpAndDown(false);
      setRandom();

      break;
    }
  }

  gameLose();
  gameWin();
};

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = filterZero(row);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score.textContent = `${+score.textContent + newRow[i]}`;
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columnsCount) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeftAndRight(left) {
  for (let r = 0; r < rowsCount; r++) {
    let row = board[r];

    if (left) {
      row = slide(row);
      board[r] = row;
    } else {
      row.reverse();
      row = slide(row);
      row.reverse();
      board[r] = row;
    }

    for (let c = 0; c < columnsCount; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUpAndDown(up) {
  for (let c = 0; c < columnsCount; c++) {
    let row = [board[0][c],
      board[1][c],
      board[2][c],
      board[3][c]];

    if (up) {
      row = slide(row);
    } else {
      row.reverse();
      row = slide(row);
      row.reverse();
    }

    for (let r = 0; r < columnsCount; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
};

function gameLose() {
  if (
    hasEmptyTile()
    || isHorizontalMoveAvailable()
    || isVerticalMoveAvailable()
  ) {
    return;
  }

  loseMessage.classList.remove('hidden');
  document.removeEventListener('keyup', handleChange);
}

function isHorizontalMoveAvailable() {
  for (let r = 0; r < rowsCount; r++) {
    const row = board[r];

    for (let c = 0; c < columnsCount - 1; c++) {
      if (row[c] === row[c + 1]) {
        return true;
      }
    }
  }

  return false;
}

function isVerticalMoveAvailable() {
  for (let r = 0; r < rowsCount - 1; r++) {
    for (let c = 0; c < columnsCount; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
}

function gameWin() {
  for (let r = 0; r < rowsCount; r++) {
    for (let c = 0; c < columnsCount; c++) {
      if (board[r][c] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}
