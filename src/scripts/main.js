'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageRules = document.querySelector('.message-rules');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');

let checkMove = false;

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

  checkMove = false;

  if (arrows.includes(key)) {
    handleArrowKeyAction(key);

    if (checkMove) {
      if (button.classList.contains('start')
      && !messageRules.classList.contains('hidden')) {
        setGameRestart();
      }

      addNewTile();
    }
  }
});

function startGame() {
  filledCells.forEach(clearCell);
  updateCellLists();

  hideMessage(messageStart);
  hideMessage(messageLose);
  hideMessage(messageWin);
  showMessage(messageRules);

  for (let i = 0; i < 2; i++) {
    addNewTile();
  }
}

function restartGame() {
  filledCells.forEach(clearCell);
  updateCellLists();
  setGameStart();

  hideMessage(messageLose);
  hideMessage(messageWin);
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

  if (emptyCells.length === 0 && !checkAvailableMergers()) {
    showMessage(messageLose);
  }
}

function getRandomCellIndex() {
  return Math.floor(Math.random() * emptyCells.length);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function clearCell(cell) {
  cell.classList.remove(cell.classList[1]);
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
  showMessage(messageStart);
  gameScore.textContent = '0';
}

function setGameRestart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  hideMessage(messageRules);
}

function moveTile(cell, direction) {
  const cellIndex = [...cells].indexOf(cell);
  let emptyCell = cell;
  let merged = false;

  for (let j = getNextCellIndex(cellIndex, direction);
    j !== null;
    j = getNextCellIndex(j, direction)) {
    const nextCell = cells[j];

    if (cell.textContent === nextCell.textContent) {
      mergeTiles(cell, nextCell);
      merged = true;
      updateCellLists();
      clearCell(cell);
      checkMove = true;

      break;
    } else if (emptyCells.includes(nextCell)) {
      emptyCell = nextCell;
    } else {
      break;
    }
  }

  if (emptyCell !== cell && !merged) {
    emptyCell.classList.add(cell.classList[1]);
    emptyCell.textContent = cell.textContent;
    clearCell(cell);
    checkMove = true;
    updateCellLists();
  }
}

function mergeTiles(cell, nextCell) {
  const newNumber = cell.textContent * 2;

  nextCell.textContent = newNumber;

  nextCell.classList
    .replace(nextCell.classList.item(1), `field-cell--${newNumber}`);

  clearCell(cell);
  updateCellLists();

  gameScore.textContent = +gameScore.textContent + newNumber;

  if (newNumber === 2048) {
    showMessage(messageWin);
  }
}

function checkAvailableMergers() {
  for (const cell of filledCells) {
    for (const arrow of arrows) {
      const direction = DIRECTIONS[arrow];
      const cellIndex = [...cells].indexOf(cell);
      const nextCellIndex = getNextCellIndex(cellIndex, direction);

      if (nextCellIndex !== null
        && cell.textContent === cells[nextCellIndex].textContent) {
        return true;
      }
    }
  }

  return false;
}

function getNextCellIndex(cellIndex, direction) {
  const isVerticalMove = Math.abs(direction) === 4;
  const maxIndex = isVerticalMove
    ? cells.length - 1
    : (Math.floor(cellIndex / 4) + 1) * 4 - 1;
  const minIndex = isVerticalMove ? 0 : Math.floor(cellIndex / 4) * 4;
  const nextCellIndex = cellIndex + direction;

  return nextCellIndex >= minIndex && nextCellIndex <= maxIndex
    ? nextCellIndex
    : null;
}

function showMessage(messageElement) {
  messageElement.classList.remove('hidden');
}

function hideMessage(messageElement) {
  messageElement.classList.add('hidden');
}
