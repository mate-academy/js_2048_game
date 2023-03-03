'use strict';

const button = document.querySelector('button');
const tbody = document.querySelector('tbody');
const messages = document.querySelectorAll('.message');
const score = document.querySelector('.game-score');
const rows = [...tbody.rows];
const cells = document.querySelectorAll('td');

let isChanged = false;
let lastMergedCell = -1;
let rowIndex = -1;

button.addEventListener('click', () => {
  [...cells].forEach(cell => {
    if (cell.classList.contains(`field-cell--${cell.innerHTML}`)) {
      cell.classList.remove(`field-cell--${cell.innerHTML}`);
    }

    cell.innerHTML = '';
    cell.className = 'field-cell';
    score.innerHTML = '0';
  });

  addNumbers();
  addNumbers();

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerHTML = 'Restart';

  [...messages].forEach(message => {
    message.classList.add('hidden');
  });
});

function addNumbers() {
  const randomRowIndex = randomNumber(4);
  const randomCellIndex = randomNumber(4);
  const randomRow = rows[randomRowIndex];
  const randomCell = randomRow.cells[randomCellIndex];
  const number = Math.random() >= 0.9 ? 4 : 2;

  if (randomCell.innerHTML.length !== 0) {
    addNumbers();
  } else {
    randomCell.innerHTML = number;
    randomCell.className = `field-cell field-cell--${number}`;
    changeFontSize(randomCell);
  }
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function changeFontSize(el) {
  el.style.fontSize = '30px';

  setTimeout(() => {
    el.style.fontSize = '24px';
  }, 300);
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyA':
    case 'ArrowLeft':
      isChanged = false;

      for (const row of rows) {
        const rowCells = [...row.cells];

        lastMergedCell = -1;

        checkCellLeft(rowCells);
      }

      break;

    case 'KeyD':
    case 'ArrowRight':
      isChanged = false;

      for (const row of rows) {
        const rowCells = [...row.cells];

        lastMergedCell = -1;

        checkCellRight(rowCells);
      }

      break;

    case 'KeyW':
    case 'ArrowUp':
      isChanged = false;

      for (let i = 0; i < rows.length; i += 1) {
        const columnCells = [
          rows[0].cells[i],
          rows[1].cells[i],
          rows[2].cells[i],
          rows[3].cells[i],
        ];

        rowIndex = -1;

        checkCellUp(columnCells);
      }

      break;

    case 'KeyS':
    case 'ArrowDown':
      isChanged = false;

      for (let i = 0; i < rows.length; i += 1) {
        const columnCells = [
          rows[0].cells[i],
          rows[1].cells[i],
          rows[2].cells[i],
          rows[3].cells[i],
        ];

        rowIndex = -1;

        checkCellDown(columnCells);
      }
      break;

    default:
      return;
  };

  canAddNewNum();

  if (checkLose(rows)) {
    const loseMessage = document.querySelector('.message-lose');

    loseMessage.classList.remove('hidden');
  }
});

function canAddNewNum() {
  if (isChanged) {
    addNumbers();
    isChanged = false;
  }
}

function changeTile(current, previous, mult = 1) {
  previous.innerHTML = current.innerHTML * mult;
  previous.className = `field-cell field-cell--${previous.innerHTML}`;
  changeFontSize(previous);
  current.className = 'field-cell';
  current.innerHTML = '';

  if (mult !== 1) {
    score.innerHTML = +score.innerHTML + +previous.innerHTML;
  }

  if (previous.innerHTML === '2048') {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');
  }
}

function checkCellRight(cell) {
  for (let i = cell.length - 1; i >= 0; i -= 1) {
    if (cell[i].nextElementSibling === null) {
      continue;
    }

    const cellsObj = {
      current: cell[i],
    };

    cellsObj.next = cellsObj.current.nextElementSibling;

    let { current, next } = cellsObj;

    while (next.innerHTML.length === 0 && current.innerHTML.length > 0) {
      changeTile(current, next);

      if (next.nextElementSibling === null) {
        break;
      }

      current = next;
      next = current.nextElementSibling;

      isChanged = true;
    };

    const isSame = next.innerHTML === current.innerHTML;

    if (isSame && next.innerHTML && lastMergedCell !== next.cellIndex) {
      changeTile(current, next, 2);
      lastMergedCell = next.cellIndex;
      isChanged = true;
    }
  }
};

