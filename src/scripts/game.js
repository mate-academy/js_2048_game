'use strict';

// import:
const {
  mobileSwipes,
} = require('./mobile');

const {
  gameScore,
  gameField,
  allCells,
  highestScore,
  startBtn,
  messageBeforeStart,
  messageDuringTheGame,
  messageAfterLose,
  messageAfterWin,
} = require('./variables');

const {
  arrowsPlayHandler,
  createItemInRandomEmptyField,
} = require('./move');

// main function:
function gameInit() {
  highestScore.innerText = localStorage.getItem('score') || 0;

  startBtn.addEventListener('click', (e) => {
    if (startBtn.innerText === 'Start') {
      gameOnStart();
    } else if (startBtn.innerText === 'Restart') {
      gameOnRestart();
    }
  });
}

function gameOnStart() {
  startBtn.innerText = 'Restart';
  startBtn.classList.remove(`start`);
  startBtn.classList.add(`restart`);

  messageDuringTheGame.classList.remove('hidden');
  messageBeforeStart.classList.add('hidden');

  createItemInRandomEmptyField();
  createItemInRandomEmptyField();

  mobileSwipes(gameField);
  document.body.addEventListener('keyup', arrowsPlayHandler);
}

function gameOnRestart() {
  for (const cell of allCells) {
    if (cell.classList.length > 1) {
      cell.classList.remove(`field-cell--${cell.innerText}`);
      cell.innerText = '';
    }
  }

  messageDuringTheGame.classList.remove('hidden');
  messageAfterLose.classList.add('hidden');
  messageAfterWin.classList.add('hidden');
  gameScore.innerText = 0;

  createItemInRandomEmptyField();
  createItemInRandomEmptyField();

  document.body.addEventListener('keyup', arrowsPlayHandler);
}

module.exports = { gameInit };
