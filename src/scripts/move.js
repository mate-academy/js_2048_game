'use strict';

// import
const {
  getNotEmptyFields,
  getNotEmptyFieldsCoords,
  checkBetween,
  randomField,
  mergeCells,
  moveCell,
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
} = require('./variables');

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

    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

// Main movement algorithm:
const arrowsPlayHandler = (e) => {
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
            moveCell(field, cell);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 0, 1)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 0)
          ) {
            mergeCells(field, cell);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        createItemInRandomEmptyField();
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
            moveCell(field, cell);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 0, 1, true)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 0, true)
          ) {
            mergeCells(field, cell);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        createItemInRandomEmptyField();
      }
      break;

    case 'ArrowLeft':
      for (const field of notEmptyFields) {
        const fieldPos = field.id.split('-').slice(1);

        for (const cell of [...allCells]) {
          const cellPos = cell.id.split('-').slice(1);

          if (checkForMove(field, cell, fieldPos, cellPos, 1, 0, true)) {
            moveCell(field, cell);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 1, 0, true)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 1, true)
          ) {
            mergeCells(field, cell);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        createItemInRandomEmptyField();
      }
      break;

    case 'ArrowRight':
      for (const field of notEmptyFields.reverse()) {
        const fieldPos = field.id.split('-').slice(1);

        for (const cell of [...allCells].reverse()) {
          const cellPos = cell.id.split('-').slice(1);

          if (checkForMove(field, cell, fieldPos, cellPos, 1, 0)) {
            moveCell(field, cell);
            isMoved = true;
            break;
          } else if (
            checkForMerge(field, cell, fieldPos, cellPos, 1, 0)
            && checkBetween(fieldPos, cellPos, notEmptyFieldsPositions, 1)
          ) {
            mergeCells(field, cell);
            isMoved = true;
            break;
          }
        }
      }

      if (isMoved || notEmptyFields.length === totalCountOfCells) {
        createItemInRandomEmptyField();
      }
      break;
  }
};

module.exports = {
  arrowsPlayHandler,
  createItemInRandomEmptyField,
};
