'use strict';

// write your code here

const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');

button.addEventListener('click', e => {
  const cells = document.querySelectorAll('.field-cell');

  if (e.target.matches('.start')) {
    e.target.innerHTML = 'Restart';
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    startMessage.hidden = true;
  }

  if (e.target.matches('.restart')) {
    [...cells].forEach(cell => {
      cell.removeAttribute('data-number');
    });
  }

  addStartCells(cells);
  updateCells();
});

function probability(n) {
  return Math.random() < n;
}

function addStartCells(cells) {
  // const cells = document.querySelectorAll('.field-cell');
  let firstCell = Math.floor(Math.random() * 16);
  let secondCell = Math.floor(Math.random() * 16);

  while (firstCell === secondCell) {
    firstCell = Math.floor(Math.random() * 16);
    secondCell = Math.floor(Math.random() * 16);
  }

  for (let i = 0; i < [...cells].length; i++) {
    if (i === firstCell) {
      cells[i].dataset.number = '2';
    }

    if (i === secondCell) {
      const num = probability(0.1) ? '4' : '2';

      cells[i].dataset.number = num;
    }
  }

  updateCells();
}

document.addEventListener('keydown', e => {
  if (!startMessage.hidden) {
    return;
  }

  console.log(e.key);

  if (e.key === 'ArrowRight') {
    right();
  }

  if (e.key === 'ArrowLeft') {
    left();
  }

  if (e.key === 'ArrowUp') {
    let columns = [
      document.querySelectorAll('.field-row :first-child[data-number]'),
      document.querySelectorAll('.field-row :nth-child(2)[data-number]'),
      document.querySelectorAll('.field-row :nth-child(3)[data-number]'),
      document.querySelectorAll('.field-row :last-child[data-number]'),
    ];

    [...columns].forEach(column => {
      for (let i = 1; i < column.length; i++) {
        const current = column[i];
        const prev = column[i - 1];
  
        if (current.dataset.number === prev.dataset.number) {
          prev.dataset.number = `${+current.dataset.number * 2}`;
          current.removeAttribute('data-number');
        }
      }
    });

    let rows = document.querySelectorAll('.field-row');

    rows = [...rows];
    columns = [...columns];

    for (let i = 0; i < 4; i++) {
      const rowCells = rows[i].querySelectorAll('.field-cell');

      for (let cellNum = 0; cellNum < 4; cellNum++) {
        const column = columns[cellNum];

        if (column[i] && rowCells[cellNum] !== column[i] && column[i].dataset.number) {
          rowCells[cellNum].dataset.number = column[i].dataset.number;
          column[i].removeAttribute('data-number');
        }
      }
    }
  }

  updateCells();
  addCell();
});

function right() {
  const rows = document.querySelectorAll('.field-row');

  [...rows].forEach(row => {
    const cells = row.querySelectorAll('.field-cell');
    const cellsWithNumber = [...cells].filter(cell => cell.hasAttribute('data-number'));

    // [...cells].filter(cell => cell.hasAttribute('data-number'))
    //   .forEach(cell => row.append(cell));

    for (let i = cellsWithNumber.length - 1; i > 0; i--) {
      const current = cellsWithNumber[i];
      const prev = cellsWithNumber[i - 1];

      console.log(row);

      if (current.dataset.number === prev.dataset.number) {
        current.dataset.number = `${+prev.dataset.number * 2}`;
        prev.removeAttribute('data-number');
      }

      console.log(row, cellsWithNumber);
    }

    cellsWithNumber.forEach(cell => row.append(cell));
  });
}

function left() {
  const rows = document.querySelectorAll('.field-row');

  [...rows].forEach(row => {
    const cells = row.querySelectorAll('.field-cell');
    const cellsWithNumber = [...cells].filter(cell => cell.hasAttribute('data-number'));

    // [...cells].filter(cell => cell.hasAttribute('data-number'))
    //   .forEach(cell => row.append(cell));

    for (let i = 1; i < cellsWithNumber.length; i++) {
      const current = cellsWithNumber[i];
      const prev = cellsWithNumber[i - 1];

      console.log(row);

      if (current.dataset.number === prev.dataset.number) {
        prev.dataset.number = `${+current.dataset.number * 2}`;
        current.removeAttribute('data-number');
      }

      console.log(row, cellsWithNumber);
    }

    [...cells].filter(cell => !cell.hasAttribute('data-number')).forEach(cell => row.append(cell));
  });
}

function up() {
  // const rows = document.querySelectorAll('.field-row');

  // for (let i = 1; i < rows.length; i++) {
  //   const currentRow = rows[i].querySelectorAll('.field-cell[data-number]');
  //   const previousRow = rows[i - 1].querySelectorAll('.field-cell[data-number]');

  //   console.log(currentRow, previousRow);

  //   // for (let )

  // };
}

function updateCells() {
  const cells = document.querySelectorAll('.field-cell');

  [...cells].forEach(cell => {
    if (cell.hasAttribute('data-number')) {
      cell.classList.add(`field-cell--${cell.dataset.number}`);
      cell.classList.remove(`field-cell--${+cell.dataset.number / 2}`);
      cell.innerHTML = `${cell.dataset.number}`;
    } else {
      cell.innerHTML = '';
      cell.className = 'field-cell';
    }
  });
}

function addCell() {
  const emptyCells = [...document.querySelectorAll('.field-cell')].filter(cell => !cell.hasAttribute('data-number'));
  const randomCell = Math.floor(Math.random() * emptyCells.length);

  emptyCells[randomCell].dataset.number = probability(0.1) ? '4' : '2';
  emptyCells[randomCell].classList.add(`field-cell--${emptyCells[randomCell].dataset.number}`);
  emptyCells[randomCell].innerHTML = `${emptyCells[randomCell].dataset.number}`;
}
