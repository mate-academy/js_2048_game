'use strict';

const game = document.querySelector('.container');

const gameHeader = game.querySelector('.game-header');
const gameMessageContainer = game.querySelector('.message-container');

const gameButonStart = gameHeader.querySelector('.start');
const gameScore = game.querySelector('.game-score');

const fieldCell = game.querySelectorAll('.field-cell');

const cell = [...fieldCell];

const messageLose = gameMessageContainer.querySelector('.message-lose');
const messageWin = gameMessageContainer.querySelector('.message-win');
const messageStart = gameMessageContainer.querySelector('.message-start');

function removeEventHandler() {
  document.removeEventListener('keydown', keydownEventHandler);
}

function addEventHandler() {
  document.addEventListener('keydown', keydownEventHandler);
}

function keydownEventHandler(el) {
  if (el.key === 'ArrowRight') {
    addRandomNumber();
    moveRight();
    removeClas();
  } else if (el.key === 'ArrowLeft') {
    addRandomNumber();
    moveLeft();
    removeClas();
  } else if (el.key === 'ArrowUp') {
    addRandomNumber();
    moveUp();
    removeClas();
  } else if (el.key === 'ArrowDown') {
    addRandomNumber();
    moveDown();
    removeClas();
  }
  win();
  isGameOver();
  gameScore.textContent = score;
}

removeEventHandler()

let score = 0;

function removeClas() {
  return [...fieldCell].map(el => {
    if (el.textContent) {
      el.classList.remove(...el.classList);
      el.classList.add('field-cell');
      el.classList.add(`field-cell--${el.textContent}`);
    } else {
      if (el.classList.contains('field-cell')) {
        el.classList.remove(...el.classList);
        el.classList.add('field-cell');
      }
    }
  });
}

function generateRandomNumber() {
  const randomNumber = Math.random();

  if (randomNumber < 0.1) {
    return 4;
  } else if (randomNumber < 0.9) {
    return 2;
  } else {
    return 2;
  }
}

function generateRandomIndex() {
  const index = Math.floor(Math.random() * cell.length);

  return index;
}

function addRandomNumber() {
  const emptyCells = cell.filter(el => !el.textContent);

  if (emptyCells.length) {
    let index = generateRandomIndex();

    while (cell[index].textContent) {
      index = generateRandomIndex();
    }
    cell[index].textContent = generateRandomNumber();
  }
}

function win() {
  const cells = Array.from(fieldCell);

  if (cells.some(x => x.textContent === '2048')) {
    messageWin.classList.remove('hidden');
  }
}

const rowLength = 4;

function moveRight() {
  for (let i = 0; i < fieldCell.length; i += rowLength) {
    const row = [];

    for (let j = i + rowLength - 1; j >= i; j--) {
      if (fieldCell[j].textContent !== '') {
        row.push(fieldCell[j].textContent);
      }
    }

    for (let j = i + rowLength - 1; j >= i; j--) {
      const newValue = row.shift() || '';

      fieldCell[j].textContent = newValue;
    }
  }

  mergeRight();
}

function moveLeft() {
  for (let i = 0; i < fieldCell.length; i += rowLength) {
    const row = [];

    for (let j = i; j < i + rowLength; j++) {
      if (fieldCell[j].textContent !== '') {
        row.push(fieldCell[j].textContent);
      }
    }

    for (let j = i; j < i + rowLength; j++) {
      const newValue = row.shift() || '';

      fieldCell[j].textContent = newValue;
    }
  }

  mergeLeft();
}

function moveUp() {
  for (let i = 0; i < rowLength; i++) {
    const column = [];

    for (let j = i; j < fieldCell.length; j += rowLength) {
      if (fieldCell[j].textContent !== '') {
        column.push(fieldCell[j].textContent);
      }
    }

    for (let j = i; j < fieldCell.length; j += rowLength) {
      const newValue = column.shift() || '';

      fieldCell[j].textContent = newValue;
    }
  }

  mergeUp();
}

