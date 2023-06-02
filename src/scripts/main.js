'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreBoard = document.querySelector('.game-score');
const tableCells = document.querySelectorAll('td');
const size = 4;
let score = 0;
let scoreNumber = [];

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

function isGameTableFull() {
  for (let i = 0; i < size; i++) {
    if (gameTable[i].includes(0)) {
      return false;
    }
  }
}

function randomNumber() {
  while (!isGameTableFull()) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (gameTable[row][col] === 0) {
      gameTable[row][col] = (Math.random() <= 0.1) ? 4 : 2;
      break;
    }
  }
}

function mergeTiles(data) {
  const arr = [];
  let currentNumber = data.shift();

  if (!currentNumber) {
    return;
  }

  for (let i = 0; i < size; i++) {
    const nextNumber = data.shift();

    if (!nextNumber) {
      if (currentNumber) {
        arr.push(currentNumber);
      }
      break;
    } else if (currentNumber === nextNumber) {
      arr.push(currentNumber + nextNumber);
      scoreNumber.push(currentNumber + nextNumber);
      currentNumber = null;
    } else if (currentNumber !== nextNumber) {
      if (currentNumber) {
        arr.push(currentNumber);
      }
      currentNumber = nextNumber;
    }
  }

  return arr.slice();
}

function updateGameBoard(direct) {
  const gameData = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  switch (direct) {
    case keyCode.left:
      for (let i = 0; i < size; i++) {
        const shifted = mergeTiles(gameTable[i].filter((val) => val > 0));

        if (shifted) {
          for (let j = 0; j < shifted.length; j++) {
            gameData[i][j] = shifted[j];
          }
        }
      }
      break;
    case keyCode.right:
      for (let i = 0; i < size; i++) {
        const shifted = mergeTiles(gameTable[i].filter((val) =>
          val > 0).reverse());

        if (shifted) {
          for (let j = 0; j < shifted.length; j++) {
            gameData[i][size - 1 - j] = shifted[j];
          }
        }
      }
      break;
    case keyCode.up:
      for (let j = 0; j < size; j++) {
        const arr = [];

        for (let i = 0; i < size; i++) {
          arr.push(gameTable[i][j]);
        }

        const mergedValues = mergeTiles(arr.filter((val) => val > 0));

        if (mergedValues) {
          for (let i = 0; i < mergedValues.length; i++) {
            gameData[i][j] = mergedValues[i];
          }
        }
      }
      break;
    case keyCode.down:
      for (let j = 0; j < size; j++) {
        const arr = [];

        for (let i = 0; i < size; i++) {
          arr.push(gameTable[size - 1 - i][j]);
        }

        const mergedValues = mergeTiles(arr.filter((val) => val > 0));

        if (mergedValues) {
          for (let i = 0; i < mergedValues.length; i++) {
            gameData[size - 1 - i][j] = mergedValues[i];
          }
        }
      }
      break;
    default:
      break;
  }

  return gameData;
}

function gameEnd() {
  if (`${gameTable}` !== `${updateGameBoard(keyCode.left)}`
    || `${gameTable}` !== `${updateGameBoard(keyCode.right)}`
    || `${gameTable}` !== `${updateGameBoard(keyCode.up)}`
    || `${gameTable}` !== `${updateGameBoard(keyCode.down)}`) {
    return true;
  }
}

function updateScore() {
  if (scoreNumber.length > 0) {
    score += scoreNumber.reduce((acc, cur) => acc + cur);
    scoreBoard.textContent = !score ? 0 : score;
  }
}

function performAction(direct) {
  scoreNumber = [];

  const gameDataNext = updateGameBoard(direct);

  if (`${gameTable}` === `${gameDataNext}`) {
    return false;
  }

  gameTable = gameDataNext;

  return true;
}

function displayGameResult(result) {
  if (result) {
    messageWin.classList.remove('hidden');
  } else {
    messageLose.classList.remove('hidden');
  }
  document.removeEventListener('keydown', handleKeyPress);
}

function startNewGame() {
  button.classList.remove('start');
  button.textContent = 'Restart';
  button.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  scoreBoard.textContent = '0';
  score = 0;
  cleanTable();
  randomNumber();
  randomNumber();
  updateGameDataUnpacked();
  document.addEventListener('keydown', handleKeyPress);
}

function cleanTable() {
  [...tableCells].map(el => {
    el.classList.remove(`field-cell--${el.textContent}`);
    el.textContent = '';
  });

  gameTable.map(row => row.map((_, ind) => {
    row[ind] = 0;
  }));
}

function updateGameDataUnpacked() {
  const gameUnpacked = [];

  gameTable.forEach((rows) => {
    rows.forEach((cells) => {
      gameUnpacked.push(cells);
    });
  });

  tableCells.forEach((cells) => {
    const text = gameUnpacked.shift();

    cells.textContent = !text ? null : text;
    cells.className = 'field-cell';
    cells.classList.add(`field-cell--${cells.textContent}`);
  });
}

function handleKeyPress(e) {
  if (e.keyCode < 36 || e.keyCode > 41) {
    return;
  }

  if (performAction(e.keyCode)) {
    if (scoreNumber.includes(2048)) {
      displayGameResult(true);
    }
    updateScore();
    randomNumber();

    if (!isGameTableFull() && !gameEnd()) {
      displayGameResult(false);
    }
    scoreNumber = [];
    updateGameDataUnpacked();
  }
};
button.addEventListener('click', startNewGame);
