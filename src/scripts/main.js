'use strict';

let board;
let score = 0;
const ROWS = 4;
const COLUMNS = 4;
let arraysUpdatedBoard = [];

const gameFieldContainer = document.querySelector('.game-field-container');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');

window.onload = function() {
  startGame();
};

startButton.onclick = () => {
  startButton.style.display = 'none';
  restartButton.style.display = 'block';
  document.querySelector('.hidden-start').style.display = 'none';

  addTile();
  addTile();
};

restartButton.onclick = () => {
  score = 0;
  document.querySelector('.game-score').innerText = 0;
  document.querySelector('.hidden-lose').style.display = 'none';
  document.querySelector('.hidden-start').style.display = 'none';

  document.querySelector('.game-field').remove();

  const restartField = document.createElement('div');

  restartField.className = 'game-field';
  gameFieldContainer.append(restartField);

  startGame();
  addTile();
  addTile();
};

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.querySelector('.game-field').append(tile);
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 2048) {
      tile.classList.add('field-cell--' + num.toString());
    } else {
      tile.classList.add('field-cell--2048');
    }
  }
}

document.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      if (!youWin()) {
        moveUp();
        doubleBoardsToSingleForComprassion();

        if (!notAddTile()) {
          addTile();
        }
      }
      break;

    case 'ArrowRight':
      if (!youWin()) {
        moveRight();
        doubleBoardsToSingleForComprassion();

        if (!notAddTile()) {
          addTile();
        }
      }
      break;

    case 'ArrowDown':
      if (!youWin()) {
        moveDown();
        doubleBoardsToSingleForComprassion();

        if (!notAddTile()) {
          addTile();
        }
      }
      break;

    case 'ArrowLeft':
      if (!youWin()) {
        moveLeft();
        doubleBoardsToSingleForComprassion();

        if (!notAddTile()) {
          addTile();
        }
      }
      break;
  }

  document.querySelector('.game-score').innerText = score;
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function move(row) {
  let rOw = row;

  rOw = filterZero(rOw);

  for (let i = 0; i < rOw.length - 1; i++) {
    if (rOw[i] === rOw[i + 1]) {
      rOw[i] *= 2;
      rOw[i + 1] = 0;
      score += rOw[i];
    }
  }
  rOw = filterZero(rOw);

  while (rOw.length < COLUMNS) {
    rOw.push(0);
  }

  return rOw;
}

function moveLeft() {
  for (let r = 0; r < ROWS; r++) {
    let row = board[r];

    row = move(row);
    board[r] = row;

    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function moveRight() {
  for (let r = 0; r < ROWS; r++) {
    let row = board[r];

    row.reverse();
    row = move(row);
    board[r] = row.reverse();

    for (let c = 0; c < COLUMNS; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function moveUp() {
  for (let c = 0; c < COLUMNS; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = move(row);

    for (let r = 0; r < ROWS; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function moveDown() {
  for (let c = 0; c < COLUMNS; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = move(row);
    row.reverse();

    for (let r = 0; r < ROWS; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function addTile() {
  if (!hasEmptyTile()) {
    return;
  }

  const arrayBoard = [];
  let found = false;
  const randomDigits = [2, 4];
  const randomDigit
    = randomDigits[Math.floor(Math.random() * randomDigits.length)];

  while (!found) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLUMNS);

    if (board[r][c] === 0) {
      board[r][c] = randomDigit;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = randomDigit.toString();
      tile.classList.add(`field-cell--${randomDigit}`);
      found = true;
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      arrayBoard.push(board[r][c]);
    }
  }

  arraysUpdatedBoard = [...arraysUpdatedBoard, [...arrayBoard]];

  if (arrayBoard.some(arr => arr === 2048)) {
    document.querySelector('.hidden-win').style.display = 'block';
  }

  if (youLose()) {
    document.querySelector('.hidden-lose').style.display = 'block';
  }
}

function notAddTile() {
  const booleanArr = [];
  const penultimateArr = arraysUpdatedBoard[arraysUpdatedBoard.length - 2];
  const lastArr = arraysUpdatedBoard[arraysUpdatedBoard.length - 1];

  for (let i = 0; i < penultimateArr.length; i++) {
    booleanArr.push(penultimateArr[i] === lastArr[i]);
  }

  return booleanArr.every((arr) => arr);
}

function hasEmptyTile() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function youWin() {
  const arrayBoard = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      arrayBoard.push(board[r][c]);
    }
  }

  return arrayBoard.some((arr) => arr === 2048);
}

function youLose() {
  let columnsStrLines = '';
  const columnsLines = [];
  const rowsLines = [...board];
  let rowAndColumnLines = [];

  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLUMNS; y++) {
      columnsStrLines += ((rowsLines[y][x]) + '.');
    }
    columnsStrLines += ' ';
  }

  for (let i = 0; i < columnsStrLines.split(' ').length - 1; i++) {
    columnsLines.push(
      columnsStrLines.split(' ')[i].split('.')
        .filter(ar => ar !== '')
    );
  }

  rowAndColumnLines = [
    ...rowsLines, ...columnsLines
      .map((col) => col.map((c) => +c)),
  ];

  const newArr = rowAndColumnLines.map(
    arr => arr.map((ar, i, array) => (array[i] !== array[i + 1]))
      .slice(0, 3).every((ar) => ar)
  );

  return newArr.every(ar => ar) && !hasEmptyTile();
}

function doubleBoardsToSingleForComprassion() {
  const arrayBoard = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      arrayBoard.push(board[r][c]);
    }
  }

  arraysUpdatedBoard = arraysUpdatedBoard
    .filter((arr, i, array) => arr !== array[0]);
  arraysUpdatedBoard = [...arraysUpdatedBoard, [...arrayBoard]];
}
