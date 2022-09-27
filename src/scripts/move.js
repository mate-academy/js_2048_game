'use strict';

// import
const {
  getNotEmptyFields,
  getNotEmptyFieldsCoords,
  checkBetween,
  randomField,
  checkForMerge,
  checkForMove,
  setNewHighestScore,
} = require('./utils');

const {
  totalCountOfCells,
  gameScore,
  allCells,
  highestScore,
  values,
  messageDuringTheGame,
  messageAfterLose,
  winCondition,
  moveCellColor,
} = require('./variables');

function mainListenerRemover() {
  document.body.removeEventListener('keyup', arrowsPlayHandler);
}

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
    messageAfterLose.classList.remove('hidden');
    messageDuringTheGame.classList.add('hidden');

    setNewHighestScore(gameScore, highestScore);

    // mainListenerRemover();
    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

// Main movement algorithm:
function arrowsPlayHandler(e) {
  let isMoved = false;
  const notEmptyFields = getNotEmptyFields(allCells);
  const notEmptyFieldsPositions = getNotEmptyFieldsCoords(allCells);

  switch (e.key) {
    case 'ArrowDown':
      for (const field of notEmptyFields.reverse()) {
        const fieldPos = field.id.split('-').slice(1);

        for (const cell of [...allCells].reverse()) {
          const cellPos = cell.id.split('-').slice(1);

          if (
            checkForMove(field, cell, fieldPos, cellPos, 0, 1)
          ) {
            moveCell(field, cell, fieldPos, cellPos, 0);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 0, 1)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 0)
          ) {
            mergeCells(field, cell, fieldPos, cellPos, 0);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        setTimeout(() => {
          createItemInRandomEmptyField();
        }, 301);
      }
      break;

    case 'ArrowUp':
      for (const field of notEmptyFields) {
        const fieldPos = field.id.split('-').slice(1);

        for (const cell of [...allCells]) {
          const cellPos = cell.id.split('-').slice(1);

          if (
            checkForMove(field, cell, fieldPos, cellPos, 0, 1, true)
          ) {
            moveCell(field, cell, fieldPos, cellPos, 0);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 0, 1, true)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 0, true)
          ) {
            mergeCells(field, cell, fieldPos, cellPos, 0);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        setTimeout(() => {
          createItemInRandomEmptyField();
        }, 301);
      }
      break;

    case 'ArrowLeft':
      for (const field of notEmptyFields) {
        const fieldPos = field.id.split('-').slice(1);

        for (const cell of [...allCells]) {
          const cellPos = cell.id.split('-').slice(1);

          if (checkForMove(field, cell, fieldPos, cellPos, 1, 0, true)) {
            moveCell(field, cell, fieldPos, cellPos, 1);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 1, 0, true)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 1, true)
          ) {
            mergeCells(field, cell, fieldPos, cellPos, 1);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        setTimeout(() => {
          createItemInRandomEmptyField();
        }, 301);
      }
      break;

    case 'ArrowRight':
      for (const field of notEmptyFields.reverse()) {
        const fieldPos = field.id.split('-').slice(1);

        for (const cell of [...allCells].reverse()) {
          const cellPos = cell.id.split('-').slice(1);

          if (checkForMove(field, cell, fieldPos, cellPos, 1, 0)) {
            moveCell(field, cell, fieldPos, cellPos, 1);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 1, 0)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 1)
          ) {
            mergeCells(field, cell, fieldPos, cellPos, 1);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        setTimeout(() => {
          createItemInRandomEmptyField();
        }, 301);
      }
      break;
  }
}

// function to merge 2 cells in one:
function mergeCells(curr, target, currCoords, targetCoords, axis) {
  const transformAxis = axis ? 'X' : 'Y';
  const value = curr.innerText;

  curr.style.transition = 'all 0.3s';
  curr.style.backgroundColor = moveCellColor;

  curr.style.transform = `
    translate${transformAxis}(${(targetCoords[axis] - currCoords[axis]) * 85}px)
  `;

  // As it was before:
  // curr.classList.remove(`field-cell--${curr.innerText}`);
  // target.classList.remove(`field-cell--${curr.innerText}`);
  // target.classList.add(`field-cell--${Number(curr.innerText) * 2}`);
  // target.innerText = Number(curr.innerText) * 2;
  //
  // gameScore.innerText = Number(gameScore.innerText)
  //   + Number(curr.innerText) * 2;
  // curr.innerText = '';

  curr.classList.remove(`field-cell--${value}`);
  target.classList.remove(`field-cell--${value}`);
  target.classList.add(`field-cell--${Number(value) * 2}`);
  target.innerText = Number(value) * 2;

  gameScore.innerText = Number(gameScore.innerText)
    + Number(value) * 2;
  curr.innerText = '';

  setTimeout(() => {
    curr.removeAttribute('style');
  }, 300);

  if (target.innerText === winCondition) {
    // - Cant move it to ./utils.js 'cus of this line of code.
    // |-- It doesnt work from another file.
    document.body.removeEventListener('keyup', arrowsPlayHandler);

    document.querySelector('.message-win').classList.remove('hidden');
    document.querySelector('.message-play').classList.add('hidden');

    setNewHighestScore(gameScore, highestScore);
  }
}

// function to move a cell into the free field:
function moveCell(curr, target, currCoords, targetCoords, axis) {
  const transformAxis = axis === 0 ? 'Y' : 'X';
  const value = curr.innerText;

  curr.style.transition = 'all 0.3s';
  curr.style.backgroundColor = moveCellColor;

  curr.style.transform = `
    translate${transformAxis}(${(targetCoords[axis] - currCoords[axis]) * 85}px)
  `;

  // As it was before:
  // target.classList.add(`field-cell--${curr.innerText}`);
  // target.innerText = curr.innerText;
  // curr.classList.remove(`field-cell--${curr.innerText}`);
  // curr.innerText = '';

  target.classList.add(`field-cell--${value}`);
  target.innerText = value;
  curr.classList.remove(`field-cell--${value}`);
  curr.innerText = '';

  setTimeout(() => {
    curr.removeAttribute('style');
  }, 300);
}

module.exports = {
  arrowsPlayHandler,
  createItemInRandomEmptyField,
  mainListenerRemover,
};
