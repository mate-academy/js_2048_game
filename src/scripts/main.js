'use strict';

const board = document.querySelector('.game-field');
const size = 4;
let score = 0;
let field = [
  [2, 2, 2, 2],
  [2, 2, 2, 2],
  [4, 4, 8, 8],
  [4, 4, 8, 8],
];

const filterZeros = (nums) => nums.filter(num => num !== 0);

function setGame() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = field[r][c];
      const styleColor = value > 0 ? `field-cell--${value}` : '';

      board.insertAdjacentHTML('beforeend', `
      <div
        class="field-cell ${styleColor}"
        id="${r}-${c}"
      >
        ${value}
      </div>
    `)
    }
  }
}
setGame();

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
    case 'ArrowRight':
      for (let r = 0; r < size; r++) {
        let row = field[r];
        row = slideHorizontal(e.code, row);
        field[r] = row;
      }
      break;

    case 'ArrowUp':
    case 'ArrowDown':
      slideVertical(e.code)
      break;
  }

  updateBoard();
})

function slideHorizontal(arrow, row) {
  if (arrow === 'ArrowRight') {
    row = row.reverse();
    row = slide(row);
    row = row.reverse();
  } else {
    row = slide(row);
  }

  return row;
}

function slideVertical(arrow) {
  for (let c = 0; c < size; c++) {
    let row = [field[0][c], field[1][c], field[2][c], field[2][c]];

    if (arrow === 'ArrowDown') {
      row = row.reverse();
      row = slide(row);
      row = row.reverse();
    } else {
      row = slide(row);
    }

    for (let r = 0; r < size; r++) {
      field[r][c] = row[r];
    }
  }
}

function slide(row) {
  row = filterZeros(row);

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZeros(row);

  const startFill = row.length;
  row.length = size;
  row = row.fill(0, startFill, size);

  return row;
}

function updateBoard() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = field[r][c];
      const id = `${r}-${c}`;
      const cell = document.getElementById(id);

      cell.innerText = '';
      cell.className = 'field-cell';

      if (value > 0) {
        cell.innerText = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

