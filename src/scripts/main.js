'use strict';

const startBtn = document.querySelector('.button');
const msgStartContainer = document.querySelector('.message-start');
const msgWinContainer = document.querySelector('.message-win');
const msgLoseContainer = document.querySelector('.message-lose');
let cellFreePlaces = [];
const cellNumbers = [];

const launchGame = () => {
  for (let i = 0; i < 16; i++) {
    cellFreePlaces.push(i);
  }

  addCell(2);
  addCell(2);

  move();
  updateScore(4);
};

const stopGame = () => {
  cellFreePlaces = [];

  const cells = document.querySelectorAll('.field-cell');

  for (let i = 0; i < 16; i++) {
    cells[i].classList.remove(
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
    );
    cells[i].textContent = '';
    deleteScore();
  }
};

const winGame = () => {
  const cells = document.querySelectorAll('.field-cell');
  let cells2048 = 0;

  for (let i = 0; i < 16; i++) {
    if (cells[i].classList.contains('field-cell--2048')) {
      cells2048++;
    }
  }

  if (cells2048 > 0) {
    msgWinContainer.classList.remove('hidden');
  }
};

const loseGame = () => {
  if (cellFreePlaces.length === 16) {
    msgLoseContainer.classList.remove('hidden');
  }
};

const generateRandom = () => {
  cellFreePlaces.sort(() => Math.random() - 0.5);

  return cellFreePlaces.pop();
};

const addCell = (cellNum) => {
  const randomPos = generateRandom();
  const cell = document.querySelectorAll('.field-cell')[randomPos];

  cell.classList.add(`field-cell--${cellNum}`);
  cell.textContent = `${cellNum}`;

  cellNumbers[randomPos] = cellNum;
};

const updateScore = (addedValue) => {
  const score = document.querySelector('.game-score');
  const scoreValue = +document.querySelector('.game-score').textContent;

  score.textContent = scoreValue + addedValue;
};

const deleteScore = () => {
  const score = document.querySelector('.game-score');

  score.textContent = 0;
};

const updateGame = () => {
  winGame();
  loseGame();
};

const move = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') {
      updateGame();

      const column1 = [
        cellNumbers[0],
        cellNumbers[4],
        cellNumbers[8],
        cellNumbers[12],
      ];

      column1.sort((a, b) => a - b);
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
      updateGame();
    } else if (e.key === 's' || e.key === 'ArrowDown') {
      updateGame();
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
      updateGame();
    }
  });
};

startBtn.addEventListener('click', () => {
  if (startBtn.classList.value.includes('restart')) {
    msgStartContainer.classList.remove('hidden');
    startBtn.classList.remove('restart');
    startBtn.textContent = 'Start';
    stopGame();
  } else {
    msgStartContainer.classList.add('hidden');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    launchGame();
  }
});
