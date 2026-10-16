'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const body = document.body;
const startButton = body.querySelector('.button');
const table = body.querySelector('.game-field');
const scoreTablet = body.querySelector('.info');
const infoBlock = body.querySelector('.message-container');
const messageWin = infoBlock.querySelector('.message.message-win');
const messageLost = infoBlock.querySelector('.message.message-lose');
const messageStart = infoBlock.querySelector('.message.message-start');

function platesColor(rows, field) {
  const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

  for (let i = 0; i < field.length; i++) {
    const cells = Array.from(rows[i].querySelectorAll('.field-cell'));

    for (let j = 0; j < field[i].length; j++) {
      const value = +cells[j].textContent;

      values.forEach((val) => cells[j].classList.remove(`field-cell--${val}`));

      if (value !== 0) {
        cells[j].classList.add(`field-cell--${value}`);
      }
    }
  }
}

function stateReplacing(gameTable) {
  const rows = Array.from(gameTable.querySelectorAll('.field-row'));

  const field = game.getState();

  for (let i = 0; i < field.length; i++) {
    const cells = Array.from(rows[i].querySelectorAll('.field-cell'));

    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] !== 0) {
        cells[j].textContent = field[i][j];
      } else {
        cells[j].textContent = '';
      }
    }
  }

  platesColor(rows, field);

  const animationCoords = game.getAnimatedCoords();

  for (const [row, col] of animationCoords) {
    const cells = rows[row].querySelectorAll('.field-cell');

    cells[col].classList.add('apear-animation');

    cells[col].addEventListener(
      'animationend',
      (e) => {
        e.currentTarget.classList.remove('apear-animation');
      },
      { once: true },
    );
  }

  const unitedCoords = game.getUnitedCoords();

  for (const [row, col] of unitedCoords) {
    const cells = rows[row].querySelectorAll('.field-cell');

    cells[col].classList.add('merge-animation');

    cells[col].addEventListener(
      'animationend',
      (e) => {
        e.currentTarget.classList.remove('merge-animation');
      },
      { once: true },
    );
  }

  game.apearCells.length = 0;
  game.unitedCells.length = 0;

  scoreReloading(scoreTablet);
}

function scoreReloading(scoreValue) {
  const score = game.getScore();
  const gameScore = scoreValue.querySelector('.game-score');

  gameScore.textContent = score;
}

function hasWonOrLost() {
  const currentStatus = game.getStatus();

  if (currentStatus === 'won') {
    infoBlock.classList.remove('hidden');
    messageWin.classList.remove('hidden');
    messageLost.classList.add('hidden');
  } else if (currentStatus === 'lost') {
    infoBlock.classList.remove('hidden');
    messageLost.classList.remove('hidden');
    messageWin.classList.add('hidden');
  }
}

startButton.addEventListener('click', (e) => {
  if (e.currentTarget.classList.contains('start')) {
    game.start();
  } else {
    game.restart();
    messageLost.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  stateReplacing(table);
  messageStart.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  if (e.key.startsWith('Arrow')) {
    e.preventDefault();
  }

  if (game.getStatus() !== 'playing') {
    return;
  }

  const startStatePosition = game.getState();

  switch (e.key) {
    case 'ArrowLeft': {
      game.moveLeft();
      stateReplacing(table);

      if (
        game.hasChanged(startStatePosition) &&
        startButton.classList.contains('start')
      ) {
        startButton.classList.replace('start', 'restart');
        startButton.textContent = 'Restart';
      }

      hasWonOrLost();
      break;
    }

    case 'ArrowRight': {
      game.moveRight();
      stateReplacing(table);

      if (
        game.hasChanged(startStatePosition) &&
        startButton.classList.contains('start')
      ) {
        startButton.classList.replace('start', 'restart');
        startButton.textContent = 'Restart';
      }

      hasWonOrLost();
      break;
    }

    case 'ArrowUp': {
      game.moveUp();
      stateReplacing(table);

      if (
        game.hasChanged(startStatePosition) &&
        startButton.classList.contains('start')
      ) {
        startButton.classList.replace('start', 'restart');
        startButton.textContent = 'Restart';
      }

      hasWonOrLost();
      break;
    }

    case 'ArrowDown': {
      game.moveDown();
      stateReplacing(table);

      if (
        game.hasChanged(startStatePosition) &&
        startButton.classList.contains('start')
      ) {
        startButton.classList.replace('start', 'restart');
        startButton.textContent = 'Restart';
      }

      hasWonOrLost();
      break;
    }
  }
});
