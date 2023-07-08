'use strict';

const cells = document.querySelectorAll('.field-cell');
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const tryAgain = document.querySelector('.btn');

let board = [];
let score = 0;
let isGameWon = false;
let isGameOver = false;

function displayBoard() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = board[row][col];
      const cell = cells[row * 4 + col];

      cell.textContent = value !== 0 ? value : '';
      cell.className = `field-cell field-cell--${value}`;
      scoreDisplay.textContent = score;
    }
  }
}

function initGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  
  score = 0;

  updateScore();

  if (!isGameOver && !isGameWon) {
    startMessage.classList.add('hidden');

    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
  }
  
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });
  
  generateTile();
  generateTile();
  displayBoard(); 
}

function generateTile() {
  const row = Math.floor(Math.random() * 4);
  const col = Math.floor(Math.random() * 4);
  
  if (board[row][col] === 0) {
    board[row][col] = Math.random() < 0.9 ? 2 : 4;

    updateCell(row, col);
    
    if (!hasEmptyCell()) {
      if (!canMove()) {
        isGameOver = true;
        loseMessage.classList.remove('hidden');
      }
    }
  } else {
    generateTile();
  }
}

function updateCell(row, col) {
  const cell = cells[row * 4 + col];
  const value = board[row][col];

  cell.textContent = value !== 0 ? value : '';
  cell.className = `field-cell field-cell--${value}`;
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function hasEmptyCell() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return true;
      }
    }
  }
  return false;
}

function canMove() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return true;
      }
      if (col !== 3 && board[row][col] === board[row][col + 1]) {
        return true;
      }
      if (row !== 3 && board[row][col] === board[row + 1][col]) {
        return true;
      }
    }
  }
  return false;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

function moveLeft() {
  let isChanged = false;

  for (let row = 0; row < 4; row++) {
    let newArr = [];
    let count = 1;

    for (let col = 0; col < 4; col++) {
      if (board[row][col] !== 0) {
        if (board[row][col] === newArr[newArr.length - 1] && count > 0) {
          newArr[newArr.length - 1] *= 2;
          score += newArr[newArr.length - 1];
          count--;
          isChanged = true;
        } else {
          newArr.push(board[row][col]);
          count = 1;
        }
      }
    }

    while (newArr.length < 4) {
      newArr.push(0);
    }

    if (!arraysEqual(board[row], newArr)) {
      isChanged = true;
    }

    board[row] = [...newArr];
    newArr = [];
  }

  if (isChanged) {
    generateTile();
  }
}

function moveRight() {
  let isChanged = false;

  for (let row = 0; row < 4; row++) {
    let newArr = [];
    let count = 1;

    for (let col = 3; col >= 0; col--) {
      if (board[row][col] !== 0) {
        if (board[row][col] === newArr[0] && count > 0) {
          newArr[0] *= 2;
          score += newArr[0];
          count--;
          isChanged = true;
        } else {
          newArr.unshift(board[row][col]);
          count = 1;
        }
      }
    }

    while (newArr.length < 4) {
      newArr.unshift(0);
    }

    if (!arraysEqual(board[row], newArr)) {
      isChanged = true;
    }

    board[row] = newArr;
    newArr = [];
  }

  if (isChanged) {
    generateTile();
  }
}

function moveUp() {
  rotate();
  moveRight();
  rotate();
  rotate();
  rotate();
}

function moveDown() {
  rotate();
  moveLeft();
  rotate();
  rotate();
  rotate();
}

function rotate() {
  const newBoard = [];

  for (let row = 0; row < 4; row++) {
    let newArr = [];

    for (let col = 3; col >= 0; col--) {
      newArr.push(board[col][row]);
    }

    while (newArr.length < 4) {
      newArr.unshift(0);
    }

    newBoard[row] = newArr;
    newArr = [];
  }

  board = newBoard;
}

function handleKeyPress(keyEvent) {
  switch (keyEvent.key) {
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
      break;
  }

  displayBoard();
}

startButton.addEventListener('click', initGame);
tryAgain.addEventListener('click', initGame);
