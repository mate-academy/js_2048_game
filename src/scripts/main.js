'use strict';

const field = document.querySelector('.game-field');
const trList = field.children[0].children;
const gameScore = document.querySelector('.game-score');
const messageList = document.querySelector('.message-container').children;
const start = document.querySelector('.start');

const size = 4;
let htmlElements;
let cells;
let score = 0;

start.addEventListener('click', () => {
  init();
  messageHidden();
  start.classList.remove('start');
  start.classList.add('restart');
  start.textContent = 'Restart'
  gameScore.textContent = score;
});

function messageHidden() {
  for (const message of messageList) {
    message.classList.add('hidden');
  }
}

function createFields() {
  if (htmlElements) {
    return;
  }

  htmlElements = [];

  for (const item of trList) {
    const tr = item.cells;
    const trElements = [];

    for (const td of tr) {
      trElements.push(td);
    }

    htmlElements.push(trElements);
  }
}

function createCells() {
  cells = [];

  for (let i = 0; i < size; i++) {
    cells.push(new Array(size).fill(0));
  }
}

function generateInEmtyCell() {
  let x, y;

  do {
    x = Math.floor(Math.random() * size);
    y = Math.floor(Math.random() * size);

    if (cells[y][x] === 0) {
      cells[y][x] = Math.random() >= 0.9 ? 4 : 2;
      break;
    }
  } while (true);
}

function draw() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const td = htmlElements[y][x];
      const v = cells[y][x];

      td.innerHTML = v === 0 ? '' : String(v);

      if (v === 0) {
        td.removeAttribute('class');
        td.classList.add('field-cell');
      } else {
        td.removeAttribute('class');
        td.classList.add(`field-cell`);
        td.classList.add(`field-cell--${v}`);
      }
    }
  }
}

function slide(array, sizeGame) {
  function filterEmty(a) {
    return a.filter(v => v !== 0);
  }

  let arr = array;

  arr = filterEmty(arr);

  if (arr.length > 0) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        score += arr[i];
      }
    }
  }
  arr = filterEmty(arr);

  while (arr.length < sizeGame) {
    arr.push(0);
  }

  return arr;
}

function slideLeft() {
  let changed = false;

  for (let i = 0; i < size; i++) {
    const old = Array.from(cells[i]);

    cells[i] = slide(cells[i], size);
    changed = changed || (cells[i].join(',') !== old.join(','));
  }

  return changed;
}

function swap(x1, y1, x2, y2) {
  const tmp = cells[y1][x1];

  cells[y1][x1] = cells[y2][x2];
  cells[y2][x2] = tmp;
}

function mirror() {
  for (let y = 0; y < size; y++) {
    for (let xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
      swap(xLeft, y, xRight, y);
    }
  }
}

function transpose() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < y; x++) {
      swap(x, y, y, x);
    }
  }
}

function moveLeft() {
  return slideLeft();
}

function moveRight() {
  mirror();

  const changed = moveLeft();

  mirror();

  return changed;
}

function moveUp() {
  transpose();

  const changed = moveLeft();

  transpose();

  return changed;
}

function moveDown() {
  transpose();

  const changed = moveRight();

  transpose();

  return changed;
}

function isWin() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (cells[y][x] === 2048) {
        return false;
      }
    }
  }
}

function isGameOver() {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (cells[y][x] === 0) {
        return false;
      }
    }
  }

  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = cells[y][x];

      if (c !== 0 && (c === cells[y + 1][x] || c === cells[y][x + 1])) {
        return false;
      }
    }
  }

  return true;
}

document.addEventListener('keyup', (e) => {
  const code = e.code;
  let ok;

  switch (code) {
    case 'ArrowDown':
      ok = moveDown();
      break;
    case 'ArrowUp':
      ok = moveUp();
      break;
    case 'ArrowLeft':
      ok = moveLeft();
      break;
    case 'ArrowRight':
      ok = moveRight();
      break;
    default:
      return;
  }

  if (ok) {
    start.textContent = 'Restart';
    generateInEmtyCell();
    draw();
  }

  if (isGameOver()) {
    const messageLose = document.querySelector('.message-lose');

    messageHidden();
    messageLose.classList.toggle('hidden');
  }

  if (isWin()) {
    const messageWin = document.querySelector('.message-win');

    messageHidden();
    messageWin.classList.toggle('hidden');
  }

  gameScore.textContent = score;
});

function init() {
  createFields();
  createCells();
  new Array(2).fill(0).forEach(generateInEmtyCell);
  draw();
  score = 0;
}
