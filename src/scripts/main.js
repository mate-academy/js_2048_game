'use strict';

const allCells = [...document.querySelectorAll('.field-cell')];

allCells.toBoard = function() {
  const boardSize = Math.sqrt(this.length);
  const board = [];

  for (let i = 0; i < boardSize; i++) {
    const row = [];

    const startFrom = i * boardSize;
    const endOn = (i * boardSize) + boardSize;

    for (let j = startFrom; j < endOn; j++) {
      row.push(this[j]);
    }

    board.push(row);
  }

  return board;
};

allCells.getFreeCells = function() {
  return this.filter(cell => !cell.hasChildNodes());
};

allCells.getFilledCells = function() {
  return this.filter(cell => cell.hasChildNodes());
};

function createCard(
  cellWeight = Math.random() <= 0.1 ? 4 : 2
) {
  const filledCell = document.createElement('div');

  filledCell.classList.add('cell', `cell--${cellWeight}`);
  filledCell.textContent = `${cellWeight}`;

  return filledCell;
}

function getFreeRandomCells(needFilledCells = 1) {
  const freeCells = allCells.getFreeCells();
  const randomCells = [];

  for (let i = 0; i < needFilledCells; i++) {
    const randomCellIndex = Math.floor(Math.random() * freeCells.length);

    const randomCell = freeCells[randomCellIndex];

    randomCells.push(randomCell);

    freeCells.splice(randomCellIndex, 1);
  }

  return randomCells;
}

function genFilledCells(needGenAmount = 1) {
  const freeRandomCells = getFreeRandomCells(needGenAmount);

  freeRandomCells.forEach(cell => {
    const fieldCell = createCard();

    cell.appendChild(fieldCell);
  });
}

function clearBoard() {
  allCells.forEach(cell => cell.replaceChildren());
}

let isStarted = false;

const startButton = document.querySelector('.button.start');
const firstGenCellsCount = 2;

startButton.restartStyle = function() {
  this.textContent = 'Restart';
  this.classList.remove('start');
  this.classList.add('restart');
};

startButton.startStyle = function() {
  this.textContent = 'Start';
  this.classList.remove('restart');
  this.classList.add('start');
};

startButton.addEventListener('click', () => {
  event.preventDefault();

  if (isStarted) {
    startButton.startStyle();
    clearBoard();
  } else {
    startButton.restartStyle();
    genFilledCells(firstGenCellsCount);
  }

  isStarted = !isStarted;
});

function isFreeCell(cell) {
  return !cell.hasChildNodes();
}

function getFirstFreeCell(row) {
  for (let i = 0; i < row.length; i++) {
    if (isFreeCell(row[i])) {
      return i;
    }
  }

  return -1;
}

function shiftLeft() {
  const board = allCells.toBoard();
  const boardSize = board.length;

  for (let y = 0; y < boardSize; y++) {
    const currentRow = board[y];

    for (let x = 1; x < boardSize; x++) {
      const currentCell = board[y][x];

      if (!isFreeCell(currentCell)) {
        const card = currentCell.firstChild;
        const firstFreeCell = getFirstFreeCell(currentRow);

        if (x > firstFreeCell) {
          currentRow[x].replaceChildren();
          currentRow[firstFreeCell].appendChild(card);
        }
      }
    }
  }
}

document.addEventListener('keydown', () => {
  if (isStarted) {
    switch (event.key) {
      case 'ArrowUp':
        genFilledCells();
        break;
      case 'ArrowDown':
        genFilledCells();
        break;
      case 'ArrowLeft':
        shiftLeft();
        // genFilledCells();
        break;
      case 'ArrowRight':
        genFilledCells();
        break;
      default:
        break;
    }
  }
});
