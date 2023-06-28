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
  const emptyCells = [...cells].filter(cell => cell.textContent === '');

  if (emptyCells.length === 0) {
    return;
  }

  const randomI = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomI];
  const randomNum = Math.random() < probabilityGeneratingNumber
    ? numberFour : numberTwo;

  randomCell.textContent = randomNum;
  randomCell.classList.add('field-cell--' + randomNum);
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    generateRandom();
    generateRandom();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
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
  const arrayToSlide = filterZero(cellsArray);
  let updatedScore = 0;

  const newArray = arrayToSlide.map((value, i) => {
    if (value === arrayToSlide[i + 1]) {
      updatedScore += value * 2;
      arrayToSlide[i + 1] = '';

      return value * 2;
    } else {
      return value;
    }
  });

  const finalArray = filterZero(newArray);

  while (finalArray.length < cellsArray.length) {
    finalArray.push('');
  }

  gameScore.textContent = parseInt(gameScore.textContent) + updatedScore;

  return finalArray;
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
      const currentCellContent
      = gameRow[rowIndex].children[columnIndex].textContent;
      const updatedCellContent = updatedArray[rowIndex];

      if (currentCellContent !== updatedCellContent) {
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
      const currentCellContent
        = gameRow[rowIndex].children[columnIndex].textContent;
      const updatedCellContent = updatedArray[rowIndex];

      if (currentCellContent !== updatedCellContent) {
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

      const isRightCellSame = rightCell && currentCell === rightCell;
      const isBottomCellSame = bottomCell && currentCell === bottomCell;

      if (isRightCellSame || isBottomCellSame) {
        adjacentCells = true;
      }
    });
  });

  if (!emptyCells && !adjacentCells) {
    messageLose.classList.remove('hidden');
  }
}
