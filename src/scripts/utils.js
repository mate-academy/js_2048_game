'use strict';

const {
  gameScore,
} = require('./variables');

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
  setNewHighestScore,
};
