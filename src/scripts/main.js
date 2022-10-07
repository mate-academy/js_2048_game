'use strict';

const gameField = document.querySelector('.game-field');
const start = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageRestart = document.querySelector('.message-restart');
const gameScore = document.querySelector('.game-score');
const gameBestScore = document.querySelector('.game-score--best');
const messageStart = document.querySelector('.message-start');
const messageWinner = document.querySelector('.message-winner');

const arrayField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
let bestScore = 0;
let gameOver = [];

gameOver.length = arrayField.length;
gameOver.fill([]);

addNumbersIntoGameField(arrayField, gameOver);
addNumbersIntoGameField(arrayField, gameOver);
setGameField(arrayField, gameField);

start.addEventListener('click', () => {
  gameOver = [];
  gameOver.length = arrayField.length;
  gameOver.fill([]);
  score = 0;
  gameScore.innerText = 0;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageRestart.classList.add('hidden');
  messageWinner.classList.add('hidden');

  clearGameField(arrayField);
  addNumbersIntoGameField(arrayField, gameOver);
  addNumbersIntoGameField(arrayField, gameOver);
  setGameField(arrayField, gameField);
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight' && isMoveRowsRight(arrayField)) {
    arrayField.forEach(row => {
      moveRight(row);
    });

    addNumbersIntoGameField(arrayField, gameOver);
  }

  if (e.code === 'ArrowLeft' && isMoveRowsLeft(arrayField)) {
    arrayField.forEach(row => {
      moveLeft(row);
    });

    addNumbersIntoGameField(arrayField, gameOver);
  }

  if (e.code === 'ArrowUp' && isMoveColumnsUp(arrayField)) {
    moveUp(arrayField);
    addNumbersIntoGameField(arrayField, gameOver);
  }

  if (e.code === 'ArrowDown' && isMoveColumnsDown(arrayField)) {
    moveDown(arrayField);
    addNumbersIntoGameField(arrayField, gameOver);
  }

  setGameField(arrayField, gameField);
  isGameOver(arrayField, gameOver);
  gameOver = deepClone(arrayField);
});

function deepClone(array) {
  return JSON.parse(JSON.stringify(array));
}

function randomizerCoords(field) {
  const possibleY = [];

  field.forEach((row, rowIndex) => {
    for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
      if (row[cellIndex] === 0) {
        possibleY.push(rowIndex);
        cellIndex = row.length;
      }
    }
  });

  if (possibleY.length === 0) {
    return;
  }

  const y = possibleY[Math.floor(Math.random() * possibleY.length)];
  const possibleX = [];

  field[y].forEach((number, i) => {
    if (!number) {
      possibleX.push(i);
    }
  });

  const x = possibleX[Math.floor(Math.random() * possibleX.length)];

  return {
    x,
    y,
  };
}

function randomizerNumber() {
  return (Math.floor(Math.random() * 10) <= 8) ? 2 : 4;
}

function clearGameField(field) {
  field.forEach((row, i) => {
    row.forEach((cell, j) => {
      field[i][j] = 0;
    });
  });
}

function setGameField(from, to) {
  from.forEach((row, indexOfRow) => {
    row.forEach((cell, indexOfCell) => {
      let forCell = cell;

      if (!forCell) {
        forCell = '';
      }

      to.rows[indexOfRow].cells[indexOfCell].className = '';
      to.rows[indexOfRow].cells[indexOfCell].classList.add('field-cell');

      to.rows[indexOfRow].cells[indexOfCell].classList
        .add(`field-cell--${forCell}`);

      to.rows[indexOfRow].cells[indexOfCell].innerText = forCell;
    });
  });
}

function isMoveRowsRight(array) {
  const isMoveAll = [];

  array.forEach(row => {
    let isMove = false;

    for (let i = 0; i < row.length; i++) {
      if ((row[i + 1] === 0 || row[i] === row[i + 1]) && row[i] !== 0) {
        isMove = true;
        i = row.length;
      }
    };

    isMoveAll.push(isMove);
  });

  return isMoveAll.includes(true);
}

