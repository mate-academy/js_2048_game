'use strict';

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const fields = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let totalScore = 0;

button.addEventListener('click', e => {
  e.target.textContent = 'Restart';
  e.target.classList.remove('start');
  e.target.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  score.textContent = 0;

  clearFields();
  generateRandomField();
});

function clearFields() {
  fields.forEach(field => {
    field.textContent = '';

    Array.from(field.classList).forEach(className => {
      if (className.startsWith('field-cell--')) {
        field.classList.remove(className);
      }
    });
  });
}

function generateRandomField() {
  const indexes = [];

  while (indexes.length < 2) {
    const randomIndex = Math.floor(Math.random() * fields.length);

    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }

  const randomNumber = Math.random() < 0.1 ? 4 : 2;

  indexes.forEach(index => {
    const field = fields[index];

    field.textContent = randomNumber;
    field.classList.add('field-cell--' + randomNumber);
  });
}

function getEmptyFields() {
  return Array.from(fields).filter(field => field.textContent === '');
}

function addRandomField() {
  const emptyFields = getEmptyFields();

  if (emptyFields.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyFields.length);
    const randomNumber = Math.random() < 0.1 ? 4 : 2;

    const field = emptyFields[randomIndex];

    field.textContent = randomNumber;
    field.classList.add('field-cell--' + randomNumber);
  }
}

document.addEventListener('keydown', e => {
  const emptyFields = getEmptyFields();

  if (emptyFields.length === 0) {
    messageLose.classList.remove('hidden');

    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      moveFieldsUp();
      break;
    case 'ArrowDown':
      moveFieldsDown();
      break;
    case 'ArrowLeft':
      moveFieldsLeft();
      break;
    case 'ArrowRight':
      moveFieldsRight();
      break;
    default:
      break;
  }

  addRandomField();

  if (totalScore === 2048) {
    messageWin.classList.remove('hidden');
  }
});

function moveFieldsUp() {
  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      const index = i + j * 4;
      const field = fields[index];
      const value = parseInt(field.textContent);

      if (value) {
        column.push(value);
      }
    }

    const mergedColumn = mergeValues(column);

    for (let j = 0; j < 4; j++) {
      const index = i + j * 4;
      const field = fields[index];

      if (j < mergedColumn.length) {
        field.textContent = mergedColumn[j];
        field.className = `field-cell field-cell--${mergedColumn[j]}`;
      } else {
        field.textContent = '';
        field.className = 'field-cell';
      }
    }
  }

  score.textContent = totalScore;
}

function moveFieldsDown() {
  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 3; j >= 0; j--) {
      const index = i + j * 4;
      const field = fields[index];
      const value = parseInt(field.textContent);

      if (value) {
        column.push(value);
      }
    }

    const mergedColumn = mergeValues(column);

    for (let j = 3; j >= 0; j--) {
      const index = i + j * 4;
      const field = fields[index];

      if (3 - j < mergedColumn.length) {
        field.textContent = mergedColumn[3 - j];
        field.className = `field-cell field-cell--${mergedColumn[3 - j]}`;
      } else {
        field.textContent = '';
        field.className = 'field-cell';
      }
    }
  }

  score.textContent = totalScore;
}

function moveFieldsLeft() {
  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      const field = fields[index];
      const value = parseInt(field.textContent);

      if (value) {
        row.push(value);
      }
    }

    const mergedRow = mergeValues(row);

    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      const field = fields[index];

      if (j < mergedRow.length) {
        field.textContent = mergedRow[j];
        field.className = `field-cell field-cell--${mergedRow[j]}`;
      } else {
        field.textContent = '';
        field.className = 'field-cell';
      }
    }
  }

  score.textContent = totalScore;
}

function moveFieldsRight() {
  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 3; j >= 0; j--) {
      const index = i * 4 + j;
      const field = fields[index];
      const value = parseInt(field.textContent);

      if (value) {
        row.push(value);
      }
    }

    const mergedRow = mergeValues(row);

    for (let j = 3; j >= 0; j--) {
      const index = i * 4 + j;
      const field = fields[index];

      if (3 - j < mergedRow.length) {
        field.textContent = mergedRow[3 - j];
        field.className = `field-cell field-cell--${mergedRow[3 - j]}`;
      } else {
        field.textContent = '';
        field.className = 'field-cell';
      }
    }
  }

  score.textContent = totalScore;
}

function mergeValues(arr) {
  const mergedArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      const mergedValue = arr[i] + arr[i + 1];

      totalScore += mergedValue;

      mergedArr.push(mergedValue);
      i++;
    } else {
      mergedArr.push(arr[i]);
    }
  }

  return mergedArr;
}
