'use strict';

const cells = document.querySelectorAll('.field-cell');
const table = document.querySelector('.game-field');
const start = document.querySelector('.start');
const messegeStart = document.querySelector('.message-start');
const messegeLose = document.querySelector('.message-lose');
const messegeWin = document.querySelector('.message-win');
let score = 0;
const scoreInGame = document.querySelector('.game-score');

function createNumber() {
  const emptyCells
    = [...document.querySelectorAll('.field-cell')]
      .filter(cell => !cell.innerText);

  function random(minNumber, maxNumber) {
    const min = Math.ceil(minNumber);
    const max = Math.floor(maxNumber);

    return Math.floor(Math.random()
      * (max - min + 1)) + min; // Максимум и минимум включаются
  };

  const randomCellIndex = random(0, [...emptyCells].length - 1);
  let number;
  const randomNumber = random(0, 100);

  if (randomNumber >= 90) {
    number = 4;
  } else {
    number = 2;
  };

  function addNumber(cell) {
    cell.setAttribute('id', 'new-number');

    setTimeout(() => {
      cell.removeAttribute('id');
    }, 100);

    cell.innerText = number;
  };
  addNumber(emptyCells[randomCellIndex]);

  addClass([...cells]);
};

function addClass(cellsArr) {
  cellsArr.map(cell => {
    if (cell.innerText) {
      cell.className = `field-cell field-cell--${cell.innerText}`;
    } else {
      cell.className = ``;
      cell.classList.add(`field-cell`);
    }
  });
};

const tbodyHorisontal = document.querySelector('tbody');
const tbodyVertical = document.createElement('tbody');

tbodyVertical.classList.add('tbody-columns');

// розворот таблиці
function turnTheTable(tableBody, type) {
  tableBody.innerHTML = '';

  for (let i = 0; i < document.querySelector('tbody').children.length; i++) {
    // отримую колонку
    const cellsInColumn = [...document.querySelectorAll('td')]
      .filter(cell => cell.cellIndex === i);
    // створюю таблицю де стовпці це рядки
    const newLine = document.createElement('tr');

    newLine.classList.add(`field-${type}`);

    newLine.innerHTML = `${cellsInColumn.map(cell => {
      return `<td class="field-cell field-cell-${type}">${cell.innerText}</td>`;
    }).join('')}`;
    tableBody.append(newLine);
  };

  addClass([...tableBody.querySelectorAll('td')]);
};

function rowsRewriteToLeft() {
  const rows = document.querySelectorAll('tr');

  for (let i = 0; i < document.querySelector('tr').children.length; i++) {
    const cellsInCollumn = rows[i].children;

    // переставляю пусті комірки в кінець
    [...cellsInCollumn].forEach(cell => {
      if (cell.innerText === '') {
        cell.parentElement.append(cell);
      }
    });

    // додаю однакові числа
    for (let j = 0; j < cellsInCollumn.length; j++) {
      if (cellsInCollumn[j]
          && cellsInCollumn[j + 1]
          && cellsInCollumn[j].innerText === cellsInCollumn[j + 1].innerText
          && cellsInCollumn[j].innerText !== '') {
        cellsInCollumn[j].innerText = cellsInCollumn[j].innerText * 2;
        score += +cellsInCollumn[j].innerText;

        /// ///////////////////////////////////
        cellsInCollumn[j].setAttribute('scale', '1');

        setTimeout(() => {
          cellsInCollumn[j].removeAttribute('scale');
        }, 200);
        cellsInCollumn[j + 1].innerText = '';
        rows[i].append(cellsInCollumn[j + 1]);
      };
    };
  };
}

function rowsRewriteToRight() {
  const rows = document.querySelectorAll('tr');

  for (let i = 0; i < [...document.querySelectorAll('tr')].length; i++) {
    const cellsInRow = rows[i].children;

    // переставляю пусті комірки в кінець
    [...cellsInRow].forEach(cell => {
      if (cell.innerText === '') {
        cell.parentElement.prepend(cell);
      }
    });

    // додаю однакові числа
    for (let j = cellsInRow.length - 1; j >= 0; j--) {
      if (cellsInRow[j]
          && cellsInRow[j - 1]
          && cellsInRow[j].innerText === cellsInRow[j - 1].innerText
          && cellsInRow[j].innerText !== '') {
        cellsInRow[j].innerText = cellsInRow[j].innerText * 2;
        score += +cellsInRow[j].innerText;

        /// /////////////////////////////////////////////////////////////
        cellsInRow[j].setAttribute('scale', '1');

        setTimeout(() => {
          cellsInRow[j].removeAttribute('scale');
        }, 200);
        cellsInRow[j - 1].innerText = '';
        rows[i].prepend(cellsInRow[j - 1]);
      };
    };
  };
}

