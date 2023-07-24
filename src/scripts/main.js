'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageRules = document.querySelector('.message-rules');
const cells = document.querySelectorAll('.field-cell');

document.addEventListener('keydown', () => {
  // зробити, щоб реагувало лише на стрілки-клавіші

  if (button.classList.contains('start')
    && !messageRules.classList.contains('hidden')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
    messageRules.classList.add('hidden');
  }
});

button.addEventListener('click', () => {
  clearField();

  // при натиснанні на кнопку Start
  if (button.classList.contains('start')) {
    if (!messageStart.classList.contains('hidden')) {
      messageStart.classList.add('hidden');
      messageRules.classList.remove('hidden');
    }

    // заповнити рандомно поле 2 числами
    for (let i = 0; i < 2; i++) {
      const randomCell = getRandomCell(); // 0-15
      // const firsRandomCell = randomCell;
      const randomNumber = getRandomNumber(); // 2/4
      const emptyCells = getEmptyCells();

      emptyCells[randomCell].classList.add(`field-cell--${randomNumber}`);
      emptyCells[randomCell].textContent = `${randomNumber}`;
    }
  }

  // при натиснанні на кнопку Restart
  if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageStart.classList.remove('hidden');
  }
});

function getRandomCell() {
  const emptyCells = getEmptyCells();

  return Math.floor(Math.random() * emptyCells.length);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function clearField() {
  const filledCells = getFilledCells();

  filledCells.forEach(item => {
    item.classList.remove(`${[...item.classList][1]}`);
    item.textContent = '';
  });

  // for (let i = 0; i < cells.length; i++) {
  //   const [classToRemove] = [...cells[i].classList]
  //     .filter(item => item.startsWith('field-cell--'));

  //   if (classToRemove) {
  //     cells[i].classList.remove(`${classToRemove}`);
  //     cells[i].textContent = '';
  //   }
  // }
}

function getFilledCells() {
  return [...cells].filter(item => [...item.classList].length > 1);
}

function getEmptyCells() {
  return [...cells].filter(item => [...item.classList].length === 1);
}
