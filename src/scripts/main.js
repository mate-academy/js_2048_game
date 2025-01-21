'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function CheckStatus() {
  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
    messageStart.classList.add('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
  }
}

buttonStart.addEventListener('click', () => {
  game.start();
  buttonStart.textContent = 'Restart';
  buttonStart.classList.add('restart');
  CheckStatus();
});

buttonStart.addEventListener('click', () => {
  if (buttonStart.textContent === 'Restart') {
    game.restart();
    score.textContent = '0';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
  }
});

let isKeyPressed = false;

document.addEventListener('keydown', (event) => {
  if (isKeyPressed) return;

  isKeyPressed = true;

  if (event.key === 'ArrowLeft') {
    game.moveLeft();
    score.textContent = game.getScore();
    CheckStatus();
  }

  if (event.key === 'ArrowRight') {
    game.moveRight();
    score.textContent = game.getScore();
    CheckStatus();
  }

  if (event.key === 'ArrowUp') {
    game.moveUp();
    score.textContent = game.getScore();
    CheckStatus();
  }

  if (event.key === 'ArrowDown') {
    game.moveDown();
    score.textContent = game.getScore();
    CheckStatus();
  }
});

document.addEventListener('keyup', () => {
  isKeyPressed = false;
});
