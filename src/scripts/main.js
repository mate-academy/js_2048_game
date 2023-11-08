'use strict';

document.addEventListener('keydown', param => func(param.key));

const table = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const randomValues = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
const cellValue2 = 2;
const cellValue4 = 4;
const tableSize = 4;
const winValue = 2048;
const startButton = document.getElementById('buttonStart');
const messageStart = document.getElementsByClassName('message-start');
const messageWin = document.getElementsByClassName('message-win');
const messageLose = document.getElementsByClassName('message-lose');
const scoreElement = document.getElementById('score');
let score = 0;
let moved = 0;
let merged = 0;

startButton.addEventListener('click', startFunction);

function func(param) {
  switch (param) {
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
  }
}

function startFunction() {
  if (startButton.textContent === 'Restart') {
    restart();
    messageStart[0].classList.remove('hidden');
  } else {
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    newCell();
    newCell();
    messageStart[0].classList.add('hidden');
  }
}

function restart() {
  startButton.classList.remove('restart');
  startButton.textContent = 'Start';
  scoreElement.textContent = '0';
  score = 0;

  if (!messageLose[0].classList.contains('hidden')) {
    messageLose[0].classList.add('hidden');
  }

  if (!messageWin[0].classList.contains('hidden')) {
    messageWin[0].classList.add('hidden');
  }

  for (let i = 0; i < cellValue4; i++) {
    for (let j = 0; j < cellValue4; j++) {
      table[i][j] = 0;

      const identifier = i.toString() + j.toString();
      const identifiedCell = document.getElementById(identifier);

      identifiedCell.className = 'field-cell';
    }
  }
}

function newCell() {
  if (startButton.textContent === 'Start') {
    return;
  }

  const freeCells = [];

  for (let i = 0; i < cellValue4; i++) {
    for (let j = 0; j < cellValue4; j++) {
      if (table[i][j] === 0) {
        freeCells.push(i.toString() + j.toString());
      }
    }
  }

  const randCellInd = Math.floor(Math.random() * freeCells.length);
  const identifier = freeCells[randCellInd];
  const ranInd = Math.floor(Math.random() * 10);
  const ranVal = randomValues[ranInd];
  const randomRow = Number(identifier[0]);
  const randomColumn = Number(identifier[1]);

  if (ranVal === cellValue2) {
    const identifiedCell = document.getElementById(identifier);

    table[randomRow][randomColumn] = cellValue2;
    identifiedCell.classList.add(`field-cell--2`);
  } else {
    const identifiedCell = document.getElementById(identifier);

    table[randomRow][randomColumn] = cellValue4;
    identifiedCell.classList.add(`field-cell--4`);
  }

  check();
}

function moveLeft() {
  const a = 0;
  const b = -1;

  if (startButton.textContent === 'Start') {
    return;
  }

  moved = 0;
  merged = 0;

  for (let i = 0; i < tableSize; i++) {
    for (let j = 1; j < tableSize; j++) {
      merge(i, j, a, b);
      move(i, j, a, b);
    }
  }

  if (moved === 1 || merged === 1) {
    newCell();
  }
  check();
}

function moveRight() {
  const a = 0;
  const b = 1;

  if (startButton.textContent === 'Start') {
    return;
  }

  moved = 0;
  merged = 0;

  for (let i = 0; i < tableSize; i++) {
    for (let j = tableSize - 1; j >= 0; j--) {
      merge(i, j, a, b);
      move(i, j, a, b);
    }
  }

  if (moved === 1 || merged === 1) {
    newCell();
  }
  check();
}

function moveUp() {
  const a = -1;
  const b = 0;

  if (startButton.textContent === 'Start') {
    return;
  }

  moved = 0;
  merged = 0;

  for (let i = 1; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      merge(i, j, a, b);
      move(i, j, a, b);
    }
  }

  if (moved === 1 || merged === 1) {
    newCell();
  }
  check();
}

function moveDown() {
  const a = 1;
  const b = 0;

  if (startButton.textContent === 'Start') {
    return;
  }

  moved = 0;
  merged = 0;

  for (let i = tableSize - 2; i >= 0; i--) {
    for (let j = 0; j < tableSize; j++) {
      merge(i, j, a, b);
      move(i, j, a, b);
    }
  }

  if (moved === 1 || merged === 1) {
    newCell();
  }
  check();
}

function check() {
  let counterFree = 16;
  let counterMoves = 0;

  for (let i = 0; i < cellValue4; i++) {
    for (let j = 0; j < cellValue4; j++) {
      if (table[i][j] !== 0) {
        counterFree--;
      }
    }
  }

  for (let i = 0; i < cellValue4; i++) {
    for (let j = 0; j < cellValue4 - 1; j++) {
      if (table[i][j] === table[i][j + 1]) {
        counterMoves++;
      }
    }
  }

  for (let i = 0; i < cellValue4 - 1; i++) {
    for (let j = 0; j < cellValue4; j++) {
      if (table[i][j] === table[i + 1][j]) {
        counterMoves++;
      }
    }
  }

  if (counterFree === 0 && counterMoves === 0) {
    messageLose[0].classList.remove('hidden');
  }
}

function merge(i, j, a = 0, b = 0) {
  if (table[i][j] === table[i + a][j + b] && table[i + a][j + b] !== 0) {
    const identifier = i.toString() + j.toString();
    const identifierPrev = (i + a).toString() + (j + b).toString();
    const identifiedCell = document.getElementById(identifier);
    const identifiedPrev = document.getElementById(identifierPrev);

    score += table[i][j] * 2;
    table[i + a][j + b] = table[i][j] * 2;
    table[i][j] = 0;
    merged++;

    const scoreText = score.toString();

    scoreElement.textContent = scoreText;
    identifiedCell.className = 'field-cell';
    identifiedPrev.className = 'field-cell';
    identifiedPrev.classList.add(`field-cell--${table[i + a][j + b]}`);

    if (table[i + a][j + b] === winValue) {
      messageWin[0].classList.remove('hidden');
    };
    merged = 1;
  }
}

function move(i, j, a, b) {
  let l = i;
  let k = j;

  if (table[i][j] !== 0 && table[i + a][j + b] === 0) {
    while (table[l + a][k + b] === 0 && table[l][k] !== 0) {
      const identifier = l.toString() + k.toString();
      const identifierPrev = (l + a).toString() + (k + b).toString();
      const identifiedCell = document.getElementById(identifier);
      const identifiedPrev = document.getElementById(identifierPrev);

      table[l + a][k + b] = table[l][k];
      table[l][k] = 0;
      identifiedCell.className = 'field-cell';
      identifiedPrev.className = 'field-cell';
      identifiedPrev.classList.add(`field-cell--${table[l + a][k + b]}`);

      if (b === -1) {
        k--;
      } else if (b === 1) {
        k++;
      } else if (a === -1) {
        l--;
      } else if (a === 1) {
        l++;
      }

      if (a === -1 && l === 0) {
        moved = 1;

        return;
      } else if (a === 1 && l === 3) {
        moved = 1;

        return;
      }
    };
    moved = 1;
    merge(l, k, a, b);
  }
}
