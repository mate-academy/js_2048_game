'use strict';

const body = document.querySelector('body');
const gameHeader = body.querySelector('.game-header');
const gameField = body.querySelector('.game-field');
const tbody = body.querySelector('tbody');
const fieldRowAll = body.querySelectorAll('.field-row');
const controls = body.querySelector('.controls');
const score = body.querySelector('.game-score');
const start = body.querySelector('.start');
let probabilityCount = 0;

function changeAdditionalClassCell(element, newAddClass) {
  for (let i = 2; i <= 2048; i = i * 2) {
    element.classList.remove('field-cell--' + i);
  }

  element.classList.add(newAddClass);
}

function moveLeft() {
  for (const row of fieldRowAll) {
    const cells = row.querySelectorAll('.field-cell');
    const arrayCells = [];
    const arrayCellsNew = [];

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].textContent) {
        arrayCells.push(parseInt(cells[i].textContent));
      }
    }

    for (let i = 1; i < arrayCells.length; i++) {
      if (arrayCells[i - 1] === arrayCells[i] ) {
        arrayCells[i - 1] = arrayCells[i] * 2;
        arrayCells[i] = 0;
      }
    }

    for (let i = 1; i < arrayCells.length; i++) {
      if (arrayCells[i] !== 0) {
        arrayCellsNew.push(arrayCells[i]);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      if (arrayCellsNew[i]) {
        cells[i].textContent = arrayCellsNew[i];

        const addClass = 'field-cell--' + arrayCellsNew[i];

        changeAdditionalClassCell(cells[i], addClass);
      } else {
        cells[i].textContent = '';
        changeAdditionalClassCell(cells[i], '');
      }
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function newCell() {
  let cellNew = getRandomInt(16);
  let count = 0;

  for (const row of fieldRowAll) {
    const cells = row.querySelectorAll('.field-cell');

    for (const cell of cells) {
      if (count === cellNew && !cell.textContent) {
        if (probabilityCount < 10) {
          cell.textContent = 2;
          cell.classList.add('field-cell--2');
          probabilityCount++;
        } else {
          cell.textContent = 4;
          cell.classList.add('field-cell--4');
          probabilityCount = 0;
        }
      } else if (count === cellNew && cell.textContent) {
        cellNew = getRandomInt(16);
      }
      count++;
    }
  }
};

start.addEventListener('click', ourEvent => {
  if (start.classList.contains('start')) {
    start.textContent = 'Restart';
    newCell();
    newCell();
  }

  start.classList.remove('start');
  start.classList.add('restart');

  document.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowRight':
        break;

      case 'ArrowLeft':
        moveLeft();
        break;

      case 'ArrowUp':
        break;

      case 'ArrowDown':
        break;

      default:
        break;
    }
  });
});
