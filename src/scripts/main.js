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

button.addEventListener('click', start);

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowDown':
      down();
      startToRestart('restart');
      showMessage('not');

      if (notMove) {
        newCell();
      }
      break;

    case 'ArrowUp':
      up();
      startToRestart('restart');
      showMessage('not');

      if (notMove) {
        newCell();
      }
      break;

    case 'ArrowRight':
      right();
      startToRestart('restart');
      showMessage('not');

      if (notMove) {
        newCell();
      }
      break;

    case 'ArrowLeft':
      left();
      startToRestart('restart');
      showMessage('not');

      if (notMove) {
        newCell();
      }
      break;
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

function start(e) {
  if (e.target.matches('.start')) {
    reset();
    startGame();
  } else {
    reset();
    startToRestart('start');
    showMessage('start');
  }
}

function reset() {
  [...rows]
    .map(row => [...row.children]
      .map(cell => {
        cell.innerText = '';
        cell.className = 'field-cell';
      }));
  scoreValue.innerText = 0;
  showMessage('start');
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

function startToRestart(selector) {
  switch (selector) {
    case 'restart':
      button.classList.remove('start');
      button.classList.add('restart');
      button.innerText = 'Restart';
      break;

    case 'start':
      button.classList.add('start');
      button.classList.remove('restart');
      button.innerText = 'Start';
      break;
  }
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

    case 'start':
      loseMessage.classList.add('hidden');
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      break;

    case 'not':
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
        break;
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
  let count = 0; // i - стовбець

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
        break;
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
    moveRight(i); // i - рядок

    for (let j = FIELD_SIZE - 1; j > 0; j--) {
      const currentCell = rows[i].children[j];
      const beforeCell = rows[i].children[j - 1];

      if (currentCell.innerText === '' || beforeCell.innerText === '') {
        break;
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
  let count = 0; // i - рядок

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
    moveLeft(i); // i - рядок

    for (let j = 0; j < FIELD_SIZE - 1; j++) {
      const currentCell = rows[i].children[j];
      const nextCell = rows[i].children[j + 1];

      if (currentCell.innerText === '' || nextCell.innerText === '') {
        break;
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
  let count = 0; // i - рядок

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
