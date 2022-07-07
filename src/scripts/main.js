// write your code here

import
{ toRowArray, toColumnArray, rowToSingleArray, columnsToSingleArray }
  from './functions.js';

const tbody = document.querySelector(`tbody`);
const messageStart = document.querySelector(`.message-start`);
const messageWin = document.querySelector(`.message-win`);
const messageLose = document.querySelector(`.message-lose`);
const btnStart = document.querySelector(`.start`);
const gameScore = document.querySelector(`.game-score`);

let singleArray = new Array(16).fill('');
let rowsArray = toRowArray(singleArray);
let columnArray = toColumnArray(singleArray);

messageLose.hidden = true;
messageWin.hidden = true;

let gamePlay = false;

const rerender = () => {
  tbody.innerHTML = ``;

  for (let i = 0; i < 4; i++) {
    const tr = document.createElement(`tr`);

    tr.classList.add(`field-row`);

    for (let j = i * 4; j < i * 4 + 4; j++) {
      const td = document.createElement('td');

      td.classList.add(`field-cell`);

      if (singleArray[j] !== '') {
        td.innerHTML = singleArray[j];
        td.classList.add(`field-cell--${singleArray[j]}`);
      }
      tr.appendChild(td);
    };
    tbody.appendChild(tr);
  }
};

const randomCell = () => {
  const emptyArray = singleArray
    .map((el, index) => {
      if (el === '') {
        return index;
      }
    })
    .filter(el => el);

  const randomIndex = Math.floor(Math.random() * emptyArray.length);

  const randomValue = (Math.floor(Math.random() * 10) + 1) === 1 ? 4 : 2;

  singleArray[ emptyArray[randomIndex] ] = randomValue;
};

const push = (array, condition) => {
  const sortedArray = [];

  for (const subArray of array) {
    const emptyArray = subArray.filter(el => el === '');
    const numbersArray = subArray.filter(el => el !== '');

    if (condition === 'Left' || condition === 'Up') {
      sortedArray.push([...numbersArray, ...emptyArray]);
    } else {
      sortedArray.push([...emptyArray, ...numbersArray]);
    }
  }

  return sortedArray;
};

const combine = (array) => {
  const combinedArray = [];

  for (const subArray of array) {
    let combined = false;

    for (let i = 0; i < 3; i++) {
      if (
        subArray[i] === subArray[ i + 1 ]
        && subArray[i] !== ''
        && !combined
      ) {
        gameScore.innerHTML = Number(gameScore.innerHTML) + subArray[i] * 2;
        subArray[i] *= 2;
        subArray[ i + 1 ] = '';
        combined = true;
      }
    }
    combinedArray.push(subArray);
  }

  return combinedArray;
};

const gameOverCheck = () => {
  const emptyArray = singleArray.filter(el => el === '');

  if (emptyArray.length > 0) {
    return;
  };

  const sameValue = (array) => {
    let possibleMoves = false;

    for (const subArray of array) {
      for (let i = 0; i < 3; i++) {
        if (subArray[i] === subArray[ i + 1 ]) {
          possibleMoves = true;
        }
      }
    }

    return possibleMoves;
  };

  if (!sameValue(rowsArray) && !sameValue(columnArray)) {
    messageLose.hidden = false;
    gamePlay = false;
  }
};

const gameWin = () => {
  for (const el of singleArray) {
    if (el === 2048) {
      messageWin.hidden = false;
      gamePlay = false;

      return true;
    }
  }

  return false;
};

btnStart.addEventListener(`click`, function(e) {
  btnStart.classList.add(`restart`);
  btnStart.classList.remove(`start`);
  gamePlay = true;
  gameScore.innerHTML = '0';
  singleArray = new Array(16).fill('');

  messageLose.hidden = true;
  messageWin.hidden = true;
  messageStart.hidden = true;
  randomCell();
  randomCell();
  rerender();
  rowsArray = toRowArray(singleArray);
  columnArray = toColumnArray(singleArray);
});

document.addEventListener(`keydown`, function(e) {
  if (!gamePlay) {
    return;
  }

  const move = (condition, side) => {
    if (side === 'Horizontal') {
      rowsArray = push(rowsArray, condition);
      rowsArray = combine(rowsArray);
      rowsArray = push(rowsArray, condition);
      singleArray = rowToSingleArray(rowsArray);
    } else {
      columnArray = push(columnArray, condition);
      columnArray = combine(columnArray);
      columnArray = push(columnArray, condition);
      singleArray = columnsToSingleArray(columnArray);
    }

    randomCell();
    rerender();
    rowsArray = toRowArray(singleArray);
    columnArray = toColumnArray(singleArray);

    if (!gameWin()) {
      gameOverCheck();
    }
  };

  if (e.key === 'ArrowLeft') {
    move('Left', 'Horizontal');
  }

  if (e.key === 'ArrowRight') {
    move('Right', 'Horizontal');
  }

  if (e.key === 'ArrowUp') {
    move('Up', 'Vertical');
  }

  if (e.key === 'ArrowDown') {
    move('Down', 'Vertical');
  }
});
