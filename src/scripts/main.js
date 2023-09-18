'use strict';

// write your code here
const button = document.querySelector('.button');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const fieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');

const rowLength = 4;
let score = 0;
let field;

function startGame() {
  field = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addRandomBlock();
  addRandomBlock();

  renderField();
}

function renderField() {
  field.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const block = fieldRows[rowIndex].children[colIndex];

      if (cell === 0) {
        block.textContent = '';
        block.className = 'field-cell';
      } else {
        block.textContent = cell;
        block.className = `field-cell field-cell--${cell}`;
      }
    });
  });

  gameScore.textContent = score;
}

function canSlide() {
  let canBlockSlide = false;

  field.forEach((row) => {
    if (row.some((block, index) => block === 0 || block === row[index + 1])) {
      canBlockSlide = true;
    }
  });

  return canBlockSlide;
}

const addRandomBlock = () => {
  while (canSlide()) {
    const randomRow = Math.floor(Math.random() * rowLength);
    const randomCol = Math.floor(Math.random() * rowLength);

    if (field[randomRow][randomCol] === 0) {
      field[randomRow][randomCol] = Math.random() >= 0.8 ? 4 : 2;
      break;
    }
  }
};

function moveBlocks() {
  if (!canSlide()) {
    return;
  }

  field = field.map(row => {
    const newRow = row.filter(block => block !== 0);

    newRow.forEach((block, index) => {
      if (block === newRow[index + 1]) {
        newRow[index] *= 2;
        newRow.splice(index + 1, 1);
        score += newRow[index];
      }
    });

    return newRow.concat(Array(rowLength - newRow.length).fill(0));
  });
}

function reverseRows() {
  field.forEach(row => row.reverse());
}

function transponseField() {
  field = field[0].map((block, colIndex) => field.map(row => row[colIndex]));
}

document.addEventListener('keyup', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowUp':
      transponseField();
      moveBlocks();
      transponseField();
      addRandomBlock();
      renderField();
      break;
    case 'ArrowDown':
      transponseField();
      reverseRows();
      moveBlocks();
      reverseRows();
      transponseField();
      addRandomBlock();
      renderField();
      break;
    case 'ArrowLeft':
      moveBlocks();
      addRandomBlock();
      renderField();
      break;
    case 'ArrowRight':
      reverseRows();
      moveBlocks();
      reverseRows();
      addRandomBlock();
      renderField();
      break;
  }
});

button.addEventListener('click', (element) => {
  if (button.classList.contains('start')) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  }

  startGame();
});
