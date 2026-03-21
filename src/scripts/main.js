'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';
// const Game = require('../modules/Game.class');

const game = new Game();

const actionBtn = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const messageWon = document.querySelector('.message.message-won');
const messageLose = document.querySelector('.message.message-lose');
const fieldCells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');

actionBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (game.getStatus() === 'idle') {
    game.start();
  } else if (
    game.getStatus() === 'playing' ||
    game.getStatus() === 'won' ||
    game.getStatus() === 'lose'
  ) {
    game.restart();
    gameScore.textContent = 0;
  }

  checkStatus();

  renderField();
});

function renderField() {
  const fieldValues = [];

  game.state.field.forEach((r) => r.forEach((c) => fieldValues.push(c)));

  for (let i = 0; i < fieldCells.length; i++) {
    fieldCells[i].textContent = '';

    const el = fieldCells[i];
    const value = fieldValues[i];

    for (const cls of [...el.classList]) {
      if (cls.startsWith('field-cell--')) {
        el.classList.remove(cls);
      }
    }

    if (value !== 0) {
      el.textContent = value;
      el.classList.add(`field-cell--${value}`);
    }
  }
}

function checkStatus() {
  for (let i = 0; i < messages.length; i++) {
    if (!messages[i].classList.contains('hidden')) {
      messages[i].classList.add('hidden');
    }
  }

  if (game.getStatus() === 'playing') {
    actionBtn.textContent = 'Restart';
    actionBtn.classList.remove('start');
    actionBtn.classList.add('restart');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }

  if (game.getStatus() === 'won') {
    messageWon.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  const score = game.getScore();

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    gameScore.textContent = score;
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    gameScore.textContent = score;
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    gameScore.textContent = score;
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    gameScore.textContent = score;
  }

  checkStatus();

  renderField();
});
