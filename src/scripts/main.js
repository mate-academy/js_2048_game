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
const keyCodeDic = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};
let gameData = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function checkTableFull() {
  for (let i = 0; i < tableSize; i++) {
    if (gameData[i].includes(0)) {
      return false;
    }
  }
}

function randomGenerator() {
  while (!checkTableFull()) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (gameData[row][col] === 0) {
      gameData[row][col] = (Math.random() <= 0.1) ? 4 : 2;
      break;
    }
  }
}

function merge(data) {
  const arr = [];
  let alpha = data.shift();

  if (!alpha) {
    return;
  }

  for (let i = 0; i < tableSize; i++) {
    const beta = data.shift();

    if (!beta) {
      if (alpha) {
        arr.push(alpha);
      }
      break;
    } else if (alpha === beta) {
      arr.push(alpha + beta);
      scoreBuffer.push(alpha + beta);
      alpha = null;
    } else if (alpha !== beta) {
      if (alpha) {
        arr.push(alpha);
      }
      alpha = beta;
    }
  }

  return arr.slice();
}

function makeMove(direction) {
  const gameDataNext = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  switch (direction) {
    case keyCodeDic.left:
      for (let i = 0; i < tableSize; i++) {
        const shifted = merge(gameData[i].filter((val) => val > 0));

        if (shifted) {
          for (let j = 0; j < shifted.length; j++) {
            gameDataNext[i][j] = shifted[j];
          }
        }
      }
      break;
    case keyCodeDic.right:
      for (let i = 0; i < tableSize; i++) {
        const shifted = merge(gameData[i].filter((val) => val > 0).reverse());

        if (shifted) {
          for (let j = 0; j < shifted.length; j++) {
            gameDataNext[i][tableSize - 1 - j] = shifted[j];
          }
        }
      }
      break;
    case keyCodeDic.up:
      for (let j = 0; j < tableSize; j++) {
        const arr = [];

        for (let i = 0; i < tableSize; i++) {
          arr.push(gameData[i][j]);
        }

        const shifted = merge(arr.filter((val) => val > 0));

        if (shifted) {
          for (let i = 0; i < shifted.length; i++) {
            gameDataNext[i][j] = shifted[i];
          }
        }
      }
      break;
    case keyCodeDic.down:
      for (let j = 0; j < tableSize; j++) {
        const arr = [];

        for (let i = 0; i < tableSize; i++) {
          arr.push(gameData[tableSize - 1 - i][j]);
        }

        const shifted = merge(arr.filter((val) => val > 0));

        if (shifted) {
          for (let i = 0; i < shifted.length; i++) {
            gameDataNext[tableSize - 1 - i][j] = shifted[i];
          }
        }
      }
      break;
    default:
      break;
  }

  return gameDataNext;
}

function gameoverCheck() {
  if (`${gameData}` !== `${makeMove(keyCodeDic.left)}`
    || `${gameData}` !== `${makeMove(keyCodeDic.right)}`
    || `${gameData}` !== `${makeMove(keyCodeDic.up)}`
    || `${gameData}` !== `${makeMove(keyCodeDic.down)}`) {
    return true;
  }
}

function addScore() {
  if (scoreBuffer.length > 0) {
    score += scoreBuffer.reduce((acc, cur) => acc + cur);
    scoreBoard.textContent = !score ? 0 : score;
  }
}

function action(direction) {
  scoreBuffer = [];

  const gameDataNext = makeMove(direction);

  if (`${gameData}` === `${gameDataNext}`) {
    return false;
  }

  gameData = gameDataNext;

  return true;
}

function endGame(result) {
  if (result) {
    messageWin.classList.remove('hidden');
  } else {
    messageLose.classList.remove('hidden');
  }
  document.removeEventListener('keydown', start);
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
  randomGenerator();
  randomGenerator();
  draw();
  document.addEventListener('keydown', start);
}

function cleanTable() {
  [...tableCells].map(el => {
    el.classList.remove(`field-cell--${el.textContent}`);
    el.textContent = '';
  });

  gameData.map(row => row.map((_, ind) => {
    row[ind] = 0;
  }));
}

function draw() {
  const gameDataUnpacked = [];

  gameData.forEach((rows) => {
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

  if (action(e.keyCode)) {
    if (scoreBuffer.includes(2048)) {
      endGame(true);
    }
    addScore();
    randomGenerator();

    if (!checkTableFull() && !gameoverCheck()) {
      endGame(false);
    }
    scoreBuffer = [];
    draw();
  }
};
button.addEventListener('click', init);
