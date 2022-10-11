'use strict';

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const rows = 4;
const columns = 4;
const score = document.querySelector('.game-score');
let scoreValue = 0;
let freeCells = board.join(',').split(',').filter(el => el === '0').length;

const startGameButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startGameButton.addEventListener('click', () => {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  scoreValue = 0;

  startGameButton.innerText = 'Restart';
  startGameButton.classList.remove('start');
  startGameButton.classList.add('restart');

  messageStart.classList.add('hidden');

  addNumber();
  addNumber();
  updateCells();

  document.addEventListener('keydown', () => {
    const startCellValues = getValues([...document.querySelectorAll('td')]);

    if (event.key === 'ArrowLeft') {
      for (let r = 0; r < rows; r++) {
        const row = moveLeft(board[r]);

        board[r] = row;
      }
    }

    if (event.key === 'ArrowRight') {
      for (let r = 0; r < rows; r++) {
        const row = moveRight(board[r]);

        board[r] = row;
      }
    }

    if (event.key === 'ArrowUp') {
      const reversedBoard = reverseBoard(board);

      for (let r = 0; r < rows; r++) {
        const row = moveLeft(reversedBoard[r]);

        reversedBoard[r] = row;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          board[c][r] = reversedBoard[r][c];
        }
      }
    }

    if (event.key === 'ArrowDown') {
      const reversedBoard = reverseBoard(board);

      for (let r = 0; r < rows; r++) {
        const row = moveRight(reversedBoard[r]);

        reversedBoard[r] = row;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          board[c][r] = reversedBoard[r][c];
        }
      }
    }

    if (!findMove() && freeCells === 0) {
      messageLose.classList.remove('hidden');
    }

    if (checkDifference(startCellValues, board)) {
      addNumber();
    }

    updateCells();
  });
});

// functions

function addNumber() {
  const r = Math.floor(Math.random() * rows);
  const c = Math.floor(Math.random() * columns);

  if (board[r][c] === 0) {
    board[r][c] = generateNumber();
  } else if (freeCells !== 0) {
    addNumber();

    return;
  }

  freeCells = board.join(',').split(',').filter(el => el === '0').length;
}

function generateNumber() {
  const number = Math.floor(Math.random() * 10);

  if (number === 4) {
    return 4;
  } else {
    return 2;
  }
}

function reverseBoard(originalBoard) {
  const result = [];

  for (let c = 0; c < columns; c++) {
    const row = [];

    for (let r = 0; r < rows; r++) {
      row.push(originalBoard[r][c]);
    }

    result.push(row);
  }

  return result;
}

function checkDifference(first, second) {
  const a = first.join(',');
  const b = second.join(',');

  if (a !== b) {
    return true;
  }

  return false;
}

function getValues(a) {
  return a.map(el => +el.innerText).map(el => el === '' ? 0 : el);
}

function findMove() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return true;
      }
    }
  }

  const reversedBoard = [];

  for (let c = 0; c < columns; c++) {
    const row = [];

    for (let r = 0; r < rows; r++) {
      row.push(board[r][c]);
    }

    reversedBoard.push(row);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (reversedBoard[r][c] === reversedBoard[r][c + 1]) {
        return true;
      }
    }
  }

  return false;
}

function updateCells() {
  const cells = document.querySelectorAll('td');
  const cellValues = board.join(',').split(',');

  if (cellValues.includes('2048')) {
    messageWin.classList.remove('hidden');
  }

  let valueIndex = 0;

  for (const cell of cells) {
    cellValues[valueIndex] === '0' ? 
        cell.innerText = '' : cell.innerText = cellValues[valueIndex];
    valueIndex++;

    cell.classList = '';
    cell.classList.add('field-cell');
    cell.classList.add(`field-cell--${cell.innerText}`);
  }

  score.innerText = scoreValue;
}

function moveLeft(r) {
  let row = r.filter(el => el !== 0);

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] += row[i + 1];
      row[i + 1] = 0;
      scoreValue += row[i];
    }
  }

  row = row.filter(el => el !== 0);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function moveRight(r) {
  let row = r.filter(el => el !== 0);

  row.reverse();

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] += row[i + 1];
      row[i + 1] = 0;
      scoreValue += row[i];
    }
  }

  row = row.filter(el => el !== 0);

  while (row.length < columns) {
    row.push(0);
  }

  row.reverse();

  return row;
}
