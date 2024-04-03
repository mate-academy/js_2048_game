'use strict';
// Uncomment the next lines to use your game instance in the browser

function keyListener(e) {
  if (game2048.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowDown':
      game2048.moveDown();
      break;

    case 'ArrowLeft':
      game2048.moveLeft();
      break;

    case 'ArrowRight':
      game2048.moveRight();
      break;

    case 'ArrowUP':
      game2048.moveUp();
      break;
  }

  update();
}

function update() {
  game2048.getState().forEach((row, i) => {
    row.forEach((el, j) => {
      let cellCssClass = 'field-cell';

      cellCssClass += el >= 2 ? ` field-cell--${el}` : '';
      gameCells[i][j].innerText = el || '';
      gameCells[i][j].className = cellCssClass;
    });
  });

  scoreELement.innerText = game2048.getScore();

  switch (game2048.getStatus().toUpperCase()) {
    case 'WIN':
      changeMessage('WIN');
      break;
    case 'LOSE':
      changeMessage('LOSE');
      break;
    default:
      hideAllMessanges();
      break;
  }
}

function start() {
  switch (game2048.getStatus()) {
    case 'idle':
      game2048.start();
      toggleButton('restart');
      removeStartMessage();
      break;
    case 'playing':
    case 'win':
    case 'lose':
      game2048.restart();
      toggleButton('start');
      changeMessage('START');
      break;
  }

  update();
}

function removeStartMessage() {
  const startMessage = document.querySelector('message-start');

  if (startMessage) {
    startMessage.remove();
  }
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
      throw new Error('unknown type');
  }

  messageContainer.querySelector(':not(.hidden)').classList.toggle('hidden');
  messageContainer.querySelector(messageClass).classList.remove('hidden');
}

function hideAllMessanges() {
  messageContainer
    .querySelectorAll('.message')
    .forEach((msg) => msg.classList.add('hidden'));
}

const Game = require('../modules/Game.class');
const game2048 = new Game();

const gameField = document.querySelector('.game-field');

const gameCells = Array.from(gameField.querySelectorAll('.field-row')).map(
  (row) => Array.from(row.children),
);
const scoreELement = document.querySelector('game-score');
const messageContainer = document.querySelector('.message-container');
const button = document.querySelector('.button.start');

document.addEventListener('keydown', keyListener);
button.addEventListener('click', start);
