'use strict';

const gameFieldRows = document.querySelector('tbody');
const startGameButton = document.querySelector('button');
const score = document.querySelector('.game-score');

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

let desk = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let newDesk;
let scoreNum = 0;
const cellsInLine = 4;
let winSituation = false;

const gamaField = [...gameFieldRows.children].map(row => [...row.children]);

startGameButton.addEventListener('click', () => {
  document.addEventListener('keydown', moved);

  if (startGameButton.classList.contains('start')) {
    startGameButton.classList.remove('start');
    startGameButton.classList.add('restart');
    startGameButton.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    desk = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    scoreNum = 0;
    messageLose.classList.toggle('hidden', true);
    messageWin.classList.toggle('hidden', true);
  }

  addTwo();
  addTwo();
  rendering();
});

document.addEventListener('keydown', moved);

function addTwo() {
  const [y, x] = findEmptyCell();

  desk[y][x] = randomNumber();
};

function findEmptyCell() {
  const emptyCell = [];

  desk.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 0) {
        emptyCell.push([rowIndex, cellIndex]);
      }
    });
  });

  return emptyCell[Math.floor(Math.random() * emptyCell.length)];
};

function randomNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
};

function rendering() {
  desk.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const element = gamaField[rowIndex][cellIndex];

      element.classList = 'field-cell';

      if (cell === 0) {
        element.innerText = '';
      } else {
        element.innerText = cell;
        element.classList.add(`field-cell--${cell}`);
      }
    });
  });

  score.innerText = scoreNum;
};

function moved(e) {
  newDesk = desk;

  switch (e.key) {
    case 'ArrowUp':
      renewalState();
      left();
      renewalState();
      break;
    case 'ArrowDown':
      renewalState();
      right();
      renewalState();
      break;
    case 'ArrowLeft':
      left();
      break;
    case 'ArrowRight':
      right();
      break;
  }

  for (let i = 0; i < cellsInLine; i++) {
    for (let j = 0; j < cellsInLine; j++) {
      if (newDesk[i][j] !== desk[i][j]) {
        desk = newDesk;

        addTwo();
        rendering();

        if (winSituation) {
          messageWin.classList.remove('hidden');
          document.removeEventListener('keydown', moved);
          winSituation = false;

          return;
        }

        if (!isCellMove()) {
          messageLose.classList.remove('hidden');
        }

        return;
      }
    }
  }
};

function left() {
  if (!checkRows()) {
    return;
  }

  newDesk = newDesk.map(row => {
    const newRow = row.filter(cell => cell !== 0);

    newRow.forEach((cell, cellIndex) => {
      if (cell === newRow[cellIndex + 1]) {
        newRow[cellIndex] *= 2;
        newRow.splice(cellIndex + 1, 1);
        scoreNum += newRow[cellIndex];

        if (newRow[cellIndex] === 2048) {
          winSituation = true;
        }
      }
    });

    return newRow.concat(Array(cellsInLine - newRow.length).fill(0));
  });
};

function reverseGameRows() {
  newDesk.forEach(row => row.reverse());
}

function right() {
  if (!checkRows()) {
    return;
  }

  reverseGameRows();
  left();
  reverseGameRows();
};

function renewalState() {
  newDesk = newDesk[0].map((_, cellIndex) =>
    newDesk.map(row => row[cellIndex]));
};

function isCellMove() {
  if (checkRows()) {
    return true;
  }

  renewalState();

  return checkColumns();
};

function checkRows() {
  for (let i = 0; i < cellsInLine; i++) {
    if (newDesk[i].some(cell => cell === 0)
      || newDesk[i].some((a, b) => a === newDesk[i][b + 1])) {
      return true;
    }
  }

  return false;
};

function checkColumns() {
  for (let i = 0; i < cellsInLine; i++) {
    if (newDesk[i].some((a, b) => a === newDesk[i][b + 1])) {
      return true;
    }
  }

  return false;
};
