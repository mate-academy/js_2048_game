'use strict';

let desk = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const SIZE_OF_DESK = desk.length;
const RANDOM_VALUE = 2;
const BIGGER_RANDOM_VALUE = 4;
const BIGGER_RANDOM_VALUE_CHANCE = 0.1;

const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const gameFieldRows = document.querySelector('tbody').rows;
const startButton = document.getElementsByClassName('button start')[0];
const score = document.querySelector('.game-score');
const body = document.querySelector('body');

let isGameStarted = false;
let isDeskMoved = false;

body.addEventListener('keydown', (e) => {
  if (!isGameStarted) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      init();
      break;
    case 'ArrowDown':
      rotateDesk(2);
      moveUp();
      rotateDesk(2);
      init();
      break;
    case 'ArrowRight':
      rotateDesk(3);
      moveUp();
      rotateDesk();
      init();
      break;
    case 'ArrowLeft':
      rotateDesk();
      moveUp();
      rotateDesk(3);
      init();
      break;
  }
});

startButton.addEventListener('click', () => {
  if (isGameStarted) {
    cleanDesk();
  }

  score.innerText = 0;
  isGameStarted = true;
  isDeskMoved = true;
  startButton.className = 'button restart';
  startButton.innerText = 'Restart';

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  addRandomValueToDesk();
  init();
});

function init() {
  if (!isDeskMoved) {
    return;
  }

  addRandomValueToDesk();

  for (let rowIndex = 0; rowIndex < SIZE_OF_DESK; rowIndex++) {
    const cells = gameFieldRows[rowIndex].cells;

    for (let cellIndex = 0; cellIndex < SIZE_OF_DESK; cellIndex++) {
      const cellValue = desk[rowIndex][cellIndex];

      cells[cellIndex].innerText = cellValue;
      cells[cellIndex].className = `field-cell field-cell--${cellValue}`;
    }
  }

  if (!checkPossibilityToMove()) {
    loseMessage.className = 'message message-lose';
  }

  if (checkWinSituation()) {
    winMessage.className = 'message message-win';
  }

  isDeskMoved = false;
}

function addRandomValueToDesk() {
  const availableCell = [];

  for (let rowIndex = 0; rowIndex < SIZE_OF_DESK; rowIndex++) {
    for (let cellIndex = 0; cellIndex < SIZE_OF_DESK; cellIndex++) {
      if (desk[rowIndex][cellIndex] === null) {
        availableCell.push({
          rowIndex,
          cellIndex,
        });
      }
    }
  }

  if (availableCell.length === 0) {
    return false;
  }

  const randomCell
    = availableCell[Math.floor(Math.random() * availableCell.length)];
  let currentRandomValue = RANDOM_VALUE;

  if (Math.random() <= BIGGER_RANDOM_VALUE_CHANCE) {
    currentRandomValue = BIGGER_RANDOM_VALUE;
  }

  desk[randomCell.rowIndex][randomCell.cellIndex] = currentRandomValue;
  score.innerText = currentRandomValue + parseInt(score.innerText);

  return true;
}

function moveUp() {
  const move = () => {
    for (let rowIndex = 1; rowIndex < SIZE_OF_DESK; rowIndex++) {
      for (let cellIndex = 0; cellIndex < SIZE_OF_DESK; cellIndex++) {
        let currentRowIndex = rowIndex;
        const currentCellValue = desk[rowIndex][cellIndex];

        if (currentCellValue === null) {
          continue;
        }

        while (desk[currentRowIndex - 1][cellIndex] === null) {
          desk[currentRowIndex - 1][cellIndex] = currentCellValue;
          desk[currentRowIndex][cellIndex] = null;
          isDeskMoved = true;

          if (currentRowIndex - 1 > 0) {
            currentRowIndex--;
          } else {
            break;
          }
        }
      }
    }
  };

  const merge = () => {
    for (let rowIndex = 1; rowIndex < SIZE_OF_DESK; rowIndex++) {
      for (let cellIndex = 0; cellIndex < SIZE_OF_DESK; cellIndex++) {
        const currentCell = desk[rowIndex][cellIndex];
        const higherCell = desk[rowIndex - 1][cellIndex];

        if (currentCell === null) {
          continue;
        }

        if (higherCell === currentCell) {
          desk[rowIndex - 1][cellIndex] = currentCell * 2;
          desk[rowIndex][cellIndex] = null;
          isDeskMoved = true;
        }
      }
    }
  };

  move();
  merge();
  move();
}

function checkPossibilityToMove() {
  for (let rowIndex = 0; rowIndex < SIZE_OF_DESK; rowIndex++) {
    if (desk[rowIndex].includes(null)) {
      return true;
    }

    for (let cellIndex = 0; cellIndex < SIZE_OF_DESK - 1; cellIndex++) {
      if (desk[rowIndex][cellIndex] === desk[rowIndex][cellIndex + 1]) {
        return true;
      }
    }
  }

  for (let rowIndex = 0; rowIndex < SIZE_OF_DESK - 1; rowIndex++) {
    for (let cellIndex = 0; cellIndex < SIZE_OF_DESK; cellIndex++) {
      if (desk[rowIndex][cellIndex] === desk[rowIndex + 1][cellIndex]) {
        return true;
      }
    }
  }

  return false;
}

function rotateDesk(times = 1) {
  const rotate = source => {
    const destination = new Array(SIZE_OF_DESK);

    for (let i = 0; i < SIZE_OF_DESK; i++) {
      destination[i] = new Array(SIZE_OF_DESK);
    }

    for (let i = 0; i < SIZE_OF_DESK; i++) {
      for (let j = 0; j < SIZE_OF_DESK; j++) {
        destination[i][j] = source[SIZE_OF_DESK - j - 1][i];
      }
    }

    return destination;
  };

  for (let i = 0; i < times; i++) {
    desk = rotate(desk);
  }
}

function checkWinSituation() {
  return desk.some(arr => arr.includes(2048));
}

function cleanDesk() {
  desk = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];
}
