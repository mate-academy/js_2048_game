'use strict';

const rows = 4;
const columns = 4;
let score = 0;
let field;
const page = document.querySelector('.container');
const startButton = document.getElementById('start');
let gameStarted = false;

startButton.addEventListener('click', function() {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerText = 'Restart';

    if (!gameStarted) {
      const messageStart = page.querySelector('.message-start');

      messageStart.classList.add('hidden');
      gameStarted = true;
      setGame();
    }
  } else if (startButton.classList.contains('restart')) {
    clearGame();
    startButton.innerText = 'Restart';

    const messageLose = page.querySelector('.message-lose');

    messageLose.classList.add('hidden');
    gameStarted = true;
    setGame();
  }
});

function clearGame() {
  startButton.innerText = 'Start';
  score = 0;
  document.getElementById('score').innerText = score;

  field = new Array(rows).fill(0).map(() => new Array(columns).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());

      updateCell(cell, 0);
    }
  }
}

function setGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const fieldContainer = document.getElementById('field');

  fieldContainer.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');

      cell.id = r.toString() + '-' + c.toString();

      const num = field[r][c];

      updateCell(cell, num);
      document.getElementById('field').append(cell);
    }
  }
  setTwo();
  setTwo();
  // created two 2 to start the game
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num.toString();

    if (num <= 2048) {
      cell.classList.add('field-cell--' + num.toString());

      if (num === 2048) {
        messageWin();
      }
    }
  }
}

document.addEventListener('keyup', (element) => {
  if (element.code === 'ArrowLeft') {
    moveLeft();
    setTwo();
  } else if (element.code === 'ArrowRight') {
    moveRight();
    setTwo();
  } else if (element.code === 'ArrowUp') {
    moveUp();
    setTwo();
  } else if (element.code === 'ArrowDown') {
    moveDown();
    setTwo();
  }

  document.getElementById('score').innerText = score;
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function move(row) { // [0, 2, 2, 2]
  let filteredRow = filterZero(row); // [2, 2, 2]

  for (let ind = 0; ind < filteredRow.length - 1; ind++) {
    if (filteredRow[ind] === filteredRow[ind + 1]) {
      filteredRow[ind] *= 2;
      filteredRow[ind + 1] = 0;
      score += filteredRow[ind];
    }
  } // [4, 0, 2]

  filteredRow = filterZero(filteredRow); // [4, 2]

  while (filteredRow.length < columns) {
    filteredRow.push(0);
  } // [4, 2, 0, 0]

  return filteredRow;
}

function moveLeft() {
  for (let r = 0; r < rows; r++) {
    let row = field[r];

    row = move(row);
    field[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
}

function moveRight() {
  for (let r = 0; r < rows; r++) {
    let row = field[r]; // [2, 2, 2, 0]

    row.reverse(); // [0, 2, 2, 2]
    row = move(row);// [4, 2, 0, 0]
    field[r] = row.reverse(); // [0, 0, 2, 4]

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
}

function moveUp() {
  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row = move(row);
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
}

function moveDown() {
  for (let c = 0; c < columns; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[3][c]];

    row.reverse(); // [0, 2, 2, 2]
    row = move(row);// [4, 2, 0, 0]
    row.reverse(); // [0, 0, 2, 4]

    for (let r = 0; r < rows; r++) {
      field[r][c] = row[r];

      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = field[r][c];

      updateCell(cell, num);
    }
  }
}

function messageGameOver() {
  const messageLose = page.querySelector('.message-lose');

  messageLose.classList.remove('hidden');
}

function messageWin() {
  const winningMessage = page.querySelector('.message-win');

  winningMessage.classList.remove('hidden');
}

function setTwo() {
  if (!hasEmptyCell()) {
    return messageGameOver();
  }

  let found = false;

  const value = Math.random() < 0.9 ? 2 : 4;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (field[r][c] === 0) {
      field[r][c] = value;

      const cell = document.getElementById(r.toString() + '-' + c.toString());

      cell.innerText = value.toString();
      cell.classList.add('field-cell--' + value);
      found = true;
    }
  }
}

function hasEmptyCell() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (field[r][c] === 0) { // at least one zero in the field
        return true;
      }
    }
  }

  return false;
}
