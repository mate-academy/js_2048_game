'use strict';

const gameField = document.body.querySelector('.game-field');
const startButton = document.body.querySelector('.button', '.start');
const startMessage = document.body.querySelector('.message-start');
const scoreMessage = document.body.querySelector('.game-score');
const winMessage = document.body.querySelector('.message-win');
const loseMessage = document.body.querySelector('.message-lose');

const size = 4;
let score = 0;
let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createRandomCell() {
  const randomRow = getRandomInt(size);
  const randomCell = getRandomInt(size);
  const probability = 10;
  const value = (getRandomInt(100) <= probability) ? 4 : 2;

  if (board[randomRow][randomCell] === 0) {
    board[randomRow][randomCell] = value;
  } else {
    createRandomCell();
  }
}

function reset() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

function isWin() {
  if (board.some((arr) => arr.some((cell) => cell === 2048))) {
    winMessage.classList.remove('hidden');
  }
}

function isLose() {
  if (haveSpace()) {
    return false;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        return false;
      }
    }
  }

  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size - 1; r++) {
      if (board[r][c] === board[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
}

function lose() {
  loseMessage.classList.remove('hidden');
}

function haveSpace() {
  for (let r = 0; r < size; r++) {
    if (board[r].includes(0)) {
      return true;
    }
  }

  return false;
}

function renderCells() {
  for (let row = 0; row < size; row++) {
    for (let cell = 0; cell < size; cell++) {
      const currentCell = gameField.rows[row].cells[cell];

      currentCell.innerHTML = '';
      currentCell.className = 'field-cell';

      if (board[row][cell] > 0) {
        currentCell.innerHTML = `${board[row][cell]}`;
        currentCell.classList.add(`field-cell--${board[row][cell]}`);
      }
    }
  }
};

function slide(array) {
  const newArray = array.filter((element) => {
    return element !== 0;
  });

  for (let i = 0; i < newArray.length - 1; i++) {
    if (newArray[i] === newArray[i + 1]) {
      newArray[i] *= 2;
      newArray[i + 1] = 0;
      score += newArray[i];
    }
  }

  const filteredArray = newArray.filter((element) => {
    return element !== 0;
  });

  const zeros = Array(array.length - filteredArray.length).fill(0);
  const finalArray = filteredArray.concat(zeros);

  return finalArray;
};

startButton.addEventListener('click', () => {
  reset();

  startMessage.classList.add('hidden');
  startButton.classList.replace('start', 'restart');
  startButton.innerHTML = 'restart';

  createRandomCell();
  createRandomCell();
  renderCells();
});

function hasChanged(cur, prev) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (cur[row][col] !== prev[row][col]) {
        return true;
      }
    }
  }

  return false;
}

function slideUp() {
  for (let c = 0; c < size; c++) {
    const column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const newColumn = slide(column);

    updateColumn(c, newColumn);
  }
}

function slideDown() {
  for (let c = 0; c < size; c++) {
    const column = [board[3][c], board[2][c], board[1][c], board[0][c]];
    const newColumn = slide(column).reverse();

    updateColumn(c, newColumn);
  }
}

function slideLeft() {
  for (let r = 0; r < size; r++) {
    const row = board[r];
    const newRow = slide(row);

    board[r] = newRow;
  }
}

function slideRight() {
  for (let r = 0; r < size; r++) {
    const row = board[r];

    if (slide(row) === row.reverse()) {
      return;
    }

    const newRow = slide(row).reverse();

    board[r] = newRow;
  }
}

function updateColumn(cell, newCell) {
  for (let row = 0; row < size; row++) {
    board[row][cell] = newCell[row];
  }
}

document.addEventListener('keydown', (e) => {
  const copyBoard = board.map((arr) => [...arr]);

  e.preventDefault();

  switch (e.code) {
    case 'KeyW':
      slideUp();
      break;

    case 'KeyS':
      slideDown();
      break;

    case 'KeyA':
      slideLeft();
      break;

    case 'KeyD':
      slideRight();
      break;
  }

  isWin();

  if (isLose()) {
    lose();
  }

  if (hasChanged(board, copyBoard)) {
    createRandomCell();
  };

  renderCells();
  scoreMessage.innerHTML = score.toString();
});
