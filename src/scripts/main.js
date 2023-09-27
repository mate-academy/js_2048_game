'use strict';

const startButton = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const rows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
let canMove = false;

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    generateRandom();
    generateRandom();

    messageStart.classList.add('hidden');
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
  } else if (startButton.classList.contains('restart')) {
    cells.forEach(cell => {
      cell.className = 'field-cell';
      cell.textContent = '';
    });

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    gameScore.textContent = 0;

    generateRandom();
    generateRandom();
  }
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  switch (e.key) {
    case 'ArrowLeft':
      slideLeft();
      checkGameOver();
      break;

    case 'ArrowRight':
      slideRight();
      checkGameOver();
      break;

    case 'ArrowUp':
      slideUp();
      checkGameOver();
      break;

    case 'ArrowDown':
      slideDown();
      checkGameOver();
      break;
  }

  checkGameWin();
});

function generateRandom() {
  const randomCell = Math.floor(Math.random() * cells.length);

  if (cells[randomCell].textContent === '') {
    const randomNum = Math.random() < 0.1 ? '4' : '2';

    cells[randomCell].textContent = randomNum;
    cells[randomCell].classList.add(`field-cell--${randomNum}`);
  } else {
    generateRandom();
  }
}

function updateCells() {
  cells.forEach(cell => {
    if (cell.textContent === '') {
      cell.className = 'field-cell';
    } else {
      cell.classList = 'field-cell';
      cell.classList.add(`field-cell--${cell.textContent}`);
    }
  });
}

function filterZero(cellsArray) {
  return cellsArray.filter(i => i !== '');
}

function slide(cellsArray) {
  let arrayToSlide = filterZero(cellsArray);
  let updateScore = 0;

  for (let i = 0; i < arrayToSlide.length; i++) {
    if (arrayToSlide[i] === arrayToSlide[i + 1]) {
      arrayToSlide[i] *= 2;
      updateScore += arrayToSlide[i];
      arrayToSlide[i + 1] = '';
    }
  }

  arrayToSlide = filterZero(arrayToSlide);

  while (arrayToSlide.length < cellsArray.length) {
    arrayToSlide.push('');
  }

  gameScore.textContent = parseInt(gameScore.textContent) + updateScore;

  return arrayToSlide;
}

function slideLeft() {
  canMove = false;

  rows.forEach(row => {
    const rowCells = row.querySelectorAll('.field-cell');
    const cellsArray = [...rowCells].map(cell => cell.textContent);
    const updateArray = slide(cellsArray);

    rowCells.forEach((cell, i) => {
      if (cell.textContent !== updateArray[i]) {
        canMove = true;
      }

      cell.textContent = updateArray[i];
    });
  });

  if (canMove) {
    updateCells();
    generateRandom();
  }
}

function slideRight() {
  canMove = false;

  rows.forEach(row => {
    const rowCells = row.querySelectorAll('.field-cell');
    const cellsArray = [...rowCells].map(cell => cell.textContent);

    cellsArray.reverse();

    const updateArray = slide(cellsArray);

    updateArray.reverse();

    rowCells.forEach((cell, i) => {
      if (cell.textContent !== updateArray[i]) {
        canMove = true;
      }

      cell.textContent = updateArray[i];
    });
  });

  if (canMove) {
    updateCells();
    generateRandom();
  }
}

function slideUp() {
  canMove = false;

  for (let colIndex = 0; colIndex < rows[0].childElementCount; colIndex++) {
    const cellsArray = [...rows].map(row => row.children[colIndex].textContent);
    const updateArray = slide(cellsArray);

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (rows[rowIndex].children[colIndex]
        .textContent !== updateArray[rowIndex]) {
        canMove = true;
      }

      rows[rowIndex].children[colIndex].textContent = updateArray[rowIndex];
    }
  }

  if (canMove) {
    updateCells();
    generateRandom();
  }
}

function slideDown() {
  canMove = false;

  for (let colIndex = 0; colIndex < rows[0].childElementCount; colIndex++) {
    const cellsArray = [...rows].map(row => row.children[colIndex].textContent);

    cellsArray.reverse();

    const updateArray = slide(cellsArray);

    updateArray.reverse();

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      if (rows[rowIndex].children[colIndex]
        .textContent !== updateArray[rowIndex]) {
        canMove = true;
      }

      rows[rowIndex].children[colIndex].textContent = updateArray[rowIndex];
    }
  }

  if (canMove) {
    updateCells();
    generateRandom();
  }
}

function checkGameOver() {
  const emptyCells = [...cells].some(cell => cell.textContent === '');

  let adjacentCells = false;

  for (let i = 0; i < cells.length; i++) {
    const currentCell = cells[i];
    const rightCell = cells[i + 1];
    const bottomCell = cells[i + 4];

    if (rightCell && currentCell.textContent === rightCell.textContent) {
      adjacentCells = true;
      break;
    }

    if (bottomCell && currentCell.textContent === bottomCell.textContent) {
      adjacentCells = true;
      break;
    }
  }

  if (!emptyCells && !adjacentCells) {
    messageLose.classList.remove('hidden');
  }
}

function checkGameWin() {
  const winCell = Array.from(cells).some(cell => cell.textContent === '2048');

  if (winCell) {
    messageWin.classList.remove('hidden');
  }
}
