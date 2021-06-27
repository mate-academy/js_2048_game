'use strict';

// write your code here
const root = document.querySelector('.container');

const allCellField = root.querySelectorAll('tbody td');
const allRowsField = root.querySelectorAll('tbody tr');
const btnStart = root.querySelector('.start');
const messageFooter = root.querySelector('.message-container');
const gameScore = root.querySelector('.game-score');

const randomNumber = (min = 0, max = 15) => {
  return Math.ceil(Math.random() * (max - min) + min);
};

const changeCellValue = (numberChange,
  cellsField = root.querySelectorAll('tbody td:not(.notFree)')) => {
  let randomStart = randomNumber();

  for (let i = 0; i < numberChange; i++) {
    let random = randomNumber(0, cellsField.length - 1);

    for (; random === randomStart;) {
      random = randomNumber(0, cellsField.length - 1);
    }

    if (!cellsField[random]) {
      return;
    }

    const valueCell = randomNumber(0, 10) > 9 ? 4 : 2;

    cellsField[random].className = `
    field-cell field-cell--${valueCell} notFree`;
    cellsField[random].textContent = valueCell;
    randomStart = random;
  }
};

const loseGame = () => {
  messageFooter.querySelector('.message-lose').hidden = false;
};

let winner = false;

const winnGame = () => {
  if (!winner) {
    messageFooter.querySelector('.message-win').hidden = false;
    winner = true;
  }
};

const startGame = () => {
  btnStart.textContent = 'Restart';
  winner = false;
  gameScore.textContent = 0;

  [...allCellField].map(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  changeCellValue(2);

  [...messageFooter.children].map(message => {
    message.hidden = true;
  });
};

btnStart.addEventListener('click', () => startGame());

let mergeCells = '';

const validateCells = (prevCell, nextCell) => {
  return (!prevCell.classList.contains('notFree')
    && nextCell.classList.contains('notFree'))
    || (prevCell.textContent === nextCell.textContent
    && !!prevCell.textContent && prevCell !== mergeCells
    && nextCell !== mergeCells);
};

const sortCellssField = (arr) => {
  mergeCells = '';

  let change = true;

  const changeCellsClass = (giveClassCell, takeClassCell) => {
    if (giveClassCell.textContent === takeClassCell.textContent) {
      giveClassCell.textContent = +takeClassCell.textContent * 2;

      gameScore.textContent = +gameScore.textContent
      + (+giveClassCell.textContent);

      if (giveClassCell.textContent === '2048') {
        winnGame();
      }

      giveClassCell.className = `
      field-cell notFree field-cell--${giveClassCell.textContent}`;
      mergeCells = giveClassCell;
    } else {
      giveClassCell.textContent = takeClassCell.textContent;
      giveClassCell.className = takeClassCell.className;
    }

    takeClassCell.textContent = '';
    takeClassCell.className = 'field-cell';
  };

  for (; change;) {
    change = false;

    for (let i = 1; i < arr.length; i++) {
      if (validateCells(arr[i - 1], arr[i])) {
        changeCellsClass(arr[i - 1], arr[i]);
        change = true;
      }
    }
  }
};

const possibilityMove = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    if (validateCells(arr[i - 1], arr[i])) {
      return true;
    }
  }

  return false;
};

const validMove = () => {
  for (let i = 1; i <= allRowsField.length; i++) {
    const arrCellListColumn = root.querySelectorAll(`tr :nth-child(${i})`);
    const arrCellListRows = allRowsField[i - 1].children;

    if (possibilityMove(arrCellListColumn)
      || possibilityMove([...arrCellListColumn].reverse())
      || possibilityMove(arrCellListRows)
      || possibilityMove([...arrCellListRows].reverse())) {
      return true;
    }
  }

  return false;
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown'
  || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    let nextMove = false;

    for (let i = 1; i <= allRowsField.length; i++) {
      const arrCellListColumn = root.querySelectorAll(`tr :nth-child(${i})`);
      const arrCellListRows = allRowsField[i - 1].children;

      switch (e.code) {
        case 'ArrowUp':
          if (possibilityMove(arrCellListColumn)) {
            sortCellssField(arrCellListColumn);
            nextMove = true;
          }
          break;

        case 'ArrowDown':
          if (possibilityMove([...arrCellListColumn].reverse())) {
            sortCellssField([...arrCellListColumn].reverse());
            nextMove = true;
          }
          break;

        case 'ArrowLeft':
          if (possibilityMove(arrCellListRows)) {
            sortCellssField(arrCellListRows);
            nextMove = true;
          }
          break;

        case 'ArrowRight':
          if (possibilityMove([...arrCellListRows].reverse())) {
            sortCellssField([...arrCellListRows].reverse());
            nextMove = true;
          }
          break;
      }
    }

    if (!validMove()) {
      loseGame();
    }

    if (!nextMove) {
      return;
    }

    changeCellValue(1);
  }
});
