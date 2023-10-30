'use strict';

const start = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

score.textContent = 0;

const cells = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  11: null,
  12: null,
  13: null,
  14: null,
  15: null,
  16: null,
};

let changed = true;

function getRandom(min, max) {
  return Math.round((min - 0.5) + Math.random() * (max - min + 1));
}

function sync() {
  for (const key in cells) {
    document.querySelector(`.cell_${key}`).textContent = cells[key];
    document.querySelector(`.cell_${key}`).classList = `field-cell cell_${key}`;

    if (cells[key]) {
      document.querySelector(`.cell_${key}`)
        .classList.add(`field-cell--${cells[key]}`);
    }
  }
  check();
}

function addNumber() {
  if (Object.values(cells).every((cell) => cell !== null)
    || changed === false) {
    return;
  }

  let cellNum = getRandom(1, 16);

  while (cells[cellNum] !== null) {
    cellNum = getRandom(1, 16);
  }

  if (getRandom(1, 10) > 1) {
    cells[cellNum] = 2;
  } else {
    cells[cellNum] = 4;
  }

  changed = false;
}

start.addEventListener('click', () => {
  if (start.textContent === 'Start') {
    addNumber();
    changed = true;
    addNumber();
    sync();

    changed = false;
    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    for (const key in cells) {
      cells[key] = null;

      document.querySelector(`.cell_${key}`).classList
        = `field-cell cell_${key}`;
    }
    changed = true;
    addNumber();
    changed = true;
    addNumber();
    sync();
    score.textContent = 0;
    messageLose.classList.add('hidden');
    changed = true;
  }
});

function moveLeft(a, b) {
  for (let i = a; i <= b; i++) {
    if (cells[i] === null) {
      for (let j = i; j <= b; j++) {
        if (cells[j] !== null) {
          cells[i] = cells[j];
          cells[j] = null;
          changed = true;
          break;
        }
      }
    }
  }
}

function moveRight(a, b) {
  for (let i = b; i >= a; i--) {
    if (cells[i] === null) {
      for (let j = i; j >= a; j--) {
        if (cells[j] !== null) {
          cells[i] = cells[j];
          cells[j] = null;
          changed = true;
          break;
        }
      }
    }
  }
}

function sumLeft(a, b) {
  for (let i = a; i < b; i++) {
    if (cells[i] === cells[i + 1] && cells[i] !== null) {
      cells[i + 1] = cells[i] + cells[i + 1];
      cells[i] = null;
      score.textContent = Number(score.textContent) + cells[i + 1];
    }
  }

  moveLeft(a, b);
}

function sumRight(a, b) {
  for (let i = b; i > a; i--) {
    if (cells[i] === cells[i - 1] && cells[i] !== null) {
      cells[i - 1] = cells[i] + cells[i - 1];
      cells[i] = null;
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
      if (cells[cellRotated[col][i]] === null) {
        for (let j = i; j <= 3; j++) {
          if (cells[cellRotated[col][j]] !== null) {
            cells[cellRotated[col][i]] = cells[cellRotated[col][j]];
            cells[cellRotated[col][j]] = null;
            changed = true;
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
      if (cells[cellRotated[col][i]] === cells[cellRotated[col][i + 1]]
        && cells[cellRotated[col][i]]) {
        cells[cellRotated[col][i + 1]] = cells[cellRotated[col][i]]
          + cells[cellRotated[col][i + 1]];
        cells[cellRotated[col][i]] = null;

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
      if (cells[cellRotated[col][i]] === null) {
        for (let j = i; j >= 0; j--) {
          if (cells[cellRotated[col][j]] !== null) {
            cells[cellRotated[col][i]] = cells[cellRotated[col][j]];
            cells[cellRotated[col][j]] = null;
            changed = true;
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
      if (cells[cellRotated[col][i]]
        === cells[cellRotated[col][i - 1] && cells[cellRotated[col][i]]]) {
        cells[cellRotated[col][i - 1]] = cells[cellRotated[col][i]]
          + cells[cellRotated[col][i - 1]];
        cells[cellRotated[col][i]] = null;

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

  if (Object.values(cells).every((cell) => cell !== null)) {
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
      sync();
      break;
    case 'ArrowDown':
      if (!messageStart.classList.contains('hidden')) {
        break;
      }
      moveDown();
      sumDown();
      addNumber();
      sync();
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
      sync();
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
      sync();
      break;
  }
});
