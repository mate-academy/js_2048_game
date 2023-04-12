'use strict';

const ClassActions = {
  ADD: 'add',
  DELETE: 'delete',
  REPLACE: 'replace',
};

let isStarted = false;
let isWon = false;
let isLose = false;
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const actionButton = document.querySelector('.start');
const rows = [...document.querySelectorAll('.field-row')];
const scoreTable = document.querySelector('.game-score');

const cells = [...document.querySelectorAll('.field-cell')];
const rowSize = 4;

actionButton.addEventListener('click', () => {
  isStarted = handleGameStatus(isStarted);
});

document.addEventListener('keydown', (e) => {
  if (!isStarted) {
    return;
  }

  if (e.key === 'ArrowRight') {
    moveAllRight();
  }

  if (e.key === 'ArrowLeft') {
    moveAllLeft();
  }

  if (e.key === 'ArrowDown') {
    moveAllDown();
  }

  if (e.key === 'ArrowUp') {
    moveAllUp();
  }

  checkForWin();
  checkForLose();
});

const handleGameStatus = (isGameStarted) => {
  if (isGameStarted || isWon || isLose) {
    restartGame();
  } else {
    startGame();
  }

  return true;
};

const handleCellClasses = (element, value, action) => {
  switch (action) {
    case ClassActions.ADD:
      element.classList.add(`field-cell--${value}`);
      break;

    case ClassActions.DELETE:
      element.classList.remove(`field-cell--${value}`);
      break;

    case ClassActions.REPLACE:
      element.className = `field-cell field-cell--${value}`;
      break;

    default:
      break;
  }
};

const moveAllRight = () => {
  rows.forEach(row => {
    const rowArray = [...row.children];

    moveSingleSetOfCells(rowArray);
  });

  createCell();
};

const moveAllLeft = () => {
  rows.forEach(row => {
    const rowArray = [...row.children].reverse();

    moveSingleSetOfCells(rowArray);
  });

  createCell();
};

const moveAllDown = () => {
  const cols = getCols(rows);

  cols.forEach(col => {
    moveSingleSetOfCells(col);
  });

  createCell();
};

const moveAllUp = () => {
  const cols = getCols(rows).reverse();

  cols.forEach(col => {
    moveSingleSetOfCells(col.reverse());
  });

  createCell();
};

const getCols = (inputRows) => {
  const arrayOfCols = [];

  for (let i = 0; i < inputRows.length; i++) {
    const col = [];

    for (let j = 0; j < inputRows.length; j++) {
      col.push(inputRows[j].children[i]);
    }
    arrayOfCols.push(col);
  }

  return arrayOfCols;
};

const moveSingleSetOfCells = (setOfCells) => {
  for (let i = 0; i < rowSize - 1; i++) {
    const currentCellValue = +setOfCells[i].innerHTML;

    for (let j = i + 1; j < rowSize; j++) {
      const nextCellValue = +setOfCells[j].innerHTML;
      const notEmpty = currentCellValue !== 0 && nextCellValue !== 0;
      const haveSameValues = currentCellValue === nextCellValue;

      if (!haveSameValues && notEmpty) {
        break;
      }

      if (haveSameValues && notEmpty) {
        const newValue = currentCellValue + currentCellValue;

        setOfCells[i].innerHTML = newValue;

        handleCellClasses(
          setOfCells[i],
          setOfCells[i].innerHTML,
          ClassActions.REPLACE
        );

        handleCellClasses(setOfCells[j], currentCellValue, ClassActions.DELETE);
        setOfCells[j].innerHTML = '';

        scoreTable.innerHTML = +scoreTable.innerHTML + newValue;

        break;
      }
    }
  }

  for (let i = rowSize - 1; i > 0; i--) {
    const isCurrentEmpty = setOfCells[i].innerHTML === '';

    for (let j = i - 1; j >= 0; j--) {
      if (isCurrentEmpty && setOfCells[j].innerHTML !== '') {
        setOfCells[i].innerHTML = setOfCells[j].innerHTML;

        handleCellClasses(
          setOfCells[i],
          setOfCells[j].innerHTML,
          ClassActions.ADD
        );

        handleCellClasses(
          setOfCells[j],
          setOfCells[j].innerHTML,
          ClassActions.DELETE
        );
        setOfCells[j].innerHTML = '';
        break;
      }
    }
  }
};

const createCell = () => {
  const emptyCells = cells.filter(cell => {
    return cell.innerHTML === '';
  });
  const randomCellIndex = randomize(emptyCells);

  if (randomCellIndex !== undefined) {
    const cellValue = Math.random() < 0.9 ? 2 : 4;

    emptyCells[randomCellIndex].innerHTML = cellValue;
    handleCellClasses(emptyCells[randomCellIndex], cellValue, ClassActions.ADD);
  }
};

const randomize = (emptyCellsArray) => {
  if (emptyCellsArray.length) {
    return Math.floor(Math.random() * emptyCellsArray.length);
  }
};

const placeTwoCells = () => {
  createCell();
  createCell();
};

const startGame = () => {
  placeTwoCells();
  startMessage.classList.add('hidden');
  actionButton.className = 'button restart';
  actionButton.innerHTML = 'Restart';
};

const restartGame = () => {
  scoreTable.innerHTML = 0;

  if (isWon) {
    winMessage.classList.add('hidden');
  }

  if (isLose) {
    loseMessage.classList.add('hidden');
  }

  cells.forEach(cell => {
    cell.innerHTML = '';
    cell.className = 'field-cell';
  });

  placeTwoCells();
};

const checkForLose = () => {
  const emptyCellsArray = cells.filter(cell => cell.innerHTML === '');
  const cols = getCols(rows);

  if (emptyCellsArray.length) {
    return;
  }

  if (!checkSetOfCells(rows) && !checkSetOfCells(cols)) {
    handleLose();
  };
};

const checkCells = (arrayOfCells) => {
  for (let i = 0; i < arrayOfCells.length - 1; i++) {
    const curretCellValue = +arrayOfCells[i].innerHTML;
    const nextCellValue = +arrayOfCells[i + 1].innerHTML;

    if (curretCellValue === nextCellValue) {
      return true;
    }
  }

  return false;
};

const checkSetOfCells = (setOfCells) => {
  for (let i = 0; i < setOfCells.length; i++) {
    const row = setOfCells[i];
    let rowArray = [];

    if (Array.isArray(row)) {
      rowArray = row;
    } else {
      rowArray = [...row.children];
    }

    const hasTurns = checkCells(rowArray);

    if (hasTurns) {
      return true;
    }
  }

  return false;
};

const checkForWin = () => {
  isWon = cells.find(cell => cell.innerHTML === '2048') !== undefined;

  if (isWon) {
    winMessage.classList.remove('hidden');
    isStarted = false;
  }
};

const handleLose = () => {
  isStarted = false;
  loseMessage.classList.remove('hidden');
  isLose = true;
};
