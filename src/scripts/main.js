'use strict';

const gameSize = 4;
const startBtn = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const scoreField = document.querySelector('.game-score');
let score = 0;
let direction;
let gameSquare = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],

];

startBtn.addEventListener('click', () => {
  newGame();

  if (startBtn.innerText === 'Start') {
    startBtn.innerText = 'Restart';
    startBtn.classList.replace('start', 'restart');
  }

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
});

function generateNewNumber() {
  const randomRow = Math.floor(Math.random() * gameSize);
  const randomCell = Math.floor(Math.random() * gameSize);

  if (gameSquare[randomRow][randomCell] === 0) {
    gameSquare[randomRow][randomCell] = Math.random() > 0.1 ? 2 : 4;
  } else {
    generateNewNumber();
  }
}

function fillGameField() {
  const gameBoard = document.querySelector('.game-field');
  const rows = [...gameBoard.rows];
  const gameBoardCells = [];

  for (const a of rows) {
    gameBoardCells.push([...a.cells]);
  }

  for (let row = 0; row < gameSize; row++) {
    for (let column = 0; column < gameSize; column++) {
      const gameValue = gameBoardCells[row][column];
      const arrayValue = gameSquare[row][column];

      gameValue.innerText = arrayValue === 0 ? '' : arrayValue;
      gameValue.classList.value = '';

      gameValue.classList.add(
        'field-cell',
        `field-cell--${gameValue.innerText}`
      );
    }
  }
}

function newGame() {
  gameSquare = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;
  scoreField.innerText = score;
  generateNewNumber();
  generateNewNumber();

  fillGameField();
  fillGameField();
}

document.addEventListener('keydown', (e) => {
  const pressedKey = e.code;
  const isZeroAvailable
  = gameSquare.every((row) => row.every((el) => el !== 0));
  const newBoard = JSON.parse(JSON.stringify(gameSquare));

  switch (pressedKey) {
    case 'ArrowRight':
      moveRowsRight();
      break;

    case 'ArrowLeft':
      moveRowsLeft();
      break;

    case 'ArrowUp':
      moveRowsUp();
      break;

    case 'ArrowDown':
      moveRowsDown();
      break;
  }

  if (!isZeroAvailable && compareGameBoards(gameSquare, newBoard)) {
    generateNewNumber();
  }

  fillGameField();

  if (isGameOver()) {
    loseMessage.classList.remove('hidden');
  };

  isGameWon();
});

function compareGameBoards(prevBoardGame, currentBoardGame) {
  for (let r = 0; r < gameSize; r++) {
    for (let c = 0; c < gameSize; c++) {
      if (prevBoardGame[r][c] !== currentBoardGame[r][c]) {
        return true;
      }
    }
  }

  return false;
}

function moveCellsLeft(array) {
  function removeZeros(collection) {
    return collection.filter((item) => item !== 0);
  }

  let copy = [...array];

  copy = removeZeros(copy);

  for (let i = 0; i < copy.length - 1; i++) {
    if (copy[i] === copy[i + 1]) {
      copy[i] *= 2;
      copy[i + 1] = 0;
      score += copy[i];
      scoreField.innerText = score;
    }
  }

  copy = removeZeros(copy);

  while (copy.length < gameSize) {
    copy.push(0);
  }

  return copy;
}

function moveRowsLeft() {
  for (let i = 0; i < gameSize; i++) {
    gameSquare[i] = moveCellsLeft(gameSquare[i], gameSize);
  }

  return gameSquare;
}

function moveRowsRight() {
  for (let i = 0; i < gameSize; i++) {
    gameSquare[i].reverse();
    gameSquare[i] = moveCellsLeft(gameSquare[i], gameSize);
    gameSquare[i].reverse();
  }

  return gameSquare;
}

function moveVertically() {
  for (let i = 0; i < gameSize; i++) {
    let newRow = [gameSquare[0][i],
      gameSquare[1][i],
      gameSquare[2][i],
      gameSquare[3][i]];

    if (direction === 'up') {
      newRow = moveCellsLeft(newRow, gameSize);
    } else if (direction === 'down') {
      newRow.reverse();
      newRow = moveCellsLeft(newRow, gameSize);
      newRow.reverse();
    }
    gameSquare[0][i] = newRow[0];
    gameSquare[1][i] = newRow[1];
    gameSquare[2][i] = newRow[2];
    gameSquare[3][i] = newRow[3];
  };

  return gameSquare;
}

function moveRowsUp() {
  direction = 'up';
  moveVertically();
}

function moveRowsDown() {
  direction = 'down';
  moveVertically();
}

function isGameOver() {
  for (let row = 0; row < gameSquare.length; row++) {
    for (let col = 0; col < gameSquare.length; col++) {
      if (gameSquare[row][col] === 0) {
        return false;
      }
    }
  }

  for (let row = 0; row < gameSize; row++) {
    for (let col = 0; col < gameSize - 1; col++) {
      if (gameSquare[row][col] === gameSquare[row][col + 1]
        || gameSquare[col][row] === gameSquare[col + 1][row]) {
        return false;
      }
    }
  }

  return true;
}

function isGameWon() {
  for (const row of gameSquare) {
    for (let cell = 0; cell < gameSize; cell++) {
      if (row[cell] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}
