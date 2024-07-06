'use strict';

import Game from '../modules/Game.class.js';

function keyListener(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
  }

  update();
}

function update() {
  game.getState().forEach((row, i) => {
    row.forEach((el, j) => {
      let cellCssClass = 'field-cell';

      cellCssClass += el >= 2 ? ` field-cell--${el}` : '';
      gameCells[i][j].innerText = el || '';
      gameCells[i][j].className = cellCssClass;
    });
  });

  scoreElement.innerText = game.getScore();

  switch (game.getStatus().toUpperCase()) {
    case 'WIN':
      changeMessage('WIN');
      break;
    case 'LOSE':
      changeMessage('LOSE');
      break;
  }
}

function start() {
  switch (game.getStatus()) {
    case 'idle':
      game.start();
      toggleButton('restart');
      break;
    case 'playing':
    case 'win':
    case 'lose':
      game.restart();
      toggleButton('start');
      break;
  }

  update();
}

function toggleButton(text) {
  button.classList.toggle('start');
  button.classList.toggle('restart');
  button.innerText = text.toUpperCase();
}

function changeMessage(type) {
  let messageClass;

  switch (type.toUpperCase()) {
    case 'WIN':
      messageClass = '.message-win';
      break;
    case 'LOSE':
      messageClass = '.message-lose';
      break;
    case 'START':
      messageClass = '.message-start';
      break;
    default:
      throw new Error('unkown type');
  }

  messageContainer.querySelector(':not(.hidden)').classList.toggle('hidden');
  messageContainer.querySelector(messageClass).classList.toggle('hidden');
}

const game = new Game();

const gameField = document.querySelector('.game-field');
const gameCells = Array.from(gameField.querySelectorAll('.field-row')).map(
  (row) => Array.from(row.children),
);
const scoreElement = document.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');
const button = document.querySelector('.button.start');

document.addEventListener('keydown', keyListener);
button.addEventListener('click', start);
