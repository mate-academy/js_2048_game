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
const tableValue = [];
let finishGame = false;
let score = 0;

const swap = (events) => {
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
    screenEcho();
  };
};

mainButton.addEventListener('click', () => {
  messageStart.hidden = true;

  if (mainButton.classList[1] === 'start') {
    const classButton = mainButton.className.split(' ');

    classButton[1] = 'restart';
    mainButton.className = classButton.join(' ');
    mainButton.textContent = 'Restart';

    game();
  } else {
    clearScreen();
    body.removeEventListener('keydown', swap);
    finishGame = false;
    game();
  };
});

function game() {
  clearScreen();
  newCell();
  newCell();

  screenEcho();

  if (!finishGame) {
    body.addEventListener('keydown', swap);
  };
}

function arrowRight() {
  for (let i = 0; i <= 3; i++) {
    const rowArr = tableValue[i];
    const workArr = [];

    for (let j = 3; j >= 0; j--) {
      workArr.push(rowArr[j]);
    };

    cellShift(workArr);

    const rowNew = [];

    for (let j = 3; j >= 0; j--) {
      rowNew.push(workArr[j]);
    };

    tableValue[i] = rowNew;
  };
  newCell();
};

function arrowleft() {
  for (let i = 0; i <= 3; i++) {
    const rowArr = tableValue[i];

    cellShift(rowArr);
  };
  newCell();
};

function arrowUp() {
  for (let i = 0; i <= 3; i++) {
    const workArr = [];

    for (let j = 0; j <= 3; j++) {
      const rowArr = tableValue[j];

      workArr.push(rowArr[i]);
    };
    cellShift(workArr);

    for (let j = 0; j <= 3; j++) {
      const rowArr = tableValue[j];

      rowArr[i] = workArr[j];
      tableValue[j] = rowArr;
    };
  };
  newCell();
};

function arrowDown() {
  for (let i = 0; i <= 3; i++) {
    const workArr = [];

    for (let j = 3; j >= 0; j--) {
      const rowArr = tableValue[j];

      workArr.push(rowArr[i]);
    };
    cellShift(workArr);

    let k = 0;

    for (let j = 3; j >= 0; j--) {
      const rowArr1 = tableValue[j];

      rowArr1[i] = workArr[k];
      tableValue[j] = rowArr1;
      k++;
    };
  };
  newCell();
};

function cellShift(rowArr) {
  let lastCellWithValue;
  let lastCellWithAdd;

  if (rowArr[0] !== 0) {
    lastCellWithValue = 0;
  };

  for (let i = 1; i <= 3; i++) {
    if (rowArr[i] !== 0) {
      if (lastCellWithValue === undefined) {
        shift(rowArr, 0, i);
        lastCellWithValue = 0;
        continue;
      };

      if (rowArr[i] === rowArr[lastCellWithValue]
        && lastCellWithValue !== lastCellWithAdd) {
        rowArr[i] = rowArr[i] * 2;

        score += rowArr[i];
        shift(rowArr, lastCellWithValue, i);
        lastCellWithAdd = lastCellWithValue;

        if (+rowArr[lastCellWithAdd] === 2048) {
          finishGame = true;
          messageWin.className = messageLose.classList[0];

          return;
        };
        continue;
      };

      lastCellWithValue++;

      if (rowArr[i] !== rowArr[lastCellWithValue]) {
        shift(rowArr, lastCellWithValue, i);
      }
    };
  };
  screenEcho();
};

function shift(rowArr, lastFree, index) {
  rowArr[lastFree] = rowArr[index];
  rowArr[index] = 0;
};

function newCell() {
  if (!finishGame) {
    const cellArr = [];
    const rand = (randomInteger(1, 10) < 10) ? 2 : 4;

    for (let j = 0; j <= 3; j++) {
      const rowArr = tableValue[j];

      for (let i = 0; i <= 3; i++) {
        if (rowArr[i] === 0) {
          cellArr.push([j, i]);
        };
      };
    };

    if (cellArr.length === 0) {
      finishGame = true;
      messageLose.className = messageLose.classList[0];

      return;
    };

    const index = randomInteger(0, cellArr.length - 1);

    const coord = cellArr[index];
    const rowArray = tableValue[coord[0]];

    rowArray[coord[1]] = rand;
    tableValue[coord[0]] = rowArray;
  };
  screenEcho();
};

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
}

function screenEcho() {
  gameScore.textContent = score;

  for (let j = 0; j <= 3; j++) {
    const rowArr = tableCell[j];
    const rowArr2 = tableValue[j];

    for (let i = 0; i <= 3; i++) {
      if (rowArr2[i] === 0) {
        rowArr[i].textContent = '';
        rowArr[i].className = 'field-cell';
      } else {
        rowArr[i].textContent = rowArr2[i];
        rowArr[i].className = `field-cell field-cell--${rowArr2[i]}`;
      };
    };
  };
};

function clearScreen() {
  tableCell.length = 0;
  tableValue.length = 0;
  score = 0;

  tableRows.forEach((tableRow) => {
    const rowArr = [];
    const rowArr2 = [];

    for (const cell of tableRow.cells) {
      rowArr.push(cell);
      rowArr2.push(0);
    };
    tableCell.push(rowArr);
    tableValue.push(rowArr2);
  });
};
