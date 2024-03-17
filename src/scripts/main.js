'use strict';

const COLUMN_LENGTH = 4;
const WIN_VALUE = 2048;

const gameField = document.querySelector('.game-field').tBodies[0];
const rows = [...gameField.children];
const cells = [...gameField.querySelectorAll('.field-cell')];
const scoreBlock = document.querySelector('.game-score');
const bestBlock = document.querySelector('.game-best');
const tiles = [];

let wasAnyCellReplaced = false;
let score = 0;
let best = localStorage.getItem('best') || 0;

let xStartPoint = null;
let yStartPoint = null;
let lastY = 1;

function isPossibleToMove() {
  if (getEmptyCells().length > 0) {
    return true;
  }

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows.length; j++) {
      const currentCellValue = rows[i].children[j].dataset.num;

      if (j !== rows.length - 1) {
        const rightCellValue = rows[i].children[j + 1].dataset.num;

        if (currentCellValue === rightCellValue) {
          return true;
        }
      }

      if (i !== rows.length - 1) {
        const bottomCellValue = rows[i + 1].children[j].dataset.num;

        if (currentCellValue === bottomCellValue) {
          return true;
        }
      }
    }
  }

  return false;
}

function getCellsByRows() {
  return rows.map((row) => [...row.children]);
}

function getCellsByRowsReversed() {
  return getCellsByRows().map((row) => row.reverse());
}

function getCellsByColumns() {
  const columns = [];

  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const column = [];

    for (let j = 0; j < rows.length; j++) {
      column.push(rows[j].children[i]);
    }

    columns.push(column);
  }

  return columns;
}

function getCellsByReversedColumns() {
  const columns = [];

  for (let i = 0; i < COLUMN_LENGTH; i++) {
    const column = [];

    for (let j = 0; j < rows.length; j++) {
      column.push(rows[rows.length - j - 1].children[i]);
    }

    columns.push(column);
  }

  return columns;
}

function createTile(cell) {
  const tile = document.createElement('div');

  tile.classList.add('tile');
  tile.style.top = cell.offsetTop + 'px';
  tile.style.left = cell.offsetLeft + 'px';
  gameField.append(tile);

  return tile;
}

function initTilesAndCells() {
  for (let i = 0; i < cells.length; i++) {
    tiles.push(createTile(cells[i]));
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].dataset.id = i;
    cells[i].dataset.num = 0;
  }
}

function getEmptyCells() {
  return cells.filter((cell) => cell.dataset.num === '0');
}

function getRandomEmptyCell() {
  const emptyCells = getEmptyCells();
  const emptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  return emptyCell;
}

function makeNewCell() {
  const emptyCell = getRandomEmptyCell();
  const id = emptyCell.dataset.id;

  emptyCell.dataset.num = Math.random() >= 0.9 ? 4 : 2;
  tiles[id].textContent = emptyCell.dataset.num;
  tiles[id].classList.add(`tile--${emptyCell.dataset.num}`);
  tiles[id].classList.add('anim-show');

  setTimeout(() => tiles[id].classList.remove('anim-show'), 500);
}

function replaceEmptyCells(arrOfCells) {
  let isSorted = false;

  do {
    isSorted = true;

    for (let k = 0; k < arrOfCells.length; k++) {
      if (k === arrOfCells.length - 1) {
        break;
      }

      if (
        arrOfCells[k].dataset.num !== '0' &&
        arrOfCells[k + 1].dataset.num === '0'
      ) {
        arrOfCells[k + 1].dataset.num = arrOfCells[k].dataset.num;
        arrOfCells[k].dataset.num = 0;

        [arrOfCells[k + 1].dataset.id, arrOfCells[k].dataset.id] = [
          arrOfCells[k].dataset.id,
          arrOfCells[k + 1].dataset.id,
        ];

        wasAnyCellReplaced = true;

        isSorted = false;
      }
    }
  } while (!isSorted);
}

