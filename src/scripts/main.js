'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageRules = document.querySelector('.message-rules');
const cells = document.querySelectorAll('.field-cell');
let shouldAddNewTile = false;

let emptyCells = [];
let filledCells = [];

const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const DIRECTIONS = {
  'ArrowUp': -4,
  'ArrowDown': 4,
  'ArrowLeft': -1,
  'ArrowRight': 1,
};

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    startGame();
  } else if (button.classList.contains('restart')) {
    restartGame();
  }
});

document.addEventListener('keydown', keydownEvent => {
  const key = keydownEvent.key;

  shouldAddNewTile = false;

  if (arrows.includes(key)) {
    if (button.classList.contains('start')
    && !messageRules.classList.contains('hidden')) {
      setGameRestart();
    }

    handleArrowKeyAction(key);

    if (shouldAddNewTile) {
      addNewTile();
    }
  }
});

function startGame() {
  filledCells.forEach(clearCell);
  updateCellLists();

  messageStart.classList.add('hidden');
  messageRules.classList.remove('hidden');

  for (let i = 0; i < 2; i++) {
    addNewTile();
  }
}

function restartGame() {
  filledCells.forEach(clearCell);
  updateCellLists();
  setGameStart();
}

function addNewTile() {
  const randomCellIndex = getRandomCellIndex();
  const randomNumber = getRandomNumber();
  const randomCell = emptyCells[randomCellIndex];

  randomCell.classList.add(`field-cell--${randomNumber}`);
  randomCell.textContent = `${randomNumber}`;

  updateCellLists();
}

function handleArrowKeyAction(key) {
  const direction = DIRECTIONS[key];
  const cellsToMove = direction > 0 ? [...filledCells].reverse() : filledCells;

  for (const cell of cellsToMove) {
    moveTile(cell, direction);
  }
}

function getRandomCellIndex() {
  return Math.floor(Math.random() * emptyCells.length);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function clearCell(cell) {
  const cssClass = cell.classList[1];

  cell.classList.remove(cssClass);
  cell.textContent = '';
  updateCellLists();
}

function updateCellLists() {
  emptyCells = [...cells].filter(item => item.classList.length === 1);
  filledCells = [...cells].filter(item => item.classList.length > 1);
}

function setGameStart() {
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
  messageStart.classList.remove('hidden');
}

function setGameRestart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messageRules.classList.add('hidden');
}

function moveTile(cell, direction) {
  const cellIndex = [...cells].indexOf(cell);
  let emptyCell = cell;
  let j = cellIndex + direction;
  const isVerticalMove = Math.abs(direction) === 4;
  const maxIndex = isVerticalMove
    ? cells.length
    : (Math.floor(cellIndex / 4) + 1) * 4 - 1;
  const minIndex = isVerticalMove ? 0 : Math.floor(cellIndex / 4) * 4;
  let merged = false;

  while (j >= minIndex && j <= maxIndex && emptyCells.includes(cells[j])) {
    emptyCell = cells[j];
    j += direction;
  }

  if (emptyCell !== cell) {
    if (j >= minIndex && j <= maxIndex && cell.textContent === cells[j].textContent && !merged) {
      mergeTiles(cell, cells[j]);
      merged = true;
    } else {
      emptyCell.classList.add(cell.classList[1]);
      emptyCell.textContent = cell.textContent;
    }
    clearCell(cell);
    shouldAddNewTile = true;
    updateCellLists();
  }
}

function mergeTiles(cell, nextCell) {
  const newNumber = cell.textContent * 2;

  nextCell.classList.replace(nextCell.classList.item(1), `field-cell--${newNumber}`);
  nextCell.textContent = newNumber;

  clearCell(cell);
  updateCellLists();
}
