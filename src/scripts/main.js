'use strict';

const field = document.querySelector('.game-field');
const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let board;
const columns = 4;
let score = 0;

const filterZero = (row) => {
  return row.filter(num => num !== 0);
};

function compareFields(prevBoard, boards) {
  return JSON.stringify(prevBoard) !== JSON.stringify(boards);
};

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
};

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
      field.rows[r].cells[c].className = '';

      field.rows[r].cells[c].classList.add(
        'field-cell',
        `field-cell--${board[r][c]}`
      );
      field.rows[r].cells[c].textContent = board[r][c] || '';
    }
  }
};

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
};

const transponseField = (currentField) => {
  let transponsedBoard = currentField;

  transponsedBoard = transponsedBoard[0].map(
    (_, colIndex) => transponsedBoard.map(
      row => row[colIndex]
    )
  );

  return transponsedBoard;
};

function slideLeft(transponsedField = board) {
  for (let r = 0; r < columns; r++) {
    let row = transponsedField[r];

    row = slide(row);
    transponsedField[r] = row;
  };
};

function slideRight(transponsedField = board) {
  for (let r = 0; r < columns; r++) {
    let row = transponsedField[r].reverse();

    row = slide(row);
    transponsedField[r] = row.reverse();
  };
};

function slideDown() {
  const newField = transponseField(board);

  slideRight(newField);

  board = transponseField(newField);
};

function slideUp() {
  const newField = transponseField(board);

  slideLeft(newField);

  board = transponseField(newField);
};

const winGame = () => {
  for (let i = 0; i < board[0].length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j] === 2048) {
        return true;
      }
    }
  }
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

  const newDesk = transponseField(boardToCheck);

  if (checkFields(newDesk) || checkFields(boardToCheck)) {
    return false;
  };

  return true;
};

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  };

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  scoreElement.textContent = score;

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
    const prevBoard = JSON.parse(JSON.stringify(board));

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
    }

    renderField();
  }

  scoreElement.textContent = score;
});
