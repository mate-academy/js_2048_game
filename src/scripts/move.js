'use strict';

// import
const {
  getNotEmptyFields,
  getNotEmptyFieldsCoords,
  checkBetween,
  randomField,
} = require('./utils');

const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const allCells = gameField.querySelectorAll('.field-cell');
const highestScore = document.querySelector('.highest-score');
const values = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

function createItemInRandomEmptyField() {
  const emptyFields = [];

  for (const cell of allCells) {
    if (cell.classList.length === 1) {
      emptyFields.push(cell);
    }
  }

  // create new item:
  if (emptyFields.length > 0) {
    const randomIndex = randomField(0, emptyFields.length - 1);
    const randomValue = randomField(0, values.length - 1);

    emptyFields[randomIndex]
      .classList.add('field-cell--' + values[randomValue]);

    emptyFields[randomIndex]
      .innerText = values[randomValue];

  // if its impossible to create a new item:
  } else {
    document.querySelector('.message-lose').classList.remove('hidden');
    document.querySelector('.message-play').classList.add('hidden');

    if (Number(localStorage.getItem('score')) < Number(gameScore.innerText)) {
      localStorage.setItem('score', gameScore.innerText);

      highestScore.innerText = localStorage.getItem('score');
    }

    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

// Main movement algorithm:
const arrowsPlayHandler = (e) => {
  let isMoved = false;

  if (e.key === 'ArrowDown') {
    // MOVE DOWN:
    // console.log('DOWN');

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
    // MOVE UP:
    // console.log('UP');

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
    // MOVE LEFT:
    // console.log('LEFT');

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
    // MOVE RIGHT:
    // console.log('RIGHT');

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

// function to marge 2 cells in one:
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

    if (Number(localStorage.getItem('score')) < Number(gameScore.innerText)) {
      localStorage.setItem('score', gameScore.innerText);

      highestScore.innerText = localStorage.getItem('score');
    }

    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

// function to move a cell into the free field:
function moveCell(curr, target) {
  target.classList.add(`field-cell--${curr.innerText}`);
  target.innerText = curr.innerText;
  curr.classList.remove(`field-cell--${curr.innerText}`);
  curr.innerText = '';
}

module.exports = {
  arrowsPlayHandler,
  createItemInRandomEmptyField,
};
