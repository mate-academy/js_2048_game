'use strict';

const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const scoreText = document.querySelector('.game-score');
const field = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const BOARD_SIZE = 4;
const INITIAL_CELL_VALUE = 2;
const WINNING_NUMBER = 2048;

let board;
let score = 0;

const filterZero = (row) => {
  return row.filter(num => num !== 0);
};

const compareFields = (prevBoard, boards) => {
  return JSON.stringify(prevBoard) !== JSON.stringify(boards);
};

const slide = (row) => {
  const newRow = filterZero(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow.splice(i + 1, 1);
      score += newRow[i];
    }
  }

  while (newRow.length < BOARD_SIZE) {
    newRow.push(0);
  }

  return newRow;
};

const hasEmptyCell = () => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
};

const renderField = () => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      field.rows[r].cells[c].className = '';

      field.rows[r].cells[c].classList.add(
        'field-cell',
        `field-cell--${board[r][c]}`
      );
      field.rows[r].cells[c].textContent = board[r][c] || '';
    }
  }
};

const spawnRandomCell = () => {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const randomRowIndex = Math.floor(Math.random() * BOARD_SIZE);
    const randomColIndex = Math.floor(Math.random() * BOARD_SIZE);

    if (board[randomRowIndex][randomColIndex] === 0) {
      board[randomRowIndex][randomColIndex] = INITIAL_CELL_VALUE;
      renderField();

      found = true;
    }
  }
};

const transposeField = (currentField) => {
  let transposedBoard = currentField;

  transposedBoard = transposedBoard[0].map(
    (_, colIndex) => transposedBoard.map(
      row => row[colIndex]
    )
  );

  return transposedBoard;
};

const moveLeft = (transposedField = board) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    let row = transposedField[r];

    row = slide(row);
    transposedField[r] = row;
  }
};

const moveRight = (transposedField = board) => {
  for (let r = 0; r < BOARD_SIZE; r++) {
    let row = transposedField[r].reverse();

    row = slide(row);
    transposedField[r] = row.reverse();
  }
};

const moveUp = () => {
  const newField = transposeField(board);

  moveLeft(newField);

  board = transposeField(newField);
};

const moveDown = () => {
  const newField = transposeField(board);

  moveRight(newField);

  board = transposeField(newField);
};

const winGame = () => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === WINNING_NUMBER) {
        return true;
      }
    }
  }
};

const checkFields = (fieldToCheck) => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE - 1; j++) {
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

  if (checkFields(boardToCheck) || checkFields(newDesk)) {
    return false;
  }

  return true;
};

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else {
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));

  score = 0;
  scoreText.textContent = score;

  spawnRandomCell();
  spawnRandomCell();
});

document.addEventListener('keydown', (e) => {
  if (gameOver(board)) {
    loseMessage.classList.remove('hidden');
  }

  if (winGame()) {
    winMessage.classList.remove('hidden');

    board = Array.from(
      { length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => {
        return Math.random() < 0.9 ? 2 : 4;
      }));

    renderField();
  } else {
    const prevBoard = JSON.parse(JSON.stringify(board));

    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        break;

      case 'ArrowRight':
        moveRight();
        break;

      case 'ArrowUp':
        moveUp();
        break;

      case 'ArrowDown':
        moveDown();
        break;
    }

    if (compareFields(prevBoard, board)) {
      spawnRandomCell();
    }

    renderField();
  }

  scoreText.textContent = score;
});
