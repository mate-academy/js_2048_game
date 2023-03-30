'use strict';

// write your code here
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

function isTableFull() {
  return gameTable.flat().includes(0) === false;
}

function generateRandomTile() {
  while (!isTableFull()) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (gameTable[row][col] === 0) {
      gameTable[row][col] = (Math.random() >= 0.5) ? 4 : 2;
      break;
    }
  }
}

function mergeTiles(data) {
  const arr = [];
  let currentElement = data.shift();

  if (!currentElement) {
    return;
  }

  for (let i = 0; i < tableSize; i++) {
    const nextElement = data.shift();

    if (!nextElement) {
      if (currentElement) {
        arr.push(currentElement);
      }
      break;
    } else if (currentElement === nextElement) {
      arr.push(currentElement + nextElement);
      scoreBuffer.push(currentElement + nextElement);
      currentElement = null;
    } else if (currentElement !== nextElement) {
      if (currentElement) {
        arr.push(currentElement);
      }
      currentElement = nextElement;
    }
  }

  return arr.slice();
}

function moveTiles(direction) {
  const gameDataNext = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  switch (direction) {
    case keyCode.up:
      for (let j = 0; j < tableSize; j++) {
        const arr = [];

        for (let i = 0; i < tableSize; i++) {
          arr.push(gameTable[i][j]);
        }

        const shifted = mergeTiles(arr.filter((val) => val > 0));

        if (shifted) {
          for (let i = 0; i < shifted.length; i++) {
            gameDataNext[i][j] = shifted[i];
          }
        }
      }
      break;

    case keyCode.down:
      for (let j = 0; j < tableSize; j++) {
        const arr = [];

        for (let i = 0; i < tableSize; i++) {
          arr.push(gameTable[tableSize - 1 - i][j]);
        }

        const shifted = mergeTiles(arr.filter((val) => val > 0));

        if (shifted) {
          for (let i = 0; i < shifted.length; i++) {
            gameDataNext[tableSize - 1 - i][j] = shifted[i];
          }
        }
      }
      break;

    case keyCode.left:
      for (let i = 0; i < tableSize; i++) {
        const shifted = mergeTiles(gameTable[i].filter((val) => val > 0));

        if (shifted) {
          for (let j = 0; j < shifted.length; j++) {
            gameDataNext[i][j] = shifted[j];
          }
        }
      }
      break;

    case keyCode.right:
      for (let i = 0; i < tableSize; i++) {
        const shifted = mergeTiles(gameTable[i].filter((val) =>
          val > 0).reverse());

        if (shifted) {
          for (let j = 0; j < shifted.length; j++) {
            gameDataNext[i][tableSize - 1 - j] = shifted[j];
          }
        }
      }
      break;

    default:
      break;
  }

  return gameDataNext;
}

function isGameOver() {
  if (!isTableFull()) {
    return false;
  }

  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (
        (j < tableSize - 1 && gameTable[i][j] === gameTable[i][j + 1])
        || (i < tableSize - 1 && gameTable[i][j] === gameTable[i + 1][j])
      ) {
        return false;
      }
    }
  }

  return true;
}

function updateScore() {
  if (scoreBuffer.length > 0) {
    score += scoreBuffer.reduce((acc, cur) => acc + cur);
    scoreBoard.textContent = !score ? 0 : score;
  }
}

function performMove(direction) {
  scoreBuffer = [];

  const gameDataNext = moveTiles(direction);

  if (`${gameTable}` === `${gameDataNext}`) {
    return false;
  }

  gameTable = gameDataNext;

  return true;
}

function init() {
  button.classList.remove('start');
  button.textContent = 'Restart';
  button.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  scoreBoard.textContent = '0';
  score = 0;
  cleanTable();
  generateRandomTile();
  generateRandomTile();
  draw();
  document.addEventListener('keydown', start);
}

function cleanTable() {
  [...tableCells].map(el => {
    el.classList.remove(`field-cell--${el.textContent}`);
    el.textContent = '';
  });

  gameTable.map(row => row.map((_, i) => {
    row[i] = 0;
  }));
}

function draw() {
  const gameDataUnpacked = [];

  gameTable.forEach((rows) => {
    rows.forEach((cells) => {
      gameDataUnpacked.push(cells);
    });
  });

  tableCells.forEach((cells) => {
    const text = gameDataUnpacked.shift();

    cells.textContent = !text ? null : text;
    cells.className = 'field-cell';
    cells.classList.add(`field-cell--${cells.textContent}`);
  });
}

function start(e) {
  if (e.keyCode < 36 || e.keyCode > 41) {
    return;
  }

  if (performMove(e.keyCode)) {
    if (scoreBuffer.includes(2048)) {
      messageWin.classList.remove('hidden');
    }
    updateScore();
    generateRandomTile();

    if (isGameOver()) {
      messageLose.classList.remove('hidden');
    }
    scoreBuffer = [];
    draw();
  }
}

button.addEventListener('click', init);
