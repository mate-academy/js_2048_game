'use strict';

const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const rows = 4;
const columns = 4;
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';
  messageStart.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  startGame();
});

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  addRandomNumber();
  addRandomNumber();
  updateCells();
}

function addRandomNumber() {
  const number = Math.random() < 0.9 ? 2 : 4;

  while (hasSpace()) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = number;
      break;
    }
  }

  updateCells();
}

function hasSpace() {
  for (let r = 0; r < rows; r++) {
    if (board[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function updateCells() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = gameField.rows[r].cells[c];
      const number = board[r][c];

      cell.innerText = '';
      cell.className = 'field-cell';

      if (number > 0) {
        cell.innerText = number;
        cell.classList.add(`field-cell--${number}`);
      }
    }
  }

  isWin();
  updateScore();

  if (isLost()) {
    loseMessage.classList.remove('hidden');
  }
}

function isWin() {
  if (board.some((arr) => arr.some((cell) => cell === 2048))) {
    winMessage.classList.remove('hidden');
  }

  return false;
}

function updateScore() {
  gameScore.innerText = score;
}

function isLost() {
  if (hasSpace()) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function hasChangedBoard(currentBoard, copyBoard) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (currentBoard[r][c] !== copyBoard[r][c]) {
        return true;
      }
    }
  }

  return false;
}

const transponseBoard = (currentBoard) => {
  let transponsedBoard = currentBoard;

  transponsedBoard = transponsedBoard[0].map((_, columnIndex) =>
    transponsedBoard.map((row) => row[columnIndex]),
  );

  return transponsedBoard;
};

const slide = (row) => {
  const newRow = row.filter((num) => num !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }

  const filteredRow = newRow.filter((num) => num !== 0);
  const zerosToAdd = Array(columns - filteredRow.length).fill(0);
  const finalRow = filteredRow.concat(zerosToAdd);

  return finalRow;
};

const slideLeft = (transponsedBoard = board) => {
  for (let r = 0; r < rows; r++) {
    let row = transponsedBoard[r].slice();

    row = slide(row);
    transponsedBoard[r] = row;
  }

  return transponsedBoard;
};

const slideRight = (transponsedBoard = board) => {
  for (let r = 0; r < rows; r++) {
    let row = transponsedBoard[r].slice().reverse();

    row = slide(row);
    transponsedBoard[r] = row.reverse();
  }

  return transponsedBoard;
};

const slideUp = () => {
  const newBoard = transponseBoard(board);

  const updatedBoard = slideLeft(newBoard);

  board = transponseBoard(updatedBoard);
};

const slideDown = () => {
  const newBoard = transponseBoard(board);

  const updatedBoard = slideRight(newBoard);

  board = transponseBoard(updatedBoard);
};

document.addEventListener('keyup', (e) => {
  const copyBoard = board.map((arr) => arr.slice());

  e.preventDefault();

  switch (e.code) {
    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowDown':
      slideDown();
      break;

    case 'ArrowLeft':
      slideLeft();
      break;
  }

  if (hasChangedBoard(board, copyBoard)) {
    addRandomNumber();
  }

  updateCells();
});
