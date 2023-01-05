'use strict';

const table = document.querySelector('tbody');
const rows = table.rows;
const rowsQnt = 4;
const columnsQnt = 4;

function styleUpdater() {
  const cells = table.querySelectorAll('td');

  for (const cell of cells) {
    const num = cell.innerText;

    cell.classList.value = '';
    cell.classList.add('field-cell');

    if (num > 0) {
      cell.innerText = num;
      cell.classList.add(`field-cell--${num}`);
    }
  }
};

styleUpdater();

function zeroRemover(row) {
  for (let c = 0; c < row.length; c++) {
    if (row[c].innerText === '') {
      row[c].remove();
    }
  }

  return row;
}

function move(row) {
  let cells = zeroRemover(row.children);

  for (let c = 0; c < cells.length - 1; c++) {
    if (cells[c].innerText && cells[c + 1].innerText
        && cells[c].innerText === cells[c + 1].innerText) {
      const value = cells[c].innerText * 2;

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
}

// function reverser(coll) {
//   const reversed = [...coll.children].reverse();

//   for (let i = 0; i < reversed.length; i++) {
//     coll.children[i] = reversed[i];
//   }

//   return coll;
// }

function moveLeft() {
  for (let row = 0; row < rowsQnt; row++) {
    move(rows[row]);
  }
};

function moveRight() {
//   for (let row = 0; row < rowsQnt; row++) {
//     const reversed = reverser(rows[row]);

//     move(reversed);
//     reverser(reversed);
//   }
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
