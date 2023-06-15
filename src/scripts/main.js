'use strict';

const cells = findAllCells(document);
const table = document.querySelector('.game-field');
const start = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
let score = 0;
const scoreInGame = document.querySelector('.game-score');

function findAllCells(element) {
  return element.querySelectorAll('td');
};

function random(minNumber, maxNumber) {
  const min = Math.ceil(minNumber);
  const max = Math.floor(maxNumber);

  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
};

function createNumber() {
  const emptyCells = [...findAllCells(document)]
    .filter(cell => !cell.innerText);

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

function turnTheTable(tableBody, type) {
  tableBody.innerHTML = '';

  const rowsCount = document.querySelector('tbody').children.length;

  for (let i = 0; i < rowsCount; i++) {
    const cellsInColumn = [...findAllCells(document)]
      .filter(cell => cell.cellIndex === i);

    const newLine = document.createElement('tr');

    newLine.classList.add(`field-${type}`);

    newLine.innerHTML = `${cellsInColumn.map(cell => {
      return `<td class="field-cell field-cell-${type}">${cell.innerText}</td>`;
    }).join('')}`;

    tableBody.append(newLine);
  };

  addClass([...findAllCells(tableBody)]);
};

function rowsRewriteToLeft() {
  const rows = document.querySelectorAll('tr');
  const columnsCount = document.querySelector('tr').children.length;

  for (let i = 0; i < columnsCount; i++) {
    const cellsInCollumn = rows[i].children;

    [...cellsInCollumn].forEach(cell => {
      if (cell.innerText === '') {
        cell.parentElement.append(cell);
      }
    });

    for (let j = 0; j < cellsInCollumn.length; j++) {
      if (cellsInCollumn[j]
          && cellsInCollumn[j + 1]
          && cellsInCollumn[j].innerText === cellsInCollumn[j + 1].innerText
          && cellsInCollumn[j].innerText !== '') {
        cellsInCollumn[j].innerText = cellsInCollumn[j].innerText * 2;
        score += +cellsInCollumn[j].innerText;

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

  for (let i = 0; i < [...rows].length; i++) {
    const cellsInRow = rows[i].children;

    [...cellsInRow].forEach(cell => {
      if (cell.innerText === '') {
        cell.parentElement.prepend(cell);
      }
    });

    for (let j = cellsInRow.length - 1; j >= 0; j--) {
      if (cellsInRow[j]
          && cellsInRow[j - 1]
          && cellsInRow[j].innerText === cellsInRow[j - 1].innerText
          && cellsInRow[j].innerText !== '') {
        cellsInRow[j].innerText = cellsInRow[j].innerText * 2;
        score += +cellsInRow[j].innerText;

        cellsInRow[j].setAttribute('scale', '1');

        setTimeout(() => {
          cellsInRow[j].removeAttribute('scale');
        }, 200);
        cellsInRow[j - 1].innerText = '';
        rows[i].prepend(cellsInRow[j - 1]);
      };
    };
  };
};

function createArrWithAllNumbers(arrForPush) {
  const verticalTable = document.querySelector('tbody')
    .classList.contains('tbody-columns');

  if (verticalTable) {
    const allCells = [...document.querySelectorAll('td')];

    for (let i = 0; i < [...document.querySelectorAll('tr')].length; i++) {
      const row = allCells.filter(cell => cell.cellIndex === i);
      const rowNumbers = row.map(cell => cell.innerText);

      arrForPush.push(...rowNumbers);
    };
  } else {
    const allCells = [...findAllCells(document)];

    allCells.map(cell => arrForPush.push(cell.innerText));
  };
};

function arrIsChanged(arrBefore, arrAfter) {
  for (let i = 0; i < arrAfter.length; i++) {
    if (arrAfter[i] !== arrBefore[i]) {
      createNumber();
      break;
    };
  };
};

function insertTable(toTableType, fromTableType) {
  if (toTableType === 'vetical') {
    if (fromTableType) {
      turnTheTable(tbodyVertical, 'column');
      tbodyHorisontal.remove();
      table.append(tbodyVertical);
    };
  }

  if (toTableType === 'horisontal') {
    if (!fromTableType) {
      turnTheTable(tbodyHorisontal, 'row');
      tbodyVertical.remove();
      table.append(tbodyHorisontal);
    };
  }
};

function keydownListener(e) {
  const cellsArr = [];

  createArrWithAllNumbers(cellsArr);

  const horisontalTable = !document.querySelector('tbody')
    .classList.contains('tbody-columns');

  switch (e.key) {
    case 'ArrowUp':
      insertTable('vetical', horisontalTable);
      rowsRewriteToLeft();
      break;
    case 'ArrowDown':
      insertTable('vetical', horisontalTable);
      rowsRewriteToRight();
      break;
    case 'ArrowLeft':
      insertTable('horisontal', horisontalTable);
      rowsRewriteToLeft();
      break;
    case 'ArrowRight':
      insertTable('horisontal', horisontalTable);
      rowsRewriteToRight();
      break;
  };

  const newCellArr = [];

  createArrWithAllNumbers(newCellArr);

  arrIsChanged(cellsArr, newCellArr);

  victory(newCellArr);

  loss(newCellArr, horisontalTable);

  addClass([...findAllCells(document)]);
  scoreInGame.innerText = score;
};

function victory(valuesInCells) {
  if (valuesInCells.find(cell => cell === '2048')) {
    changeMessage('win');

    document.removeEventListener('keydown', keydownListener);
  };
};

function createObjNumgbers(
  allCells,
  horisontalNembers,
  verticalNumbers,
  horisontalIndex,
  verticalIndex
) {
  for (let i = 0; i < [...allCells].length; i++) {
    if (!horisontalNembers[allCells[i][horisontalIndex]]) {
      horisontalNembers[allCells[i][horisontalIndex]] = [];
    }

    horisontalNembers[allCells[i][horisontalIndex]]
      .push(allCells[i].innerText);

    if (!verticalNumbers[allCells[i][verticalIndex]]) {
      verticalNumbers[allCells[i][verticalIndex]] = [];
    };

    verticalNumbers[allCells[i][verticalIndex]]
      .push(allCells[i].innerText);
  };
};

function loss(valuesInCells, horisontalType) {
  const emptyCells = valuesInCells.filter(cell => cell === '');

  if (emptyCells.length === 0) {
    const horisontalNembers = {};
    const verticalNumbers = {};

    const allCells = findAllCells(document);

    if (!horisontalType) {
      createObjNumgbers(
        allCells,
        horisontalNembers,
        verticalNumbers,
        'cellIndex',
        'parentElement.rowIndex'
      );
    } else {
      createObjNumgbers(
        allCells,
        horisontalNembers,
        verticalNumbers,
        'parentElement.rowIndex',
        'cellIndex'
      );
    };

    let possibleNextStep = 0;

    for (const row in horisontalNembers) {
      for (let i = 1; i < horisontalNembers[row].length - 1; i++) {
        if (horisontalNembers[row][i] === horisontalNembers[row][i - 1]
          || horisontalNembers[row][i] === horisontalNembers[row][i + 1]) {
          possibleNextStep++;
        }
      }
    };

    for (const row in verticalNumbers) {
      for (let i = 1; i < verticalNumbers[row].length - 1; i++) {
        if (verticalNumbers[row][i] === verticalNumbers[row][i - 1]
          || verticalNumbers[row][i] === verticalNumbers[row][i + 1]) {
          possibleNextStep++;
        }
      }
    };

    if (possibleNextStep === 0) {
      changeMessage('loss');
      document.removeEventListener('keydown', keydownListener);
    }
  };
};

start.addEventListener('click', (e) => {
  document.addEventListener('keydown', keydownListener);
  changeMessage();
  score = 0;
  scoreInGame.innerText = 0;

  const allCells = findAllCells(document);

  if ([...allCells].find(cell => cell.innerText !== '')) {
    allCells.forEach(cell => {
      cell.innerText = '';
      cell.className = 'field-cell';
    });
  };
  createNumber();
  createNumber();
  addClass([...findAllCells(document)]);

  start.innerText = 'Restart';
  start.classList.remove('start');
  start.classList.add('restart');
});

function changeMessage(gameResult) {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (gameResult === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (gameResult === 'loss') {
    messageLose.classList.remove('hidden');
  }
};