function slide(groupedCells) {
  for (let i = 0; i < groupedCells.length; i++) {
    const cellsGroup = groupedCells[i];

    replaceEmptyCells(cellsGroup);

    for (let k = 2; k >= 0; k--) {
      if (k === cellsGroup.length - 1) {
        break;
      }

      if (
        cellsGroup[k].dataset.num === cellsGroup[k + 1].dataset.num &&
        cellsGroup[k].dataset.num !== '0'
      ) {
        const cellToRemove = cellsGroup[k];
        const cellToDouble = cellsGroup[k + 1];
        const tileToRemove = tiles[cellToRemove.dataset.id];
        const tileToDouble = tiles[cellToDouble.dataset.id];
        const newNumber = cellToDouble.dataset.num * 2;

        tileToRemove.classList.remove(`tile--${cellToRemove.dataset.num}`);
        tileToRemove.textContent = '';
        cellToRemove.dataset.num = 0;

        tileToDouble.classList.remove(`tile--${cellToDouble.dataset.num}`);
        cellToDouble.dataset.num = newNumber;
        tileToDouble.textContent = newNumber;
        tileToDouble.classList.add(`tile--${newNumber}`);
        tileToDouble.classList.add(`anim-merge`);

        setTimeout(() => tileToDouble.classList.remove(`anim-merge`), 500);

        wasAnyCellReplaced = true;
        score += newNumber;

        if (newNumber === WIN_VALUE) {
          document.querySelector('.message-win').classList.remove('hidden');
        }

        replaceEmptyCells(cellsGroup);
      }
    }
  }

  cells.forEach((cell) => {
    tiles[cell.dataset.id].style.top = cell.offsetTop + 'px';
    tiles[cell.dataset.id].style.left = cell.offsetLeft + 'px';
  });
}

function slideUp() {
  const cellsArr = getCellsByReversedColumns();

  slide(cellsArr);

  if (wasAnyCellReplaced) {
    makeNewCell();

    wasAnyCellReplaced = false;
  }
}

function slideDown() {
  const cellsArr = getCellsByColumns();

  slide(cellsArr);

  if (wasAnyCellReplaced) {
    makeNewCell();

    wasAnyCellReplaced = false;
  }
}

function slideRight() {
  const cellsArr = getCellsByRows();

  slide(cellsArr);

  if (wasAnyCellReplaced) {
    makeNewCell();

    wasAnyCellReplaced = false;
  }
}

function slideLeft() {
  const cellsArr = getCellsByRowsReversed();

  slide(cellsArr);

  if (wasAnyCellReplaced) {
    makeNewCell();

    wasAnyCellReplaced = false;
  }
}

function endMove() {
  if (score > best) {
    localStorage.setItem('best', score);

    best = score;
  }

  scoreBlock.textContent = score;
  bestBlock.textContent = best;

  if (!isPossibleToMove()) {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

function handleButtonClick(e) {
  e.target.textContent = 'Restart';
  e.target.classList.remove('start');
  e.target.classList.add('restart');

  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');

  cells.forEach((cell) => {
    tiles[cell.dataset.id].textContent = '';
    tiles[cell.dataset.id].classList.remove(`tile--${cell.dataset.num}`);
    cell.dataset.num = 0;
  });

  score = 0;

  document.querySelector('.game-score').textContent = 0;

  makeNewCell();
  makeNewCell();
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      slideUp();
      break;

    case 'ArrowDown':
      slideDown();
      break;

    case 'ArrowRight':
      slideRight();
      break;

    case 'ArrowLeft':
      slideLeft();
      break;
  }

  endMove();
}

function handleTouchStart(e) {
  const firstTouch = e.touches[0];

  xStartPoint = firstTouch.clientX;
  yStartPoint = firstTouch.clientY;
}

function handleTouchMove(e) {
  if (!xStartPoint || !yStartPoint) {
    // eslint-disable-next-line no-useless-return
    return;
  }

  const xEndPoint = e.touches[0].clientX;
  const yEndPoint = e.touches[0].clientY;

  const xDiff = xEndPoint - xStartPoint;
  const yDiff = yEndPoint - yStartPoint;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      slideRight();
    } else {
      slideLeft();
    }
  } else {
    if (yDiff > 0) {
      slideDown();
    } else {
      slideUp();
    }
  }

  xStartPoint = null;
  yStartPoint = null;

  endMove();
}

function disableScrollReload(e) {
  const lastS = document.documentElement.scrollTop;

  if (lastS === 0 && lastY - e.touches[0].clientY < 0 && e.cancelable) {
    e.preDefault();
    e.stopPropagation();
  }

  lastY = e.touches[0].clientY;
}

bestBlock.textContent = best;

initTilesAndCells();

document.querySelector('.button').addEventListener('click', handleButtonClick);
document.addEventListener('keyup', handleInput);
gameField.addEventListener('touchstart', handleTouchStart, false);
gameField.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchmove', disableScrollReload, { passive: false });
