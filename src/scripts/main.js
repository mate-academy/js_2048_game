import { messageText } from './mesageText';

const message = document.querySelector('.message');

const startButton = document.querySelector('#start');
const skipButton = document.querySelector('#skip');

const gameScore = document.querySelector('.game-score');
const fieldRows = document.querySelectorAll('.field-row');

let isWon = false;
let isLose = false;

const rows = 4;
const columns = 4;

let board;
let score = 0;
let tilesMoved = false;

window.onload = function() {
  setGame();
  messageText('start');
};

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = 'field-cell';

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`field-cell--${num}`);
  }
}

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < fieldRows.length; r++) {
    const fieldRowCells = fieldRows[r].querySelectorAll('.field-cell');

    for (let c = 0; c < fieldRowCells.length; c++) {
      fieldRowCells[c].id = `${r}-${c}`;

      const num = board[r][c];

      updateTile(fieldRowCells[c], num);
    }
  }
}

function isGameWon() {
  const finalCell = document.querySelector('.field-cell--2048');

  if (finalCell) {
    messageText('win');
    isWon = true;
  }
}

function gameOver() {
  if (!canTilesSlide()) {
    messageText('lose');
    isLose = true;
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

function setTwoTiles() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const randomCellNumber = Math.random() <= 0.1 ? 4 : 2;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = randomCellNumber;

      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = `${randomCellNumber}`;
      tile.classList.add(`field-cell--${randomCellNumber}`);
      found = true;
    }
  }
}

function handleStartGame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = '';
      tile.classList.value = 'field-cell';
      board[r][c] = 0;
    }

    score = 0;
    gameScore.innerText = 0;
  }

  setTwoTiles();
  setTwoTiles();

  isWon = false;
  isLose = false;

  message.classList.value = 'hidden';

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';

  skipButton.classList.remove('hidden');
}

function handleSkip() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);

      tile.innerText = '128';
      tile.classList.value = 'field-cell field-cell--128';
      board[r][c] = 128;
    }

    score = 0;
  }

  isLose = false;

  messageText('skip');
  skipButton.classList.add('hidden');
}

function handleKeyUpEvent(keyEvent) {
  if (!isWon && !isLose) {
    switch (keyEvent.code) {
      case 'ArrowLeft':
        slideLeft();
        break;

      case 'ArrowRight':
        slideRight();
        break;

      case 'ArrowUp':
        slideUp();
        break;

      case 'ArrowDown':
        slideDown();
        break;

      default:
        messageText('wrong-key');
    }
  }

  if (tilesMoved) {
    setTwoTiles();
    gameOver();
    isGameWon();
  }

  tilesMoved = false;
  gameScore.innerText = score;
}

function filterZero(row) {
  return row.filter(currentNumber => currentNumber !== 0);
}

function slide(row) {
  let currentRow = row;

  currentRow = filterZero(currentRow);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow[i + 1] = 0;
      score += currentRow[i];
    }
  }

  currentRow = filterZero(currentRow);

  while (currentRow.length < columns) {
    currentRow.push(0);
  }

  return currentRow;
}

function canTilesSlide() {
  if (hasEmptyTile()) {
    return true;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = board[r][c];

      if (
        (c > 0 && tile === board[r][c - 1])
        || (c < columns - 1 && tile === board[r][c + 1])
        || (r > 0 && tile === board[r - 1][c])
        || (r < rows - 1 && tile === board[r + 1][c])
      ) {
        return true;
      }
    }
  }

  return false;
}

function arraysEqual(originalRow, row) {
  if (originalRow.length !== row.length) {
    return false;
  }

  for (let i = 0; i < originalRow.length; i++) {
    if (originalRow[i] !== row[i]) {
      return false;
    }
  }

  return true;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row = slide(row);
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row.reverse();

    row = slide(row);

    row.reverse();
    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(`${r.toString()}-${c.toString()}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r.toString()}-${c.toString()}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(`${r.toString()}-${c.toString()}`);
      const num = board[r][c];

      updateTile(tile, num);
    }

    if (!arraysEqual(originalRow, row)) {
      tilesMoved = true;
    }
  }
}

startButton.addEventListener('click', handleStartGame);
skipButton.addEventListener('click', handleSkip);
document.addEventListener('keyup', handleKeyUpEvent);
