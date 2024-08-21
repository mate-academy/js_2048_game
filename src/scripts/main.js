'use strict';

const Game = require('./modules/Game.class.js');

const playBtn = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const playground = new Game();

updateTableStyles();

const keyDownHandler = (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      playground.moveLeft();
      break;

    case 'ArrowRight':
      playground.moveRight();
      break;

    case 'ArrowDown':
      playground.moveDown();
      break;

    case 'ArrowUp':
      playground.moveUp();
      break;

    default:
      return;
  }

  updateStyles();
};

function updateButtonText(button) {
  button.textContent = button.classList.contains('start') ? 'Start' : 'Restart';
}

function toggleButtonClasses(button) {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  updateButtonText(button);
}

playBtn.addEventListener('click', () => {
  if (playBtn.classList.contains('start')) {
    startGame();

    msgStart.classList.add('hidden');

    document.addEventListener('keydown', keyDownHandler);
  } else {
    restartGame();

    msgStart.classList.remove('hidden');

    document.removeEventListener('keydown', keyDownHandler);
  }

  toggleButtonClasses(playBtn);
});

function updateTableStyles() {
  const table = document.querySelector('.game-field');
  const tableRows = table.rows;

  const state = playground.state;

  for (let i = 0; i < state.length; i++) {
    const gridRow = state[i];

    for (let j = 0; j < gridRow.length; j++) {
      if (!gridRow[j]) {
        tableRows[i].cells[j].textContent = '';
        tableRows[i].cells[j].className = 'field-cell';
      } else {
        const tableTd = tableRows[i].cells[j];
        const gridValue = gridRow[j];

        tableTd.textContent = gridValue;
        tableTd.className = `field-cell field-cell--${gridValue}`;
      }
    }
  }
}

function updateMessageStyles() {
  switch (playground.status) {
    case 'win':
      msgWin.classList.remove('hidden');
      document.removeEventListener('keydown', keyDownHandler);
      break;

    case 'lose':
      msgLose.classList.remove('hidden');
      break;

    default:
      msgLose.classList.add('hidden');
      msgWin.classList.add('hidden');
  }
}

function updateScoreStyles() {
  gameScore.textContent = playground.score;
}

function updateStyles() {
  updateTableStyles();
  updateScoreStyles();
  updateMessageStyles();
}

function startGame() {
  playground.start();
  updateStyles();
}

function restartGame() {
  playground.restart();
  updateStyles();
}
