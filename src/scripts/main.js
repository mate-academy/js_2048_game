'use strict';

// write your code here
const FOUR_CHANCE = 0.1;
const table = document.querySelector('table');
const tBody = table.tBodies[0];
const button = document.querySelector('.button');
const allCells = document.querySelectorAll('td');
const startMessage = document.querySelector('.message-start');
let gameStarted = false;

button.addEventListener('click', () => {
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

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();

      if (gameStarted) {
        if (startMessage.classList.length < 3) {
          startMessage.classList.add('hidden');
        }

        handleArrowDown();
        createRandomElement();
      }
      break;

    case 'ArrowUp':
      e.preventDefault();

      if (gameStarted) {
        if (startMessage.classList.length < 3) {
          startMessage.classList.add('hidden');
        }

        handleArrowUp();
        createRandomElement();
      }
      break;

    case 'ArrowLeft':
      e.preventDefault();

      if (gameStarted) {
        if (startMessage.classList.length < 3) {
          startMessage.classList.add('hidden');
        }

        handleArrowLeft();
        createRandomElement();
      }
      break;

    case 'ArrowRight':
      e.preventDefault();

      if (gameStarted) {
        if (startMessage.classList.length < 3) {
          startMessage.classList.add('hidden');
        }

        handleArrowRight();
        createRandomElement();
      }
      break;

    default:
      break;
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
  let number = nextElem.classList[1].replace(/[^0-9]/g, '');

  number *= 2;

  elem.className = 'field-cell';
  elem.textContent = '';

  nextElem.className = 'field-cell';
  nextElem.textContent = number;
  nextElem.classList.add(`field-cell--${number}`);
  nextElem.id = 'merged';
}

function handleArrowDown() {
  const listOfActiveSpots = activeSpots();

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
      const mergeCondition = (
        elem.textContent === nextElem.textContent
        && !elem.id
        && !nextElem.id
      );

      if (nextElem.classList.length < 2) {
        elementMove(elem, nextElem);
      } else if (mergeCondition) {
        elementsMerge(elem, nextElem);
      }
    }
  }

  listOfActiveSpots.forEach(elem => elem.removeAttribute('id'));
}

function handleArrowUp() {
  const listOfActiveSpots = activeSpots();

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
      const mergeCondition = (
        elem.textContent === nextElem.textContent
        && !elem.id
        && !nextElem.id
      );

      if (nextElem.classList.length < 2) {
        elementMove(elem, nextElem);
      } else if (mergeCondition) {
        elementsMerge(elem, nextElem);
      }
    }
  }

  listOfActiveSpots.forEach(elem => elem.removeAttribute('id'));
}

function handleArrowLeft() {
  // console.log('arrowLeft');
}

function handleArrowRight() {
  // console.log('arrowRight');
}