function moveDown() {
  for (let i = 0; i < rowLength; i++) {
    const column = [];

    for (let j = i + (rowLength * (rowLength - 1)); j >= i; j -= rowLength) {
      if (fieldCell[j].textContent !== '') {
        column.push(fieldCell[j].textContent);
      }
    }

    for (let j = i + (rowLength * (rowLength - 1)); j >= i; j -= rowLength) {
      const newValue = column.shift() || '';

      fieldCell[j].textContent = newValue;
    }
  }

  mergeDown();
}

function mergeRight() {
  for (let i = 0; i < fieldCell.length; i += rowLength) {
    for (let j = i + rowLength - 1; j > i; j--) {
      const currentCell = fieldCell[j];
      const prevCell = fieldCell[j - 1];

      if (currentCell.textContent === prevCell.textContent
        && currentCell.textContent !== '') {
        const newValue = parseInt(currentCell.textContent)
        + parseInt(prevCell.textContent);

        currentCell.textContent = newValue;
        score += newValue;
        prevCell.textContent = '';
      }
    }
  }
}

function mergeLeft() {
  for (let i = 0; i < fieldCell.length; i += rowLength) {
    for (let j = i; j < i + rowLength - 1; j++) {
      const currentCell = fieldCell[j];
      const nextCell = fieldCell[j + 1];

      if (currentCell.textContent === nextCell.textContent
        && currentCell.textContent !== '') {
        const newValue = parseInt(currentCell.textContent)
        + parseInt(nextCell.textContent);

        currentCell.textContent = newValue;
        score += newValue;
        nextCell.textContent = '';
      }
    }
  }
}

function mergeUp() {
  for (let i = 0; i < rowLength; i++) {
    for (let j = i; j < fieldCell.length - rowLength; j += rowLength) {
      const currentCell = fieldCell[j];
      const belowCell = fieldCell[j + rowLength];

      if (currentCell.textContent === belowCell.textContent
        && currentCell.textContent !== '') {
        const newValue = parseInt(currentCell.textContent)
        + parseInt(belowCell.textContent);

        currentCell.textContent = newValue;
        score += newValue;
        belowCell.textContent = '';
      }
    }
  }
}

function mergeDown() {
  for (let i = fieldCell.length - 1; i >= fieldCell.length - rowLength; i--) {
    for (let j = i; j >= rowLength; j -= rowLength) {
      const currentCell = fieldCell[j];
      const aboveCell = fieldCell[j - rowLength];

      if (currentCell.textContent === aboveCell.textContent
        && currentCell.textContent !== '') {
        const newValue = parseInt(currentCell.textContent)
        + parseInt(aboveCell.textContent);

        currentCell.textContent = newValue;
        score += newValue;
        aboveCell.textContent = '';
      }
    }
  }
}

function isGameOver() {
  const emptyCells = cell.filter(el => !el.textContent);

  if (emptyCells.length) {
    return false;
  }

  for (let i = 0; i < fieldCell.length; i++) {
    const currentCell = fieldCell[i];
    const rightCell = fieldCell[i + 1];
    const bottomCell = fieldCell[i + rowLength];

    if (
      (i % rowLength < rowLength - 1
        && currentCell.textContent === rightCell.textContent)
      || (i < fieldCell.length - rowLength
        && currentCell.textContent === bottomCell.textContent)
    ) {
      return false;
    }
  }

  messageLose.classList.remove('hidden');
}


gameButonStart.addEventListener('click', (e) => {
  gameButonStart.classList.remove('start');
  gameButonStart.classList.add('restart');
  gameButonStart.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  cell.map(el => {
    el.textContent = '';

    return el;
  });

  score = 0;
  gameScore.textContent = score;

  const index1 = generateRandomIndex();
  let index2 = generateRandomIndex();

  if (index2 === index1) {
    index2 = generateRandomIndex();
  }
  cell[index1].textContent = generateRandomNumber();
  cell[index1].classList.add(`field-cell--${cell[index1].textContent}`);
  cell[index2].textContent = generateRandomNumber();
  cell[index2].classList.add(`field-cell--${cell[index2].textContent}`);
  removeClas();
  addEventHandler()
});




