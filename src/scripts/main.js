'use strict';

const Game = require('./game');

let game;
const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const message = document.querySelectorAll('.message');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const field = document.querySelector('.game-field');

function drawField() {
  const cellValues = game.cellsValues();

  cells.forEach((cell, index) => {
    if (cell.classList.contains(`field-cell--${cell.textContent}`)) {
      cell.classList.remove(`field-cell--${cell.textContent}`);
    }

    cell.textContent = cellValues[index] || '';

    if (cell.textContent) {
      cell.classList.add(`field-cell--${cell.textContent}`);
    };
  });

  gameScore.textContent = game.score;

  switch (game.state) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
  }
}

button.addEventListener('click', () => {
  game = new Game();
  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';
  message.forEach(msg => msg.classList.add('hidden'));

  drawField();
});

document.addEventListener('keyup', (ev) => {
  if (!game || game.state !== 'started') {
    return;
  }

  switch (ev.key) {
    case 'ArrowDown':
      game.moveBottom();
      break;
    case 'ArrowUp':
      game.moveTop();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  drawField();
});

let startX, startY, endX, endY;

field.addEventListener('touchstart', (ev) => {
  const touch = ev.touches[0];

  startX = touch.clientX;
  startY = touch.clientY;
});

field.addEventListener('touchmove', (ev) => {
  ev.preventDefault();

  const touch = ev.touches[0];

  endX = touch.clientX;
  endY = touch.clientY;
});

field.addEventListener('touchend', (ev) => {
  if (!game || game.state !== 'started') {
    return;
  }

  const diffX = startX - endX;
  const diffY = startY - endY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      game.moveLeft();
    } else {
      game.moveRight();
    }
  } else {
    if (diffY > 0) {
      game.moveTop();
    } else {
      game.moveBottom();
    }
  }

  drawField();
});
