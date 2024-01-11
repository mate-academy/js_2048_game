'use strict';

const gameField = document.querySelector('tbody');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const message = document.querySelectorAll('.message');

const cellsInRow = 4;
let scoreCount = 0;
let board;
let previousState;

button.onclick = () => {
  button.classList.replace('start', 'restart');
  button.innerText = 'Restart';

  for (const text of message) {
    text.classList.add('hidden');
  }

  startGame();
};

function randomPlace() {
  while (checkEmptyPlace()) {
    const randomRowIdx = getRandomNum();
    const randomColumnIdx = getRandomNum();

    if (board[randomRowIdx][randomColumnIdx] === 0) {
      const number = getRandomValue();

      board[randomRowIdx][randomColumnIdx] = number;
      break;
    }
  }

  setValue();
};

function checkEmptyPlace() {
  for (let i = 0; i < cellsInRow; i++) {
    if (board[i].includes(0)) {
      return true;
    }
  }

  return false;
};

function startGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  previousState = board.map(arr => [...arr]);

  scoreCount = 0;
  gameScore.innerText = scoreCount;

  randomPlace();
  randomPlace();
};

function getRandomNum() {
  return Math.floor(Math.random() * cellsInRow);
};

function getRandomValue() {
  return Math.random() > 0.9 ? 4 : 2;
};

function setValue() {
  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow; j++) {
      const htmlCell = gameField.rows[i].cells[j];
      const jsCell = board[i][j];

      htmlCell.innerText = '';
      htmlCell.classList.value = 'field-cell';

      if (jsCell > 0) {
        htmlCell.innerText = jsCell;
        htmlCell.classList.add(`field-cell--${jsCell}`);
      }

      if (jsCell === 2048) {
        messageWin.classList.remove('hidden');
        button.classList.replace('restart', 'start');
        button.innerText = 'Start';
      }
    }
  };

  if (isLose()) {
    messageLose.classList.remove('hidden');
  }
}

function move(array) {
  let check = 0;
  let newArray = array.filter(num => num !== 0);

  for (let i = 0; i < newArray.length - 1; i++) {
    if (newArray[i] === newArray[i + 1]) {
      check++;
      newArray[i] *= 2;
      newArray[i + 1] = 0;
      scoreCount += newArray[i];
      gameScore.innerText = scoreCount;
    }
  }

  newArray = newArray.filter(num => num !== 0);

  while (newArray.length < cellsInRow) {
    newArray.push(0);
  }

  if (check === 0 && !checkEmptyPlace(array)) {
    return array;
  }

  return newArray;
};

function arraysEqual(a, b) {
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function moveLeft() {
  for (let i = 0; i < cellsInRow; i++) {
    let array = board[i];

    array = move(array);
    board[i] = array;
  }

  if (!arraysEqual(previousState, board)) {
    randomPlace();
    previousState = board.map(arr => [...arr]);
  }
}

function moveRight() {
  for (let i = 0; i < cellsInRow; i++) {
    let array = board[i].reverse();

    array = move(array).reverse();
    board[i] = array;
  }

  if (!arraysEqual(previousState, board)) {
    randomPlace();
    previousState = board.map(arr => [...arr]);
  }
};

function moveUp() {
  for (let i = 0; i < cellsInRow; i++) {
    let array = [board[0][i], board[1][i], board[2][i], board[3][i]];

    array = move(array);

    for (let j = 0; j < cellsInRow; j++) {
      board[j][i] = array[j];
    }
  }

  if (!arraysEqual(previousState, board)) {
    randomPlace();
    previousState = board.map(arr => [...arr]);
  }
}

function moveDown() {
  for (let i = 0; i < cellsInRow; i++) {
    let array = [board[0][i], board[1][i], board[2][i], board[3][i]].reverse();

    array = move(array).reverse();

    for (let j = 0; j < cellsInRow; j++) {
      board[j][i] = array[j];
    }
  }

  if (!arraysEqual(previousState, board)) {
    randomPlace();
    previousState = board.map(arr => [...arr]);
  }
}

function isLose() {
  if (checkEmptyPlace()) {
    return false;
  }

  for (let i = 0; i < cellsInRow; i++) {
    for (let j = 0; j < cellsInRow - 1; j++) {
      if (board[i][j] === board[i][j + 1] || board[j][i] === board[j + 1][i]) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keydown', function(e) {
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
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];

  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      moveLeft();
    } else {
      moveRight();
    }
  } else {
    if (yDiff > 0) {
      moveUp();
    } else {
      moveDown();
    }
  }

  xDown = null;
  yDown = null;
}
