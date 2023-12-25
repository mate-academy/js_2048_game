'use strict';

const startBtn = document.querySelectorAll('.button')[0];

let cellFreePlaces = [];

startBtn.addEventListener('click', () => {
  if (startBtn.classList.value.includes('restart')) {
    startBtn.classList.remove('restart');
    startBtn.textContent = 'Start';
    stopGame();
  } else {
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
    launchGame();
  }
});

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
};

const updateScore = (addedValue) => {
  const score = document.querySelector('.game-score');
  const scoreValue = +document.querySelector('.game-score').textContent;

  score.textContent = scoreValue + addedValue;
};

const move = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'ArrowUp') {
      // console.log('Up');
    } else if (e.key === 'a' || e.key === 'ArrowLeft') {
      // console.log('Left');
    } else if (e.key === 's' || e.key === 'ArrowDown') {
      // console.log('Down');
    } else if (e.key === 'd' || e.key === 'ArrowRight') {
      // console.log('Right');
    }
  });
};
