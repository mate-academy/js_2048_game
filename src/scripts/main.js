'use strict';

const random = require('../../node_modules/lodash/random');
const isEqual = require('../../node_modules/lodash/isEqual');

const gameField = document.querySelector('.game-field').tBodies[0];
const blocks = [...gameField.querySelectorAll('td')];
const rows = gameField.rows;

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
let score = +gameScore.innerText;
const highScoreField = document.querySelector('.high-score');
let highScore = +highScoreField.innerText;

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

class CellInfo {
  constructor(cell) {
    this.coords = {
      x: cell.cellIndex,
      y: cell.closest('tr').rowIndex,
    };
    this.HTML = cell;
  }

  get number() {
    return +this.HTML.innerText;
  }

  get isEmpty() {
    return this.HTML.classList.length === 1;
  }

  fillCell(cellClassNum) {
    this.HTML.classList.add(`field-cell--${cellClassNum}`);
    this.HTML.innerText = cellClassNum;
  }

  clearCell() {
    this.HTML.classList.remove(this.HTML.classList[1]);
    this.HTML.innerText = '';
  }
}

class KeyInfo {
  constructor(keyCode) {
    const axis = KeyInfo.isVerticalKey(keyCode) ? 'y' : 'x';
    const acrossAxis = axis === 'y' ? 'x' : 'y';
    const edge = !KeyInfo.isAscOrderKey(keyCode)
      ? rows[0].rowIndex
      : rows[rows.length - 1].rowIndex;

    this.code = keyCode;
    this.axis = axis;
    this.acrossAxis = acrossAxis;
    this.edgeIdx = edge;
  }
}

KeyInfo.arrowKeys = [37, 38, 39, 40];

KeyInfo.isVerticalKey = (code) => code % 2 === 0;
KeyInfo.isAscOrderKey = (code) => code > 38;

const cellsInfo = blocks.map(cell => {
  return new CellInfo(cell);
});

const startGamePromise = new Promise((resolve) => {
  button.addEventListener('click', () => {
    resolve();
  });
});

const firstMovePromise = new Promise((resolve) => {
  document.addEventListener('keydown', e => {
    if (KeyInfo.arrowKeys.includes(e.keyCode)) {
      resolve();
    }
  }, { once: true });
});

firstMovePromise
  .then(() => {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
  });

const KeyEvent = e => {
  const keyInfo = new KeyInfo(e.keyCode);

  if (!KeyInfo.arrowKeys.includes(keyInfo.code)) {
    return;
  }

  const wasMoved = moveCells(keyInfo);
  const merged = mergeCells(keyInfo);

  moveCells(keyInfo);

  if (merged.some(el => el) || wasMoved) {
    getCell();
  }

  isGameWon();

  if (!hasEmptyCells()) {
    isGameOver();
  }
};

startGamePromise
  .then(() => {
    getCell();
    getCell();

    messageStart.classList.add('hidden');

    document.addEventListener('keydown', KeyEvent);
  })
  .then(() => {
    button.addEventListener('click', () => {
      getFilledCells().forEach(cell => cell.clearCell());

      getCell();
      getCell();

      score = 0;
      gameScore.innerText = score;

      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');

      document.addEventListener('keydown', KeyEvent);
    });
  });

function isGameOver() {
  let merged = [];

  KeyInfo.arrowKeys.forEach(key => {
    const keyToCheck = new KeyInfo(key);

    merged = [...merged, ...mergeCells(keyToCheck, true)];
  });

  if (merged.every(el => !el)) {
    messageLose.classList.remove('hidden');
  }
}

function isGameWon() {
  if (getFilledCells().some(({ number }) => number === 2048)) {
    messageWin.classList.remove('hidden');

    document.removeEventListener('keydown', KeyEvent);
  }
}

function getRandomNum(type = 'coords') {
  const number = random(1, 100) <= 90 ? 2 : 4;
  const coords = {
    x: random(0, 3),
    y: random(0, 3),
  };

  if (type === 'cell') {
    return number;
  }

  return coords;
}

function getCell() {
  const coords = getRandomNum();
  const cell = cellsInfo.find(
    ({ coords: cellCoords }) => (
      +cellCoords.x === coords.x
      && +cellCoords.y === coords.y
    )
  );

  if (cell.isEmpty) {
    const cellNum = getRandomNum('cell');

    cell.fillCell(cellNum);

    return;
  }

  if (hasEmptyCells()) {
    getCell();
  }
}

function hasEmptyCells() {
  return cellsInfo.some(cell => cell.isEmpty);
}

function getFilledCells() {
  return cellsInfo.filter(cell => !cell.isEmpty);
}

function findNextEmptyCell(cell, code, axis, edgeIdx) {
  let prev = cell;
  let next = getNextCell(prev);

  function getNextCell({ coords: { x: x1, y: y1 } }) {
    const step = KeyInfo.isAscOrderKey(code) ? 1 : -1;

    return KeyInfo.isVerticalKey(code)
      ? cellsInfo.find(({ coords: { x, y } }) => x === x1 && y === y1 + step)
      : cellsInfo.find(({ coords: { x, y } }) => x === x1 + step && y === y1);
  }

  while (next.isEmpty && next.coords[axis] !== edgeIdx) {
    prev = next;
    next = getNextCell(prev);
  }

  return next.isEmpty ? next : prev;
}

function moveCells({ code, axis, edgeIdx }) {
  const notEdgeLocated = getFilledCells().filter(
    cell => cell.coords[axis] !== edgeIdx
  );
  let moved = false;

  notEdgeLocated.forEach(cell => {
    const nextEmpty = findNextEmptyCell(cell, code, axis, edgeIdx);

    if (!isEqual(cell, nextEmpty)) {
      moved = true;
      nextEmpty.fillCell(cell.number);
      cell.clearCell();
    }
  });

  return moved;
}

function merge(queue, { code }, justCheck = false) {
  let merged = false;

  const line = !KeyInfo.isAscOrderKey(code) ? queue : queue.reverse();

  for (let i = 0; i < line.length - 1; i++) {
    if (line[i].number === line[i + 1].number) {
      const newNum = line[i + 1].number * 2;

      merged = true;

      if (justCheck) {
        return merged;
      }

      line[i].clearCell();
      line[i].fillCell(newNum);
      line[i + 1].clearCell();

      score += newNum;
      gameScore.innerText = score;

      highScore = highScore < score ? score : highScore;
      highScoreField.innerText = highScore;
      i++;
    } else {
      continue;
    }
  }

  return merged;
}

function mergeCells(key, justCheck = false) {
  const lines = createLines(key);
  const merged = [];

  lines.forEach(line => merged.push(merge(line, key, justCheck)));

  return merged;
}

function createLines({ acrossAxis: a }) {
  const lines = Array.from({ length: rows.length }, () => ([]));

  getFilledCells().forEach(cell => {
    lines[cell.coords[a]].push(cell);
  });

  return lines;
}
