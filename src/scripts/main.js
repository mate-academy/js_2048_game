'use strict';

const startButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let board;
const columns = 4;
const rows = 4;
let score = 0;

const filterZero = (row) => row.filter(num => num !== 0);

function compareFields(prevBoard, currentBoard) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (prevBoard[i][j] !== currentBoard[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function slide(row) {
  const currentRow = filterZero(row);

  for (let i = 0; i < currentRow.length - 1; i++) {
    if (currentRow[i] === currentRow[i + 1]) {
      currentRow[i] *= 2;
      currentRow.splice(i + 1, 1);
      score += currentRow[i];
    }
  }

  while (currentRow.length < columns) {
    currentRow.push(0);
  }

  return currentRow;
}

const hasEmptyCell = () => {
  for (let r = 0; r < columns; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
};

function renderField() {
  for (let r = 0; r < columns; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = gameField.rows[r].cells[c];

      cell.className = `field-cell field-cell--${board[r][c]}`;
      cell.textContent = board[r][c] || '';
    }
  }
}

function setRandomCell() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * columns);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;
      renderField();
      found = true;
    }
  }
}

const transposeField = (currentField) => currentField[0]
  .map((_, colIndex) => currentField
    .map(row => row[colIndex]));

function slideLeft(transposedField = board) {
  for (let r = 0; r < columns; r++) {
    let row = transposedField[r];

    row = slide(row);
    transposedField[r] = row;
  }
}

function slideRight(transposedField = board) {
  for (let r = 0; r < columns; r++) {
    let row = transposedField[r].reverse();

    row = slide(row);
    transposedField[r] = row.reverse();
  }
}

function slideDown() {
  const newField = transposeField(board);

  slideRight(newField);
  board = transposeField(newField);
}

function slideUp() {
  const newField = transposeField(board);

  slideLeft(newField);
  board = transposeField(newField);
}

const winGame = () => {
  for (let i = 0; i < board[0].length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
};

const checkFields = (fieldToCheck) => {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < columns - 1; j++) {
      if (fieldToCheck[i][j] === fieldToCheck[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
};

const gameOver = (boardToCheck) => {
  if (hasEmptyCell()) {
    return false;
  }

  const newDesk = transposeField(boardToCheck);

  if (checkFields(newDesk) || checkFields(boardToCheck)) {
    return false;
  }

  return true;
};

startButton.addEventListener('click', () => {
  startButton.classList.toggle('start', false);
  startButton.classList.toggle('restart', true);
  startButton.innerText = 'Restart';

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.add('hidden');

  board = Array.from({ length: columns }, () => Array(columns).fill(0));

  score = 0;
  gameScore.textContent = score;

  setRandomCell();
  setRandomCell();
});

document.addEventListener('keydown', (e) => {
  if (gameOver(board)) {
    messageLose.classList.remove('hidden');
  }

  if (winGame()) {
    messageWin.classList.remove('hidden');
    renderField();
  } else {
    const prevBoard = deepCloneBoard(board);

    switch (e.key) {
      case 'ArrowLeft':
        slideLeft();
        break;

      case 'ArrowRight':
        slideRight();
        break;

      case 'ArrowDown':
        slideDown();
        break;

      case 'ArrowUp':
        slideUp();
        break;
    }

    if (compareFields(prevBoard, board)) {
      setRandomCell();
      renderField();
    }
  }

  gameScore.textContent = score;
});

function deepCloneBoard(newBoard) {
  return newBoard.map(row => [...row]);
}
