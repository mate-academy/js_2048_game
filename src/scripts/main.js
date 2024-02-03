'use strict';

// write your code here
const FOUR_CHANCE = 0.1;
const ROWS = 4;
const COLS = 4;

const table = document.querySelector('table');
const tBody = table.tBodies[0];
const button = document.querySelector('.button');
const allCells = document.querySelectorAll('td');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

let gameStarted = false;
let score = 0;

button.addEventListener('click', () => {
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';

  score = 0;
  gameScore.textContent = 0;

  for (const element of allCells) {
    if (element.classList.length < 2) {
      continue;
    }

    element.className = 'field-cell';
    element.textContent = '';
  }

  createRandomElement();
  createRandomElement();
  gameStarted = true;
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();

      if (gameStarted) {
        handleArrowDown();
      }
      break;

    case 'ArrowUp':
      e.preventDefault();

      if (gameStarted) {
        handleArrowUp();
      }
      break;

    case 'ArrowLeft':
      e.preventDefault();

      if (gameStarted) {
        handleArrowLeft();
      }
      break;

    case 'ArrowRight':
      e.preventDefault();

      if (gameStarted) {
        handleArrowRight();
      }
      break;

    default:
      break;
  }

  if (isLost()) {
    loseMessage.classList.remove('hidden');
  }
});

function createRandomElement() {
  const chance = Math.random();
  const listOfFreeSpots = freeSpots();

  if (chance <= FOUR_CHANCE) {
    const element = getRandomSpot(listOfFreeSpots);

    element.textContent = '4';
    element.classList.add('field-cell--4');
  } else {
    const element = getRandomSpot(listOfFreeSpots);

    element.textContent = '2';
    element.classList.add('field-cell--2');
  }
}

