'use strict';

const WINNER_SCORE = 2048;
const ARROW = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const rows = 4;
const columns = 4;
let scoreCount = 0;
let won = false;
const initialBoard = board.map(row => [...row]);
let isInitialSetup = true;

button.addEventListener('click', restartGame);

const table = document.querySelector('.game-field');

const setGame = () => {
  for (let r = 0; r < rows; r++) {
    const row = table.querySelectorAll('.field-row')[r];
    const cells = row.querySelectorAll('.field-cell');

    for (let c = 0; c < columns; c++) {
      const cell = cells[c];

      cell.setAttribute('id', `row_${r}-column_${c}`);

      const number = board[r][c];

      updateCell(cell, number);
    }
  }
  setCell();
  setCell();
};

const hasEmptyCell = () => {
  return board.some(row => row.some(cell => cell === 0));
};

const loseGame = () => {
  if (hasEmptyCell()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < rows; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
};

const clearBoard = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`row_${r}-column_${c}`);

      board[r][c] = 0;

      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');
    }
  }
  scoreCount = 0;
  score.innerHTML = scoreCount;
};

const setCell = () => {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;
  const number = Math.random() < 0.8 ? 2 : 4;

  while (!found) {
    const row = Math.floor(Math.random() * rows);
    const column = Math.floor(Math.random() * columns);

    if (board[row][column] === 0) {
      board[row][column] = number;

      const cell = document.getElementById(`row_${row}-column_${column}`);

      cell.innerText = `${number}`;
      cell.classList.add(`field-cell--${number}`);
      found = true;
    }
  }

  if (loseGame()) {
    messageLose.classList.remove('hidden');

    button.addEventListener('click', () => {
      messageLose.classList.add('hidden');

      clearBoard();
      restartGame();
    });
  }
};

const updateCell = (cell, number) => {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (number > 0) {
    cell.innerText = number;

    if (number < 4096) {
      cell.classList.add(`field-cell--${number}`);
    } else {
      cell.classList.add(`field-cell--8192`);
    }
  }

  if (number === WINNER_SCORE) {
    messageWin.classList.remove('hidden');
    won = true;
  }
};

document.addEventListener('keyup', arrow => {
  arrow.preventDefault();

  if (won) {
    return;
  }

  switch (arrow.key) {
    case ARROW.LEFT:
      slideLeft();
      break;
    case ARROW.RIGHT:
      slideRight();
      break;
    case ARROW.UP:
      slideUp();
      break;
    case ARROW.DOWN:
      slideDown();
      break;
    default:
      return;
  }

  document.querySelector('.game-score').innerText = scoreCount;
});

const filterZero = row => row.filter(num => num !== 0);

const slide = (row) => {
  let initialRow = [...row];

  initialRow = filterZero(initialRow);

  for (let i = 0; i < initialRow.length - 1; i++) {
    if (initialRow[i] === initialRow[i + 1]) {
      initialRow[i] *= 2;
      initialRow[i + 1] = 0;
      scoreCount += initialRow[i];
    }
  }

  initialRow = filterZero(initialRow);

  while (initialRow.length < columns) {
    initialRow.push(0);
  }

  return initialRow;
};

const slideHorizontal = (row, direction) => {
  let newRow = [...row];

  if (direction === 'right') {
    newRow.reverse();
  }

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      scoreCount += newRow[i];
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  if (direction === 'right') {
    newRow.reverse();
  }

  return newRow;
};

const slideLeft = () => {
  for (let r = 0; r < rows; r++) {
    const row = board[r];
    const newRow = slideHorizontal(row, 'left');

    board[r] = newRow;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`row_${r}-column_${c}`);
      const number = board[r][c];

      updateCell(cell, number);
    }
  }

  if (hasChanges(initialBoard, board)) {
    setCell();
  }
};

const slideRight = () => {
  for (let r = 0; r < rows; r++) {
    const row = board[r];
    const newRow = slideHorizontal(row, 'right');

    board[r] = newRow;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(`row_${r}-column_${c}`);
      const number = board[r][c];

      updateCell(cell, number);
    }
  }

  if (hasChanges(initialBoard, board)) {
    setCell();
  }
};

const slideUp = () => {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(`row_${r}-column_${c}`);
      const number = board[r][c];

      updateCell(cell, number);
    }
  }

  if (hasChanges(initialBoard, board)) {
    setCell();
  }
};

const slideDown = () => {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const cell = document.getElementById(`row_${r}-column_${c}`);
      const number = board[r][c];

      updateCell(cell, number);
    }
  }

  if (hasChanges(initialBoard, board)) {
    setCell();
  }
};

const hasChanges = (arrayA, arrayB) => {
  for (let i = 0; i < arrayA.length; i++) {
    for (let j = 0; j < arrayA[i].length; j++) {
      if (arrayA[i][j] !== arrayB[i][j]) {
        return true;
      }
    }
  }

  return false;
};

button.removeEventListener('click', restartGame);

function restartGame() {
  messageWin.classList.add('hidden');
  won = false;
  clearBoard();
  setGame();
}

if (isInitialSetup) {
  messageStart.classList.add('hidden');
  button.innerText = 'Restart';
  button.classList.replace('start', 'restart');

  setGame();
  isInitialSetup = false;
} else {
  messageWin.classList.add('hidden');
  won = false;
  clearBoard();
  setGame();
}
