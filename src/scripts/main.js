'use strict';

const buttonStart = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const rows = document.querySelectorAll('.field-row');
const cells = [];
let filledCells;
let epmtyCells;
let firstMove = false;
let moved = false;

for (const row of rows) {
  for (const cell of row.cells) {
    cells.push({
      cell: cell,
      row: row.sectionRowIndex,
      column: cell.cellIndex,
      value: 0,
    });
  }
}

function fillCell() {
  const randomEmptyCell = Math.floor(Math.random() * epmtyCells.length);

  if (Math.random() > 0.9) {
    epmtyCells[randomEmptyCell].cell.textContent = 4;
    epmtyCells[randomEmptyCell].cell.classList.add('field-cell--4');
    epmtyCells[randomEmptyCell].value = 4;
  } else {
    epmtyCells[randomEmptyCell].cell.textContent = 2;
    epmtyCells[randomEmptyCell].cell.classList.add('field-cell--2');
    epmtyCells[randomEmptyCell].value = 2;
  }

  filledCells.push(...epmtyCells.splice(randomEmptyCell, 1));
}

function moveNumbers(direction, merge) {
  let filledCell;
  let sortCells;
  let filterCells;
  let findCell;

  switch (direction) {
    case 'Up':
      sortCells = (cellA, cellB) => cellA.row - cellB.row;

      filterCells = (cell) => filledCell.column === cell.column
        && filledCell.row > cell.row;

      findCell = (cell) => filledCell.column === cell.column
        && (filledCell.row - 1) === cell.row;
      break;

    case 'Down':
      sortCells = (cellA, cellB) => cellB.row - cellA.row;

      filterCells = (cell) => filledCell.column === cell.column
        && filledCell.row < cell.row;

      findCell = (cell) => filledCell.column === cell.column
        && (filledCell.row + 1) === cell.row;
      break;

    case 'Right':
      sortCells = (cellA, cellB) => cellB.column - cellA.column;

      filterCells = (cell) => filledCell.row === cell.row
        && filledCell.column < cell.column;

      findCell = (cell) => filledCell.row === cell.row
        && (filledCell.column + 1) === cell.column;
      break;

    case 'Left':
      sortCells = (cellA, cellB) => cellA.column - cellB.column;

      filterCells = (cell) => filledCell.row === cell.row
        && filledCell.column > cell.column;

      findCell = (cell) => filledCell.row === cell.row
        && (filledCell.column - 1) === cell.column;
      break;
  }

  filledCells.sort(sortCells);

  if (!merge) {
    for (filledCell of filledCells) {
      const epmtyCellForMove = epmtyCells
        .filter(filterCells)
        .sort(sortCells)[0];

      if (epmtyCellForMove) {
        cellExchange(filledCell, epmtyCellForMove);
      }
    }
  } else {
    for (filledCell of filledCells) {
      const filledCellForMerge = filledCells
        .filter(cell => filledCell.value === cell.value && cell !== filledCell)
        .find(findCell);

      if (filledCellForMerge) {
        cellExchange(filledCell, filledCellForMerge, 'merge');
      }
    }
  }
}

function startGame() {
  cells.forEach(item => {
    item.cell.textContent = '';
    item.cell.className = 'field-cell';
    item.value = 0;
  });

  epmtyCells = [...cells];
  filledCells = [];
  fillCell();
  fillCell();
  document.querySelector('.message-start').classList.toggle('hidden', true);
  document.querySelector('.message-win').classList.toggle('hidden', true);
  document.querySelector('.message-lose').classList.toggle('hidden', true);
  gameScore.textContent = '0';

  document.addEventListener('keydown', gameMove);
}

function gameMove(e) {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown'
    && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
    return;
  }

  if (e.key === 'ArrowUp') {
    moveNumbers('Up');
    moveNumbers('Up', 'merge');
    moveNumbers('Up');
  }

  if (e.key === 'ArrowDown') {
    moveNumbers('Down');
    moveNumbers('Down', 'merge');
    moveNumbers('Down');
  }

  if (e.key === 'ArrowRight') {
    moveNumbers('Right');
    moveNumbers('Right', 'merge');
    moveNumbers('Right');
  }

  if (e.key === 'ArrowLeft') {
    moveNumbers('Left');
    moveNumbers('Left', 'merge');
    moveNumbers('Left');
  }

  if (moved) {
    if (!firstMove) {
      firstMove = true;
      buttonStart.classList.remove('start');
      buttonStart.classList.add('restart');
      buttonStart.textContent = 'Restart';
    }

    fillCell();
    moved = false;

    if (!epmtyCells.length) {
      let canMove = false;

      for (const filledCell of filledCells) {
        const cellOfPreviousRow = filledCells.find(cell =>
          cell.row === filledCell.row - 1 && cell.column === filledCell.column);
        const cellOfNextRow = filledCells.find(cell =>
          cell.row === filledCell.row + 1 && cell.column === filledCell.column);
        const cellOfPreviousColumn = filledCells.find(cell =>
          cell.column === filledCell.column - 1 && cell.row === filledCell.row);
        const cellOfNextColumn = filledCells.find(cell =>
          cell.column === filledCell.column - 1 && cell.row === filledCell.row);

        if (cellOfPreviousRow) {
          if (cellOfPreviousRow.value === filledCell.value) {
            canMove = true;
          }
        }

        if (cellOfNextRow) {
          if (cellOfNextRow.value === filledCell.value) {
            canMove = true;
          }
        }

        if (cellOfPreviousColumn) {
          if (cellOfPreviousColumn.value === filledCell.value) {
            canMove = true;
          }
        }

        if (cellOfNextColumn) {
          if (cellOfNextColumn.value === filledCell.value) {
            canMove = true;
          }
        }
      }

      if (!canMove) {
        document.querySelector('.message-lose').classList.remove('hidden');
        document.removeEventListener('keydown', gameMove);
      }
    }
  }
}

function cellExchange(whereFrom, whereTo, merge) {
  moved = true;
  whereTo.cell.textContent = whereFrom.value + whereTo.value;
  whereTo.value = whereFrom.value + whereTo.value;
  whereTo.cell.classList.add('field-cell--' + whereTo.value);

  if (!merge) {
    filledCells.push(whereTo);
  }

  whereFrom.cell.textContent = '';
  whereFrom.cell.className = 'field-cell';
  whereFrom.value = 0;
  epmtyCells.push(whereFrom);
  epmtyCells = epmtyCells.filter(cell => cell.value === 0);
  filledCells = filledCells.filter(cell => cell.value > 0);

  if (merge) {
    gameScore.textContent = +gameScore.textContent + whereTo.value;

    if (whereTo.value === 2048) {
      document.querySelector('.message-win').classList.remove('hidden');
      document.removeEventListener('keydown', gameMove);
    }
  }
}

buttonStart.addEventListener('click', startGame);
