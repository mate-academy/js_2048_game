'use strict';

const allCells = [...document.querySelectorAll('.field-cell')];

function createFieldCell(
  cellWeight = Math.random() <= 0.2 ? 4 : 2
) {
  const filledCell = document.createElement('div');

  filledCell.classList.add('cell', `cell--${cellWeight}`);
  filledCell.textContent = `${cellWeight}`;

  return filledCell;
}

function getAllFreeCells() {
  return allCells.filter(cell => !cell.hasChildNodes());
}

function getFreeRandomCells(needFilledCells = 1) {
  const freeCells = getAllFreeCells();
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
    const fieldCell = createFieldCell();

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
        genFilledCells();
        break;
      case 'ArrowRight':
        genFilledCells();
        break;
      default:
        break;
    }
  }
});
