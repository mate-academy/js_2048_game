'use strict';

const game = document.querySelector('.container');
const gameField = game.querySelector('.game-field');
const startButton = game.querySelector('.button');
const startGame = game.querySelector('.message-start');
const gameOver = game.querySelector('.message-lose');
const score = game.querySelector('.game-score');

const htmlElements = [];
let cells = [];
const size = 4;
let scoreTotal = 0;

function createField() {
  for (let y = 0; y < size; y++) {
    const tr = game.querySelector('.field-row');
    const trElements = [];

    for (let x = 0; x < size; x++) {
      const td = game.querySelector('.field-cell');

      tr.appendChild(td);
      trElements.push(td);
    }
    htmlElements.push(trElements);
    gameField.appendChild(tr);
  }
}

function createCells() {
  for (let y = 0; y < size; y++) {
    cells.push(new Array(size).fill(0));
  }
}

function generateInEmptyCell() {
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

      td.classList.value = '';
      td.classList.add('field-cell');

      if (v > 0) {
        if (v <= 2048) {
          td.classList.add('field-cell--' + v.toString());
        }
      }
    }
  }
}

function slide(array, origSize) {
  function filterEmpty(a) {
    return a.filter(x => x !== 0);
  }

  let newArray = filterEmpty(array);

  if (newArray.length > 0) {
    for (let i = 0; i < newArray.length - 1; i++) {
      if (newArray[i] === newArray[i + 1]) {
        newArray[i] *= 2;
        scoreTotal += newArray[i];
        newArray[i + 1] = 0;
      }
    }
  }
  newArray = filterEmpty(newArray);

  while (newArray.length < origSize) {
    newArray.push(0);
  }

  return newArray;
}

function slideLeft() {
  let changed = false;

  for (let y = 0; y < size; y++) {
    const oldArray = Array.from(cells[y]);

    cells[y] = slide(cells[y], size);
    changed = changed || (cells[y].join(',') !== oldArray.join(','));
  }

  return changed;
}

function swap(x1, y1, x2, y2) {
  const temp = cells[y1][x1];

  cells[y1][x1] = cells[y2][x2];
  cells[y2][x2] = temp;
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

startButton.addEventListener('click', () => {
  startGame.classList.add('hidden');
});

game.addEventListener('keydown', function(e) {
  const keyCode = e.key;
  let ok = Boolean;

  switch (keyCode) {
    case 'ArrowDown': ok = moveDown(); break;
    case 'ArrowUp': ok = moveUp(); break;
    case 'ArrowLeft': ok = moveLeft(); break;
    case 'ArrowRight': ok = moveRight(); break;
    default: return;
  }

  if (ok) {
    generateInEmptyCell();
    draw();
    score.innerHTML = scoreTotal;
  }

  startButton.innerHTML = 'Restart';

  startButton.addEventListener('click', () => {
    score.innerHTML = 0;
    scoreTotal = 0;
    cells = [];
    gameOver.classList.add('hidden');
    init();
  });

  if (isGameOver()) {
    gameOver.classList.remove('hidden');
  }
});

function init() {
  createField();
  createCells();
  new Array(2).fill(0).forEach(generateInEmptyCell);
  draw();
}

init();
