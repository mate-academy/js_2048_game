'use strict';

const {
  winCondition,
  gameScore,
  highestScore,
} = require('./variables');

const { arrowsPlayHandler } = require('./move');

// - utils module:
// |-- with functions like get random field,
// |-- get non empty fields, check if something between etc.
function getNotEmptyFields(cells) {
  const AllNotEmptyFields = [];

  for (const cell of cells) {
    if (cell.classList.length !== 1) {
      AllNotEmptyFields.push(cell);
    }
  }

  return AllNotEmptyFields;
}

function getNotEmptyFieldsCoords(cells) {
  const notEmptyFieldsCoorsds = [];

  for (const cell of cells) {
    if (cell.classList.length !== 1) {
      notEmptyFieldsCoorsds.push(cell.id.split('-').slice(1));
    }
  }

  return notEmptyFieldsCoorsds;
}

function checkBetween(currPos, targetPos, allPos, dir, revert = false) {
  if (revert) {
    for (const pos of allPos) {
      if (pos[dir] < currPos[dir] && pos[dir] > targetPos[dir]) {
        return false;
      }
    }
  } else {
    for (const pos of allPos) {
      if (pos[dir] > currPos[dir] && pos[dir] < targetPos[dir]) {
        return false;
      }
    }
  }

  return true;
}

function randomField(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// - function to check if its possible to move
// |-- a cell into the free field:
function checkForMove(
  curr, target, currCoords, targetCoords,
  mainAxis, staticAxis, revert = false
) {
  return (revert
    ? currCoords[mainAxis] > targetCoords[mainAxis]
    : currCoords[mainAxis] < targetCoords[mainAxis])
    && currCoords[staticAxis] === targetCoords[staticAxis]
    && target.classList.length === 1
    && target.id !== curr.id;
}

// function to check if its possible to merge 2 cells in one:
function checkForMerge(
  curr, target, currCoords, targetCoords,
  mainAxis, staticAxis, revert = false
) {
  return (revert
    ? currCoords[mainAxis] > targetCoords[mainAxis]
    : currCoords[mainAxis] < targetCoords[mainAxis])
    && currCoords[staticAxis] === targetCoords[staticAxis]
    && target.classList.length !== 1
    && target.id !== curr.id
    && target.innerText === curr.innerText;
}

// function to merge 2 cells in one:
function mergeCells(curr, target) {
  target.classList.remove(`field-cell--${curr.innerText}`);
  target.classList.add(`field-cell--${Number(curr.innerText) * 2}`);
  target.innerText = Number(curr.innerText) * 2;
  curr.classList.remove(`field-cell--${curr.innerText}`);

  gameScore.innerText = Number(gameScore.innerText)
    + Number(curr.innerText) * 2;
  curr.innerText = '';

  if (target.innerText === winCondition) {
    document.querySelector('.message-win').classList.remove('hidden');
    document.querySelector('.message-play').classList.add('hidden');

    setNewHighestScore(gameScore, highestScore);

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

function setNewHighestScore(currentScore, currentHighestScore) {
  if (Number(localStorage.getItem('score')) < Number(currentScore.innerText)) {
    localStorage.setItem('score', gameScore.innerText);

    currentHighestScore.innerText = localStorage.getItem('score');
  }
}

module.exports = {
  getNotEmptyFields,
  getNotEmptyFieldsCoords,
  checkBetween,
  randomField,
  checkForMove,
  checkForMerge,
  mergeCells,
  moveCell,
  setNewHighestScore,
};
