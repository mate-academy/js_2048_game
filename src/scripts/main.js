'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageRules = document.querySelector('.message-rules');
const cells = document.querySelectorAll('.field-cell');

let emptyCells = [];
let filledCells = [];

const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', event => {
  // зробити, щоб реагувало лише на стрілки-клавіші
  // if (!arrows.includes(event.key)) {
  //   return;
  // }

  if (arrows.includes(event.key)) {
    handleArrowKeyAction(event.key);

    if (button.classList.contains('start')
      && !messageRules.classList.contains('hidden')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
      messageRules.classList.add('hidden');
    }
  }
});

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    startGame();
  }

  if (button.classList.contains('restart')) {
    restartGame();
  }
});

function startGame() {
  clearField();

  if (!messageStart.classList.contains('hidden')) {
    messageStart.classList.add('hidden');
    messageRules.classList.remove('hidden');
  }

  for (let i = 0; i < 2; i++) {
    addNewTile();
  }
}

function restartGame() {
  clearField();
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
  messageStart.classList.remove('hidden');
}

function addNewTile() {
  const randomCell = getRandomCell();
  const randomNumber = getRandomNumber();

  emptyCells[randomCell].classList.add(`field-cell--${randomNumber}`);
  emptyCells[randomCell].textContent = `${randomNumber}`;

  updateCellLists();
}

function handleArrowKeyAction(key) {
  //
}

function getRandomCell() {
  return Math.floor(Math.random() * emptyCells.length);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function clearField() {
  filledCells.forEach(item => {
    item.classList.remove(`${item.classList[1]}`);
    item.textContent = '';
  });

  updateCellLists();
}

function updateCellLists() {
  emptyCells = [...cells].filter(item => item.classList.length === 1);
  filledCells = [...cells].filter(item => item.classList.length > 1);
}
