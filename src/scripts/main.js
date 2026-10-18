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
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');

    stateReplacing(table);
  } 
  else {
    game.restart();
    stateReplacing(table);
    startButton.classList.replace('restart', 'start');
    startButton.textContent = 'Start';
    messageLost.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key.startsWith('Arrow')) {
    e.preventDefault();
  }

  makeMove(e.key);
});

let startX;
let startY;

document.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) {
    startX = undefined;
    startY = undefined;

    return;
  }

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  if (startX === undefined || startY === undefined) {
    return;
  }

  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;

  const direction = handleSwipe(startX, endX, startY, endY);

  startX = undefined;
  startY = undefined;

  if (direction) {
    makeMove(direction);
  }
});

document.addEventListener('touchcancel', () => {
  startX = undefined;
  startY = undefined;
});

function handleSwipe(startx, endX, starty, endY) {
  const diffX = endX - startx;
  const diffY = endY - starty;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (Math.abs(diffX) < 30) {
      return null;
    }

    return diffX > 0 ? 'right' : 'left';
  }

  if (Math.abs(diffY) < 30) {
    return null;
  }

  return diffY > 0 ? 'down' : 'up';
}

function makeMove(direction) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (direction) {
    case 'ArrowLeft':
    case 'left': {
      game.moveLeft();
      stateReplacing(table);
      hasWonOrLost();
      break;
    }

    case 'ArrowRight':
    case 'right': {
      game.moveRight();
      stateReplacing(table);
      hasWonOrLost();
      break;
    }

    case 'ArrowUp':
    case 'up': {
      game.moveUp();
      stateReplacing(table);
      hasWonOrLost();
      break;
    }

    case 'ArrowDown':
    case 'down': {
      game.moveDown();
      stateReplacing(table);
      hasWonOrLost();
      break;
    }
  }
}
