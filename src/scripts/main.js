'use strict';

const gameSize = 4;
const startBtn = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const scoreField = document.querySelector('.game-score');
let score = 0;
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
  const e = [];

  for (const a of rows) {
    e.push([...a.cells]);
  }

  for (let i = 0; i < gameSize; i++) {
    for (let x = 0; x < gameSize; x++) {
      const gameValue = e[i][x];
      const arrayValue = gameSquare[i][x];

      gameValue.innerText = arrayValue === 0 ? '' : arrayValue;
      gameValue.classList.value = '';

      gameValue.classList.add('field-cell',
        `field-cell--${gameValue.innerText}`);
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
  fillGameField();
}

document.addEventListener('keydown', (e) => {
  const pressedKey = e.code;

  switch (pressedKey) {
    case 'ArrowRight':
      moveRowsRight();
      generateNewNumber();
      break;
    case 'ArrowLeft':
      moveRowsLeft();
      generateNewNumber();
      break;
    case 'ArrowUp':
      moveRowsUp();
      generateNewNumber();
      break;
    case 'ArrowDown':
      moveRowsDown();
      generateNewNumber();
      break;
  }

  fillGameField();

  if (isGameOver()) {
    loseMessage.classList.remove('hidden');
  };

  isGameWon();
});

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

function moveRowsUp() {
  for (let i = 0; i < gameSize; i++) {
    let newRow = [gameSquare[0][i],
      gameSquare[1][i],
      gameSquare[2][i],
      gameSquare[3][i]];

    newRow = moveCellsLeft(newRow, gameSize);

    gameSquare[0][i] = newRow[0];
    gameSquare[1][i] = newRow[1];
    gameSquare[2][i] = newRow[2];
    gameSquare[3][i] = newRow[3];
  };

  return gameSquare;
}

function moveRowsDown() {
  for (let i = 0; i < gameSize; i++) {
    let newRow = [gameSquare[0][i],
      gameSquare[1][i],
      gameSquare[2][i],
      gameSquare[3][i]];

    newRow.reverse();
    newRow = moveCellsLeft(newRow, gameSize);
    newRow.reverse();

    gameSquare[0][i] = newRow[0];
    gameSquare[1][i] = newRow[1];
    gameSquare[2][i] = newRow[2];
    gameSquare[3][i] = newRow[3];
  };

  return gameSquare;
}

function isGameOver() {
  for (let row = 0; row < gameSquare.length; row++) {
    for (let col = 0; col < gameSquare.length; col++) {
      if (gameSquare[row][col] === 0) {
        return false;
      }
    }
  }

  for (let row = 0; row < gameSize - 1; row++) {
    for (let col = 0; col < gameSize - 1; col++) {
      const cell = gameSquare[row][col];

      if (cell === gameSquare[row + 1][col]
        || cell === gameSquare[row][col + 1]) {
        return false;
      }
    }
  }

  return true;
}

function isGameWon() {
  for (const row of gameSquare) {
    for (let i = 0; i < gameSize; i++) {
      if (row[i] === 2048) {
        winMessage.classList.remove('hidden');
      }
    }
  }
}
