'use strict';

const table = document.querySelector('.game-field');
const rows = table.querySelectorAll('.field-row');
let score = 0;

const numbers = [];

function generateBoard() {
  score = 0;

  const messageStart = document.querySelector('.message-start');
  const buttonStart = document.querySelector('.start');
  const messageLose = document.querySelector('.message-lose');

  messageLose.classList = 'message message-lose hidden';
  messageStart.classList += ' hidden';
  buttonStart.textContent = 'Reset';

  numbers.length = 0;

  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('.field-cell'));

    cells.forEach(cell => {
      cell.textContent = '';
    });

    const rowNumbers = cells.map(cell => parseInt(cell.textContent) || 0);

    numbers.push(rowNumbers);
  });

  return numbers;
}

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', function() {
  generateBoard();
  updateBoard();
  generateRandomTile();
  generateRandomTile();
});

const WIDTH = 4;

function isAbleToContinue() {
  gameWinner();

  const messageLoseElement = document.querySelector('.message-lose');

  let canSlide = false;

  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < WIDTH; col++) {
      if (numbers[row][col] === 0) {
        return;
      }

      if (
        (col < WIDTH - 1 && numbers[row][col] === numbers[row][col + 1])
        || (row < WIDTH - 1 && numbers[row][col] === numbers[row + 1][col])
      ) {
        canSlide = true;
      }
    }
  }

  if (!canSlide) {
    messageLoseElement.classList.remove('hidden');
  }
}

function generateRandomTile() {
  const emptyCells = [];

  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < WIDTH; j++) {
      if (numbers[i][j] === 0) {
        emptyCells.push({
          row: i,
          col: j,
        });
      }
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];

  numbers[row][col] = Math.random() < 0.9 ? 2 : 4;
  updateBoard();
}

function gameWinner() {
  const claimWin = document.querySelector('.message-win');

  for (let row = 0; row < WIDTH; row++) {
    for (let col = 0; col < WIDTH; col++) {
      if (numbers[row][col] === 2048) {
        claimWin.classList.remove('hidden');
      }
    }
  }
}

function slideRight() {
  let tileGenerated = false;

  for (let row = 0; row < WIDTH; row++) {
    for (let col = WIDTH - 1; col >= 0; col--) {
      if (numbers[row][col] !== 0) {
        let colIndex = col;

        while (colIndex < WIDTH - 1 && numbers[row][colIndex + 1] === 0) {
          numbers[row][colIndex + 1] = numbers[row][colIndex];
          numbers[row][colIndex] = 0;
          colIndex++;
          tileGenerated = true;
        }

        if (
          colIndex < WIDTH - 1
          && numbers[row][colIndex + 1] === numbers[row][colIndex]
        ) {
          numbers[row][colIndex + 1] += numbers[row][colIndex];
          numbers[row][colIndex] = 0;
          score += numbers[row][colIndex + 1];

          tileGenerated = true;
        }
      }
    }
  }

  if (tileGenerated) {
    generateRandomTile();
  }

  return numbers;
}

function slideLeft() {
  let tileGenerated = false;

  for (let row = 0; row < WIDTH; row++) {
    for (let col = 1; col < WIDTH; col++) {
      if (numbers[row][col] !== 0) {
        let colIndex = col;

        while (colIndex > 0 && numbers[row][colIndex - 1] === 0) {
          numbers[row][colIndex - 1] = numbers[row][colIndex];
          numbers[row][colIndex] = 0;
          colIndex--;
          tileGenerated = true;
        }

        if (
          colIndex > 0
          && numbers[row][colIndex - 1] === numbers[row][colIndex]
        ) {
          numbers[row][colIndex - 1] += numbers[row][colIndex];
          numbers[row][colIndex] = 0;
          tileGenerated = true;

          score += numbers[row][colIndex - 1];
        }
      }
    }
  }

  if (tileGenerated) {
    generateRandomTile();
  }

  return numbers;
}

function slideDown() {
  let tileGenerated = false;

  for (let col = 0; col < WIDTH; col++) {
    for (let row = WIDTH - 2; row >= 0; row--) {
      if (numbers[row][col] !== 0) {
        let rowIndex = row;

        while (rowIndex < WIDTH - 1 && numbers[rowIndex + 1][col] === 0) {
          numbers[rowIndex + 1][col] = numbers[rowIndex][col];
          numbers[rowIndex][col] = 0;
          rowIndex++;
          tileGenerated = true;
        }

        if (
          rowIndex < WIDTH - 1
          && numbers[rowIndex + 1][col] === numbers[rowIndex][col]
        ) {
          numbers[rowIndex + 1][col] += numbers[rowIndex][col];
          numbers[rowIndex][col] = 0;
          tileGenerated = true;

          score += numbers[rowIndex + 1][col];
        }
      }
    }
  }

  if (tileGenerated) {
    generateRandomTile();
  }

  return numbers;
}

function slideUp() {
  let tileGenerated = false;

  for (let col = 0; col < WIDTH; col++) {
    for (let row = 0; row < WIDTH; row++) {
      if (numbers[row][col] !== 0) {
        let rowIndex = row;

        while (rowIndex > 0 && numbers[rowIndex - 1][col] === 0) {
          numbers[rowIndex - 1][col] = numbers[rowIndex][col];
          numbers[rowIndex][col] = 0;
          rowIndex--;
          tileGenerated = true;
        }

        if (
          rowIndex > 0 && numbers[rowIndex - 1][col] === numbers[rowIndex][col]
        ) {
          numbers[rowIndex - 1][col] += numbers[rowIndex][col];
          numbers[rowIndex][col] = 0;
          tileGenerated = true;

          score += numbers[rowIndex - 1][col];
        }
      }
    }
  }

  if (tileGenerated) {
    generateRandomTile();
  }

  return numbers;
}

function updateBoard() {
  rows.forEach((row, i) => {
    const cells = row.querySelectorAll('.field-cell');

    numbers[i].forEach((number, j) => {
      cells[j].textContent = number !== 0 ? number : '';

      const tileClass = `field-cell--${number}`;

      cells[j].className = `field-cell ${tileClass}`;
    });
  });

  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = score.toString();
}

function handleKeyPress(slide) {
  if (slide.key === 'ArrowRight') {
    updateBoard();
    slideRight(numbers);
    isAbleToContinue();
  }

  if (slide.key === 'ArrowLeft') {
    updateBoard();
    slideLeft(numbers);
    isAbleToContinue();
  }

  if (slide.key === 'ArrowDown') {
    updateBoard();
    slideDown(numbers);
    isAbleToContinue();
  }

  if (slide.key === 'ArrowUp') {
    updateBoard();
    slideUp(numbers);
    isAbleToContinue();
  }
}

let touchStartX = 0;
let touchStartY = 0;
const swipeThreshold = 50;

function handleTouchStart(slide) {
  touchStartX = slide.touches[0].clientX;
  touchStartY = slide.touches[0].clientY;
  slide.preventDefault();
}

function handleTouchEnd(slide) {
  slide.preventDefault();

  const touchEndX = slide.changedTouches[0].clientX;
  const touchEndY = slide.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        slideRight(numbers);
      } else {
        slideLeft(numbers);
      }
    } else {
      if (deltaY > 0) {
        slideDown(numbers);
      } else {
        slideUp(numbers);
      }
    }

    updateBoard();
    isAbleToContinue();
  }
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

document.addEventListener('keydown', handleKeyPress);
