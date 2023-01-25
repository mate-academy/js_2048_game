'use strict';

const gameSize = 4;
const startBtn = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
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

  // const btn = e.target;
  // console.log(startBtn.innerText);

  if (startBtn.innerText === 'Start') {
    // console.log('true');
    startBtn.innerText = 'Restart';
    startBtn.classList.replace('start', 'restart');
  } else if (startBtn.textContent === 'Restart') {
    startBtn.innerText = 'Start';
    startBtn.classList.replace('restart', 'start');
  }

  // startBtn.classList.toggle('')

  // if (startBtn.textContent === 'Restart') {
  // startBtn.innerText = 'Start';
  // startBtn.classList.replace('restart', 'start');
  // }

  // btn.innerText = 'Restart';
  // btn.classList.replace('start', 'restart');
  startMessage.classList.add('hidden');
});

function generateNewNumber() {
  let randomRow;
  let randomCell;

  do {
    randomRow = Math.floor(Math.random() * gameSize);
    randomCell = Math.floor(Math.random() * gameSize);

    if (gameSquare[randomRow][randomCell] === 0) {
      gameSquare[randomRow][randomCell] = Math.random() > 0.1 ? 2 : 4;
      break;
    }
  } while (true);
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
}

document.addEventListener('keydown', (e) => {
  const pressedKey = e.code;

  switch (pressedKey) {
    case 'ArrowRight':
      moveRowsRight();
      // fillGameField();
      // generateNewNumber();
      break;
    case 'ArrowLeft':
      moveRowsLeft();
      // generateNewNumber();
      break;
    case 'ArrowUp':
      moveRowsUp();
      break;
    case 'ArrowDown':
      moveRowsDown();
      break;
    // default:
      // return;
  }

  isGameOver();

  if (isGameWon()) {
    //console.log('won');
  }

// console.log('hello');
});

function moveCellsLeft(array) {
  function removeZeros(collection) {
    return collection.filter((item) => item !== 0);
  }

  array = removeZeros(array);

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] === array[i + 1]) {
      array[i] *= 2;
      array[i + 1] = 0;
      score += array[i];
      scoreField.innerText = score;
    }
  }

  array = removeZeros(array);

  while (array.length < gameSize) {
    array.push(0);
  }

  return array;
}

function moveRowsLeft() {
  for (let i = 0; i < gameSize; i++) {
    gameSquare[i] = moveCellsLeft(gameSquare[i], gameSize);

    // fillGameField();
  }

  generateNewNumber();
  fillGameField();

  return gameSquare;
}

function moveRowsRight() {
  for (let i = 0; i < gameSize; i++) {
    gameSquare[i].reverse();
    gameSquare[i] = moveCellsLeft(gameSquare[i], gameSize);
    gameSquare[i].reverse();

    // fillGameField();
  }

  generateNewNumber();
  fillGameField();

  return gameSquare;
}

function moveRowsUp() {
  for (let i = 0; i < gameSize; i++) {
    let newRow = [gameSquare[0][i], gameSquare[1][i], gameSquare[2][i], gameSquare[3][i]];

    newRow = moveCellsLeft(newRow, gameSize);

    gameSquare[0][i] = newRow[0];
    gameSquare[1][i] = newRow[1];
    gameSquare[2][i] = newRow[2];
    gameSquare[3][i] = newRow[3];

    // fillGameField();
  };

  generateNewNumber();
  fillGameField();

  return gameSquare;
}

function moveRowsDown() {
  for (let i = 0; i < gameSize; i++) {
    let newRow = [gameSquare[0][i], gameSquare[1][i], gameSquare[2][i], gameSquare[3][i]];

    newRow.reverse();
    newRow = moveCellsLeft(newRow, gameSize);
    newRow.reverse();

    gameSquare[0][i] = newRow[0];
    gameSquare[1][i] = newRow[1];
    gameSquare[2][i] = newRow[2];
    gameSquare[3][i] = newRow[3];

    // fillGameField();
  };

  generateNewNumber();
  fillGameField();

  return gameSquare;
}

function isGameOver() {
  // console.log('hello')

  for (let row = 0; row < gameSquare.length; row++) {
    for (let col = 0; col < gameSquare.length; col++) {
      if (gameSquare[row][col] === 0) {
        return;
      }
    }
  }

  // console.log('hello')

  for (let row = 0; row < gameSquare.length - 1; row++) {
    for (let col = 0; col < gameSquare.length - 1; col++) {
      const cell = gameSquare[row][col];

      if (cell === gameSquare[row + 1][col] || cell === gameSquare[row][col + 1]) {
        return;
      }
    }
  }
  loseMessage.classList.remove('hidden');
  // return true;
}

function isGameWon() {
  for (const row of gameSquare) {
    return row.some(item => item.innerText === 2048);
  }
}
