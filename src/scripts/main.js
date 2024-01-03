'use strict';

// write your code here
const FOUR_CHANCE = 0.1;
// const table = document.querySelector('table');
// const tBody = table.tBodies[0];
const button = document.querySelector('.button');
const allCells = document.querySelectorAll('td');

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
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();

      handleArrowDown();
      break;

    case 'ArrowUp':
      e.preventDefault();

      handleArrowUp();
      break;

    case 'ArrowLeft':
      e.preventDefault();

      handleArrowLeft();
      break;

    case 'ArrowRight':
      e.preventDefault();

      handleArrowRight();
      break;

    default:
      break;
  }
});

function createRandomElement() {
  const chance = Math.random();
  const listOfFreeSpots = [];

  for (const element of allCells) {
    if (element.classList.length < 2) {
      listOfFreeSpots.push(element);
    }
  }

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

function handleArrowDown() {
  // console.log('arrowDown');
}

function handleArrowUp() {
  // console.log('arrowUp');
}

function handleArrowLeft() {
  // console.log('arrowLeft');
}

function handleArrowRight() {
  // console.log('arrowRight');
}
