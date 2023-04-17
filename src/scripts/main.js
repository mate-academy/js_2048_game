'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreBoard = document.querySelector('.game-score');
const tableCells = document.querySelectorAll('td');
const tableSize = 4;
let score = 0;
let scoreBuffer = [];

const keyCode = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

let gameTable = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function fullTable() {
  const zeroCounter = gameTable.flat().filter(el => el === 0).length;

  if (zeroCounter > 0) {
    return false;
  }
}

function random() {
  while (!fullTable()) {
    const rowIndex = Math.floor(Math.random() * 4);
    const columnIndex = Math.floor(Math.random() * 4);

    if (gameTable[rowIndex][columnIndex] === 0) {
      gameTable[rowIndex][columnIndex] = (Math.random() >= 0.5) ? 4 : 2;
      break;
    }
  }
}

function cleanTable() {
  tableCells.forEach(el => {
    el.classList.remove(`field-cell--${el.textContent}`);
    el.textContent = '';
  });

  gameTable.forEach((row) => {
    row.forEach((cell, i) => {
      row[i] = 0;
    });
  });
}

function mergeTiles(row) {
  const newRow = [];
  const filteredRow = row.filter(val => val > 0);
  let currentCell = filteredRow.shift();

  if (!currentCell) {
    return;
  }

  for (let i = 0; i < tableSize; i++) {
    const nextCell = filteredRow.shift();

    if (!nextCell) {
      if (currentCell) {
        newRow.push(currentCell);
      }
      break;
    } else if (currentCell === nextCell) {
      newRow.push(currentCell + nextCell);
      scoreBuffer.push(currentCell + nextCell);
      currentCell = null;
    } else {
      if (currentCell) {
        newRow.push(currentCell);
      }
      currentCell = nextCell;
    }
  }

  return newRow;
}

function moveTile(direction) {
  const nextGameTable = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  switch (direction) {
    case keyCode.left:
      for (let i = 0; i < tableSize; i++) {
        const merged = mergeTiles(gameTable[i]);

        if (merged) {
          for (let j = 0; j < merged.length; j++) {
            nextGameTable[i][j] = merged[j];
          }
        }
      }
      break;

    case keyCode.right:
      for (let i = 0; i < tableSize; i++) {
        const merged = mergeTiles(gameTable[i].reverse());

        if (merged) {
          for (let j = 0; j < merged.length; j++) {
            nextGameTable[i][tableSize - j - 1] = merged[j];
          }
        }
      }
      break;

    case keyCode.up:
      for (let i = 0; i < tableSize; i++) {
        const arr = [];

        for (let j = 0; j < tableSize; j++) {
          arr.push(gameTable[j][i]);
        }

        const merged = mergeTiles(arr);

        if (merged) {
          for (let j = 0; j < merged.length; j++) {
            nextGameTable[j][i] = merged[j];
          }
        }
      }
      break;

    case keyCode.down:
      for (let i = 0; i < tableSize; i++) {
        const arr = [];

        for (let j = 0; j < tableSize; j++) {
          arr.push(gameTable[tableSize - j - 1][i]);
        }

        const merged = mergeTiles(arr);

        if (merged) {
          for (let j = 0; j < merged.length; j++) {
            nextGameTable[tableSize - j - 1][i] = merged[j];
          }
        }
      }
      break;

    default:
      break;
  }

  return nextGameTable;
}

function lastMove() {
  if (`${gameTable}` !== `${moveTile(keyCode.up)}`
  || `${gameTable}` !== `${moveTile(keyCode.down)}`
  || `${gameTable}` !== `${moveTile(keyCode.left)}`
  || `${gameTable}` !== `${moveTile(keyCode.right)}`) {
    return true;
  }
}

function addScore() {
  if (scoreBuffer.length > 0) {
    score += scoreBuffer.reduce((sum, curr) => sum + curr);
    scoreBoard.textContent = !score ? 0 : score;
  }
}

function makeAction(direction) {
  scoreBuffer = [];

  const nextGameTable = moveTile(direction);

  if (`${gameTable}` === `${nextGameTable}`) {
    return false;
  }

  gameTable = nextGameTable;

  return true;
}

function start() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  scoreBoard.textContent = '0';
  score = 0;
  cleanTable();
  random();
  random();
  connectHtml();
  document.addEventListener('keydown', startGame);
}

function connectHtml() {
  const cellsContent = [];

  gameTable.forEach((row) => {
    row.forEach((cell) => {
      cellsContent.push(cell);
    });
  });

  tableCells.forEach((cell) => {
    const text = cellsContent.shift();

    cell.textContent = !text ? null : text;
    cell.className = 'field-cell';
    cell.classList.add(`field-cell--${cell.textContent}`);
  });
}

function endGame(res) {
  if (res) {
    messageWin.classList.remove('hidden');
  } else {
    messageLose.classList.remove('hidden');
  }
  document.removeEventListener('keydown', startGame);
}

function startGame(e) {
  if (e.keyCode < 36 || e.keyCode > 41) {
    return;
  }

  if (makeAction(e.keyCode)) {
    if (scoreBuffer.includes(2048)) {
      endGame(true);
    }

    addScore();
    random();

    if (!fullTable() && !lastMove()) {
      endGame(false);
    }

    scoreBuffer = [];
    connectHtml();
  }
}

button.addEventListener('click', start);
