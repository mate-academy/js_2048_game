'use strict';

// import
const {
  getNotEmptyFields,
  getNotEmptyFieldsCoords,
  checkBetween,
  randomField,
} = require('./utils');
const {
  mobileSwipes,
} = require('./mobile');

// write your code here
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const allCells = gameField.querySelectorAll('.field-cell');
const startBtn = document.querySelector('.button');
const values = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

function createItemInRandomEmptyField() {
  const emptyFields = [];

  for (const cell of allCells) {
    if (cell.classList.length === 1) {
      emptyFields.push(cell);
    }
  }

  if (emptyFields.length > 0) {
    const randomIndex = randomField(0, emptyFields.length - 1);
    const randomValue = randomField(0, values.length - 1);

    emptyFields[randomIndex]
      .classList.add('field-cell--' + values[randomValue]);

    emptyFields[randomIndex]
      .innerText = values[randomValue];
  } else {
    document.querySelector('.message-lose').classList.remove('hidden');
    document.querySelector('.message-play').classList.add('hidden');

    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

const arrowsPlayHandler = (e) => {
  const scoreBefore = gameScore.innerText;
  let isMoved = false;

  if (e.key === 'ArrowDown') {
    console.log('DOWN');

    const notEmptyFields = getNotEmptyFields(allCells);
    const notEmptyFieldsPositions = getNotEmptyFieldsCoords(allCells);

    for (const field of notEmptyFields.reverse()) {
      const fieldPos = field.id.split('-').slice(1);

      for (const cell of [...allCells].reverse()) {
        const cellPos = cell.id.split('-').slice(1);

        if (fieldPos[0] < cellPos[0]
          && fieldPos[1] === cellPos[1]
          && cell.classList.length === 1
          && cell.id !== field.id
        ) {
          moveCell(field, cell);
          isMoved = true;
          break;
        } else if (fieldPos[0] < cellPos[0]
          && fieldPos[1] === cellPos[1]
          && cell.classList.length !== 1
          && cell.id !== field.id
          && field.innerText === cell.innerText
          && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 0)
        ) {
          margeCells(field, cell);
          isMoved = true;
          break;
        }
      }
    }

    if (isMoved || notEmptyFields.length === 16) {
      createItemInRandomEmptyField();
    }
  } else if (e.key === 'ArrowUp') {
    console.log('UP');

    const notEmptyFields = getNotEmptyFields(allCells);
    const notEmptyFieldsPositions = getNotEmptyFieldsCoords(allCells);

    for (const field of notEmptyFields) {
      const fieldPos = field.id.split('-').slice(1);

      for (const cell of [...allCells]) {
        const cellPos = cell.id.split('-').slice(1);

        if (fieldPos[0] > cellPos[0]
          && fieldPos[1] === cellPos[1]
          && cell.classList.length === 1
          && cell.id !== field.id
        ) {
          moveCell(field, cell);
          isMoved = true;
          break;
        } else if (fieldPos[0] > cellPos[0]
          && fieldPos[1] === cellPos[1]
          && cell.classList.length !== 1
          && cell.id !== field.id
          && field.innerText === cell.innerText
          && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 0, true)
        ) {
          margeCells(field, cell);
          isMoved = true;
          break;
        }
      }
    }

    if (isMoved || notEmptyFields.length === 16) {
      createItemInRandomEmptyField();
    }
  } else if (e.key === 'ArrowLeft') {
    const notEmptyFields = getNotEmptyFields(allCells);
    const notEmptyFieldsPositions = getNotEmptyFieldsCoords(allCells);

    for (const field of notEmptyFields) {
      const fieldPos = field.id.split('-').slice(1);

      for (const cell of [...allCells]) {
        const cellPos = cell.id.split('-').slice(1);

        if (fieldPos[1] > cellPos[1]
          && fieldPos[0] === cellPos[0]
          && cell.classList.length === 1
          && cell.id !== field.id
        ) {
          moveCell(field, cell);
          isMoved = true;
          break;
        } else if (fieldPos[1] > cellPos[1]
          && fieldPos[0] === cellPos[0]
          && cell.classList.length !== 1
          && cell.id !== field.id
          && field.innerText === cell.innerText
          && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 1, true)
        ) {
          margeCells(field, cell);
          isMoved = true;
          break;
        }
      }
    }

    if (isMoved || notEmptyFields.length === 16) {
      createItemInRandomEmptyField();
    }
  } else if (e.key === 'ArrowRight') {
    console.log('RIGHT');

    const notEmptyFields = getNotEmptyFields(allCells);
    const notEmptyFieldsPositions = getNotEmptyFieldsCoords(allCells);

    for (const field of notEmptyFields.reverse()) {
      const fieldPos = field.id.split('-').slice(1);

      for (const cell of [...allCells].reverse()) {
        const cellPos = cell.id.split('-').slice(1);

        if (fieldPos[1] < cellPos[1]
          && fieldPos[0] === cellPos[0]
          && cell.classList.length === 1
          && cell.id !== field.id
        ) {
          moveCell(field, cell);
          isMoved = true;
          break;
        } else if (fieldPos[1] < cellPos[1]
          && fieldPos[0] === cellPos[0]
          && cell.classList.length !== 1
          && cell.id !== field.id
          && field.innerText === cell.innerText
          && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 1)
        ) {
          margeCells(field, cell);
          isMoved = true;
          break;
        }
      }
    }

    if (isMoved || notEmptyFields.length === 16) {
      createItemInRandomEmptyField();
    }
  }
};

function margeCells(curr, target) {
  target.classList.remove(`field-cell--${curr.innerText}`);
  target.classList.add(`field-cell--${Number(curr.innerText) * 2}`);
  target.innerText = Number(curr.innerText) * 2;
  curr.classList.remove(`field-cell--${curr.innerText}`);

  gameScore.innerText = Number(gameScore.innerText)
    + Number(curr.innerText) * 2;
  curr.innerText = '';

  if (target.innerText === '2048') {
    document.querySelector('.message-win').classList.remove('hidden');
    document.querySelector('.message-play').classList.add('hidden');

    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

function moveCell(curr, target) {
  target.classList.add(`field-cell--${curr.innerText}`);
  target.innerText = curr.innerText;
  curr.classList.remove(`field-cell--${curr.innerText}`);
  curr.innerText = '';
}

function gameInit() {
  startBtn.addEventListener('click', (e) => {
    if (startBtn.innerText === 'Start') {
      startBtn.innerText = 'Restart';
      startBtn.classList.remove(`start`);
      startBtn.classList.add(`restart`);

      document.querySelector('.message-play').classList.remove('hidden');
      document.querySelector('.message-start').classList.add('hidden');

      createItemInRandomEmptyField();
      createItemInRandomEmptyField();

      mobileSwipes(gameField);
      document.body.addEventListener('keyup', arrowsPlayHandler);
    } else if (startBtn.innerText === 'Restart') {
      for (const cell of allCells) {
        if (cell.classList.length > 1) {
          cell.classList.remove(`field-cell--${cell.innerText}`);
          cell.innerText = '';
        }
      }

      document.querySelector('.message-play').classList.remove('hidden');
      document.querySelector('.message-lose').classList.add('hidden');
      document.querySelector('.message-win').classList.add('hidden');
      gameScore.innerText = 0;

      createItemInRandomEmptyField();
      createItemInRandomEmptyField();

      document.body.addEventListener('keyup', arrowsPlayHandler);
    }
  });
}

gameInit();
