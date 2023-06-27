'use strict';

const gameContainer = document.querySelector('.container');
const startButton = gameContainer.querySelector('.button');
const cells = gameContainer.querySelectorAll('.field-cell');
const messageStart = gameContainer.querySelector('.message-start');
const messageWin = gameContainer.querySelector('.message-win');
const messageLose = gameContainer.querySelector('.message-lose');
const gameScore = gameContainer.querySelector('.game-score');
const gameRow = gameContainer.querySelectorAll('tr');
const probabilityGeneratingNumber = 0.1;
const numberFour = 4;
const numberTwo = 2;
const moveLeft = 'ArrowLeft';
const moveRight = 'ArrowRight';
const moveUp = 'ArrowUp';
const moveDown = 'ArrowDown';
const winnerNumber = '2048';
let movePossible = false;
let adjacentCells = false;

function generateRandom() {
  const randomI = Math.floor(Math.random() * cells.length);

  if (cells[randomI].textContent === '') {
    const randomNum = Math.random() < probabilityGeneratingNumber
      ? numberFour : numberTwo;

    cells[randomI].textContent = randomNum;
    cells[randomI].classList.add('field-cell--' + randomNum);
  } else {
    generateRandom();
  }
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    generateRandom();
    generateRandom();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else if (startButton.classList.contains('restart')) {
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });
    messageStart.classList.remove('hidden');
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
    gameScore.textContent = '0';
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
});

function updateCells() {
  cells.forEach((cell) => {
    if (cell.textContent === '') {
      cell.className = 'field-cell';
    } else {
      cell.className = `field-cell field-cell--${cell.textContent}`;
    }
  });
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case moveLeft:
      slideLeft();
      break;

    case moveRight:
      slideRight();
      break;

    case moveUp:
      slideUp();
      break;

    case moveDown:
      slideDown();
      break;
  }

  checkGameWin();
  checkGameOver();
});

function filterZero(cellsArray) {
  return cellsArray.filter(i => i !== '');
}

function slide(cellsArray) {
  let arrayToSlide = filterZero(cellsArray);
  let updatedScore = 0;

  for (let i = 0; i < arrayToSlide.length; i++) {
    if (arrayToSlide[i] === arrayToSlide[i + 1]) {
      arrayToSlide[i] *= 2;
      updatedScore += arrayToSlide[i];
      arrayToSlide[i + 1] = '';
    }
  }

  arrayToSlide = filterZero(arrayToSlide);

  while (arrayToSlide.length < cellsArray.length) {
    arrayToSlide.push('');
  }

  gameScore.textContent = parseInt(gameScore.textContent) + updatedScore;

  return arrayToSlide;
}

function slideLeft() {
  movePossible = false;

  gameRow.forEach((row) => {
    const rowCells = row.querySelectorAll('td');
    const cellsArray = [...rowCells].map(td => td.textContent);
    const updatedArray = slide(cellsArray);

    rowCells.forEach((td, index) => {
      if (td.textContent !== updatedArray[index]) {
        movePossible = true;
      }
      td.textContent = updatedArray[index];
    });
  });

  if (movePossible) {
    updateCells();
    generateRandom();
  }
}

function slideRight() {
  movePossible = false;

  gameRow.forEach((row) => {
    const rowCells = row.querySelectorAll('td');
    const cellsArray = [...rowCells].map(td => td.textContent);

    cellsArray.reverse();

    const updatedArray = slide(cellsArray);

    updatedArray.reverse();

    rowCells.forEach((td, index) => {
      if (td.textContent !== updatedArray[index]) {
        movePossible = true;
      }
      td.textContent = updatedArray[index];
    });
  });

  if (movePossible) {
    updateCells();
    generateRandom();
  }
}

function slideUp() {
  movePossible = false;

  for (
    let columnIndex = 0;
    columnIndex < gameRow[0].childElementCount;
    columnIndex++
  ) {
    const columnCells = Array.from(gameRow).map(
      row => row.children[columnIndex].textContent);

    const updatedArray = slide(columnCells);

    for (let rowIndex = 0; rowIndex < gameRow.length; rowIndex++) {
      if (gameRow[rowIndex].children[columnIndex].textContent
        !== updatedArray[rowIndex]) {
        movePossible = true;
      }

      gameRow[rowIndex].children[columnIndex].textContent
        = updatedArray[rowIndex];
    }
  }

  if (movePossible) {
    updateCells();
    generateRandom();
  }
}

function slideDown() {
  movePossible = false;

  for (
    let columnIndex = 0;
    columnIndex < gameRow[0].childElementCount;
    columnIndex++
  ) {
    const columnCells = Array.from(gameRow).map(
      row => row.children[columnIndex].textContent);

    columnCells.reverse();

    const updatedArray = slide(columnCells);

    updatedArray.reverse();

    for (let rowIndex = 0; rowIndex < gameRow.length; rowIndex++) {
      if (gameRow[rowIndex].children[columnIndex].textContent
        !== updatedArray[rowIndex]) {
        movePossible = true;
      }

      gameRow[rowIndex].children[columnIndex].textContent
        = updatedArray[rowIndex];
    }
  }

  if (movePossible) {
    updateCells();
    generateRandom();
  }
}

function checkGameWin() {
  const winCell = Array.from(cells).some(
    cell => cell.textContent === winnerNumber);

  if (winCell) {
    messageWin.classList.remove('hidden');
  }
}

function checkGameOver() {
  const emptyCells = Array.from(cells).some(cell => cell.textContent === '');

  adjacentCells = false;

  gameRow.forEach((row, rowIndex) => {
    const rowCells = row.querySelectorAll('td');
    const cellsArray = [...rowCells].map(td => td.textContent);

    cellsArray.forEach((currentCell, i) => {
      const rightCell = cellsArray[i + 1];
      const bottomCell = rowIndex < gameRow.length - 1
        ? gameRow[rowIndex + 1].children[i].textContent
        : null;

      if ((rightCell && currentCell === rightCell)
        || (bottomCell && currentCell === bottomCell)) {
        adjacentCells = true;
      }
    });
  });

  if (!emptyCells && !adjacentCells) {
    messageLose.classList.remove('hidden');
  }
}
