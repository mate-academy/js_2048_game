'use strict';

const table = document.querySelector('table').tBodies[0];
const body = document.body;
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const startButton = document.querySelector('.start');
const scoreTable = document.querySelector('.game-score');
const DELAY = 300;

let scoreCounter = 0;
let isEnd = true;
let counterOf2 = 0;

startButton.addEventListener('click', () => {
  startButton.innerText = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  isEnd = false;
  counterOf2 = 0;
  scoreCounter = 0;
  scoreTable.innerText = 0;
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const newCell = table.children[i].children[j];

      newCell.className = 'field-cell';
      newCell.innerText = '';
    }
  }

  createCell();
  createCell();
});

body.addEventListener('keydown', (e) => {
  let filledCellAmount = 1;

  if (isEnd) {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      goDown();

      setTimeout(() => {
        createCell();
      }, DELAY);
      break;

    case 'ArrowUp':
      goUp();

      setTimeout(() => {
        createCell();
      }, DELAY);
      break;

    case 'ArrowLeft':
      goLeft();

      setTimeout(() => {
        createCell();
      }, DELAY);
      break;

    case 'ArrowRight':
      goRight();

      setTimeout(() => {
        createCell();
      }, DELAY);
      break;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const currentCell = table.children[i].children[j];

      if (currentCell.innerText) {
        ++filledCellAmount;
      } else {
        currentCell.className = 'field-cell';
      }
    }
  }

  if (filledCellAmount === 16) {
    loseMessage.classList.remove('hidden');
    isEnd = true;
  }
});

function merge(currentCell, neighborCell, direction) {
  const currentNum = +currentCell.innerText;
  const underNum = +neighborCell.innerText;

  currentCell.innerText = '';
  neighborCell.classList.add('field-cell');
  neighborCell.innerText = underNum + currentNum;
  neighborCell.classList.add('field-cell--' + (underNum + currentNum));

  scoreCounter += underNum + currentNum;
  scoreTable.innerText = scoreCounter;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = table.children[i].children[j];

      if (cell.innerText === '2048') {
        winMessage.classList.remove('hidden');
        isEnd = true;
      }
    }
  }
}

function rebaseX(currentCell, xCell, position) {
  const emptyCell = document.createElement('td');

  if (position === 'before') {
    currentCell.before(emptyCell);
  }

  if (position === 'after') {
    currentCell.after(emptyCell);
  }

  emptyCell.classList.add('field-cell');

  xCell.replaceWith(currentCell);
}

function rebaseY(currentCell, xCell, yCell, position) {
  const emptyCell = document.createElement('td');

  emptyCell.classList.add('field-cell');

  if (position === 'before') {
    xCell.before(emptyCell);
  }

  if (position === 'after') {
    xCell.after(emptyCell);
  }

  yCell.replaceWith(currentCell);
}

function createCell() {
  const maxLength = 4;
  const randomRow = Math.floor(Math.random() * maxLength);
  const randomPosition = Math.floor(Math.random() * maxLength);
  const randomCell = table.children[randomRow].children[randomPosition];

  randomCell.classList.add('field-cell', 'field-cell--2');

  // if random cell is already exist create another random cell
  if (!randomCell.innerText) {
    counterOf2++;

    counterOf2 % 10 === 0
      ? randomCell.innerText = '4'
      : randomCell.innerText = '2';
  } else {
    createCell();
  }
}

function goDown() {
  let amountOfCycles = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      amountOfCycles = 0;

      const currentRow = table.children[i];
      const currentCell = currentRow.children[j];
      const leftCell = currentRow.children[j - 1];
      const rightCell = currentRow.children[j + 1];
      const lowerCell = table.children[i + 1].children[j];

      const currentNum = +currentCell.innerText;
      const lowerNum = +lowerCell.innerText;
      const isFirstCell = currentRow.firstElementChild === currentCell;

      if (currentNum && !lowerNum && isFirstCell) {
        rebaseY(currentCell, rightCell, lowerCell, 'before');
        amountOfCycles++;
      }

      if (currentNum && !lowerNum && !isFirstCell) {
        rebaseY(currentCell, leftCell, lowerCell, 'after');
        amountOfCycles++;
      }

      if (currentNum && currentNum === lowerNum) {
        merge(currentCell, lowerCell, 'down');
      }

      if (amountOfCycles > 0) {
        goDown();
      }
    }
  }
}

function goUp() {
  let amountOfCycles = 0;

  for (let i = 3; i >= 1; i--) {
    for (let j = 3; j >= 0; j--) {
      amountOfCycles = 0;

      const currentRow = table.children[i];
      const currentCell = currentRow.children[j];
      const leftCell = currentRow.children[j - 1];
      const rightCell = currentRow.children[j + 1];
      const upperCell = table.children[i - 1].children[j];

      const currentNum = +currentCell.innerText;
      const upperNum = +upperCell.innerText;
      const isFirstCell = currentRow.firstElementChild === currentCell;

      if (currentNum && !upperNum && isFirstCell) {
        rebaseY(currentCell, rightCell, upperCell, 'before');
        amountOfCycles++;
      }

      if (currentNum && !upperNum && !isFirstCell) {
        rebaseY(currentCell, leftCell, upperCell, 'after');
        amountOfCycles++;
      }

      if (currentNum && currentNum === upperNum) {
        merge(currentCell, upperCell, 'up');
      }

      if (amountOfCycles > 0) {
        goUp();
      }
    }
  }
}

function goLeft() {
  let amountOfCycles = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      amountOfCycles = 0;

      const currentCell = table.children[i].children[j];
      const leftCell = table.children[i].children[j - 1];
      const currentNum = +currentCell.innerText;
      const leftNum = +leftCell.innerText;

      if (currentNum && !leftNum) {
        rebaseX(currentCell, leftCell, 'before');
        amountOfCycles++;
      }

      if (currentNum && currentNum === leftNum) {
        merge(currentCell, leftCell, 'left');
      }

      if (amountOfCycles > 0) {
        goLeft();
      }
    }
  }
}

function goRight() {
  let amountOfCycles = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      amountOfCycles = 0;

      const currentCell = table.children[i].children[j];
      const rightCell = table.children[i].children[j + 1];
      const currentNum = +currentCell.innerText;
      const rightNum = +rightCell.innerText;

      if (currentNum && !rightNum) {
        rebaseX(currentCell, rightCell, 'after');
        amountOfCycles++;
      }

      if (currentNum && currentNum === rightNum) {
        merge(currentCell, rightCell, 'right');
      }

      if (amountOfCycles > 0) {
        goRight();
      }
    }
  }
}
