'use strict';

// import
const {
  mobileSwipes,
} = require('./mobile');

const {
  arrowsPlayHandler,
  createItemInRandomEmptyField,
} = require('./move');

// vars
const gameScore = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const allCells = gameField.querySelectorAll('.field-cell');
const startBtn = document.querySelector('.button');
const highestScore = document.querySelector('.highest-score');

function gameInit() {
  highestScore.innerText = localStorage.getItem('score') || 0;

  startBtn.addEventListener('click', (e) => {
    if (startBtn.innerText === 'Start') {
      startBtn.innerText = 'Restart';
      startBtn.classList.remove(`start`);
      startBtn.classList.add(`restart`);

      document.querySelector('.message-play').classList.remove('hidden');
      document.querySelector('.message-start').classList.add('hidden');

      createItemInRandomEmptyField();
      createItemInRandomEmptyField();

      mobileSwipes(gameField);
      document.body.addEventListener('keyup', arrowsPlayHandler);
    } else if (startBtn.innerText === 'Restart') {
      for (const cell of allCells) {
        if (cell.classList.length > 1) {
          cell.classList.remove(`field-cell--${cell.innerText}`);
          cell.innerText = '';
        }
      }

      document.querySelector('.message-play').classList.remove('hidden');
      document.querySelector('.message-lose').classList.add('hidden');
      document.querySelector('.message-win').classList.add('hidden');
      gameScore.innerText = 0;

      createItemInRandomEmptyField();
      createItemInRandomEmptyField();

      document.body.addEventListener('keyup', arrowsPlayHandler);
    }
  });
}

gameInit();
