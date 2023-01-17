'use strict';

let score = 0;
let isPlaying = false;

const row1 = [0, 1, 2, 3];
const row2 = [4, 5, 6, 7];
const row3 = [8, 9, 10, 11];
const row4 = [12, 13, 14, 15];

const column1 = [0, 4, 8, 12];
const column2 = [1, 5, 9, 13];
const column3 = [2, 6, 10, 14];
const column4 = [3, 7, 11, 15];

const rightDirection = [column3, column2, column1].flat();
const leftDirection = [column2, column3, column4].flat();
const upDirection = [row2, row3, row4].flat();
const downDirection = [row3, row2, row1].flat();

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.start');
const restartButton = document.createElement('button');
const messageLoseElement = document.querySelector('.message-lose');
const messageWinElement = document.querySelector('.message-win');
const messageStartElement = document.querySelector('.message-start');

restartButton.classList.add('button', 'restart');
restartButton.textContent = 'Restart';
restartButton.hidden = true;
document.querySelector('.controls').append(restartButton);

const checkIfHaveMoves = () => {
  if ([...cells].filter(cell => cell.classList.length === 1).length > 0) {
    return true;
  }

  let haveMoves = false;

  cells.forEach((cell, i) => {
    const topCell = row1.includes(i) ? null : cells[i - 4];
    const bottomCell = row4.includes(i) ? null : cells[i + 4];
    const leftCell = column1.includes(i) ? null : cells[i - 1];
    const rightCell = column4.includes(i) ? null : cells[i + 1];

    const adjacentCells = [topCell, bottomCell, leftCell, rightCell];

    adjacentCells.forEach(adjacentCell => {
      if (!adjacentCell) {
        return;
      }

      if (adjacentCell.textContent === cell.textContent) {
        haveMoves = true;
      }
    });
  });

  return haveMoves;
};

const updateScore = (value) => {
  if (value) {
    score += value;
  } else {
    score = 0;
  }
  document.querySelector('.game-score').textContent = score;
};

const findCellForNumber = function() {
  let found = false;
  let cellIndex;

  while (!found) {
    cellIndex = Math.floor(Math.random() * 16);

    if (cells[cellIndex].classList.length === 1) {
      found = true;
    }
  }

  return cells[cellIndex];
};

const generateNumberForTile = () => {
  const num = Math.random();

  return num < 0.9 ? 2 : 4;
};

const appendNewNumberTile = () => {
  const number = generateNumberForTile();
  const cell = findCellForNumber();

  cell.classList.add(`field-cell--${number}`);
  cell.textContent = number;
};

const updateCell = (cell, value = '') => {
  cell.className = value ? `field-cell field-cell--${value}` : 'field-cell';
  cell.textContent = value;
};

const moveHelper = (currentCell, nextCell, cellValue) => {
  if (nextCell.classList.length > 1) {
    return;
  };

  updateCell(currentCell);
  updateCell(nextCell, cellValue);
};

const addHelper = (currentCell, nextCell, cellValue) => {
  if (Number(nextCell.textContent) === Number(cellValue)) {
    updateCell(currentCell);
    updateCell(nextCell, cellValue * 2);
    updateScore(cellValue * 2);

    if (Number(cellValue * 2) === 2048) {
      isPlaying = false;
      messageWinElement.classList.remove('hidden');
    }
  };
};

const moveAddTiles = (tilesIndexes, direction, type = 'move') => {
  let step;

  switch (direction) {
    case 'right':
      step = 1;
      break;
    case 'left':
      step = -1;
      break;
    case 'up':
      step = -4;
      break;
    case 'down':
      step = 4;
      break;
  };

  tilesIndexes.forEach(index => {
    const currentCell = cells[index];

    if (currentCell.classList.length === 1) {
      return;
    };

    const nextCell = cells[index + step];
    const cellValue = currentCell.textContent;

    if (type === 'move') {
      moveHelper(currentCell, nextCell, cellValue);

      return;
    };
    addHelper(currentCell, nextCell, cellValue);
  });
};

const moveDirectionAndSum = (directionArr, direction) => {
  moveAddTiles(directionArr, direction);
  moveAddTiles(directionArr, direction);
  moveAddTiles(directionArr, direction);
  moveAddTiles(directionArr, direction, 'add');
  moveAddTiles(directionArr, direction);
  moveAddTiles(directionArr, direction);
};

const innit = () => {
  appendNewNumberTile();
  appendNewNumberTile();
  isPlaying = true;
};

const startButtonCallback = () => {
  innit();
  startButton.remove();
  restartButton.hidden = false;
  messageStartElement.classList.add('hidden');
};

const restartButtonCallback = () => {
  updateScore(0);
  messageLoseElement.classList.add('hidden');
  messageWinElement.classList.add('hidden');

  for (const cell of cells) {
    cell.className = 'field-cell';
    cell.textContent = '';
  };
  innit();
};

const keydownCallback = (e) => {
  e.preventDefault();

  if (!checkIfHaveMoves()) {
    isPlaying = false;
    messageLoseElement.classList.remove('hidden');
  };

  const currentCellsValues = [...cells].map(cell => cell.textContent);

  if (!isPlaying) {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      moveDirectionAndSum(downDirection, 'down');
      break;
    case 'ArrowUp':
      moveDirectionAndSum(upDirection, 'up');
      break;
    case 'ArrowLeft':
      moveDirectionAndSum(leftDirection, 'left');
      break;
    case 'ArrowRight':
      moveDirectionAndSum(rightDirection, 'right');
      break;
  };

  const newCellsValues = [...cells].map(cell => cell.textContent);

  const hasChanged = currentCellsValues.filter(
    (value, i) => value !== newCellsValues[i]).length;

  if (hasChanged) {
    appendNewNumberTile();
  }
};

startButton.addEventListener('click', startButtonCallback);
restartButton.addEventListener('click', restartButtonCallback);
document.addEventListener('keydown', keydownCallback);
