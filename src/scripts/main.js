'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const startButton = document.querySelector('.start');
const scoreInfo = document.querySelector('.game-score');
let scoreCounter = 0;
const rows = [...gameField.rows];
let actionCounter = 0;

const blockedCells = [];

// Some Function to create random

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

// Some Function to end game

function isGameLost() {
  let result = true;

  [...gameField.rows].forEach(row => {
    const cells = [...row.cells];

    for (let i = 0; i < cells.length - 1; i++) {
      if (
        (cells[i].innerText === cells[i + 1].innerText)
        || cells[i].innerText === ''
      ) {
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
        if (
          (column[i].innerText === column[i + 1].innerText)
          || column[i].innerText === ''
        ) {
          result = false;

          return;
        };
      };
    });
  };

  return result;
};

// Implementation of game stages

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

// Some function to get field data

function getAllCells() {
  return [...document.querySelectorAll('.field-cell')];
};

function getFreeCells() {
  return [...document.querySelectorAll('.field-cell')]
    .filter(cell => cell.innerText === '');
};

// Implementation of game control

const moveRight = () => {
  [...gameField.rows].forEach(row => {
    const cells = [...row.cells];

    for (let i = 2; i >= 0; i--) {
      const value = Number(cells[i].innerText);
      const nextValue = Number(cells[i + 1].innerText);

      if (value !== 0 && nextValue === 0) {
        cells[i].className = 'field-cell';
        cells[i].innerText = '';
        cells[i + 1].innerText = value;
        cells[i + 1].classList.add(`field-cell--${value}`);
        actionCounter++;
      };

      if (
        value !== 0 && value === nextValue
        && !blockedCells.includes(cells[i])
      ) {
        cells[i].className = 'field-cell';
        cells[i].innerText = '';
        cells[i + 1].innerText = value * 2;
        cells[i + 1].classList.add(`field-cell--${value * 2}`);
        blockedCells.push(cells[i + 1]);

        scoreCounter += Number(cells[i + 1].innerText);
        scoreInfo.innerText = scoreCounter;
        actionCounter++;

        if (cells[i + 1].innerText === '2048') {
          winGame();
        };
      };
    };
  });
};

const moveLeft = () => {
  [...gameField.rows].forEach(row => {
    const cells = [...row.cells];

    for (let i = 1; i < 4; i++) {
      const value = Number(cells[i].innerText);
      const prevValue = Number(cells[i - 1].innerText);

      if (value !== 0 && prevValue === 0) {
        cells[i].className = 'field-cell';
        cells[i].innerText = '';
        cells[i - 1].innerText = value;
        cells[i - 1].classList.add(`field-cell--${value}`);
        actionCounter++;
      };

      if (
        value !== 0 && value === prevValue
        && !blockedCells.includes(cells[i])
      ) {
        cells[i].className = 'field-cell';
        cells[i].innerText = '';
        cells[i - 1].innerText = value * 2;
        cells[i - 1].classList.add(`field-cell--${value * 2}`);
        blockedCells.push(cells[i - 1]);

        scoreCounter += Number(cells[i - 1].innerText);
        scoreInfo.innerText = scoreCounter;
        actionCounter++;

        if (cells[i - 1].innerText === '2048') {
          winGame();
        };
      };
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
      const value = Number(column[i].innerText);
      const prevValue = Number(column[i - 1].innerText);

      if (value !== 0 && prevValue === 0) {
        column[i].className = 'field-cell';
        column[i].innerText = '';
        column[i - 1].innerText = value;
        column[i - 1].classList.add(`field-cell--${value}`);
        actionCounter++;
      };

      if (
        value !== 0 && value === prevValue
        && !blockedCells.includes(column[i])
      ) {
        column[i].className = 'field-cell';
        column[i].innerText = '';
        column[i - 1].innerText = value * 2;
        column[i - 1].classList.add(`field-cell--${value * 2}`);
        blockedCells.push(column[i - 1]);

        scoreCounter += Number(column[i - 1].innerText);
        scoreInfo.innerText = scoreCounter;
        actionCounter++;

        if (column[i - 1].innerText === '2048') {
          winGame();
        };
      };
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
      const value = Number(column[i].innerText);
      const prevValue = Number(column[i + 1].innerText);

      if (value !== 0 && prevValue === 0) {
        column[i].className = 'field-cell';
        column[i].innerText = '';
        column[i + 1].innerText = value;
        column[i + 1].classList.add(`field-cell--${value}`);
        actionCounter++;
      };

      if (
        value !== 0 && value === prevValue
        && !blockedCells.includes(column[i])
      ) {
        column[i].className = 'field-cell';
        column[i].innerText = '';
        column[i + 1].innerText = value * 2;
        column[i + 1].classList.add(`field-cell--${value * 2}`);
        blockedCells.push(column[i + 1]);

        scoreCounter += Number(column[i + 1].innerText);
        scoreInfo.innerText = scoreCounter;
        actionCounter++;

        if (column[i + 1].innerText === '2048') {
          winGame();
        };
      };
    };
  });
};

// EventListeners part

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