function checkCellLeft(cell) {
  for (let i = 1; i < cell.length; i += 1) {
    if (cell[i].previousElementSibling === null) {
      continue;
    }

    const cellsObj = {
      current: cell[i],
    };

    cellsObj.previous = cellsObj.current.previousElementSibling;

    let { current, previous } = cellsObj;

    while (previous.innerHTML.length === 0 && current.innerHTML.length > 0) {
      changeTile(current, previous);

      if (previous.previousElementSibling === null) {
        break;
      }

      current = previous;
      previous = current.previousElementSibling;

      isChanged = true;
    };

    const isSame = previous.innerHTML === current.innerHTML;

    if (isSame && previous.innerHTML && lastMergedCell !== previous.cellIndex) {
      changeTile(current, previous, 2);
      lastMergedCell = previous.cellIndex;
      isChanged = true;
    }
  }
};

function checkCellUp(column) {
  for (let i = 1; i < column.length; i += 1) {
    const cellsObj = {
      current: column[i],
      previous: column[i - 1],
    };

    const rowObj = {
      currentRow: rows[i],
      previousRow: rows[i - 1],
    };

    let { current, previous } = cellsObj;
    let { currentRow, previousRow } = rowObj;

    while (previous.innerHTML.length === 0 && current.innerHTML.length > 0) {
      changeTile(current, previous);

      if (!column[column.indexOf(current) - 2]) {
        break;
      }

      current = previous;
      previous = column[column.indexOf(current) - 1];

      currentRow = previousRow;
      previousRow = rows[rows.indexOf(currentRow) - 1];

      isChanged = true;
    };

    const isSame = previous.innerHTML === current.innerHTML;

    if (isSame && previous.innerHTML && rowIndex !== previousRow.rowIndex) {
      changeTile(current, previous, 2);
      rowIndex = previousRow.rowIndex;
      isChanged = true;
    }
  }
}

function checkCellDown(column) {
  for (let i = column.length - 2; i >= 0; i -= 1) {
    const cellsObj = {
      current: column[i],
      previous: column[i + 1],
    };

    const rowObj = {
      currentRow: rows[i],
      previousRow: rows[i + 1],
    };

    let { current, previous } = cellsObj;
    let { currentRow, previousRow } = rowObj;

    while (previous.innerHTML.length === 0 && current.innerHTML.length > 0) {
      changeTile(current, previous);

      if (!column[column.indexOf(current) + 2]) {
        break;
      }

      current = previous;
      previous = column[column.indexOf(current) + 1];

      currentRow = previousRow;
      previousRow = rows[rows.indexOf(currentRow) + 1];

      isChanged = true;
    };

    const isSame = previous.innerHTML === current.innerHTML;

    if (isSame && previous.innerHTML && rowIndex !== previousRow.rowIndex) {
      changeTile(current, previous, 2);
      rowIndex = previousRow.rowIndex;
      isChanged = true;
    }
  }
}

const checkLose = function(rows1) {
  const loseFlag = [];

  for (let r = 0; r < rows1.length; r += 1) {
    const rowCells = [...rows1[r].cells];
    const columnCells = [
      rows1[0].cells[r],
      rows1[1].cells[r],
      rows1[2].cells[r],
      rows1[3].cells[r],
    ];

    for (let i = 0; i < rowCells.length - 1; i += 1) {
      rowCells[i].innerHTML !== rowCells[i + 1].innerHTML
        ? loseFlag.push(false)
        : loseFlag.push(true);
    }

    for (let c = 0; c < columnCells.length - 1; c += 1) {
      columnCells[c].innerHTML !== columnCells[c + 1].innerHTML
        ? loseFlag.push(false)
        : loseFlag.push(true);
    }
  }

  for (const cell of cells) {
    if (!cell.innerHTML) {
      loseFlag.push(true);
    }
  }

  return loseFlag.every(el => el === false);
};
