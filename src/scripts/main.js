'use strict';

document.addEventListener('keydown', param => func(param.key));

const table = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const randomValues = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
let score = 0;
const cellValue2 = 2;
const cellValue4 = 4;
const winValue = 2048;
const startButton = document.getElementById('buttonStart');
const messageStart = document.getElementsByClassName('message-start');
const messageWin = document.getElementsByClassName('message-win');
const messageLose = document.getElementsByClassName('message-lose');
const scoreElement = document.getElementById('score');

startButton.addEventListener('click', startFunction);

function func(param) {
  switch (param) {
    case 'ArrowLeft':
      moveLeft();
      newCell();
      break;
    case 'ArrowRight':
      moveRight();
      newCell();
      break;
    case 'ArrowUp':
      moveUp();
      newCell();
      break;
    case 'ArrowDown':
      moveDown();
      newCell();
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
  if (startButton.textContent === 'Start') {
    return;
  }

  for (let i = 0; i < cellValue4; i++) {
    for (let j = 1; j < cellValue4; j++) {
      const identifier = i.toString() + j.toString();
      const identifierPrev = i.toString() + (j - 1).toString();
      const identifiedCell = document.getElementById(identifier);
      const identifiedPrev = document.getElementById(identifierPrev);

      if (table[i][j] !== 0 && table[i][j - 1] === 0) {
        table[i][j - 1] = table[i][j];
        table[i][j] = 0;
        identifiedCell.className = 'field-cell';
        identifiedPrev.className = 'field-cell';
        identifiedPrev.classList.add(`field-cell--${table[i][j - 1]}`);
      } else if (table[i][j] === table[i][j - 1]) {
        score += table[i][j] * 2;
        table[i][j - 1] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;
        identifiedCell.className = 'field-cell';
        identifiedPrev.className = 'field-cell';
        identifiedPrev.classList.add(`field-cell--${table[i][j - 1]}`);

        if (table[i][j - 1] === winValue) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
  }
  check();
}

function moveRight() {
  if (startButton.textContent === 'Start') {
    return;
  }

  for (let i = 0; i < cellValue4; i++) {
    for (let j = 0; j < cellValue4 - 1; j++) {
      const identifier = i.toString() + j.toString();
      const identifierNext = i.toString() + (j + 1).toString();
      const identifiedCell = document.getElementById(identifier);
      const identifiedNext = document.getElementById(identifierNext);

      if (table[i][j] !== 0 && table[i][j + 1] === 0) {
        table[i][j + 1] = table[i][j];
        table[i][j] = 0;

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i][j + 1]}`);
      } else if (table[i][j] === table[i][j + 1]) {
        score += table[i][j] * 2;
        table[i][j + 1] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i][j + 1]}`);

        if (table[i][j + 1] === winValue) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
  }
  check();
}

function moveUp() {
  if (startButton.textContent === 'Start') {
    return;
  }

  for (let i = 1; i < cellValue4; i++) {
    for (let j = 0; j < cellValue4; j++) {
      const identifier = i.toString() + j.toString();
      const identifierNext = (i - 1).toString() + j.toString();
      const identifiedCell = document.getElementById(identifier);
      const identifiedNext = document.getElementById(identifierNext);

      if (table[i][j] !== 0 && table[i - 1][j] === 0) {
        table[i - 1][j] = table[i][j];
        table[i][j] = 0;

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i - 1][j]}`);
      } else if (table[i][j] === table[i - 1][j]) {
        score += table[i][j] * 2;
        table[i - 1][j] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i - 1][j]}`);

        if (table[i - 1][j] === winValue) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
  }
  check();
}

function moveDown() {
  if (startButton.textContent === 'Start') {
    return;
  }

  for (let i = 0; i < cellValue4 - 1; i++) {
    for (let j = 0; j < cellValue4; j++) {
      const identifier = i.toString() + j.toString();
      const identifierNext = (i + 1).toString() + j.toString();
      const identifiedCell = document.getElementById(identifier);
      const identifiedNext = document.getElementById(identifierNext);

      if (table[i][j] !== 0 && table[i + 1][j] === 0) {
        table[i + 1][j] = table[i][j];
        table[i][j] = 0;

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i + 1][j]}`);
      } else if (table[i][j] === table[i + 1][j]) {
        score += table[i][j] * 2;
        table[i + 1][j] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i + 1][j]}`);

        if (table[i + 1][j] === 2048) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
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
