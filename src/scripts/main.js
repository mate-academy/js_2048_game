'use strict';

const table = document.querySelector('.game-field');
const rows = table.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
let point = +score.textContent;

function generateBoard() {
  const board = [];

  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('.field-cell'));
    const rowNumbers = cells.map(cell => parseInt(cell.textContent) || 0);

    board.push(rowNumbers);
  });

  return board;
}

const numbers = generateBoard();

const WIDTH = 4;
const ALL_TILES = WIDTH**2;

function isAbleToContinue() {
  const messageLoseElement = document.querySelector('.message-lose');
  let checker = 0;

  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < WIDTH; col++) {
      if (numbers[row][col] === 0) {
        checker++;
      }
    }
  }

  if (!checker) {
    messageLoseElement.classList.remove('hidden');
  }
}

function generateRandomTile() {
  for (let row = 0; row < WIDTH; row++) {
    const onlyZeroes = numbers[row].filter(el => el === 0);

    const randomindexOfRow = Math.floor(Math.random() * onlyZeroes.length);
    const randomindexOfCol = Math.floor(Math.random() * onlyZeroes.length);

    if (!numbers[randomindexOfRow][randomindexOfCol]) {
      numbers[randomindexOfRow][randomindexOfCol] = 2;
      break;
    }
  }
}

function slideRight() {
  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < WIDTH; col++) {
      if (numbers[row][col + 1] === numbers[row][col]
        || numbers[row][col + 1] === 0) {
        numbers[row][col + 1] += numbers[row][col];
        numbers[row][col] = 0;
      }
    }

    while (numbers[row].includes(0)) {
      numbers[row].splice(numbers[row].indexOf(0), 1);
    }

    while (numbers[row].length < WIDTH) {
      numbers[row].unshift(0);
    }
  }

  return numbers;
}

function slideLeft() {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < WIDTH - 1; j++) {
      if (numbers[i][j] === numbers[i][j + 1] || numbers[i][j] === 0) {
        numbers[i][j] += numbers[i][j + 1];
        numbers[i][j + 1] = 0;
      }

      if (numbers[i].includes(0)) {
        numbers[i].splice(numbers[i].indexOf(0), 1);
        numbers[i].push(0);
      }
    }
  }

  return numbers;
}

function slideDown() {
  for (let col = 0; col < WIDTH; col++) {
    for (let row = 0; row < WIDTH - 1; row++) {
      if (numbers[row + 1][col] === numbers[row][col]
        || numbers[row + 1][col] === 0) {
        numbers[row + 1][col] += numbers[row][col];
        numbers[row][col] = 0;
      }
    }

    for (let row = WIDTH - 1; row >= 0; row--) {
      if (numbers[row][col] === 0) {
        let rowIndex = row;

        while (rowIndex > 0 && numbers[rowIndex][col] === 0) {
          rowIndex--;
        }

        numbers[row][col] = numbers[rowIndex][col];
        numbers[rowIndex][col] = 0;
      }
    }
  }

  return numbers;
}

function slideUp() {
  for (let col = 0; col < WIDTH; col++) {
    for (let row = WIDTH - 1; row > 0; row--) {
      if (numbers[row - 1][col] === numbers[row][col]
        || numbers[row - 1][col] === 0) {
        numbers[row - 1][col] += numbers[row][col];
        numbers[row][col] = 0;
      }
    }

    for (let row = 0; row < WIDTH; row++) {
      if (numbers[row][col] === 0) {
        let rowIndex = row;

        while (rowIndex < WIDTH - 1 && numbers[rowIndex][col] === 0) {
          rowIndex++;
        }

        numbers[row][col] = numbers[rowIndex][col];
        numbers[rowIndex][col] = 0;
      }
    }
  }

  return numbers;
}

function updateBoard() {
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.field-cell');

    numbers[i].forEach((number, j) => {
      cells[j].textContent = number !== 0 ? number : '';
    });
  });
}

function handleKeyPress(event) {
  if (event.key === 'ArrowRight') {
    // const updatedNumbers = slideRight(numbers);

    //  numbers.splice(0, numbers.length, ...updatedNumbers);
    slideRight(numbers);
    isAbleToContinue();
    generateRandomTile();
    updateBoard();
  }

  if (event.key === 'ArrowLeft') {
    //  const updatedNumbers = slideLeft(numbers);
    //  numbers.splice(0, numbers.length, ...updatedNumbers);
    slideLeft(numbers);
    isAbleToContinue();
    generateRandomTile();
    updateBoard();
  }

  if (event.key === 'ArrowDown') {
    //  const updatedNumbers = slideDown(numbers);
    //  numbers.splice(0, numbers.length, ...updatedNumbers);
    slideDown(numbers);
    isAbleToContinue();
    generateRandomTile();
    updateBoard();
  }

  if (event.key === 'ArrowUp') {
    //  const updatedNumbers = slideUp(numbers);
    //  numbers.splice(0, numbers.length, ...updatedNumbers);
    slideUp(numbers);
    isAbleToContinue();
    generateRandomTile();
    updateBoard();
  }
}

document.addEventListener('keydown', handleKeyPress);
