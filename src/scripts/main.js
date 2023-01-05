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

styleUpdater(); //later to delete

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
  for (let i = 0; i < rows.length; i++) {
    const tempRow = document.createElement('tr');

    tempRow.append(rows[0].children[i].cloneNode(true));
    tempRow.append(rows[1].children[i].cloneNode(true));
    tempRow.append(rows[2].children[i].cloneNode(true));
    tempRow.append(rows[3].children[i].cloneNode(true));

    move(tempRow);

    rows[0].children[i].innerText = `${tempRow.children[0].innerText}`;
    rows[1].children[i].innerText = `${tempRow.children[1].innerText}`;
    rows[2].children[i].innerText = `${tempRow.children[2].innerText}`;
    rows[3].children[i].innerText = `${tempRow.children[3].innerText}`;

    styleUpdater();
  };
};

function moveDown() {
  for (let i = 0; i < rows.length; i++) {
    const tempRow = document.createElement('tr');

    tempRow.append(rows[0].children[i].cloneNode(true));
    tempRow.append(rows[1].children[i].cloneNode(true));
    tempRow.append(rows[2].children[i].cloneNode(true));
    tempRow.append(rows[3].children[i].cloneNode(true));

    reverser(tempRow);
    move(tempRow);
    reverser(tempRow);

    rows[0].children[i].innerText = `${tempRow.children[0].innerText}`;
    rows[1].children[i].innerText = `${tempRow.children[1].innerText}`;
    rows[2].children[i].innerText = `${tempRow.children[2].innerText}`;
    rows[3].children[i].innerText = `${tempRow.children[3].innerText}`;

    styleUpdater();
  };
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
  };
});
