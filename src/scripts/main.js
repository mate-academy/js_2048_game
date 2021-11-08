'use strict';

const mainButton = document.querySelector('button');
const body = document.body;
const gameScore = body.querySelector('.game-score');
const tableMain = body.querySelector('table');
const tableRows = tableMain.querySelectorAll('tr');
const messageStart = body.querySelector('.message-start');
const messageLose = body.querySelector('.message-lose');
const messageWin = body.querySelector('.message-win');
const tableCell = [];
let finishGame = false;

tableRows.forEach((tableRow) => {
  const rowArr = [];

  for (const cell of tableRow.cells) {
    rowArr.push(cell);
  };
  tableCell.push(rowArr);
});

mainButton.addEventListener('click', () => {
  messageStart.hidden = true;

  if (!finishGame) {
    if (mainButton.classList[1] === 'start') {
      const classButton = mainButton.className.split(' ');

      classButton[1] = 'restart';
      mainButton.className = classButton.join(' ');
      mainButton.textContent = 'Restart';
    };

    tableCell.forEach((rowArr) => {
      rowArr.forEach((cell) => {
        cell.textContent = '';
        cell.className = 'field-cell';
      });
    });

    gameScore.textContent = '0';
    newCell();
    newCell();

    if (!finishGame) {
      body.addEventListener('keydown', (events) => {
        if (!finishGame) {
          switch (events.key) {
            case 'ArrowRight':
              arrowRight();
              break;

            case 'ArrowLeft':
              arrowleft();
              break;

            case 'ArrowUp':
              arrowUp();
              break;

            case 'ArrowDown':
              arrowDown();
              break;
          };
        };
      });
    };
  };
});

function arrowRight() {
  for (let i = 0; i <= 3; i++) {
    const rowArr = tableCell[i];
    const workArr = [];

    for (let j = 3; j >= 0; j--) {
      workArr.push(rowArr[j]);
    };

    cellShift(workArr);
  };
  newCell();
};

function arrowleft() {
  for (let i = 0; i <= 3; i++) {
    const rowArr = tableCell[i];

    cellShift(rowArr);
  };
  newCell();
};

function arrowUp() {
  for (let i = 0; i <= 3; i++) {
    const workArr = [];

    for (let j = 0; j <= 3; j++) {
      const rowArr = tableCell[j];

      workArr.push(rowArr[i]);
    };
    cellShift(workArr);
  };
  newCell();
};

function arrowDown() {
  for (let i = 0; i <= 3; i++) {
    const workArr = [];

    for (let j = 3; j >= 0; j--) {
      const rowArr = tableCell[j];

      workArr.push(rowArr[i]);
    };
    cellShift(workArr);
  };
  newCell();
};

function cellShift(rowArr) {
  let lastCellWithValue;
  let lastCellWithAdd;

  if (rowArr[0].textContent !== '') {
    lastCellWithValue = 0;
  };

  for (let i = 1; i <= 3; i++) {
    if (rowArr[i].textContent !== '') {
      if (lastCellWithValue === undefined) {
        shift(rowArr, 0, i);
        lastCellWithValue = 0;
        continue;
      };

      if (rowArr[i].textContent === rowArr[lastCellWithValue].textContent
        && lastCellWithValue !== lastCellWithAdd) {
        rowArr[i].textContent = +rowArr[i].textContent * 2;
        rowArr[i].className = `field-cell--${rowArr[i].textContent}`;

        gameScore.textContent = +gameScore.textContent
          + (+rowArr[i].textContent);
        shift(rowArr, lastCellWithValue, i);
        lastCellWithAdd = lastCellWithValue;

        if (+rowArr[lastCellWithAdd].textContent === 2048) {
          finishGame = true;
          messageWin.className = messageLose.classList[0];

          return false;
        };
        continue;
      };

      lastCellWithValue++;

      if (rowArr[i].textContent !== rowArr[lastCellWithValue].textContent) {
        shift(rowArr, lastCellWithValue, i);
      }
    };
  };
};

function shift(rowArr, lastFree, index) {
  rowArr[lastFree].textContent = rowArr[index].textContent;
  rowArr[index].textContent = '';
  rowArr[lastFree].className = rowArr[index].className;
  rowArr[index].className = 'field-cell';
};

function newCell() {
  if (!finishGame) {
    const cellArr = [];
    const rand = (randomInteger(1, 10) < 10) ? 2 : 4;

    tableCell.forEach((rowArr) => {
      rowArr.forEach((cell) => {
        if (cell.textContent === '') {
          cellArr.push(cell);
        };
      });
    });

    if (cellArr.length === 0) {
      finishGame = true;
      messageLose.className = messageLose.classList[0];

      return false;
    };

    const index = randomInteger(0, cellArr.length - 1);

    cellArr[index].textContent = rand;

    cellArr[index].className = cellArr[index].className
      + '--' + rand;
  };
};

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
}
