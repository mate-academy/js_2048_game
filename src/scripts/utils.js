'use strict';

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

module.exports = {
  getNotEmptyFields,
  getNotEmptyFieldsCoords,
  checkBetween,
  randomField,
};
