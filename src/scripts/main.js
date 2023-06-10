'use strict'

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLoose = document.querySelector('.message-lose');

const button = document.querySelector('.button');

const gameScore = document.querySelector('.game-score');

const boardRows = document.querySelectorAll('.field-row');

let score = 0;
let gameBoard = boardInit();

function boardInit() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function resetGame() {
  gameBoard = boardInit();
  score = 0;
  messageLoose.classList = 'message message-lose hidden';
  messageWin.classList = 'message message-win hidden';
}

function renderGameBoard() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      boardRows[row].children[col].innerText
        = gameBoard[row][col] ? gameBoard[row][col] : '';

      boardRows[row].children[col].className
        = `field-cell field-cell--${gameBoard[row][col]}`;
    }
  }
  gameScore.innerText = score;
}

function setRandomCell() {
  const [x, y] = [
    getRandomNumber(),
    getRandomNumber(),
  ];

  if (!gameBoard[x][y]) {
    gameBoard[x][y] = Math.random() >= 0.9 ? 4 : 2;
    gameCheck();
  } else {
    setRandomCell();
  }
}

function getRandomNumber() {
  return Math.floor(Math.random() * 4);
}

function gameCheck() {
  const findNull = gameBoard.flat().some(cel => cel === 0);
  const gameBoardCopy = gameBoard.flat();

  if (gameBoardCopy.includes(2048)) {
    document.removeEventListener('keyup', keyPress);
    messageWin.classList = 'message message-win';
  }

  let gameStatus = true;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (gameBoard[row][col] === gameBoard[row][col + 1]
        || gameBoard[col][row] === gameBoard[col + 1][row]) {
        gameStatus = false;
      }
    }
  }

  if (!findNull && gameStatus) {
    messageLoose.classList = 'message message-lose';
    document.removeEventListener('keyup', keyPress);
  }
}

function startGame() {
  if (button.innerText === 'Start') {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.hidden = true;
  } else {
    resetGame();
  }

  setRandomCell();
  setRandomCell();

  renderGameBoard();
  document.addEventListener('keyup', keyPress);
}

function rotateBoard() {
  gameBoard = gameBoard.map((_, colIndex) =>
    gameBoard.map(row => row[colIndex]));
}

function moveLeft(arr) {
  for (let row = 0; row < 4; row++) {
    const notNull = arr[row].filter(ceil => ceil > 0);
    const nulls = Array(4 - notNull.length).fill(0);

    arr[row] = [...notNull, ...nulls];
  }

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      if (arr[row][col] === arr[row][col + 1] && arr[row][col] !== 0) {
        arr[row][col] *= 2;
        score += arr[row][col];
        arr[row][col + 1] = 0;
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
    for (let col = 3; col > 0; col--) {
      if (arr[row][col] === arr[row][col - 1] && arr[row][col] !== 0) {
        arr[row][col] *= 2;
        score += arr[row][col];
        arr[row][col - 1] = 0;
      }
    }
  }
}

function keyPress(keypress) {
  switch (keypress.key) {
    case 'ArrowLeft':
      moveLeft(gameBoard);
      setRandomCell();
      renderGameBoard();
      break;

    case 'ArrowUp':
      rotateBoard();
      moveLeft(gameBoard);
      rotateBoard();
      setRandomCell();
      renderGameBoard();
      break;

    case 'ArrowRight':
      moveRight(gameBoard);
      setRandomCell();
      renderGameBoard();
      break;

    case 'ArrowDown':
      rotateBoard();
      moveRight(gameBoard);
      rotateBoard();
      setRandomCell();
      renderGameBoard();
      break;

    default:
      break;
  }
}

button.addEventListener('click', startGame);
