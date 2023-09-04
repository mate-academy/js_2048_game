'use strict';

const cells = Array.from(document.getElementsByClassName('field-cell'));
const buttonStart = document.querySelector('.start');
const buttonRestart = document.querySelector('.restart');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

function getRandomIndex() {
  return Math.floor(Math.random() * cells.length);
}

function getRandomNumber() {
  return Math.random() > 0.5 ? 2 : 4;
}

function setStyles() {
  for (const cell of cells) {
    const textContent = cell.textContent;
    const styleClass = `field-cell--${textContent}`;

    for (let i = 1; i <= 2048; i *= 2) {
      cell.classList.remove(`field-cell--${i}`);
    }

    if (textContent) {
      cell.classList.add(styleClass);
    }
  }
}

function getScore() {
  gameScore.textContent = cells.reduce((acc, num) => acc + +num.textContent, 0);

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent >= 2048) {
      messageWin.classList.remove('hidden');
    }
  }
}

function start() {
  const randomIndex1 = getRandomIndex();
  let randomIndex2 = getRandomIndex();

  while (randomIndex1 === randomIndex2) {
    randomIndex2 = getRandomIndex();
  }

  cells[randomIndex1].textContent = getRandomNumber();
  cells[randomIndex2].textContent = getRandomNumber();

  setStyles();
  buttonStart.classList.add('hidden');
  buttonRestart.classList.remove('hidden');
  messageStart.classList.add('hidden');

  getScore();

  messageLose.classList.add('hidden');
}

function restart() {
  for (const cell of cells) {
    cell.classList.remove(`field-cell--${cell.textContent}`);
    cell.textContent = '';
  }

  start();
}

function setRandomEmptyCell() {
  const arrWithEmptyCell = [];

  for (const cell of cells) {
    if (!cell.textContent) {
      arrWithEmptyCell.push(cell);
    }
  }

  if (!arrWithEmptyCell.length) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * arrWithEmptyCell.length);

  arrWithEmptyCell[randomIndex].textContent = getRandomNumber();
  setStyles();
}

buttonStart.addEventListener('click', start);
buttonRestart.addEventListener('click', restart);

setupInputOnce();

function setupInputOnce() {
  document.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      move('up');
      break;
    case 'ArrowDown':
      move('down');
      break;
    case 'ArrowLeft':
      move('left');
      break;
    case 'ArrowRight':
      move('right');
      break;
    default:
      setupInputOnce();

      return;
  }

  setupInputOnce();
};

const rows = 4;
const cols = 4;

const cellsGroupedByRow = [];

for (let i = 0; i < rows; i++) {
  const row = [];

  for (let j = 0; j < cols; j++) {
    const index = i * cols + j;

    row.push(cells[index]);
  }
  cellsGroupedByRow.push(row);
}

const cellsGroupedByReversedRow = cellsGroupedByRow.map(
  row => [...row].reverse());

const cellsGroupedByColumn = [];

for (let i = 0; i < cols; i++) {
  const row = [];

  for (let j = 0; j < rows; j++) {
    const index = j * cols + i;

    row.push(cells[index]);
  }
  cellsGroupedByColumn.push(row);
}

const cellsGroupedByReversedColumn = cellsGroupedByColumn.map(
  column => [...column].reverse());

function move(direction) {
  let moved = false;
  let groupedCells;

  switch (direction) {
    case 'up':
      groupedCells = cellsGroupedByColumn;
      break;
    case 'down':
      groupedCells = cellsGroupedByReversedColumn;
      break;
    case 'left':
      groupedCells = cellsGroupedByRow;
      break;
    case 'right':
      groupedCells = cellsGroupedByReversedRow;
      break;
  }

  for (let i = 0; i < 4; i++) {
    if (slideTiles(groupedCells)) {
      moved = true;
    }
  }

  if (moved) {
    setRandomEmptyCell();
  }

  getScore();
  setStyles();
  resetMergedFlags();
}

function resetMergedFlags() {
  for (const cell of cells) {
    cell.merged = false;
  }
}

function slideTiles(groupedCells) {
  let moved = false;

  groupedCells.forEach(group => {
    if (slideTilesInGroup(group)) {
      moved = true;
    }
  });

  return moved;
}

function slideTilesInGroup(group) {
  let moved = false;

  for (let i = 1; i < group.length; i++) {
    if (!group[i].textContent) {
      continue;
    }

    const cellWithTile = group[i];

    if (group[i].textContent
      && group[i - 1].textContent
      && group[i].textContent !== group[i - 1].textContent) {
      continue;
    }

    for (let j = i - 1; j >= 0; j--) {
      const targetCell = group[j];

      if (!targetCell) {
        continue;
      }

      if (!targetCell.textContent) {
        targetCell.textContent = cellWithTile.textContent;
        cellWithTile.textContent = '';
        moved = true;
      } else if (targetCell.textContent === cellWithTile.textContent
          && !cellWithTile.merged && !targetCell.merged) {
        targetCell.textContent = +targetCell.textContent
        + +cellWithTile.textContent;
        cellWithTile.textContent = '';
        cellWithTile.merged = true;
        targetCell.merged = true;
        moved = true;
      }
    }
  }

  return moved;
}
