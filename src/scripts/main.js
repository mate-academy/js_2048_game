'use strict';

// write your code here

let board;
const rows = 4;
const columns = 4;
let score = 0;
const startButton = document.querySelector('button');
const gameField = document.querySelector('.game-field');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

window.onload = function() {
  startButton.addEventListener('click', function() {
    setGame();
    startMessage.classList.add('hidden');
    startButton.innerHTML = 'Restart';
  });
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  gameField.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('td');

      tile.classList.add('field-cell');
      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      gameField.appendChild(tile);
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

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const randomNum = Math.random() < 0.9 ? 2 : 4;

      board[r][c] = randomNum;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = randomNum.toString();

      if (randomNum === 2) {
        tile.classList.add('field-cell--2');
      } else {
        tile.classList.add('field-cell--4');
      }
      found = true;

      if (randomNum >= 2048) {
        winMessage.classList.remove('hidden');
      }

      if (!hasEmptyTile() && !hasMovesLeft()) {
        loseMessage.classList.remove('hidden');
      }
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.className = 'field-cell';

  if (num > 0 && num <= 2048) {
    tile.innerText = num;
    tile.classList.add('field-cell--' + num.toString());

    if (num === 0) {
      tile.classList.add('field-cell--empty');
    } else {
      tile.classList.remove('field-cell--empty');
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
  document.querySelector('.game-score').innerText = score;
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let filteredRow = filterZero(row);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;
      score += filteredRow[i];
    }
  }

  filteredRow = filterZero(filteredRow);

  while (filteredRow.length < columns) {
    filteredRow.push(0);
  }

  return filteredRow;
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

      if (!hasEmptyTile() && !hasMovesLeft()) {
        loseMessage.classList.remove('hidden');
      }

      if (num >= 2048) {
        winMessage.classList.remove('hidden');
      }
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

      if (!hasEmptyTile() && !hasMovesLeft()) {
        loseMessage.classList.remove('hidden');
      }

      if (num >= 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);

      if (!hasEmptyTile() && !hasMovesLeft()) {
        loseMessage.classList.remove('hidden');
      }

      if (num >= 2048) {
        winMessage.classList.remove('hidden');
      }
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

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);

      if (!hasEmptyTile() && !hasMovesLeft()) {
        loseMessage.classList.remove('hidden');
      }

      if (num >= 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}

function hasMovesLeft() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const currentNum = board[r][c];
      const leftNum = c > 0 ? board[r][c - 1] : null;
      const rightNum = c < columns - 1 ? board[r][c + 1] : null;
      const upNum = r > 0 ? board[r - 1][c] : null;
      const downNum = r < rows - 1 ? board[r + 1][c] : null;

      if (
        currentNum === 0
        || currentNum === leftNum
        || currentNum === rightNum
        || currentNum === upNum
        || currentNum === downNum
      ) {
        return true;
      }
    }
  }

  return false;
}
