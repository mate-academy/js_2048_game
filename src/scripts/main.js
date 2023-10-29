'use strict';

const start = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

score.textContent = 0;

const cells = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
  10: '',
  11: '',
  12: '',
  13: '',
  14: '',
  15: '',
  16: '',
};

const colorMods = [
  'field-cell--2',
  'field-cell--4',
  'field-cell--8',
  'field-cell--16',
  'field-cell--32',
  'field-cell--64',
  'field-cell--128',
  'field-cell--256',
  'field-cell--512',
  'field-cell--1024',
  'field-cell--2048',
];

function getRandom(min, max) {
  return Math.round((min - 0.5) + Math.random() * (max - min + 1));
}

function removeColors() {
  for (const key in cells) {
    for (const mod of colorMods) {
      if (document.querySelector(`.cell_${key}`).classList.contains(mod)) {
        document.querySelector(`.cell_${key}`).classList.remove(mod);
      }
    }
  }
}

function sync() {
  for (const key in cells) {
    document.querySelector(`.cell_${key}`).textContent = cells[key];

    switch (cells[key]) {
      case 2:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--2');
        break;
      case 4:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--4');
        break;
      case 8:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--8');
        break;
      case 16:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--16');
        break;
      case 32:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--32');
        break;
      case 64:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--64');
        break;
      case 128:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--128');
        break;
      case 256:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--256');
        break;
      case 512:
        document.querySelector(`.cell_${key}`).classList.add('field-cell--512');
        break;
      case 1024:
        document.querySelector(`.cell_${key}`)
          .classList.add('field-cell--1024');
        break;
      case 2048:
        document.querySelector(`.cell_${key}`)
          .classList.add('field-cell--2048');
        break;
    }
  }
}

function addNumbers() {
  let cellNum1 = getRandom(1, 16);
  let cellNum2 = getRandom(1, 16);

  while (cells[cellNum1] !== '') {
    cellNum1 = getRandom(1, 16);
  }

  while (cells[cellNum2] !== '' || cellNum1 === cellNum2) {
    cellNum2 = getRandom(1, 16);
  }

  if (getRandom(1, 10) > 1) {
    cells[cellNum1] = 2;
  } else {
    cells[cellNum1] = 4;
  }

  if (getRandom(1, 10) > 1) {
    cells[cellNum2] = 2;
  } else {
    cells[cellNum2] = 4;
  }

  sync();
}

function addNumber() {
  if (Object.values(cells).every((cell) => cell !== '')) {
    return;
  }

  let cellNum = getRandom(1, 16);

  while (cells[cellNum] !== '') {
    cellNum = getRandom(1, 16);
  }

  if (getRandom(1, 10) > 1) {
    cells[cellNum] = 2;
  } else {
    cells[cellNum] = 4;
  }
}

start.addEventListener('click', () => {
  if (start.textContent === 'Start') {
    addNumbers();

    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    for (const key in cells) {
      cells[key] = '';
    }
    removeColors();
    addNumbers();
    score.textContent = 0;
    messageLose.classList.add('hidden');
  }
});

function moveLeft(a, b) {
  for (let i = a; i <= b; i++) {
    if (cells[i] === '') {
      for (let j = i; j <= b; j++) {
        if (cells[j] !== '') {
          cells[i] = cells[j];
          cells[j] = '';
          break;
        }
      }
    }
  }
}

function moveRight(a, b) {
  for (let i = b; i >= a; i--) {
    if (cells[i] === '') {
      for (let j = i; j >= a; j--) {
        if (cells[j] !== '') {
          cells[i] = cells[j];
          cells[j] = '';
          break;
        }
      }
    }
  }
}

function sumLeft(a, b) {
  for (let i = a; i < b; i++) {
    if (cells[i] === cells[i + 1]) {
      cells[i + 1] = cells[i] + cells[i + 1];
      cells[i] = '';
      score.textContent = Number(score.textContent) + cells[i + 1];
    }
  }

  moveLeft(a, b);
}

function sumRight(a, b) {
  for (let i = b; i > a; i--) {
    if (cells[i] === cells[i - 1]) {
      cells[i - 1] = cells[i] + cells[i - 1];
      cells[i] = '';
      score.textContent = Number(score.textContent) + cells[i - 1];
    }
  }

  moveRight(a, b);
}

