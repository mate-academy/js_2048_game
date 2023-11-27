'use strict';

// Step1: Identify elements
// ===================================
const FIELD_ROWS = document.querySelectorAll('.field-row');
const FIELD_CELLS = Array.from(FIELD_ROWS)
  .map(row => row.querySelectorAll('.field-cell'));
const MESSAGES = document.querySelectorAll('.message');
const MESSAGE_START = document.querySelector('.message-start');
const MESSAGE_LOSE = document.querySelector('.message-lose');
const MESSAGE_WIN = document.querySelector('.message-win');
const START_BUTTON = document.querySelector('.button');
const SCORE_NUMBER = document.querySelector('.game-score');
let gameMatrix;
let isMovePossible;
let isGameOn;

// Step2: Start game (on clicking the start button)
START_BUTTON.addEventListener('click', startGame);
document.addEventListener('keyup', (e) => makeMove(e));

function startGame() {
  gameMatrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  isGameOn = true;
  isMovePossible = true;
  updateField();
  SCORE_NUMBER.innerText = '0';
  START_BUTTON.classList.add('restart');
  START_BUTTON.innerText = 'Restart';
  MESSAGE_START.classList.add('hidden');
  addNewNumber();
  addNewNumber();
  updateField();
}

function updateField() {
  for (let row = 0; row < gameMatrix.length; row++) {
    for (let col = 0; col < gameMatrix[row].length; col++) {
      const num = gameMatrix[row][col];

      FIELD_CELLS[row][col].innerText = num === 0 ? '' : `${num}`;
      FIELD_CELLS[row][col].className = 'field-cell';
      // rewriting all classes each time
      // ? refactor

      if (num !== 0) {
        FIELD_CELLS[row][col].classList.add(`field-cell--${num}`);
      }
    }
  }
}

function addNewNumber() {
  const newRandomNum = getRandomIncluding(1, 10) === 10 ? 4 : 2;
  const emptyCells = [];

  for (let r = 0; r < gameMatrix.length; r++) {
    for (let c = 0; c < gameMatrix[r].length; c++) {
      if (gameMatrix[r][c] === 0) {
        emptyCells.push({
          row: r,
          col: c,
        });
      }
    }
  }

  if (!emptyCells.length) {
    return;
  }

  const randomEmptyCell
  = emptyCells[getRandomIncluding(0, emptyCells.length - 1)];

  gameMatrix[randomEmptyCell.row][randomEmptyCell.col] = newRandomNum;
}

// Step3: Movements (on keyup)
function makeMove(event) {
  let currentMoveScore = 0;
  // 1 run through matrix, & change value accorging to the move direction:
  // - clear 0s
  // - merge similar numbers => sum of merged + to currentMoveScore
  // - clear 0s
  // - add 0s

  // 2 refresh tile data (change classes, inner text);
  updateField();
  // 3 check if further move is possible
  // 4 if no - game over message
  isMovePossible = checkGameEnd(gameMatrix);

  if (!isMovePossible) {
    MESSAGE_LOSE.classList.remove('hidden');
  }
  SCORE_NUMBER += currentMoveScore;

  console.log(event.key);
}

// Step4: add messages to functions
// ===================================
// number = 2048 - winner message
//
// Add animations to CSS
//

// additional functions
function getRandomIncluding(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkGameEnd(rowsOfCells) {
  const hasEmptyCells = rowsOfCells.some(row => row.some(cell => cell === 0));

  if (hasEmptyCells) {
    return true;
  }

  // add checking possible moves
  // rerurn true if possible
}
