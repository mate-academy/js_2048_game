'use strict';

const root = document.querySelector('.container');
const gameScore = root.querySelector('.game-score');
const button = root.querySelector('.button');
const fieldCells = root.querySelectorAll('.field-cell');
const messageLose = root.querySelector('.message-lose');
const messageWin = root.querySelector('.message-win');
const messageStart = root.querySelector('.message-start');

let scoreResult = 0;
let scoreElements = [];

const arrowKeyCode = {
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

function checkEmptySpace() {
  for (let i = 0; i < gameTable.length; i++) {
    if (gameTable[i].includes(0)) {
      return false;
    }
  }
};

function setRandomValue() {
  while (!checkEmptySpace()) {
    const row = Math.floor(Math.random() * 4);
    const col = Math.floor(Math.random() * 4);

    if (gameTable[row][col] === 0) {
      const value = (Math.random() >= 0.9) ? 4 : 2;

      gameTable[row][col] = value;
      break;
    }
  }
};

function addValueToCells() {
  const gameTableData = [];

  gameTable.forEach(rows => {
    rows.forEach(cells => {
      gameTableData.push(cells);
    });
  });

  fieldCells.forEach((cells) => {
    const value = gameTableData.shift();

    cells.classList = 'field-cell';

    if (value) {
      cells.textContent = value;
      cells.classList.add(`field-cell--${cells.textContent}`);
    } else {
      cells.textContent = '';
    }
  });
};

function cellsConnetion(data) {
  const arrayResult = [];

  let firstEl = data.shift();

  if (!firstEl) {
    return;
  }

  for (let i = 0; i < gameTable.length; i++) {
    const secondEl = data.shift();

    if (!secondEl) {
      if (firstEl) {
        arrayResult.push(firstEl);
      }
      break;
    } else if (firstEl === secondEl) {
      arrayResult.push(firstEl + secondEl);
      scoreElements.push(firstEl + secondEl);
      firstEl = null;
    } else if (firstEl !== secondEl) {
      if (firstEl) {
        arrayResult.push(firstEl);
      }

      firstEl = secondEl;
    }
  }

  return arrayResult.slice();
};

function moveCells(direction) {
  const gameTableData = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  switch (direction) {
    case arrowKeyCode.up:
      for (let i = 0; i < gameTable.length; i++) {
        const arrayElements = [];

        for (let j = 0; j < gameTable.length; j++) {
          arrayElements.push(gameTable[j][i]);
        };

        const newElements = cellsConnetion(arrayElements.filter(el => el > 0));

        if (newElements) {
          for (let l = 0; l < newElements.length; l++) {
            gameTableData[l][i] = newElements[l];
          };
        };
      };

      break;

    case arrowKeyCode.down:
      for (let i = 0; i < gameTable.length; i++) {
        const arrayElements = [];

        for (let j = 0; j < gameTable.length; j++) {
          arrayElements.push(gameTable[gameTable.length - 1 - j][i]);
        };

        const newElements = cellsConnetion(arrayElements.filter(el => el > 0));

        if (newElements) {
          for (let l = 0; l < newElements.length; l++) {
            gameTableData[gameTable.length - 1 - l][i] = newElements[l];
          };
        };
      };

      break;

    case arrowKeyCode.left:
      for (let i = 0; i < gameTable.length; i++) {
        const newElements = cellsConnetion(gameTable[i].filter(el => el > 0));

        if (newElements) {
          for (let j = 0; j < newElements.length; j++) {
            gameTableData[i][j] = newElements[j];
          };
        };
      };

      break;

    case arrowKeyCode.right:
      for (let i = 0; i < gameTable.length; i++) {
        const newElements
          = cellsConnetion(gameTable[i].filter(el => el > 0).reverse());

        if (newElements) {
          for (let j = 0; j < newElements.length; j++) {
            gameTableData[i][gameTable.length - 1 - j] = newElements[j];
          };
        };
      };

      break;

    default:
      break;
  };

  return gameTableData;
};

function gameEnd() {
  if (`${gameTable}` !== `${moveCells(arrowKeyCode.up)}`
  || `${gameTable}` !== `${moveCells(arrowKeyCode.down)}`
  || `${gameTable}` !== `${moveCells(arrowKeyCode.left)}`
  || `${gameTable}` !== `${moveCells(arrowKeyCode.right)}`) {
    return true;
  }
};

function sumScore() {
  if (scoreElements.length > 0) {
    scoreResult += scoreElements.reduce((acc, el) => {
      return acc + el;
    }, 0);

    gameScore.textContent = !scoreResult ? 0 : scoreResult;
  }
};

function changeGameTable(direction) {
  scoreElements = [];

  const gameTableData = moveCells(direction);

  if (`${gameTable}` === `${gameTableData}`) {
    return false;
  }

  gameTable = gameTableData;

  return true;
};

function showResultMessage(result) {
  if (result) {
    messageWin.classList.remove('hidden');
  } else {
    messageLose.classList.remove('hidden');
  }

  document.removeEventListener('keydown', startGame);
};

function startGame(e) {
  if (e.arrowKeyCode < 37 || e.arrowKeyCode > 40) {
    return;
  }

  if (changeGameTable(e.keyCode)) {
    if (scoreElements.includes(2048)) {
      showResultMessage(true);
    }

    sumScore();
    setRandomValue();

    if (!checkEmptySpace() && !gameEnd()) {
      showResultMessage(false);
    }

    scoreElements = [];
    addValueToCells();
  }
};

function cleanGameTable() {
  [...fieldCells].map(cell => {
    cell.classList.remove(`field-cell--${cell.textContent}`);
    cell.textContent = '';
  });

  gameTable.map(row => row.map((_, i) => {
    row[i] = 0;
  }));
}

function initGame() {
  button.classList.remove('start');
  button.textContent = 'Restart';
  button.classList.add('restart');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  gameScore.textContent = '0';
  scoreResult = 0;

  cleanGameTable();
  setRandomValue();
  setRandomValue();
  addValueToCells();

  document.addEventListener('keydown', startGame);
}

button.addEventListener('click', initGame);
