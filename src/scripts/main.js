'use strict';

const startBtn = document.querySelector('.start');
const score = document.querySelector('.game-score');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');

const fieldRows = [...document.querySelectorAll('.field-row')];
const rows = [];

for (const row of fieldRows) {
  rows.push([...row.children]);
}

const columns = Array.from({ length: rows.length }, () => ([]));

for (const row of rows) {
  for (let i = 0; i < row.length; i++) {
    columns[i].push(row[i]);
  }
}

const cells = rows.flat();

startBtn.addEventListener('click', () => {
  startMsg.classList.add('hidden');
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
  addNumber(cells);
  addNumber(cells);
  styleCells(cells);

  const restartBtn = document.querySelector('.restart');

  restartBtn.style.outline = 'none';

  restartBtn.addEventListener('click', () => {
    score.textContent = '0';
    winMsg.classList.add('hidden');
    loseMsg.classList.add('hidden');

    cells.forEach(cell => {
      cell.textContent = '';
    });

    addNumber(cells);
    addNumber(cells);
    styleCells(cells);
  });

  document.body.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowLeft':
        move(rows, leftOrUp);
        break;
      case 'ArrowRight':
        move(rows, rightOrDown);
        break;
      case 'ArrowUp':
        move(columns, leftOrUp);
        break;
      case 'ArrowDown':
        move(columns, rightOrDown);
        break;
      default:
        break;
    }
  });
});

function addNumber(allCells) {
  const emptyCells = allCells.filter(cell => !cell.textContent);

  if (!emptyCells.length) {
    return;
  }

  const chance = Math.random();
  const index = Math.floor(Math.random() * emptyCells.length);

  if (chance < 0.9) {
    emptyCells[index].textContent = '2';
  } else {
    emptyCells[index].textContent = '4';
  }
}

function styleCells(allCells) {
  for (const cell of allCells) {
    cell.className = '';
    cell.classList.add('field-cell');

    if (cell.textContent) {
      cell.classList.add(`field-cell--${cell.textContent}`);
    }
  }
}

function move(arr, direction) {
  const cellsBefore = cells.map(el => el.textContent);

  direction(arr);

  const cellsAfter = cells.map(el => el.textContent);

  if (!checkArraysEqual(cellsBefore, cellsAfter)) {
    addNumber(cells);
  }

  showWinMsg(cells);
  showLoseMsg(cells);
  styleCells(cells);
}

function rightOrDown(arr) {
  for (const row of arr) {
    const cellsWithNumb = row.filter(cell => cell.textContent);

    mergeCells(cellsWithNumb);

    for (let i = row.length - 1; i >= 0; i--) {
      if (!cellsWithNumb.length) {
        row[i].textContent = '';
        continue;
      }

      row[i].textContent = cellsWithNumb.pop().textContent;
    }
  }
}

function leftOrUp(arr) {
  for (const row of arr) {
    const cellsWithNumb = row.filter(cell => cell.textContent);

    mergeCells(cellsWithNumb);

    for (let i = 0; i < row.length; i++) {
      if (!cellsWithNumb.length) {
        row[i].textContent = '';
        continue;
      }

      row[i].textContent = cellsWithNumb.shift().textContent;
    }
  }
}

function mergeCells(cellsWithNumb) {
  if (cellsWithNumb.length < 2) {
    return;
  }

  for (let i = 0; i < cellsWithNumb.length - 1; i++) {
    if (cellsWithNumb[i].textContent === cellsWithNumb[i + 1].textContent) {
      const newValue = +cellsWithNumb[i].textContent * 2;

      cellsWithNumb.splice(i, 1);
      cellsWithNumb[i].textContent = newValue;

      score.textContent = +score.textContent + newValue;
    }
  }
}

function checkArraysEqual(arr1, arr2) {
  return arr1.every((elem, index) => elem === arr2[index]);
}

function showWinMsg(allCells) {
  const condition = allCells.some(elem => elem.textContent === '2048');

  if (condition) {
    winMsg.classList.remove('hidden');
  }
}

function showLoseMsg(allCells) {
  const isEmptyCell = allCells.some(elem => !elem.textContent);

  if (!isEmptyCell && !isMergePossible(rows) && !isMergePossible(columns)) {
    winMsg.classList.add('hidden');
    loseMsg.classList.remove('hidden');
  }
}

function isMergePossible(arr) {
  for (const row of arr) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i].textContent === row[i + 1].textContent) {
        return true;
      }
    }
  }

  return false;
}
