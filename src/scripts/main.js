'use strict';

const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const fieldRow = document.querySelectorAll('.field-row');

let score = 0;
let board = initBoard();

function initBoard() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
};

button.addEventListener('click', startGame);

function gameReset() {
  board = initBoard();
  score = 0;
  messageLose.classList = 'message message-lose hidden';
  messageWin.classList = 'message message-win hidden';
};

function renderGameBoard() {
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      fieldRow[row].children[column].textContent
      = board[row][column] ? board[row][column] : '';

      fieldRow[row].children[column].className
      = `field-cell field-cell--${board[row][column]}`;
    }
  }

  gameScore.textContent = score;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 4);
}

function setRandomCell() {
  const [x, y] = [
    getRandomNumber(),
    getRandomNumber(),
  ];

  if (!board[x][y]) {
    board[x][y] = Math.random() >= 0.9 ? 4 : 2;
    gameCheck();
  } else {
    setRandomCell();
  }
}

function gameCheck() {
  const findNull = board.flat().some(cell => cell === 0);
  const boardCopy = board.flat();

  if (boardCopy.includes(2048)) {
    document.removeEventListener('keyup', keyPress);
    messageWin.classList = 'message message-win';
  }

  let gameStatus = true;

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 3; column++) {
      if (board[row][column] === board[row][column + 1]
          || board[column][row] === board[column][row + 1]) {
        gameStatus = false;
      }
    }
  }

  if (!findNull && gameStatus) {
    messageLose.classList = 'message message-lose';
    document.removeEventListener('keyup', keyPress);
  }
}

function startGame() {
  if (button.textContent === 'Start') {
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
    messageStart.hidden = true;
  } else {
    gameReset();
  }

  setRandomCell();
  setRandomCell();
  renderGameBoard();
  document.addEventListener('keyup', keyPress);
}

function rotateBoard() {
  board = board.map((_, columnIndex) =>
    board.map(row => row[columnIndex]));
}

function moveLeft(arr) {
  for (let row = 0; row < 4; row++) {
    const notNull = arr[row].filter(ceil => ceil > 0);
    const nulls = Array(4 - notNull.length).fill(0);

    arr[row] = [...notNull, ...nulls];
  }

  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 3; column++) {
      if (arr[row][column] === arr[row][column + 1] && arr[row][column] !== 0) {
        arr[row][column] *= 2;
        score += arr[row][column];
        arr[row][column + 1] = 0;
      }
    }
  }
}

function moveRight(arr) {
  for (let row = 0; row < 4; row++) {
    const notNull = arr[row].filter(ceil => ceil > 0);
    const nulls = Array(4 - notNull.length).fill(0);

    arr[row] = [...nulls, ...notNull];
  }

  for (let row = 0; row < 4; row++) {
    for (let column = 3; column > 0; column--) {
      if (arr[row][column] === arr[row][column - 1] && arr[row][column] !== 0) {
        arr[row][column] *= 2;
        score += arr[row][column];
        arr[row][column - 1] = 0;
      }
    }
  }
}

function keyPress(keypress) {
  switch (keypress.key) {
    case 'ArrowLeft':
      moveLeft(board);
      setRandomCell();
      renderGameBoard();
      break;

    case 'ArrowUp':
      rotateBoard();
      moveLeft(board);
      rotateBoard();
      setRandomCell();
      renderGameBoard();
      break;

    case 'ArrowRight':
      moveRight(board);
      setRandomCell();
      renderGameBoard();
      break;

    case 'ArrowDown':
      rotateBoard();
      moveRight(board);
      rotateBoard();
      setRandomCell();
      renderGameBoard();
      break;

    default:
      break;
  }
}
