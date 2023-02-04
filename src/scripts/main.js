'use strict';

const tableGame = document.querySelector('.game-field');
const rows = tableGame.rows;
const columnLength = tableGame.rows.length;
const button = document.querySelector('button');
const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const winValue = 2048;

let table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let starting = false;

button.addEventListener('click', action => {
  function toggleBtn(text = '') {
    button.textContent = text;
    button.classList.toggle('start');
    button.classList.toggle('restart');
  }

  messageStart.classList.add('hidden');
  messageWin.classList.toggle('hidden', true);
  messageLose.classList.toggle('hidden', true);

  function startGame() {
    starting = true;
    score.textContent = 0;

    table = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    addInRandomCell(table);
    addInRandomCell(table);
    addValuesToCells(table);
    changeStyleCells(cells);
  }

  if (button.classList.contains('start')) {
    toggleBtn('Restart');
    startGame();
  } else {
    startGame();
  }
});

function onChanges(oldMatrix, newMatrix) {
  let answer;

  for (let i = 0; i < oldMatrix.length; i++) {
    answer = oldMatrix[i].some((elem, index) => {
      return elem !== newMatrix[i][index];
    });

    if (answer) {
      return true;
    }
  }

  return false;
}

document.addEventListener('keydown', (e) => {
  const arrayOfKeys = [
    'ArrowRight',
    'ArrowLeft',
    'ArrowDown',
    'ArrowUp',
  ];

  if (!arrayOfKeys.includes(e.key) || !starting) {
    return null;
  }

  const link = deepClone(table);
  const rotating = transpose(link);

  function arrowMove(matrix, reverse = false, vertical = false) {
    table = vertical
      ? transpose(moveCells(matrix, reverse, true))
      : moveCells(matrix, reverse, true);

    if (!onChanges(link, table)) {
      return null;
    }
    addInRandomCell(table);
    addValuesToCells(table);
    changeStyleCells(cells);
  }

  switch (e.key) {
    case 'ArrowRight':
      arrowMove(link);
      break;
    case 'ArrowLeft':
      arrowMove(link, true);
      break;
    case 'ArrowDown':
      arrowMove(rotating, false, true);
      break;
    case 'ArrowUp':
      arrowMove(rotating, true, true);
      break;
  }

  checkOnWin(table);

  for (const row of table) {
    if (!row.includes(0)) {
      const checkTable = deepClone(table);
      const down = transpose(moveCells(rotating, true));
      const up = transpose(moveCells(rotating, false));
      const right = moveCells(table, false);
      const left = moveCells(table, true);
      const results = [
        onChanges(checkTable, down),
        onChanges(checkTable, up),
        onChanges(checkTable, right),
        onChanges(checkTable, left),
      ];

      if (results.every(el => el === false)) {
        messageLose.classList.remove('hidden');
        starting = false;
      }
    }
  }
});

function transpose(original) {
  const copy = [];

  for (let i = 0; i < original.length; ++i) {
    for (let j = 0; j < original[i].length; ++j) {
      if (original[i][j] === undefined) {
        continue;
      }

      if (copy[j] === undefined) {
        copy[j] = [];
      }

      copy[j][i] = original[i][j];
    }
  }

  return copy;
}

function moveCells(matrix, reverse = false, original = false) {
  const copy = !(reverse)
    ? deepClone(matrix).map(elem => elem.reverse())
    : deepClone(matrix);

  function removeZeroes(row) {
    return row.filter(num => num !== 0);
  }

  function slide(row) {
    let newRow = removeZeroes(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;

        if (original) {
          addScore(newRow[i]);
        }
      }
      newRow = removeZeroes(newRow);
    }

    while (newRow.length < columnLength) {
      newRow.push(0);
    }

    return newRow;
  }

  const copyOut = [];

  for (let j = 0; j < columnLength; j++) {
    let row = copy[j];

    row = slide(row);
    copyOut[j] = row;
  }

  return (!(reverse) ? copyOut.map(elem => elem.reverse()) : copyOut);
}

function addScore(plusNumber) {
  const oldScores = +score.textContent;
  const newScores = oldScores + plusNumber;

  score.textContent = newScores;
}

function addValuesToCells(matrix) {
  for (let i = 0; i < columnLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      rows[i].cells[j].textContent = (matrix[i][j] !== 0)
        ? matrix[i][j]
        : ' ';
    }
  }
}

function addInRandomCell(matrix, percent = 10) {
  const emptyCellsIndexes = [];
  const randomNumber = Math.round(Math.random() * 100);
  const value = randomNumber > percent
    ? 2
    : 4;

  for (let i = 0; i < columnLength; i++) {
    for (let j = 0; j < columnLength; j++) {
      if (matrix[i][j] === 0) {
        emptyCellsIndexes.push([i, j]);
      }
    }
  }

  const arrLength = emptyCellsIndexes.length;
  const randomCeil = Math.round(Math.random() * (arrLength - 1));

  if (arrLength > 0) {
    const numbLast = +emptyCellsIndexes[randomCeil].slice(1);
    const numbFirst = +emptyCellsIndexes[randomCeil].slice(0, 1);

    matrix[numbFirst][numbLast] = value;
  }
}

function deepClone(obj) {
  const clObj = [];

  for (const i in obj) {
    if (obj[i] instanceof Object) {
      clObj[i] = deepClone(obj[i]);
      continue;
    }
    clObj[i] = obj[i];
  }

  return clObj;
}

function checkOnWin(matrix) {
  for (const row of matrix) {
    for (const cell of row) {
      if (cell === winValue) {
        messageWin.classList.remove('hidden');
      }
    }
  }
}

function changeStyleCells(cellsTable) {
  const arrayOfCells = [...cellsTable];

  arrayOfCells.forEach((cell) => {
    cell.className = `field-cell`;

    const value = cell.textContent;

    if (value >= 2) {
      cell.classList.toggle(`field-cell--${value}`, true);
    }
  });
}
