'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const startButton = document.querySelector('.start');
const scoreInfo = document.querySelector('.game-score');
let scoreCounter = 0;
const rows = [...gameField.rows];
let actionCounter = 0;

const blockedCells = [];

function getRandomNumber() {
  const randomize = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const index = Math.floor(Math.random() * randomize.length);

  return randomize[index];
};

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
};

function addRandomNumber(num) {
  const row = rows[getRandomIndex(4)];
  const cell = row.children[getRandomIndex(4)];

  if (!cell.innerText) {
    cell.innerText = num;
    cell.classList.add(`field-cell--${num}`);
  } else {
    addRandomNumber(num);
  };
};

function isGameLost() {
  let result = true;

  [...gameField.rows].forEach(row => {
    const cells = [...row.cells];

    for (let i = 0; i < cells.length - 1; i++) {
      const value = cells[i].innerText;
      const nextValue = cells[i + 1].innerText;

      if ((value === nextValue) || value === '') {
        result = false;

        return;
      };
    };
  });

  if (result === true) {
    const columns = [];
    const fieldRows = [...gameField.rows];

    for (let i = 0; i < fieldRows.length; i++) {
      const column = [];

      fieldRows.forEach(row => {
        column.push([...row.cells][i]);
      });

      columns.push(column);
    };

    columns.forEach(column => {
      for (let i = 0; i < column.length - 1; i++) {
        const value = column[i].innerText;
        const nextValue = column[i + 1].innerText;

        if ((value === nextValue) || value === '') {
          result = false;

          return;
        };
      };
    });
  };

  return result;
};

function looseGame() {
  const messageLose = document.querySelector('.message-lose');

  messageLose.classList.remove('hidden');
};

function winGame() {
  const messageWin = document.querySelector('.message-win');

  messageWin.classList.remove('hidden');
};

function startGame() {
  startButton.classList.remove('start');
  startButton.style.outline = 'none';
  startButton.classList.add('restart');

  if (startButton.innerText === 'Start') {
    startButton.innerText = 'Restart';

    const startMessage = document.querySelector('.message-start');

    startMessage.classList.add('hidden');
  } else {
    scoreCounter = 0;
    scoreInfo.innerText = scoreCounter;

    const cells = getAllCells();

    cells.forEach(cell => {
      cell.className = 'field-cell';
      cell.innerText = '';
    });

    const looseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    if (looseMessage) {
      looseMessage.classList.add('hidden');
    };

    if (winMessage) {
      winMessage.classList.add('hidden');
    }
  };

  addRandomNumber(getRandomNumber());
  addRandomNumber(getRandomNumber());
};

function getAllCells() {
  return [...document.querySelectorAll('.field-cell')];
};

function getFreeCells() {
  return [...document.querySelectorAll('.field-cell')]
    .filter(cell => cell.innerText === '');
};

function moveCells(firsCell, secondCell) {
  const firstValue = Number(firsCell.innerText);
  const secondValue = Number(secondCell.innerText);

  if (firstValue !== 0 && secondValue === 0) {
    firsCell.className = 'field-cell';
    firsCell.innerText = '';
    secondCell.innerText = firstValue;
    secondCell.classList.add(`field-cell--${firstValue}`);
    actionCounter++;
  };

  if (
    firstValue !== 0 && firstValue === secondValue
    && !blockedCells.includes(firsCell)
  ) {
    firsCell.className = 'field-cell';
    firsCell.innerText = '';
    secondCell.innerText = firstValue * 2;
    secondCell.classList.add(`field-cell--${firstValue * 2}`);
    blockedCells.push(secondCell);

    scoreCounter += Number(secondCell.innerText);
    scoreInfo.innerText = scoreCounter;
    actionCounter++;

    if (secondCell.innerText === '2048') {
      winGame();
    };
  };
};

const moveRight = () => {
  [...gameField.rows].forEach(row => {
    const cells = [...row.cells];

    for (let i = 2; i >= 0; i--) {
      const firsCell = cells[i];
      const secondCell = cells[i + 1];

      moveCells(firsCell, secondCell);
    };
  });
};

const moveLeft = () => {
  [...gameField.rows].forEach(row => {
    const cells = [...row.cells];

    for (let i = 1; i < 4; i++) {
      const firsCell = cells[i];
      const secondCell = cells[i - 1];

      moveCells(firsCell, secondCell);
    };
  });
};

const moveUp = () => {
  const columns = [];
  const fieldRows = [...gameField.rows];

  for (let i = 0; i < fieldRows.length; i++) {
    const column = [];

    fieldRows.forEach(row => {
      column.push([...row.cells][i]);
    });

    columns.push(column);
  };

  columns.forEach(column => {
    for (let i = 1; i < 4; i++) {
      const firsCell = column[i];
      const secondCell = column[i - 1];

      moveCells(firsCell, secondCell);
    };
  });
};

const moveDown = () => {
  const columns = [];
  const fieldRows = [...gameField.rows];

  for (let i = 0; i < fieldRows.length; i++) {
    const column = [];

    fieldRows.forEach(row => {
      column.push([...row.cells][i]);
    });

    columns.push(column);
  };

  columns.forEach(column => {
    for (let i = 2; i >= 0; i--) {
      const firstCell = column[i];
      const secondCell = column[i + 1];

      moveCells(firstCell, secondCell);
    };
  });
};

startButton.addEventListener('click', (e) => {
  startGame();
});

document.addEventListener('keydown', (e) => {
  const freeCells = getFreeCells();

  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      moveRight();
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();
      moveLeft();
      moveLeft();
      break;

    case 'ArrowUp':
      moveUp();
      moveUp();
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      moveDown();
      moveDown();
      break;

    default:
      return;
  };

  if (actionCounter > 0) {
    addRandomNumber(getRandomNumber());

    actionCounter = 0;

    blockedCells.length = 0;
  };

  if (freeCells.length === 0) {
    const lost = isGameLost();

    if (lost) {
      looseGame();
    };
  };
});
