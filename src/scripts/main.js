'use strict';

// Step1: Identify elements
// ===================================
// const GAME_FIELD = document.querySelector('.game-field');
const FIELD_ROWS = document.querySelectorAll('.field-row');
const FIELD_CELLS = Array.from(FIELD_ROWS)
  .map(row => row.querySelectorAll('.field-cell'));
// const MESSAGES = document.querySelectorAll('.message');
const MESSAGE_START = document.querySelector('.message-start');
// const MESSAGE_LOSE = document.querySelector('.message-lose');
// const MESSAGE_WIN = document.querySelector('.message-win');
const START_BUTTON = document.querySelector('.button');
const SCORE_NUMBER = document.querySelector('.game-score');
let gameMatrix;

// Step2: Start game (on clicking the start button)
START_BUTTON.addEventListener('click', startGame);
document.addEventListener('keyup', makeMove);

function startGame() {
  gameMatrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

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

  const randomEmptyCell
  = emptyCells[getRandomIncluding(0, emptyCells.length - 1)];

  gameMatrix[randomEmptyCell.row][randomEmptyCell.col] = newRandomNum;
}

// Step3: Movements (on keyup)
function makeMove() {
  // run through matrix,
  // change value accorging to the move direction
  // refresh tile data (change classes, inner text);
}

// Step4: add messages to functions
// ===================================

//
// Add animations to CSS
//

// additional functions
function getRandomIncluding(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
