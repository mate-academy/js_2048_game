'use strict';

let board;
let score = 0;
const rows = 4;
const column = 4;
let count = 0;

const tableBody = document.querySelector('tbody');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');

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

  tableBody.innerHTML = board.map((row, rowIndex) => `
    <tr>
      ${row.map((item, columnIndex) => `
        <td
          class="field-cell ${item > 0 ? `field-cell--${item}` : ''}"
          id="${rowIndex}-${columnIndex}">
          ${item > 0 ? item : ''}
        </td>
      `).join('')}
    </tr>
  `).join('');

  setTwoOrFour();
  setTwoOrFour();
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num.toString();
    tile.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keydown', handleGame);

button.addEventListener('click', (e) => {
  if (e.target.classList.contains('restart')) {
    restartGame();
  } else if (e.target.classList.contains('start')) {
    startGame();
  }
});

function handleGame(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        return;
      }
      moveLeft();
      setTwoOrFour();
      break;

    case 'ArrowRight':
      if (!canMoveRight()) {
        return;
      }
      moveRight();
      setTwoOrFour();
      break;

    case 'ArrowUp':
      if (!canMoveUp()) {
        return;
      }
      moveUp();
      setTwoOrFour();
      break;

    case 'ArrowDown':
      if (!canMoveDown()) {
        return;
      }
      moveDown();
      setTwoOrFour();
      break;

    default:
      return;
  }

  count++;

  if (count > 0) {
    startGame();
  }

  if (gameOver()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleGame);
  }

  if (winGame()) {
    winMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleGame);
  }
}

function startGame() {
  startMessage.classList.add('hidden');
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

function restartGame() {
  count = 0;
  score = 0;
  gameScore.innerText = score;

  setGame();
  startGame();

  document.addEventListener('keydown', handleGame);
}

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function move(row) {
  let currentRow = filterZero(row);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow[i + 1] = 0;
      score += currentRow[i];
      gameScore.innerText = score;
    }
  }

  currentRow = filterZero(currentRow);

  while (currentRow.length < column) {
    currentRow.push(0);
  }

  return currentRow;
}

function moveLeft() {
  board = board.map((row) => move(row));

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const tile = document.getElementById(`${rowIndex}-${cellIndex}`);

      updateTile(tile, cell);
    });
  });
}

function moveRight() {
  board = board.map((row) => move(row.reverse()).reverse());

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const tile = document.getElementById(`${rowIndex}-${cellIndex}`);

      updateTile(tile, cell);
    });
  });
}

function moveUp() {
  for (let c = 0; c < column; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = move(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function moveDown() {
  for (let c = 0; c < column; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = move(row.reverse()).reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function setTwoOrFour() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * column);

    if (board[r][c] === 0) {
      const randomNumber = Math.random() > 0.9 ? 4 : 2;

      board[r][c] = randomNumber;

      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = randomNumber;
      tile.classList.add(`field-cell--${randomNumber}`);
      found = true;
    }
  }
}

function hasEmptyTile() {
  for (let i = 0; i < rows; i++) {
    if (board[i].some(cell => cell === 0)) {
      return true;
    }
  }

  return false;
}

function gameOver() {
  if (!canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown()) {
    return true;
  }
}

function winGame() {
  for (let i = 0; i < rows; i++) {
    if (board[i].some(cell => cell === 2048)) {
      return true;
    }
  }

  return false;
}

function canMoveLeft() {
  for (let r = 0; r < rows; r++) {
    const row = board[r];

    for (let c = column - 1; c > 0; c--) {
      if (row[c] !== 0 && (row[c - 1] === 0 || row[c] === row[c - 1])) {
        return true;
      }
    }
  }

  return false;
}

function canMoveRight() {
  for (let r = 0; r < rows; r++) {
    const row = board[r].reverse();

    for (let c = column - 1; c > 0; c--) {
      if (row[c] !== 0 && (row[c - 1] === 0 || row[c] === row[c - 1])) {
        return true;
      }
    }
  }

  return false;
}

function canMoveUp() {
  for (let i = 0; i < column; i++) {
    const row = [board[0][i], board[1][i], board[2][i], board[3][i]];

    for (let c = column - 1; c > 0; c--) {
      if (row[c] !== 0 && (row[c - 1] === 0 || row[c] === row[c - 1])) {
        return true;
      }
    }
  }

  return false;
}

function canMoveDown() {
  for (let i = 0; i < column; i++) {
    const row = [board[0][i], board[1][i], board[2][i], board[3][i]].reverse();

    for (let c = column - 1; c > 0; c--) {
      if (row[c] !== 0 && (row[c - 1] === 0 || row[c] === row[c - 1])) {
        return true;
      }
    }
  }

  return false;
}
