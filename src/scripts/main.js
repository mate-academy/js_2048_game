'use strict';

const score = document.querySelector('.info');
const button = document.querySelector('.button');
let isRestart = false;
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

// Creating matrix with all fields
const fieldCells
= Array.from(document.querySelectorAll('.field-row .field-cell'));
let index1, index2;
const numRows = 4;
const numCols = 4;

const matrix = [];

for (let row = 0; row < numRows; row++) {
  matrix[row] = [];

  for (let col = 0; col < numCols; col++) {
    const cell = fieldCells[row * numCols + col];
    const cellValue = cell.getAttribute('data-value') || '';

    matrix[row][col] = cellValue;
  }
}

// console.log(matrix[1][3]);
// console.log(matrix[3][0]);

// Setting start function
function start() {
  button.classList.toggle('restart');
  messageStart.classList.toggle('hidden');

  const cellsWithClass = document.querySelectorAll('.field-cell--2');

  cellsWithClass.forEach(cell => cell.classList.remove('field-cell--2'));

  if (!isRestart) {
    button.innerHTML = 'Restart';
    button.style.fontSize = '18px';

    do {
      index1 = Math.floor(Math.random() * fieldCells.length);
      index2 = Math.floor(Math.random() * fieldCells.length);
    } while (index2 === index1);

    fieldCells[index1].classList.add('field-cell--2');
    fieldCells[index2].classList.add('field-cell--2');
    fieldCells[index1].setAttribute('data-value', '2');
    fieldCells[index2].setAttribute('data-value', '2');
  } else {
    button.innerHTML = 'Start';
    button.style.fontSize = '20px';
    fieldCells[index1].setAttribute('data-value', '');
    fieldCells[index2].setAttribute('data-value', '');
  }

  isRestart = !isRestart;
}

button.addEventListener('click', start);

// key functions
function moveUp() {
  for (let col = 0; col < numCols; col++) {
    let merged = false;

    for (let row = 1; row < numRows; row++) {
      const currentValue = matrix[row][col];

      if (currentValue !== '') {
        let newRow = row - 1;

        while (newRow >= 0 && matrix[newRow][col] === '') {
          matrix[newRow][col] = currentValue;
          matrix[newRow + 1][col] = '';
          newRow--;
        }

        if (newRow >= 0 && matrix[newRow][col] === currentValue && !merged) {
          matrix[newRow][col] *= 2;
          matrix[row][col] = '';
          merged = true;
        }
      }
    }
  }

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = fieldCells[row * numCols + col];
      const cellValue = matrix[row][col];

      cell.setAttribute('data-value', cellValue);
    }
  }
}

// Setting key logic
document.addEventListener('keydown', function(event) {
  isRestart = true;

  if (event.key === 'ArrowUp' && isRestart) {
    event.preventDefault();
    moveUp();
  } else if (event.key === 'ArrowDown' && isRestart) {
    event.preventDefault();

  } else if (event.key === 'ArrowLeft' && isRestart) {
    event.preventDefault();

  } else if (event.key === 'ArrowRight' && isRestart) {
    event.preventDefault();

  }
});