function isMoveRowsLeft(array) {
  const clone = deepClone(array);

  clone.forEach(row => row.reverse());

  return isMoveRowsRight(clone);
}

function isMoveColumnsUp(array) {
  const clone = deepClone(array);

  convertColumnToRow(clone);

  return isMoveRowsLeft(clone);
}

function isMoveColumnsDown(array) {
  const clone = deepClone(array);

  convertColumnToRow(clone);

  return isMoveRowsRight(clone);
}

function convertColumnToRow(array) {
  const clone = deepClone(array);

  array.length = 0;

  for (let j = 0; j < clone.length; j++) {
    array.push([]);

    for (let i = 0; i < clone[j].length; i++) {
      array[j].push(clone[i][j]);
    }
  }
}

function isGameOver(original, clone) {
  const compare = [];
  let winner = false;

  for (let i = 0; i < original.length; i++) {
    for (let j = 0; j < original.length; j++) {
      if (original[i][j] === 2048) {
        messageWin.classList.remove('hidden');
        winner = true;
      }

      let isSame = false;

      if (original[i][j] === clone[i][j]) {
        isSame = true;
      }

      if (
        ((j < original.length - 1) && (original[i][j] === original[i][j + 1]))
        || (
          (i < original.length - 1)
          && (original[i][j] === original[i + 1][j])
        )
      ) {
        isSame = false;
      }

      compare.push(isSame);
    }
  }

  const end = compare.every(item => item === true);

  if (end && winner) {
    messageWinner.classList.remove('hidden');
    messageRestart.classList.remove('hidden');

    return true;
  }

  if (end) {
    messageLose.classList.remove('hidden');
    messageRestart.classList.remove('hidden');

    return true;
  }
}

function addNumbersIntoGameField(field, clone) {
  if (isGameOver(field, clone)) {
    return;
  }

  const coords1 = randomizerCoords(field);

  if (coords1 === undefined) {
    return;
  }

  field[coords1.y][coords1.x] = randomizerNumber();
}

function moveRight(row) {
  let lastFullCell = null;
  let isMultiplied = false;

  for (let i = row.length - 1; i >= 0; i--) {
    if (row[i] === row[lastFullCell] && !isMultiplied) {
      row[lastFullCell] *= 2;
      score += row[lastFullCell];
      gameScore.innerText = score;
      isMultiplied = true;

      if (score > bestScore) {
        bestScore = score;
        gameBestScore.innerText = bestScore;
      }

      row[i] = 0;
    }

    if (row[i] && lastFullCell && !row[lastFullCell - 1]) {
      row[lastFullCell - 1] = row[i];
      isMultiplied = false;
      row[i] = 0;
      lastFullCell--;
    }

    if (!lastFullCell && row[i] && (i !== row.length - 1)) {
      row[row.length - 1] = row[i];
      lastFullCell = row.length - 1;
      row[i] = 0;
    }

    if (row[i]) {
      lastFullCell = i;
    }
  }

  return row;
}

function moveLeft(row) {
  return moveRight(row.reverse()).reverse();
}

function moveUp(array) {
  convertColumnToRow(array);

  array.forEach(row => moveLeft(row));

  convertColumnToRow(array);
}

function moveDown(array) {
  convertColumnToRow(array);

  array.forEach(row => moveRight(row));

  convertColumnToRow(array);
}

const restart = new Promise((resolve) => {
  window.addEventListener('keydown', (e) => {
    if (
      e.code === 'ArrowRight'
      || e.code === 'ArrowLeft'
      || e.code === 'ArrowUp'
      || e.code === 'ArrowDown'
    ) {
      resolve();
    }
  });
});

restart
  .then(() => {
    messageStart.classList.add('hidden');
    start.classList.remove('start');
    start.classList.add('restart');
    start.innerText = 'Restart';
  });
