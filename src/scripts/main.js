'use strict';

// write your code here

const mainButton = document.querySelector('.start');

const ROW_NUMBER = 4;
const COLUNM_NUMBER = 4;

const BOARD = createBoard();

let score = 0;

setFiledGame();

function setFiledGame() {
  const gameField = document.querySelector('.game-field');
  const tableBody = document.createElement('tbody');

  for (let i = 0; i < ROW_NUMBER; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < COLUNM_NUMBER; j++) {
      const cell = document.createElement('td');

      cell.id = `${i}-${j}`;

      cell.className = 'field-cell';
      row.append(cell);
    }
    tableBody.append(row);
  }
  gameField.append(tableBody);
}

function createBoard() {
  const startField = [];

  for (let i = 0; i < ROW_NUMBER; i++) {
    startField.push([]);

    for (let j = 0; j < COLUNM_NUMBER; j++) {
      startField[i][j] = 0;
    }
  }

  return startField;
}

function renderFiledGame() {
  BOARD.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cell = document.getElementById(`${rowIndex}-${columnIndex}`);

      updateCell(cell, value);
    });
  });
}

function updateCell(cell, value) {
  cell.innerHTML = value === 0 ? '' : value;
  cell.className = 'field-cell';

  if (value !== 0) {
    cell.classList.add(`field-cell--${value}`);
  }
}

mainButton.addEventListener('click', () => {
  if (!mainButton.classList.contains('restart')) {
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.innerHTML = 'Restart';

    switchMessage('start');
  }

  if (GameStatus === 'lose') {
    switchMessage('lose');
  }

  if (GameStatus === 'win') {
    switchMessage('win');
  }

  startGame();
});

function switchMessage(nameMessage) {
  const message = document.querySelector(`.message-${nameMessage}`);

  message.classList.toggle('hidden');
}

function startGame() {
  resetGame();
  addValueToField();
  addValueToField();
  renderFiledGame();
  renderScore();

  document.addEventListener('keydown', keyDownHandler);
}

function resetGame() {
  for (let i = 0; i < ROW_NUMBER; i++) {
    for (let j = 0; j < COLUNM_NUMBER; j++) {
      BOARD[i][j] = 0;
    }
  }

  score = 0;
}

function addValueToField() {
  if (!hasEmptyCells()) {
    return;
  }

  while (true) {
    const randomRow = Math.floor(Math.random() * ROW_NUMBER);
    const randomColunm = Math.floor(Math.random() * COLUNM_NUMBER);

    if (BOARD[randomRow][randomColunm] === 0) {
      BOARD[randomRow][randomColunm] = Math.random() < 0.9 ? 2 : 4;

      break;
    }
  }
}

function keyDownHandler() {
  const keyCode = event.keyCode;

  switch (keyCode) {
    case 40:
      moveDown();
      break;

    case 38:
      moveUp();
      break;

    case 39:
      moveRight();
      break;

    case 37:
      moveLeft();
      break;
  }

  addValueToField();
  renderScore();
  renderFiledGame();

  isWin();
  isLose();
}

function moveUp() {
  for (let col = 0; col < BOARD[0].length; col++) {
    const vector = [];

    for (let row = 0; row < BOARD.length; row++) {
      vector.push(BOARD[row][col]);
    }

    const newVector = slide(vector, BOARD.length);

    for (let row = 0; row < BOARD.length; row++) {
      BOARD[row][col] = newVector[row];
    }
  }
}

function moveDown() {
  for (let col = 0; col < BOARD[0].length; col++) {
    const vector = [];

    for (let row = BOARD.length - 1; row >= 0; row--) {
      vector.push(BOARD[row][col]);
    }

    const newVector = slide(vector, BOARD.length);

    for (let row = BOARD.length - 1; row >= 0; row--) {
      BOARD[row][col] = newVector[BOARD.length - 1 - row];
    }
  }
}

function moveLeft() {
  BOARD.forEach((row, rowIndex) => {
    BOARD[rowIndex] = slide(row, ROW_NUMBER);
  });
}

function moveRight() {
  BOARD.forEach((row, rowIndex) => {
    BOARD[rowIndex] = slide(row.slice().reverse(), ROW_NUMBER).reverse();
  });
}

function slide(vectorCurrent, vectorLength) {
  let vector = vectorCurrent.filter(value => value !== 0);

  for (let i = 0; i < vector.length - 1; i++) {
    if (vector[i] === vector[i + 1]) {
      vector[i] *= 2;
      vector[i + 1] = 0;

      score += vector[i];
    }
  }

  vector = vector.filter(value => value !== 0);

  while (vector.length < vectorLength) {
    vector.push(0);
  }

  return vector;
}

function renderScore() {
  document.querySelector('.game-score').innerHTML = score;
}

function hasEmptyCells() {
  for (let row = 0; row < BOARD.length; row++) {
    if (BOARD[row].some(value => value === 0)) {
      return true;
    }
  }

  return false;
}

function isWin() {
  for (let row = 0; row < BOARD.length; row++) {
    if (BOARD[row].some(value => value === 2048)) {
      winGame();
    }
  }
}

function isLose() {
  for (let row = 0; row < BOARD.length; row++) {
    if (BOARD[row].some(value => value === 0)) {
      return;
    }
  }

  for (let row = 0; row < BOARD.length; row++) {
    for (let col = 0; col < BOARD[row].length; col++) {
      const currentValue = BOARD[row][col];

      if (row > 0 && BOARD[row - 1][col] === currentValue) {
        return;
      }

      if (row < BOARD.length - 1 && BOARD[row + 1][col] === currentValue) {
        return;
      }

      if (col > 0 && BOARD[row][col - 1] === currentValue) {
        return;
      }

      if (col < BOARD[row].length - 1 && BOARD[row][col + 1] === currentValue) {
        return;
      }
    }
  }
  loseGame();
}

let GameStatus = '';

function winGame() {
  switchMessage('win');
  GameStatus = 'win';
}

function loseGame() {
  document.removeEventListener('keydown', keyDownHandler);
  switchMessage('lose');
  GameStatus = 'lose';
}
