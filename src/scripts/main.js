'use strict';

const start = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const fieldRowAll = document.querySelectorAll('.field-row');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');

let defaultBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let probabilityCount = 0;
let score = 0;
let started = false;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
};

function createNewCell() {
  if (!freeCell()) {
    if (checkIfPlayerLose()) {
      messageLose.classList.remove('hidden');
    }

    return;
  }

  let row = 0;
  let cell = 0;

  while (true) {
    row = getRandomInt(4);
    cell = getRandomInt(4);

    if (defaultBoard[row][cell] === 0) {
      if (probabilityCount < 10) {
        defaultBoard[row][cell] = 2;
        probabilityCount++;
      } else {
        defaultBoard[row][cell] = 4;
        probabilityCount = 0;
      }

      return;
    }
  }
}

function shiftRowLeft(row) {
  const newRow = [];

  for (let i = 0; i < row.length; i++) {
    const element = row[i];

    if (element !== 0) {
      newRow.push(element);
    }
  }

  for (let i = newRow.length; i < row.length; i++) {
    newRow.push(0);
  }

  return newRow;
}

function checkAndAction(check) {
  if (!check) {
    createNewCell();
    showDisplay();
    checkIfPlayerWon();
  }
}

function moveRight(check) {
  defaultBoard.forEach((row, i) => {
    defaultBoard[i] = shiftRowLeft(row).reverse();
  });

  defaultBoard.forEach((row) => {
    row.forEach((value, j) => {
      if (value === row[j + 1]) {
        row[j] = 0;
        row[j + 1] *= 2;
        score += row[j + 1];
      }
    });
  });

  defaultBoard.forEach((row, i) => {
    defaultBoard[i] = shiftRowLeft(row).reverse();
  });

  checkAndAction(check);
}

function moveLeft(check) {
  defaultBoard.forEach((row, i) => {
    defaultBoard[i] = shiftRowLeft(row);
  });

  defaultBoard.forEach((row) => {
    row.forEach((value, j) => {
      if (value === row[j + 1]) {
        row[j] = row[j] * 2;
        row[j + 1] = 0;
        score += row[j];
      }
    });
  });

  defaultBoard.forEach((row, i) => {
    defaultBoard[i] = shiftRowLeft(row);
  });

  checkAndAction(check);
}

const moveUp = (check) => {
  defaultBoard.forEach((column, i) => {
    let newColumn = column.map((value) => value);

    newColumn = shiftRowLeft(newColumn);

    newColumn.forEach((value, el) => {
      if (value === newColumn[el + 1]) {
        newColumn[el] = newColumn[el] * 2;
        newColumn[el + 1] = 0;
        score += newColumn[el];
      }
    });

    newColumn = shiftRowLeft(newColumn);

    newColumn.forEach((value, k) => {
      defaultBoard[k][i] = value;
    });
  });

  checkAndAction(check);
};

const moveDown = (check) => {
  defaultBoard.forEach((column, i) => {
    let newColumn = column.map((value) => value);

    newColumn = shiftRowLeft(newColumn).reverse();

    newColumn.forEach((value, j) => {
      if (value === newColumn[j + 1]) {
        newColumn[j] = 0;
        newColumn[j + 1] = newColumn[j + 1] * 2;
        score += newColumn[j + 1];
      }
    });

    newColumn = shiftRowLeft(newColumn).reverse();

    newColumn.forEach((value, j) => {
      defaultBoard[j][i] = value;
    });
  });

  checkAndAction(check);
};

function changeClassCell(element, addClass) {
  element.classList = '';
  element.classList.add('field-cell');

  if (addClass) {
    element.classList.add(addClass);
  }
}

function checkIfPlayerWon() {
  const pointForVictory = 2048;
  let playerWon = false;

  defaultBoard.forEach((row) => {
    row.forEach((cell) => {
      if (cell === pointForVictory) {
        playerWon = true;
      }
    });
  });

  return playerWon;
}

function handleVictory() {
  messageWin.classList.remove('hidden');

  start.textContent = 'Start';

  start.classList
    .remove('restart')
    .add('start');

  started = false;
  messageStart.classList.remove('hidden');
}

if (checkAndAction) {
  if (checkIfPlayerWon()) {
    handleVictory();
  }
}

function freeCell() {
  let hasFreeCell = false;

  defaultBoard.forEach((row) => {
    row.forEach((cell) => {
      if (cell === 0) {
        hasFreeCell = true;
      }
    });
  });

  return hasFreeCell;
}

function goToOldBoard(oldBoard, oldProbabilityCount, oldScore) {
  defaultBoard = [...oldBoard];
  probabilityCount = oldProbabilityCount;
  score = oldScore;
}

function checkIfPlayerLose() {
  let lose = true;
  const temp = [...defaultBoard];
  const tepmProbabilityCount = probabilityCount;
  const tempScore = score;

  moveLeft('check');

  if (freeCell()) {
    lose = false;
    goToOldBoard(temp, tepmProbabilityCount, tempScore);

    return lose;
  }

  moveUp('check');

  if (freeCell()) {
    lose = false;
    goToOldBoard(temp, tepmProbabilityCount, tempScore);

    return lose;
  }

  goToOldBoard(temp, tepmProbabilityCount, tempScore);

  return lose;
}

function showDisplay() {
  defaultBoard.forEach((row, i) => {
    const cells = fieldRowAll[i].querySelectorAll('.field-cell');

    row.forEach((boardCell, j) => {
      const cell = cells[j];

      if (boardCell !== 0) {
        cell.textContent = boardCell;

        const addClass = `field-cell--${boardCell}`;

        changeClassCell(cell, addClass);
      } else {
        cell.textContent = '';
        changeClassCell(cell);
      }
    });
  });

  scoreDisplay.textContent = score;
}

function startGame() {
  defaultBoard.forEach(row => {
    row.forEach((_, j, arr) => {
      arr[j] = 0;
    });
  });

  probabilityCount = 0;
  score = 0;
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  createNewCell();
  createNewCell();
  showDisplay();
}

start.addEventListener('click', ({ target }) => {
  startGame();
  started = true;

  if (target.matches('.start')) {
    start.textContent = 'Restart';
    start.classList.remove('start');
    start.classList.add('restart');
  }
});

document.addEventListener('keyup', ({ key }) => {
  if (!started) {
    return;
  }

  switch (key) {
    case 'ArrowLeft':
      moveLeft();

      break;

    case 'ArrowRight':
      moveRight();

      break;

    case 'ArrowUp':
      moveUp();

      break;

    case 'ArrowDown':
      moveDown();

      break;

    default:
      break;
  }
});
