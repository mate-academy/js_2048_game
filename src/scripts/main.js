'use strict';

// const page = document.documentElement;
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const fieldCell = Array.from(document.querySelectorAll('.field-cell'));
const field = Array.from({ length: 4 }, () => Array(4).fill(0));

button.addEventListener('click', () => {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  for (let i = 0; i < fieldCell.length; i++) {
    removeClassesExceptOne(fieldCell[i]);
    fieldCell[i].classList.add('field-cell--0');
    fieldCell[i].textContent = '';
  }

  makeItem(2);
  updateInterface();
});

function getRandom(countVars) {
  return Math.round(Math.random() * (countVars - 1));
}

function removeClassesExceptOne(element, classToKeep = ('field-cell')) {
  const classes = element.classList;
  const classesToRemove = Array.from(classes);

  classesToRemove.forEach(function(className) {
    if (className !== classToKeep) {
      classes.remove(className);
    }
  });
}

function makeItem(countOfItems = 1) {
  let randomIndex = getRandom(fieldCell.length);

  if (messageWin.classList.contains('hidden')) {
    if (messageStart.classList.length === 3) {
      if (fieldCell.some(x => x.classList.length === 2)) {
        for (let i = 0; i < countOfItems; i++) {
          while (fieldCell[randomIndex].classList.length !== 2) {
            randomIndex = getRandom(fieldCell.length);
          }

          const value = getRandom(100) < 10 ? 4 : 2;

          fieldCell[randomIndex].textContent = '' + value;
          fieldCell[randomIndex].classList.add(`field-cell--${value}`);
        }
      } else {
        messageLose.classList.remove('hidden');
      }
    }
  }
}

function updateInterface() {
  field.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cell = fieldCell[rowIndex * 4 + colIndex];

      if (value !== 0) {
        cell.textContent = value > 0 ? value : '';
        cell.className = `field-cell field-cell--${value}`;
      }
    });
  });
}

function moveLeft() {
  for (let row = 0; row < field.length; row++) {
    for (let col = 1; col < field[row].length; col++) {

    }
  }

  makeItem();
  updateInterface();
}

function moveRight() {
  for (let row = 0; row < field.length; row++) {
    for (let col = field[row].length - 2; col >= 0; col--) {

    }
  }
  updateInterface();
  makeItem();
}

function moveUp() {
  makeItem();
}

function moveDown() {
  makeItem();
}

document.addEventListener('keydown', function(eventKey) {
  switch (eventKey.code) {
    case 'ArrowLeft':
      // console.log('left');

      moveLeft();
      break;

    case 'ArrowRight':
      // console.log('right');

      moveRight();
      break;

    case 'ArrowUp':
      // console.log('up');

      moveUp();
      break;

    case 'ArrowDown':
      // console.log('down');

      moveDown();
      break;
  }

  if (fieldCell.some(x => x.classList.contains('field-cell--2048'))) {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
  }
});
