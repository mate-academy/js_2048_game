'use strict';

const mainButton = document.querySelector('.start');
const ROW_NUMBER = 4;
const COLUNM_NUMBER = 4;
const BOARD = createBoard();
let score = 0;
let gameStatus = '';

setFieldGame();

mainButton.addEventListener('click', handleButtonClick);

function setFieldGame() {
  const gameField = document.querySelector('.game-field');
  const tableBody = document.createElement('tbody');

  for (let i = 0; i < ROW_NUMBER; i++) {
    const row = document.createElement('tr');

    for (let j = 0; j < COLUNM_NUMBER; j++) {
      const cell = document.createElement('td');

      cell.id = `${i}-${j}`;
      cell.className = 'field-cell';
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
  gameField.appendChild(tableBody);
}

function createBoard() {
  return Array.from({ length: ROW_NUMBER }, () => Array(COLUNM_NUMBER).fill(0));
}

function renderFieldGame() {
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

function handleButtonClick() {
  if (!mainButton.classList.contains('restart')) {
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.innerHTML = 'Restart';
    switchMessage('start');
  }

  if (gameStatus === 'lose' || gameStatus === 'win') {
    switchMessage(gameStatus);
  }
  gameStatus = '';
  initGame();
}

function switchMessage(nameMessage) {
  const message = document.querySelector(`.message-${nameMessage}`);

  message.classList.toggle('hidden');
}

function initGame() {
  resetGame();
  addValueToField();
  addValueToField();
  renderFieldGame();
  renderScore();
  document.addEventListener('keydown', keyDownHandler);
}

function resetGame() {
  BOARD.forEach(row => row.fill(0));
  score = 0;
}

function addValueToField() {
  if (!hasEmptyCells()) {
    return;
  }

  while (true) {
    const randomRow = Math.floor(Math.random() * ROW_NUMBER);
    const randomColumn = Math.floor(Math.random() * COLUNM_NUMBER);

    if (BOARD[randomRow][randomColumn] === 0) {
      BOARD[randomRow][randomColumn] = Math.random() < 0.9 ? 2 : 4;
      break;
    }
  }
}

function keyDownHandler(e) {
  if (gameStatus === 'over') {
    return;
  }

  const initialBoard = cloneBoard();

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
    default:
      return;
  }

  const currentBoard = cloneBoard();

  if (JSON.stringify(initialBoard) !== JSON.stringify(currentBoard)) {
    addValueToField();
    renderFieldGame();
    renderScore();
    checkGameStatus();
  }
}

function cloneBoard() {
  return BOARD.map(row => [...row]);
}

function moveLeft() {
  BOARD.forEach((row, rowIndex) => {
    BOARD[rowIndex] = slide(row);
  });
}

function moveRight() {
  BOARD.forEach((row, rowIndex) => {
    const reversedRow = row.slice().reverse();
    const slidRow = slide(reversedRow).reverse();

    BOARD[rowIndex] = slidRow;

    for (let col = COLUNM_NUMBER - 1; col > 0; col--) {
      if (slidRow[col] === slidRow[col - 1] && slidRow[col] !== 0) {
        slidRow[col] *= 2;
        slidRow[col - 1] = 0;
        updateScore(slidRow[col]);
      }
    }
  });
}

function moveUp() {
  for (let col = 0; col < COLUNM_NUMBER; col++) {
    const column = [];

    for (let row = 0; row < ROW_NUMBER; row++) {
      column.push(BOARD[row][col]);
    }

    const slidColumn = slide(column);

    for (let row = 0; row < ROW_NUMBER - 1; row++) {
      if (slidColumn[row] === slidColumn[row + 1] && slidColumn[row] !== 0) {
        slidColumn[row] *= 2;
        slidColumn[row + 1] = 0;
        updateScore(slidColumn[row]);
      }
    }

    for (let row = 0; row < ROW_NUMBER; row++) {
      BOARD[row][col] = slidColumn[row];
    }
  }
}

function moveDown() {
  for (let col = 0; col < COLUNM_NUMBER; col++) {
    const column = [];

    for (let row = ROW_NUMBER - 1; row >= 0; row--) {
      column.push(BOARD[row][col]);
    }

    const slidColumn = slide(column);

    for (let row = ROW_NUMBER - 1; row >= 0; row--) {
      if (slidColumn[row] === slidColumn[row - 1] && slidColumn[row] !== 0) {
        slidColumn[row] *= 2;
        slidColumn[row - 1] = 0;
        updateScore(slidColumn[row]);
      }
    }

    for (let row = ROW_NUMBER - 1; row >= 0; row--) {
      BOARD[row][col] = slidColumn[ROW_NUMBER - 1 - row];
    }
  }
}

function slide(vectorCurrent) {
  let vector = vectorCurrent.filter(value => value !== 0);

  for (let i = 0; i < vector.length - 1; i++) {
    if (vector[i] === vector[i + 1]) {
      vector[i] *= 2;
      vector[i + 1] = 0;
      updateScore(vector[i]);
    }
  }

  vector = vector.filter(value => value !== 0);

  while (vector.length < COLUNM_NUMBER) {
    vector.push(0);
  }

  return vector;
}

function checkGameStatus() {
  if (checkWin()) {
    showWinMessage();
    gameStatus = 'win';
  } else if (!hasEmptyCells() && !checkAvailableMoves()) {
    showLoseMessage();
    gameStatus = 'over';
  }
}

function renderScore() {
  document.querySelector('.game-score').innerHTML = score;
}

function hasEmptyCells() {
  return BOARD.some(row => row.includes(0));
}

function checkWin() {
  return BOARD.flat().includes(2048);
}

function checkAvailableMoves() {
  return (
    [...Array(ROW_NUMBER).keys()].some(row => {
      return [...Array(COLUNM_NUMBER).keys()].some(col => {
        const currentValue = BOARD[row][col];

        return (
          (row > 0 && BOARD[row - 1][col] === currentValue)
          || (row < ROW_NUMBER - 1 && BOARD[row + 1][col] === currentValue)
          || (col > 0 && BOARD[row][col - 1] === currentValue)
          || (col < COLUNM_NUMBER - 1 && BOARD[row][col + 1] === currentValue)
        );
      });
    })
  );
}

function updateScore(value) {
  score += value;
  renderScore();
}

function showWinMessage() {
  document.removeEventListener('keydown', keyDownHandler);
  switchMessage('win');
  gameStatus = 'win';
}

function showLoseMessage() {
  document.removeEventListener('keydown', keyDownHandler);
  switchMessage('lose');
  gameStatus = 'lose';
}