function getRandomSpot(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function freeSpots() {
  const listOfFreeSpots = [];

  for (const element of allCells) {
    if (element.classList.length < 2) {
      listOfFreeSpots.push(element);
    }
  }

  return listOfFreeSpots;
}

function activeSpots() {
  const listOfActiveSpots = [];

  for (const element of allCells) {
    if (element.classList.length > 1) {
      listOfActiveSpots.push(element);
    }
  }

  return listOfActiveSpots;
}

function elementMove(elem, nextElem) {
  const classValue = elem.classList[1];
  const value = elem.textContent;

  elem.className = 'field-cell';
  elem.textContent = '';

  nextElem.classList.add(classValue);
  nextElem.textContent = value;
}

function elementsMerge(elem, nextElem) {
  let number = +nextElem.textContent;

  number *= 2;

  score += number;
  gameScore.textContent = score;

  elem.className = 'field-cell';
  elem.textContent = '';

  nextElem.className = 'field-cell';
  nextElem.textContent = number;
  nextElem.classList.add(`field-cell--${number}`);
  nextElem.id = 'merged';

  if (number === 2048) {
    winMessage.classList.remove('hidden');
  }
}

function handleArrowDown() {
  if (isLost()) {
    return;
  }

  const listOfActiveSpots = activeSpots();
  let actionCounter = 0;

  for (let i = listOfActiveSpots.length - 1; i >= 0; i--) {
    const col = listOfActiveSpots[i].cellIndex;
    const row = +listOfActiveSpots[i].parentElement.id;
    const listOfColumnElements = [];

    if (row === 3) {
      continue;
    }

    for (let j = row; j < tBody.rows.length; j++) {
      listOfColumnElements.push(tBody.rows[j].cells[col]);
    }

    for (let j = 1; j < listOfColumnElements.length; j++) {
      const elem = listOfColumnElements[j - 1];
      const nextElem = listOfColumnElements[j];
      const mergeCondition = elem.textContent
      === nextElem.textContent
        && !elem.id
        && !nextElem.id;

      if (nextElem.classList.length < 2) {
        elementMove(elem, nextElem);
        actionCounter++;
      } else if (mergeCondition) {
        elementsMerge(elem, nextElem);
        actionCounter++;
      }
    }
  }

  listOfActiveSpots.forEach((elem) => elem.removeAttribute('id'));

  if (actionCounter > 0) {
    createRandomElement();
  }
}

function handleArrowUp() {
  if (isLost()) {
    return;
  }

  const listOfActiveSpots = activeSpots();
  let actionCounter = 0;

  for (let i = 0; i < listOfActiveSpots.length; i++) {
    const col = listOfActiveSpots[i].cellIndex;
    const row = +listOfActiveSpots[i].parentElement.id;
    const listOfColumnElements = [];

    if (row === 0) {
      continue;
    }

    for (let j = row; j >= 0; j--) {
      listOfColumnElements.push(tBody.rows[j].cells[col]);
    }

    for (let j = 0; j < listOfColumnElements.length - 1; j++) {
      const elem = listOfColumnElements[j];
      const nextElem = listOfColumnElements[j + 1];
      const mergeCondition = elem.textContent === nextElem.textContent
        && !elem.id
        && !nextElem.id;

      if (nextElem.classList.length < 2) {
        elementMove(elem, nextElem);
        actionCounter++;
      } else if (mergeCondition) {
        elementsMerge(elem, nextElem);
        actionCounter++;
      }
    }
  }

  listOfActiveSpots.forEach((elem) => elem.removeAttribute('id'));

  if (actionCounter > 0) {
    createRandomElement();
  }
}

function handleArrowLeft() {
  if (isLost()) {
    return;
  }

  const listOfActiveSpots = activeSpots();
  let actionCounter = 0;

  for (let i = 0; i < listOfActiveSpots.length; i++) {
    const col = listOfActiveSpots[i].cellIndex;
    const row = +listOfActiveSpots[i].parentElement.id;
    const listOfRowElements = [];

    if (col === 0) {
      continue;
    }

    for (let j = col; j >= 0; j--) {
      listOfRowElements.push(tBody.rows[row].cells[j]);
    }

    for (let j = 0; j < listOfRowElements.length - 1; j++) {
      const elem = listOfRowElements[j];
      const nextElem = listOfRowElements[j + 1];
      const mergeCondition = (elem.textContent === nextElem.textContent
        && !elem.id
        && !nextElem.id);

      if (nextElem.classList.length < 2) {
        elementMove(elem, nextElem);
        actionCounter++;
      } else if (mergeCondition) {
        elementsMerge(elem, nextElem);
        actionCounter++;
      }
    }
  }

  listOfActiveSpots.forEach((elem) => elem.removeAttribute('id'));

  if (actionCounter > 0) {
    createRandomElement();
  }
}

function handleArrowRight() {
  if (isLost()) {
    return;
  }

  const listOfActiveSpots = activeSpots();
  let actionCounter = 0;

  for (let i = listOfActiveSpots.length - 1; i >= 0; i--) {
    const col = listOfActiveSpots[i].cellIndex;
    const row = +listOfActiveSpots[i].parentElement.id;
    const listOfRowElements = [];

    if (col === 3) {
      continue;
    }

    for (let j = col; j < tBody.rows.length; j++) {
      listOfRowElements.push(tBody.rows[row].cells[j]);
    }

    for (let j = 1; j < listOfRowElements.length; j++) {
      const elem = listOfRowElements[j - 1];
      const nextElem = listOfRowElements[j];
      const mergeCondition = (
        elem.textContent === nextElem.textContent
        && !elem.id
        && !nextElem.id
      );

      if (nextElem.classList.length < 2) {
        elementMove(elem, nextElem);
        actionCounter++;
      } else if (mergeCondition) {
        elementsMerge(elem, nextElem);
        actionCounter++;
      }
    }
  }

  listOfActiveSpots.forEach((elem) => elem.removeAttribute('id'));

  if (actionCounter > 0) {
    createRandomElement();
  }
}

function isLost() {
  if (freeSpots().length > 0) {
    return false;
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      if (
        tBody.rows[r].cells[c].textContent
        === tBody.rows[r].cells[c + 1].textContent
      ) {
        return false;
      }
    }
  }

  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS; c++) {
      if (
        tBody.rows[r].cells[c].textContent
        === tBody.rows[r + 1].cells[c].textContent
      ) {
        return false;
      }
    }
  }

  return true;
}
