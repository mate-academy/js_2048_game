'use strict';

const table = document.querySelector('tbody');
const rows = table.rows;
const rowsQnt = 4;
const columnsQnt = 4;
let total = 0;

function styleUpdater() {
  const cells = table.querySelectorAll('td');
  const score = document.querySelector('.game-score');

  for (const cell of cells) {
    const num = cell.innerText;

    cell.classList.value = '';
    cell.classList.add('field-cell');

    if (num > 0) {
      cell.innerText = num;
      cell.classList.add(`field-cell--${num}`);
    }
  };

  score.innerText = `${total}`;
};

styleUpdater();

function zeroRemover(row) {
  for (let c = 0; c < row.length; c++) {
    if (row[c].innerText === '') {
      row[c].remove();
    }
  }

  return row;
};

function reverser(row) {
  const orderToInsert = [...row.children].reverse();

  orderToInsert.forEach(el => row.append(el));
}

function move(row) {
  let cells = zeroRemover(row.children);

  for (let c = 0; c < cells.length - 1; c++) {
    if (cells[c].innerText && cells[c + 1].innerText
        && cells[c].innerText === cells[c + 1].innerText) {
      const value = cells[c].innerText * 2;

      total += value;

      cells[c].innerText = value;
      cells[c + 1].innerText = '';
    }
  };

  cells = zeroRemover(cells);

  while (cells.length < columnsQnt) {
    row.insertAdjacentHTML('beforeend', `
      <td class="field-cell"></td>
    `);
  }

  styleUpdater();
}

function moveLeft() {
  for (let row = 0; row < rowsQnt; row++) {
    move(rows[row]);
  }
};

function moveRight() {
  for (let row = 0; row < rowsQnt; row++) {
    reverser(rows[row]);
    move(rows[row]);
    reverser(rows[row]);
  }
}

function moveUp() {
  const tempRow = document.createElement('tr');

  for (let i = 0; i < rows.length; i++) {
    tempRow.append(rows[i].firstElementChild.cloneNode(true));
  };

  move(tempRow);

  for (let i = 0; i < tempRow.children.length; i++) {
    rows[i].firstElementChild.innerText = `${tempRow.children[i].innerText}`;
  };

  styleUpdater();
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    moveLeft();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowRight') {
    moveRight();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowUp') {
    moveUp();
  }
});
