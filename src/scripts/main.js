'use strict';

const startButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

const messages = document.querySelectorAll('.message');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let score = 0;
const BOARD_SIZE = 4;
const SCORE_TO_WIN = 2048;

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startGame();
  }

  [...messages].map(message => message.classList.add('hidden'));

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = 0;
    }
  }

  [...cells].map(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  score = 0;
  gameScore.textContent = score;

  addRandomNumber();
  addRandomNumber();

  renderBoard();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      slideVertical(event.key);
      addRandomNumber();
      renderBoard();
      break;

    case 'ArrowRight':
    case 'ArrowLeft':
      slideHorizontal(event.key);
      addRandomNumber();
      renderBoard();
      break;

    default:
      return;
  }

  if (isWinner()) {
    messageWin.classList.remove('hidden');
  }
});

function startGame() {
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
}

function addRandomNumber() {
  const availableCells = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === 0) {
        availableCells.push({
          x: i,
          y: j,
        });
      }
    }
  }

  const randomNum = Math.random() < 0.9 ? 2 : 4;

  if (availableCells.length) {
    const randomCell
      = availableCells[Math.floor(Math.random() * availableCells.length)];

    board[randomCell.x][randomCell.y] = randomNum;
  }

  if (!availableCells.length && !canBeMerged()) {
    messageLose.classList.remove('hidden');
  }
}

function renderBoard() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = gameField.rows[row].cells[col];

      cell.className = `field-cell field-cell--${board[row][col]}`;
      cell.textContent = board[row][col] || '';
    }
  }
}

function updateScore(value) {
  score += value;
  gameScore.textContent = score;
}

function isWinner() {
  return [...cells].some(cell => {
    return cell.classList.contains(`field-cell--${SCORE_TO_WIN}`);
  });
}

function slideHorizontal(direction) {
  for (let row = 0; row < BOARD_SIZE; row++) {
    let currentRow = board[row];

    if (direction === 'ArrowRight') {
      currentRow.reverse();
    }

    currentRow = slide(currentRow);

    if (direction === 'ArrowRight') {
      currentRow.reverse();
    }

    board[row] = currentRow;
  }
}

function slideVertical(direction) {
  for (let col = 0; col < BOARD_SIZE; col++) {
    let currentRow = [
      board[0][col],
      board[1][col],
      board[2][col],
      board[3][col],
    ];

    if (direction === 'ArrowDown') {
      currentRow.reverse();
    }

    currentRow = slide(currentRow);

    if (direction === 'ArrowDown') {
      currentRow.reverse();
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      board[i][col] = currentRow[i];
    }
  }
}

function slide(row) {
  let filteredRow = removeZeroes(row);

  for (let i = 0; i < filteredRow.length - 1; i++) {
    if (filteredRow[i] === filteredRow[i + 1]) {
      filteredRow[i] *= 2;
      filteredRow[i + 1] = 0;

      updateScore(filteredRow[i]);
    }
  }

  filteredRow = removeZeroes(filteredRow);

  while (filteredRow.length < BOARD_SIZE) {
    filteredRow.push(0);
  }

  return filteredRow;
}

function removeZeroes(rowArray) {
  return rowArray.filter(number => number !== 0);
}

function canBeMerged() {
  let canMerge = false;

  for (let row = 0; row < BOARD_SIZE - 1; row++) {
    for (let col = 0; col < BOARD_SIZE - 1; col++) {
      if ((board[row][col] === board[row + 1][col])
        || (board[row][col] === board[row][col + 1])) {
        canMerge = true;

        return canMerge;
      }
    }
  }

  return canMerge;
}
