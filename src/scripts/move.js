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

    emptyFields[randomIndex].style.opacity = '0';
    emptyFields[randomIndex].style.transition = 'opacity 0.2s';

    emptyFields[randomIndex]
      .classList.add('field-cell--' + values[randomValue]);

    emptyFields[randomIndex]
      .innerText = values[randomValue];

    setTimeout(() => {
      emptyFields[randomIndex].style.opacity = '1';
      emptyFields[randomIndex].removeAttribute('style');
    }, 100);

  // if its impossible to create a new item:
  } else {
    messageAfterLose.classList.remove('hidden');
    messageDuringTheGame.classList.add('hidden');

    setNewHighestScore(gameScore, highestScore);

    // mainListenerRemover();
    document.body.removeEventListener('keyup', arrowsPlayHandler);
  }
}

// Main movement Handler:
function arrowsPlayHandler(e) {
  switch (e.key) {
    case 'ArrowDown':
      mainMove({
        mainAxis: 0,
        staticAxis: 1,
        revert: false,
        shouldReverse: true,
      });
      break;

    case 'ArrowUp':
      mainMove({
        mainAxis: 0,
        staticAxis: 1,
        revert: true,
        shouldReverse: false,
      });
      break;

    case 'ArrowLeft':
      mainMove({
        mainAxis: 1,
        staticAxis: 0,
        revert: true,
        shouldReverse: false,
      });
      break;

    case 'ArrowRight':
      mainMove({
        mainAxis: 1,
        staticAxis: 0,
        revert: false,
        shouldReverse: true,
      });
      break;
  }
}

// Main movement algorithm
function mainMove({
  mainAxis,
  staticAxis,
  revert,
  shouldReverse,
}) {
  let isMoved = false;
  const notEmptyFields = getNotEmptyFields(allCells);
  const notEmptyFieldsPositions = getNotEmptyFieldsCoords(allCells);
  const allGameCells = [...allCells];

  if (shouldReverse) {
    notEmptyFields.reverse();
    allGameCells.reverse();
  }

  for (const field of notEmptyFields) {
    const fieldPos = field.id.split('-').slice(1);

    for (const cell of allGameCells) {
      const cellPos = cell.id.split('-').slice(1);

      if (checkForMove(
        field, cell, fieldPos, cellPos,
        mainAxis, staticAxis, revert
      )) {
        moveCell(field, cell, fieldPos, cellPos, mainAxis);
        isMoved = true;
        break;
      } else if (
        checkForMerge(
          field, cell, fieldPos, cellPos,
          mainAxis, staticAxis, revert
        )
        && checkBetween(
          fieldPos, cellPos, notEmptyFieldsPositions,
          mainAxis, revert
        )
      ) {
        mergeCells(field, cell, fieldPos, cellPos, mainAxis);
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
}

// function to merge 2 cells in one:
function mergeCells(curr, target, currCoords, targetCoords, axis) {
  const transformAxis = axis ? 'X' : 'Y';
  const value = curr.innerText;
  const cssColor = getComputedStyle(target).backgroundColor;

  curr.style.transition = 'all 0.3s';
  curr.style.backgroundColor = cssColor;
  curr.style.color = cssColor;

  curr.style.transform = `
    translate${transformAxis}(${(targetCoords[axis] - currCoords[axis]) * 85}px)
  `;
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
  const cssColor = getComputedStyle(curr).backgroundColor;

  curr.style.transition = 'all 0.3s';
  curr.style.backgroundColor = cssColor;
  curr.style.color = cssColor;

  curr.style.transform = `
    translate${transformAxis}(${(targetCoords[axis] - currCoords[axis]) * 85}px)
  `;

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