function keydownListener(e) {
  // масив зі значеннями в комірках для того щоб порівняти з масивом в кінці
  const cellsArr = [];

  [...document.querySelectorAll('td')].forEach(cell => {
    cellsArr.push(cell.innerText);
  });

  /// ///////ArrowUp
  if (e.key === 'ArrowUp') {
    if (!document.querySelector('tbody').classList.contains('tbody-columns')) {
      // розворот таблиці
      turnTheTable(tbodyVertical, 'column');
      tbodyHorisontal.remove(); // ховаю правильну таблицю
      table.append(tbodyVertical); // вставляю таблицю з колонками
    };

    rowsRewriteToLeft();
  };

  /// ///////ArrowDown
  if (e.key === 'ArrowDown') {
    if (!document.querySelector('tbody').classList.contains('tbody-columns')) {
      // розворот таблиці
      turnTheTable(tbodyVertical, 'column');
      tbodyHorisontal.remove(); // ховаю правильну таблицю
      table.append(tbodyVertical); // вставляю таблицю з колонками
    };

    rowsRewriteToRight();
  };

  /// ///////ArrowLeft
  if (e.key === 'ArrowLeft') {
    if (document.querySelector('tbody').classList.contains('tbody-columns')) {
      turnTheTable(tbodyHorisontal, 'row');
      tbodyVertical.remove(); // ховаю вертикальну таблицю
      table.append(tbodyHorisontal); // вставляю таблицю з рядками
    };

    rowsRewriteToLeft();
  };

  /// ///////ArrowRight
  if (e.key === 'ArrowRight') {
    if (document.querySelector('tbody').classList.contains('tbody-columns')) {
      turnTheTable(tbodyHorisontal, 'row');
      tbodyVertical.remove(); // ховаю вертикальну таблицю
      table.append(tbodyHorisontal); // вставляю таблицю з рядками
    };

    rowsRewriteToRight();
  };

  // порівнюю попередні значення в комірках з новими
  // (якщо відрізняються то створюю нове число)
  const newCellArr = [];

  [...document.querySelectorAll('td')].forEach(cell => {
    newCellArr.push(cell.innerText);
  });

  for (let i = 0; i < newCellArr.length; i++) {
    if (newCellArr[i] !== cellsArr[i]) {
      createNumber();
      break;
    };
  };

  // Умова для перемоги
  victory(newCellArr);

  // Умова для програшу
  loss(newCellArr);

  addClass([...document.querySelectorAll('.field-cell')]);
  scoreInGame.innerText = score;
};

// перемога
function victory(valuesInCells) {
  if (valuesInCells.find(cell => cell === '2048')) {
    messegeStart.classList.add('hidden');
    messegeLose.classList.add('hidden');
    messegeWin.classList.remove('hidden');

    document.removeEventListener('keydown', keydownListener);
  };
}

// програш
function loss(valuesInCells) {
  const emptyCells = valuesInCells.filter(cell => cell === '');

  if (emptyCells.length === 0) {
    const horisontalNembers = {};
    const verticalNumbers = {};

    const allCells = document.querySelectorAll('td');

    if (document.querySelector('tbody').classList.contains('tbody-columns')) {
      for (let i = 0; i < [...allCells].length; i++) {
        if (!horisontalNembers[allCells[i].cellIndex]) {
          horisontalNembers[allCells[i].cellIndex] = [];
        }
        horisontalNembers[allCells[i].cellIndex].push(allCells[i].innerText);

        if (!verticalNumbers[allCells[i].parentElement.rowIndex]) {
          verticalNumbers[allCells[i].parentElement.rowIndex] = [];
        };

        verticalNumbers[allCells[i].parentElement.rowIndex]
          .push(allCells[i].innerText);
      };
    } else {
      for (let i = 0; i < [...allCells].length; i++) {
        if (!verticalNumbers[allCells[i].cellIndex]) {
          verticalNumbers[allCells[i].cellIndex] = [];
        };
        verticalNumbers[allCells[i].cellIndex].push(allCells[i].innerText);

        if (!horisontalNembers[allCells[i].parentElement.rowIndex]) {
          horisontalNembers[allCells[i].parentElement.rowIndex] = [];
        };

        horisontalNembers[allCells[i].parentElement.rowIndex]
          .push(allCells[i].innerText);
      };
    }

    let possibleNextStep = 0;

    for (const row in horisontalNembers) {
      for (let i = 1; i < horisontalNembers[row].length - 1; i++) {
        if (horisontalNembers[row][i] === horisontalNembers[row][i - 1]
          || horisontalNembers[row][i] === horisontalNembers[row][i + 1]) {
          possibleNextStep++;
        }
      }
    }

    for (const row in verticalNumbers) {
      for (let i = 1; i < verticalNumbers[row].length - 1; i++) {
        if (verticalNumbers[row][i] === verticalNumbers[row][i - 1]
          || verticalNumbers[row][i] === verticalNumbers[row][i + 1]) {
          possibleNextStep++;
        }
      }
    };

    if (possibleNextStep === 0) {
      messegeLose.classList.remove('hidden');
      messegeStart.classList.add('hidden');
      messegeWin.classList.add('hidden');
      document.removeEventListener('keydown', keydownListener);
    }
  };
}

// Кнопка start
start.addEventListener('click', (e) => {
  document.addEventListener('keydown', keydownListener);
  messegeStart.classList.add('hidden');
  messegeLose.classList.add('hidden');
  messegeWin.classList.add('hidden');
  score = 0;
  scoreInGame.innerText = 0;

  const allCells = document.querySelectorAll('td');

  if ([...allCells].find(cell => cell.innerText !== '')) {
    allCells.forEach(cell => {
      cell.innerText = '';
      cell.className = 'field-cell';
    });
  };
  createNumber();
  createNumber();
  addClass([...document.querySelectorAll('.field-cell')]);

  start.innerText = 'Restart';
  start.classList.remove('start');
  start.classList.add('restart');
});
