'use strict';

const container = document.querySelector('.container');

const start = container.querySelector('.start');
const gameScore = container.querySelector('.game-score');

const gameField = container.querySelector('.game-field');
const tbody = gameField.querySelector('tbody');

const messageContainer = container.querySelector('.message-container');
const messageStart = messageContainer.querySelector('.message-start');
const messageWin = messageContainer.querySelector('.message-win');
const messageLose = messageContainer.querySelector('.message-lose');

const rows = [...tbody.querySelectorAll('tr')];
const cells = rows.map(row => [...row.cells].map(cell => cell));
let valueCells = rows.map(row => [...row.cells].map(cell => cell.textContent));
let newValueCells = [...valueCells];

let winner = false;

const numRows = rows.length;
const numColumn = rows[rows.length - 1].cells.length;

start.addEventListener('click', e => {
  if (winner) {
    return;
  }

  const fieldCells = [...gameField.querySelectorAll('.field-cell')];

  if (fieldCells.find(cell => cell.textContent !== '')) {
    fieldCells.forEach(element => {
      element.textContent = '';
      nameClass(element);
    });

    valueCells = rows.map(row => [...row.cells].map(cell => cell.textContent));
  }

  gameScore.textContent = 0;
  start.textContent = 'Restart';

  if (start.className.includes('start')) {
    start.classList.replace('start', 'restart');
  }

  if (!messageLose.className.includes('hidden')) {
    messageLose.classList.add('hidden');
  }

  if (!messageWin.className.includes('hidden')) {
    messageWin.classList.add('hidden');
  }

  if (!messageStart.className.includes('hidden')) {
    messageStart.classList.add('hidden');
  }

  const maxStart = 2;
  const emptyCells = getEmptyCells();

  fillRandom(maxStart, emptyCells);
});

document.addEventListener('keydown', e => {
  if (winner) {
    return;
  }

  newValueCells = [...valueCells];

  switch (e.key) {
    case 'ArrowLeft':
      evenMove('left');
      break;
    case 'ArrowRight':
      evenMove('right');
      break;
    case 'ArrowUp':
      evenMove('up');
      break;
    case 'ArrowDown':
      evenMove('down');
      break;
    default:
      return;
  }

  if (newValueCells.join() === valueCells.join()) {
    return;
  }

  rows.forEach((row, i) => {
    [...row.cells].forEach((cell, j) => {
      if (cell.textContent !== newValueCells[i][j]) {
        cell.textContent = String(newValueCells[i][j]);
        nameClass(cell);
      }
    });
  });

  if (winner) {
    messageWin.classList.remove('hidden');
  }

  valueCells = [...newValueCells];

  const maxStart = 1;
  const emptyCells = getEmptyCells();

  fillRandom(maxStart, emptyCells);

  if (emptyCells.length === 0 && checkMove()) {
    messageLose.classList.remove('hidden');
  }
});

function checkMove() {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumn; j++) {
      if (newValueCells[i][j] === newValueCells[i][j + 1]) {
        return false;
      }
    }
  }

  newValueCells = transposeFieldCells();

  for (let i = 0; i < numColumn; i++) {
    for (let j = 0; j < numRows; j++) {
      if (newValueCells[i][j] === newValueCells[i][j + 1]) {
        return false;
      }
    }
  }

  return true;
}

function evenMove(direction) {
  let score = 0;

  if (direction === 'up' || direction === 'down') {
    newValueCells = transposeFieldCells();
  }

  newValueCells.forEach((row, i, arrayRow) => {
    const filterNotEmpty = row.filter(elem => elem !== '');

    if (filterNotEmpty.length > 0) {
      if (direction === 'right' || direction === 'down') {
        filterNotEmpty.reverse();
      }

      if (filterNotEmpty.length > 1) {
        filterNotEmpty.forEach((cell, j, arrayCol) => {
          if (arrayCol[j] === arrayCol[j + 1]) {
            arrayCol[j] *= 2;
            score += arrayCol[j];
            filterNotEmpty.splice(j + 1, 1);

            if (arrayCol[j] === 2048) {
              winner = true;
            }
          }
        });
      }

      arrayRow[i] = [...filterNotEmpty,
        ...Array(numColumn - filterNotEmpty.length).fill('')];

      if (direction === 'right' || direction === 'down') {
        arrayRow[i].reverse();
      }
    }
  });

  if (direction === 'up' || direction === 'down') {
    newValueCells = transposeFieldCells();
  }

  if (score > 0) {
    gameScore.textContent = +gameScore.textContent + score;
  }
}

function transposeFieldCells() {
  return newValueCells[0].map((col, i) => newValueCells.map(row => row[i]));
}

function getEmptyCells() {
  return valueCells.reduce((prev, row, i) => {
    return [...prev, ...row.map((cell, j) => {
      if (cell === '') {
        return [i, j];
      }
    })];
  }, []).filter(cell => cell !== undefined);
}

function fillRandom(maxStart, emptyCells) {
  if (emptyCells.length === 0) {
    return;
  }

  let countRandom = 0;

  while (countRandom < maxStart) {
    const index = Math.floor(Math.random() * emptyCells.length);
    const [i, j] = emptyCells[index];

    valueCells[i][j] = Math.random() > 0.9 ? 4 : 2;

    cells[i][j].textContent = String(valueCells[i][j]);
    nameClass(cells[i][j]);

    countRandom++;

    emptyCells.splice(index, 1);
  }
}

function nameClass(cell) {
  if (cell.textContent === '') {
    cell.className = 'field-cell';

    return;
  }

  cell.className = `field-cell field-cell--${cell.textContent}`;
}
