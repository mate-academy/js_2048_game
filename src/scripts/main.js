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
  root.querySelector('.message-lose').classList.remove('hidden');
};

const winnGame = () => {
  root.querySelector('.message-win').classList.remove('hidden');
};

const startGame = () => {
  btnStart.textContent = 'Restart';
  btnStart.classList.add('restart');
  gameScore.textContent = 0;

  [...allCellField].map(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  changeCellValue(2);

  [...messageFooter.children].map(message => {
    message.classList.add('hidden');
  });
};

btnStart.addEventListener('click', () => startGame());

const possibilityMove = () => {
  for (let i = 0; i < allCellField.length; i++) {
    if (allCellField[i].textContent === '') {
      return true;
    }
  }

  for (let i = 1; i <= allRowsField.length; i++) {
    const arrCellListColumn = root.querySelectorAll(`tr :nth-child(${i})`);
    const arrCellListRows = allRowsField[i - 1].children;

    const valid = (arr) => {
      for (let count = 1; i < arr.length; i++) {
        if (arr[count - 1].textContent === arr[count].textContent
          && arr[count].textContent) {
          return true;
        }
      }

      return false;
    };

    if (valid(arrCellListColumn) || valid(arrCellListRows)) {
      return true;
    }
  }

  return false;
};

let validMove = false;

function move(arrCell) {
  const newArr = [...arrCell].map((cell) => cell.textContent);

  const arrNotFreeCell = [...arrCell].filter((cell) => {
    return cell.classList.contains('notFree');
  });

  for (let i = 0; i < arrCell.length; i++) {
    if (i >= arrNotFreeCell.length) {
      arrCell[i].textContent = '';
      arrCell[i].className = 'field-cell';
      continue;
    }

    arrCell[i].textContent = arrNotFreeCell[i].textContent;
    arrCell[i].className = arrNotFreeCell[i].className;
  }

  [...arrCell].map((cell) => cell.textContent).map((cell, index) => {
    if (cell !== newArr[index]) {
      validMove = true;
    }
  });
};

function merge(arrCell) {
  for (let i = 1; i < arrCell.length; i++) {
    if (arrCell[i - 1].textContent === arrCell[i].textContent
      && arrCell[i].textContent) {
      arrCell[i - 1].textContent = +arrCell[i].textContent * 2;

      gameScore.textContent = +gameScore.textContent
      + (+arrCell[i - 1].textContent);

      if (arrCell[i - 1].textContent === '2048') {
        winnGame();
      }

      arrCell[i - 1].className = `
            field-cell notFree field-cell--${arrCell[i - 1].textContent}`;
      arrCell[i].textContent = '';
      arrCell[i].className = 'field-cell';
      validMove = true;
    }
  }
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown'
  || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    validMove = false;

    for (let i = 1; i <= allRowsField.length; i++) {
      const arrCellListColumn = root.querySelectorAll(`tr :nth-child(${i})`);
      const arrCellListRows = allRowsField[i - 1].children;

      switch (e.code) {
        case 'ArrowUp':
          move(arrCellListColumn);
          merge(arrCellListColumn);
          move(arrCellListColumn);
          break;

        case 'ArrowDown':
          move([...arrCellListColumn].reverse());
          merge([...arrCellListColumn].reverse());
          move([...arrCellListColumn].reverse());
          break;

        case 'ArrowLeft':
          move(arrCellListRows);
          merge(arrCellListRows);
          move(arrCellListRows);
          break;

        case 'ArrowRight':
          move([...arrCellListRows].reverse());
          merge([...arrCellListRows].reverse());
          move([...arrCellListRows].reverse());
          break;
      }
    }

    if (!possibilityMove()) {
      loseGame();
    }

    if (validMove) {
      changeCellValue(1);
    }
  }
});
