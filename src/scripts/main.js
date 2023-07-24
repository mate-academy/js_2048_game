'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageRules = document.querySelector('.message-rules');
const cells = document.querySelectorAll('.field-cell');

document.addEventListener('keydown', () => {
  // зробити, щоб реагувало лише на стрілки-клавіші

  if (button.classList.contains('start') && !messageRules.classList.contains('hidden')) {
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

      const randomNumber = getRandomNumber(); // 2/4

      cells[randomCell].classList.add(`field-cell--${randomNumber}`);
      cells[randomCell].textContent = `${randomNumber}`;
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
  return Math.floor(Math.random() * cells.length);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function clearField() {
  for (let i = 0; i < cells.length; i++) {
    const [classToRemove] = [...cells[i].classList]
      .filter(item => item.startsWith('field-cell--'));

    cells[i].classList.remove(`${classToRemove}`);
    cells[i].textContent = '';
  }

  // for (let i = 0; i < cells.length; i++) {
  //   const classes = [...cells[i].classList];

  //   const classesToRemove = classes.filter(item => item.startsWith('field-cell--'));

  //   classesToRemove.forEach(item => {
  //     cells[i].classList.remove(`${item}`);
  //     cells[i].textContent = '';
  //   });
  // }
}

// function getFilledCells() {
//   const filledCells = [];

//   for (let i = 0; i < cells.length; i++) {
//     const classes = [...cells[i].classList];

//     if ()
//   }
// }
