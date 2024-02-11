'use strict';

const ceils = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const start = document.querySelector('#startButton');

const startText = document.querySelector('.message-start');
const loseText = document.querySelector('.message-lose');
const winText = document.querySelector('.message-win');

function messageText() {
  ceils.forEach((cell) => {
    if (cell.textContent === '2048') {
      winText.classList.remove('hidden');
    }
  });

  if (checkStep() === false) {
    loseText.classList.remove('hidden');
  }
}

function startGame() {
  const randomIndex1 = Math.floor(Math.random() * ceils.length);
  const randomIndex2 = Math.floor(Math.random() * ceils.length);

  ceils[randomIndex1].classList.add('field-cell--2');
  ceils[randomIndex1].textContent = '2';

  ceils[randomIndex2].classList.add('field-cell--2');
  ceils[randomIndex2].textContent = '2';

  start.classList = 'button restart';
  start.textContent = 'Restart';

  startText.classList.add('hidden');
}

function restartGame() {
  ceils.forEach(cell => {
    cell.textContent = '';
    cell.classList = 'field-cell';
  });

  score.textContent = '0';
  start.classList = 'button start';
  start.textContent = 'Start';

  loseText.classList.add('hidden');
  startText.classList.remove('hidden');
}

function handleButtonClick() {
  if (start.textContent === 'Start') {
    startGame();
  } else {
    restartGame();
  }
}

function generateNewCeil() {
  const emptyIndices = [];

  ceils.forEach((cell, index) => {
    if (cell.textContent === '') {
      emptyIndices.push(index);
    }
  });

  if (emptyIndices.length === 0) {
    return;
  }

  const randomNumb = Math.floor(Math.random() * emptyIndices.length);
  const randomIndex = emptyIndices[randomNumb];

  const probability = Math.random() < 0.1;
  const newValue = probability ? '4' : '2';

  ceils[randomIndex].textContent = newValue;
  ceils[randomIndex].classList.add(`field-cell--${newValue}`);
}

function move(items, itemsFrom) {
  if (itemsFrom === 0) {
    for (let j = 1; j < 4; j++) {
      if (items[j].textContent !== '') {
        for (let k = j; k > 0; k--) {
          const value = +items[k].textContent;

          if (items[k - 1].textContent === '') {
            items[k - 1].textContent = items[k].textContent;
            items[k - 1].classList.add(`field-cell--${value}`);

            items[k].textContent = '';
            items[k].classList = 'field-cell';
          } else if (items[k - 1].textContent === items[k].textContent) {
            items[k - 1].textContent = value * 2;
            items[k - 1].classList.add(`field-cell--${value * 2}`);

            items[k].textContent = '';
            items[k].classList = 'field-cell';

            score.textContent = +score.textContent + value * 2;
            break;
          }
        }
      }
    }
  } else {
    for (let j = 2; j >= 0; j--) {
      if (items[j].textContent !== '') {
        for (let k = j; k < 3; k++) {
          const value = +items[k].textContent;

          if (items[k + 1].textContent === '') {
            items[k + 1].textContent = items[k].textContent;
            items[k + 1].classList.add(`field-cell--${value}`);
            items[k].textContent = '';
            items[k].classList = 'field-cell';
          } else if (items[k + 1].textContent === items[k].textContent) {
            items[k + 1].textContent = value * 2;
            items[k + 1].classList.add(`field-cell--${value * 2}`);

            items[k].textContent = '';
            items[k].classList = 'field-cell';

            score.textContent = +score.textContent + value * 2;
            break;
          }
        }
      }
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    const row = document.querySelectorAll('.field-row')[i];
    const cells = row.querySelectorAll('.field-cell');

    move(cells, 0);
  }

  generateNewCeil();
  messageText();
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    const row = document.querySelectorAll('.field-row')[i];
    const cells = row.querySelectorAll('.field-cell');

    move(cells, 1);
  }

  generateNewCeil();
  messageText();
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    const column = document
      .querySelectorAll(`.field-row .field-cell:nth-child(${i + 1})`);

    move(column, 0);
  }

  generateNewCeil();
  messageText();
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    const column = document
      .querySelectorAll(`.field-row .field-cell:nth-child(${i + 1})`);

    move(column, 1);
  }

  generateNewCeil();
  messageText();
}

function checkStep() {
  for (let i = 0; i < 4; i++) {
    const row = document.querySelectorAll('.field-row')[i];
    const cells = row.querySelectorAll('.field-cell');

    for (let j = 0; j < 3; j++) {
      if (cells[j].textContent === cells[j + 1].textContent
        || cells[j].textContent === '') {
        return true;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    const column = document
      .querySelectorAll(`.field-row .field-cell:nth-child(${i + 1})`);

    for (let j = 0; j < 3; j++) {
      if (column[j].textContent === column[j + 1].textContent
        || column[j].textContent === '') {
        return true;
      }
    }
  }

  return false;
}

document.addEventListener('keydown', () => {
  if (event.repeat) {
    return;
  }

  switch (event.key) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();

      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    default:
      break;
  }
});

document
  .getElementById('startButton')
  .addEventListener('click', handleButtonClick);