const cellRotated = [
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [4, 8, 12, 16],
];

const cellLines = [
  [1, 4],
  [5, 8],
  [9, 12],
  [13, 16],
];

function moveUp() {
  for (let col = 0; col <= 3; col++) {
    for (let i = 0; i <= 3; i++) {
      if (cells[cellRotated[col][i]] === '') {
        for (let j = i; j <= 3; j++) {
          if (cells[cellRotated[col][j]] !== '') {
            cells[cellRotated[col][i]] = cells[cellRotated[col][j]];
            cells[cellRotated[col][j]] = '';
            break;
          }
        }
      }
    }
  }
}

function sumUp() {
  for (let col = 0; col <= 3; col++) {
    for (let i = 0; i <= 3; i++) {
      if (cells[cellRotated[col][i]] === cells[cellRotated[col][i + 1]]) {
        cells[cellRotated[col][i + 1]] = cells[cellRotated[col][i]]
          + cells[cellRotated[col][i + 1]];
        cells[cellRotated[col][i]] = '';

        score.textContent = Number(score.textContent)
          + cells[cellRotated[col][i + 1]];
      }
    }
  }
  moveUp();
}

function moveDown() {
  for (let col = 0; col <= 3; col++) {
    for (let i = 3; i >= 0; i--) {
      if (cells[cellRotated[col][i]] === '') {
        for (let j = i; j >= 0; j--) {
          if (cells[cellRotated[col][j]] !== '') {
            cells[cellRotated[col][i]] = cells[cellRotated[col][j]];
            cells[cellRotated[col][j]] = '';
            break;
          }
        }
      }
    }
  }
}

function sumDown() {
  for (let col = 0; col <= 3; col++) {
    for (let i = 3; i >= 0; i--) {
      if (cells[cellRotated[col][i]] === cells[cellRotated[col][i - 1]]) {
        cells[cellRotated[col][i - 1]] = cells[cellRotated[col][i]]
          + cells[cellRotated[col][i - 1]];
        cells[cellRotated[col][i]] = '';

        score.textContent = Number(score.textContent)
          + cells[cellRotated[col][i - 1]];
      }
    }
  }
  moveDown();
}

function checkLines(a, b) {
  for (let i = a; i < b; i++) {
    if (cells[i] === cells[i + 1]) {
      return true;
    }
  }

  return false;
}

function checkCol() {
  for (let col = 0; col <= 3; col++) {
    for (let i = 3; i >= 0; i--) {
      if (cells[cellRotated[col][i]] === cells[cellRotated[col][i - 1]]) {
        return true;
      }
    }
  }

  return false;
}

function check() {
  if (Object.values(cells).some((cell) => cell === '2048')) {
    messageWin.classList.remove('hidden');
  }

  if (Object.values(cells).every((cell) => cell !== '')) {
    for (let i = 0; i < cellLines.length; i++) {
      if (checkLines(cellLines[i][0], cellLines[i][1])) {
        return;
      }
    }

    if (checkCol() === false) {
      messageLose.classList.remove('hidden');
    }
  }
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowUp':
      if (!messageStart.classList.contains('hidden')) {
        break;
      }
      moveUp();
      sumUp();
      addNumber();
      removeColors();
      sync();
      check();
      break;
    case 'ArrowDown':
      if (!messageStart.classList.contains('hidden')) {
        break;
      }

      moveDown();
      sumDown();
      addNumber();
      removeColors();
      sync();
      check();
      break;
    case 'ArrowLeft':
      if (!messageStart.classList.contains('hidden')) {
        break;
      }

      for (let i = 0; i < cellLines.length; i++) {
        moveLeft(cellLines[i][0], cellLines[i][1]);
        sumLeft(cellLines[i][0], cellLines[i][1]);
      }

      addNumber();
      removeColors();
      sync();
      check();
      break;
    case 'ArrowRight':
      if (!messageStart.classList.contains('hidden')) {
        break;
      }

      for (let i = 0; i < cellLines.length; i++) {
        moveRight(cellLines[i][0], cellLines[i][1]);
        sumRight(cellLines[i][0], cellLines[i][1]);
      }

      addNumber();
      removeColors();
      sync();
      check();
      break;
  }
});
