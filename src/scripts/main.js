'use strict';

const FIELD_SIZE = 4;
const AMOUNT_CELLS = FIELD_SIZE * FIELD_SIZE;
let x = 0;
let y = 0;
let number = 0;
let notDown;

const tbody = document.querySelector('tbody');
const rows = tbody.children;
const header = document.querySelector('.game-header');
const button = header.querySelector('button');

startGame();

document.addEventListener('keydown', e => {
  // console.log(e.key);

  switch (e.key) {
    case 'ArrowDown':
      down();

      if (notDown) {
        newCell();
      }
      break;

    default:
      break;
  }
});

function down() {
  notDown = false;

  for (let i = 0; i < FIELD_SIZE; i++) {
    let count = 0;

    for (let j = FIELD_SIZE - 1; j >= 0; j--) {
      let currentCell = rows[j].children[i];
      // const beforeCell = rows[j - 1].children[i];

      if (currentCell.innerText === '') {
        count++;
        continue;
      }

      if (j !== FIELD_SIZE - 1 && count > 0) {
        addCell(i, j + count, currentCell.innerText);
        currentCell.innerText = '';
        currentCell.className = 'field-cell';
        count = 0;
        j++;
        notDown = true;
      }

      currentCell = rows[j].children[i];

      if (j > 0 && currentCell.innerText) {
        const beforeCell = rows[j - 1].children[i];

        if (currentCell.innerText === beforeCell.innerText) {
          const sum = +currentCell.innerText * 2;

          addCell(i, j, sum);
          beforeCell.innerText = '';
          beforeCell.className = 'field-cell';
          newCell();
        }
      }
    }
  }
}

function start() {
  reset();
  startGame();
}

button.addEventListener('click', start);

function reset() {
  [...rows]
    .map(row => [...row.children]
      .map(cell => {
        cell.innerText = '';
        cell.className = 'field-cell';
      }));
}

function startValue() {
  return Math.random() > 0.1 ? 2 : 4;
}

function addCell(coordX, coordY, value = startValue()) {
  rows[coordY].children[coordX].innerText = value;
  rows[coordY].children[coordX].classList.add(`field-cell--${value}`);
}

function newCell() {
  randomCell(AMOUNT_CELLS);

  if (rows[y].children[x].innerText === '') {
    addCell(x, y);
  } else {
    newCell();
  }
}

function startGame() {
  randomCell(AMOUNT_CELLS);
  addCell(x, y);
  randomCell(AMOUNT_CELLS);
  addCell(x, y);
}

function randomCell(amount) {
  const random = Math.floor(Math.random() * amount);

  if (number !== random) {
    number = random;
    x = Math.floor(number / FIELD_SIZE);
    y = number - (x * FIELD_SIZE);
  } else {
    randomCell(amount);
  }
}
