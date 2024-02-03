'use strict';

const COLUMN_LENGTH = 4;
const winValue = 2048;
const gameField = document.querySelector('.game-field').tBodies[0];
const rows = [...gameField.children];
const cells = [...gameField.querySelectorAll('.field-cell')];
const scoreBlock = document.querySelector('.game-score');
const bestBlock = document.querySelector('.game-best');
const tiles = [];

let wasAnyCellReplaced = false;
let score = 0;
let best = localStorage.getItem('best') || 0;

let xTouchStartPoint = null;
let yToucStartPoint = null;
let lastY = 1;

function isPossibleToMove() {
  if (getEmptyCells().length > 0) {
    return true;
  }

  for (let i = 0; i < rows.length; i++) {
    for (let k = 0; k < rows.length; k++) {
      const currentCellValue = rows[i].children[k].dataset.num;

      if (k !== rows.length - 1) {
        const rightCellValue = rows[i].children[k + 1].dataset.num;

        if (currentCellValue === rightCellValue) {
          return true;
        }
      }

      if (i !== rows.length - 1) {
        const bottomCellValue = rows[i + 1].children[k].dataset.num;

        if (currentCellValue === bottomCellValue) {
          return true;
        }
      }
    }
  }

  return false;
}
