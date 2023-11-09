'use strict';

const FIELD_SIZE = 4;
const AMOUNT_CELLS = FIELD_SIZE * FIELD_SIZE;
let x = 0;
let y = 0;
let number = 0;
let notMove;

const tbody = document.querySelector('tbody');
const rows = tbody.children;
const header = document.querySelector('.game-header');
const button = header.querySelector('button');
const scoreValue = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

button.addEventListener('click', start);

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      down();
      break;

    case 'ArrowUp':
      up();
      break;

    case 'ArrowRight':
      right();
      break;

    case 'ArrowLeft':
      left();
      break;
  }

  if (notMove) {
    newCell();
  }

  const freeCell = some(rows, '');

  if (!notMove && !freeCell) {
    let count = 0;

    for (let i = 0; i < FIELD_SIZE - 1; i++) {
      for (let j = 0; j < FIELD_SIZE - 1; j++) {
        const currentCell = rows[i].children[j];
        const downCell = rows[i + 1].children[j];
        const nextCell = rows[i].children[j + 1];

        if (currentCell.innerText === downCell.innerText
          || currentCell.innerText === nextCell.innerText) {
          count++;
        }
      }
    }

    if (!count) {
      showMessage('lose');
    }
  }

  const win = some(rows, '2048');

  if (win) {
    showMessage('win');
  }
});

function clearCell(cell) {
  cell.innerText = '';
  cell.className = 'field-cell';
}

function start() {
  reset();
  startGame();
  showMessage('nothing');
  startToRestart();
}

function reset() {
  [...cells].map(cell => {
    clearCell(cell);
  });
  scoreValue.innerText = 0;
}

function startValue() {
  return Math.random() > 0.1 ? 2 : 4;
}

function addCell(coordX, coordY, value = startValue()) {
  rows[coordY].children[coordX].innerText = value;
  rows[coordY].children[coordX].classList.add(`field-cell--${value}`);
  rows[coordY].children[coordX].classList.remove(`field-cell--${value / 2}`);
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

function startToRestart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.innerText = 'Restart';
}

function showMessage(typeMessage) {
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');
  const startMessage = document.querySelector('.message-start');

  switch (typeMessage) {
    case 'lose':
      winMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      loseMessage.classList.remove('hidden');
      break;

    case 'win':
      loseMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      winMessage.classList.remove('hidden');
      break;

    case 'nothing':
      loseMessage.classList.add('hidden');
      winMessage.classList.add('hidden');
      startMessage.classList.add('hidden');
      break;
  }
}

function down() {
  notMove = false;

  for (let i = 0; i < FIELD_SIZE; i++) {
    moveDown(i);

    for (let j = FIELD_SIZE - 1; j > 0; j--) {
      const currentCell = rows[j].children[i];
      const beforeCell = rows[j - 1].children[i];

      if (currentCell.innerText === '' || beforeCell.innerText === '') {
        continue;
      }

      if (currentCell.innerText === beforeCell.innerText) {
        const sum = +currentCell.innerText * 2;

        addCell(i, j, sum);
        scoreValue.innerText = +scoreValue.innerText + sum;
        clearCell(beforeCell);
        notMove = true;
      }
    }
    moveDown(i);
  }
}

function moveDown(index) {
  let count = 0;

  for (let j = FIELD_SIZE - 1; j >= 0; j--) {
    const currentCell = rows[j].children[index];

    if (currentCell.innerText === '') {
      count++;
      continue;
    }

    if (j !== FIELD_SIZE - 1 && count > 0) {
      addCell(index, j + count, currentCell.innerText);
      clearCell(currentCell);
      count--;
      j++;
      notMove = true;
    }
  }
}

function up() {
  notMove = false;

  for (let i = 0; i < FIELD_SIZE; i++) {
    moveUp(i);

    for (let j = 0; j < FIELD_SIZE - 1; j++) {
      const currentCell = rows[j].children[i];
      const nextCell = rows[j + 1].children[i];

      if (currentCell.innerText === '' || nextCell.innerText === '') {
        continue;
      }

      if (currentCell.innerText === nextCell.innerText) {
        const sum = +currentCell.innerText * 2;

        addCell(i, j, sum);
        scoreValue.innerText = +scoreValue.innerText + sum;
        clearCell(nextCell);
        notMove = true;
      }
    }
    moveUp(i);
  }
}

function moveUp(index) {
  let count = 0;

  for (let j = 0; j < FIELD_SIZE; j++) {
    const currentCell = rows[j].children[index];

    if (currentCell.innerText === '') {
      count++;
      continue;
    }

    if (j !== 0 && count > 0) {
      addCell(index, j - count, currentCell.innerText);
      clearCell(currentCell);
      count--;
      j--;
      notMove = true;
    }
  }
}

function right() {
  notMove = false;

  for (let i = 0; i < FIELD_SIZE; i++) {
    moveRight(i);

    for (let j = FIELD_SIZE - 1; j > 0; j--) {
      const currentCell = rows[i].children[j];
      const beforeCell = rows[i].children[j - 1];

      if (currentCell.innerText === '' || beforeCell.innerText === '') {
        continue;
      }

      if (currentCell.innerText === beforeCell.innerText) {
        const sum = +currentCell.innerText * 2;

        addCell(j, i, sum);
        scoreValue.innerText = +scoreValue.innerText + sum;
        clearCell(beforeCell);
        notMove = true;
      }
    }
    moveRight(i);
  }
}

function moveRight(index) {
  let count = 0;

  for (let j = FIELD_SIZE - 1; j >= 0; j--) {
    const currentCell = rows[index].children[j];

    if (currentCell.innerText === '') {
      count++;
      continue;
    }

    if (j !== FIELD_SIZE - 1 && count > 0) {
      addCell(j + count, index, currentCell.innerText);
      clearCell(currentCell);
      count--;
      j++;
      notMove = true;
    }
  }
}

function left() {
  notMove = false;

  for (let i = 0; i < FIELD_SIZE; i++) {
    moveLeft(i);

    for (let j = 0; j < FIELD_SIZE - 1; j++) {
      const currentCell = rows[i].children[j];
      const nextCell = rows[i].children[j + 1];

      if (currentCell.innerText === '' || nextCell.innerText === '') {
        continue;
      }

      if (currentCell.innerText === nextCell.innerText) {
        const sum = +currentCell.innerText * 2;

        addCell(j, i, sum);
        scoreValue.innerText = +scoreValue.innerText + sum;
        clearCell(nextCell);
        notMove = true;
      }
    }
    moveLeft(i);
  }
}

function moveLeft(index) {
  let count = 0;

  for (let j = 0; j < FIELD_SIZE; j++) {
    const currentCell = rows[index].children[j];

    if (currentCell.innerText === '') {
      count++;
      continue;
    }

    if (j !== 0 && count > 0) {
      addCell(j - count, index, currentCell.innerText);
      clearCell(currentCell);
      count--;
      j--;
      notMove = true;
    }
  }
}

function some(collection, value) {
  return [...collection].some(row => [...row.children]
    .some(cell => cell.innerText === value));
}
