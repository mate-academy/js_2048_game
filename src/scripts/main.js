'use strict';

document.addEventListener('keydown', param => func(param.key));

const table = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
const ranvals = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
let score = 0;

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

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      table[i][j] = 0;

      const identifier = i.toString() + j.toString();
      const identifiedCell = document.getElementById(identifier);

      identifiedCell.className = 'field-cell';
    }
  }
}

function newCell() {
  const freeCells = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (table[i][j] === 0) {
        freeCells.push(i.toString() + j.toString());
      }
    }
  }

  const randCellInd = Math.floor(Math.random() * freeCells.length);
  const identifier = freeCells[randCellInd];
  const ranInd = Math.floor(Math.random() * 10);
  const ranVal = ranvals[ranInd];
  const randomRow = Number(identifier[0]);
  const randomColumn = Number(identifier[1]);

  if (ranVal === 2) {
    const identifiedCell = document.getElementById(identifier);

    table[randomRow][randomColumn] = 2;
    identifiedCell.classList.add(`field-cell--2`);
  } else {
    const identifiedCell = document.getElementById(identifier);

    table[randomRow][randomColumn] = 4;
    identifiedCell.classList.add(`field-cell--4`);
  }

  check();
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (table[i][j] !== 0 && table[i][j - 1] === 0) {
        table[i][j - 1] = table[i][j];
        table[i][j] = 0;

        const identifier = i.toString() + j.toString();
        const identifierPrev = i.toString() + (j - 1).toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedPrev = document.getElementById(identifierPrev);

        identifiedCell.className = 'field-cell';
        identifiedPrev.className = 'field-cell';
        identifiedPrev.classList.add(`field-cell--${table[i][j - 1]}`);
      } else if (table[i][j] === table[i][j - 1]) {
        score += table[i][j] * 2;
        table[i][j - 1] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        const identifier = i.toString() + j.toString();
        const identifierPrev = i.toString() + (j - 1).toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedPrev = document.getElementById(identifierPrev);

        identifiedCell.className = 'field-cell';
        identifiedPrev.className = 'field-cell';
        identifiedPrev.classList.add(`field-cell--${table[i][j - 1]}`);

        if (table[i][j - 1] === 2048) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
  }
  check();
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (table[i][j] !== 0 && table[i][j + 1] === 0) {
        table[i][j + 1] = table[i][j];
        table[i][j] = 0;

        const identifier = i.toString() + j.toString();
        const identifierNext = i.toString() + (j + 1).toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedNext = document.getElementById(identifierNext);

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i][j + 1]}`);
      } else if (table[i][j] === table[i][j + 1]) {
        score += table[i][j] * 2;
        table[i][j + 1] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        const identifier = i.toString() + j.toString();
        const identifierNext = i.toString() + (j + 1).toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedNext = document.getElementById(identifierNext);

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i][j + 1]}`);

        if (table[i][j + 1] === 2048) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
  }
  check();
}

function moveUp() {
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (table[i][j] !== 0 && table[i - 1][j] === 0) {
        table[i - 1][j] = table[i][j];
        table[i][j] = 0;

        const identifier = i.toString() + j.toString();
        const identifierNext = (i - 1).toString() + j.toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedNext = document.getElementById(identifierNext);

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i - 1][j]}`);
      } else if (table[i][j] === table[i - 1][j]) {
        score += table[i][j] * 2;
        table[i - 1][j] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        const identifier = i.toString() + j.toString();
        const identifierNext = (i - 1).toString() + j.toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedNext = document.getElementById(identifierNext);

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i - 1][j]}`);

        if (table[i - 1][j] === 2048) {
          messageWin[0].classList.remove('hidden');
        }
      }
    }
  }
  check();
}

function moveDown() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (table[i][j] !== 0 && table[i + 1][j] === 0) {
        table[i + 1][j] = table[i][j];
        table[i][j] = 0;

        const identifier = i.toString() + j.toString();
        const identifierNext = (i + 1).toString() + j.toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedNext = document.getElementById(identifierNext);

        identifiedCell.className = 'field-cell';
        identifiedNext.className = 'field-cell';
        identifiedNext.classList.add(`field-cell--${table[i + 1][j]}`);
      } else if (table[i][j] === table[i + 1][j]) {
        score += table[i][j] * 2;
        table[i + 1][j] = table[i][j] * 2;
        table[i][j] = 0;

        const scoreText = score.toString();

        scoreElement.textContent = scoreText;

        const identifier = i.toString() + j.toString();
        const identifierNext = (i + 1).toString() + j.toString();
        const identifiedCell = document.getElementById(identifier);
        const identifiedNext = document.getElementById(identifierNext);

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

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (table[i][j] !== 0) {
        counterFree--;
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (table[i][j] === table[i][j + 1]) {
        counterMoves++;
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (table[i][j] === table[i + 1][j]) {
        counterMoves++;
      }
    }
  }

  if (counterFree === 0 && counterMoves === 0) {
    messageLose[0].classList.remove('hidden');
  }
}
