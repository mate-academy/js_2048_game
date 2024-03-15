'use strict';

const Game = require('../modules/Game');
const displayMessage = require('./displayMessage');
const placeState = require('./placeState');

const HIDDEN_CLASS = 'hidden';

const HTMLStartButtons = {
  start: document.querySelector('.button.start'),
  restart: document.querySelector('.button.restart'),
};
const HTMLMessages = {
  lose: document.querySelector('.message.message-lose'),
  win: document.querySelector('.message.message-win'),
  idle: document.querySelector('.message.message-start'),
};
const HTMLScore = document.querySelector('.game-score');
const HTMLCells = document.querySelectorAll('.field-cell');

const game = new Game();

HTMLStartButtons.start.addEventListener('click', () => {
  HTMLStartButtons.start.classList.add(HIDDEN_CLASS);
  HTMLStartButtons.restart.classList.remove(HIDDEN_CLASS);

  game.start();
  placeState(game.getState(), HTMLCells);
  displayMessage(HTMLMessages, game.getStatus(), HIDDEN_CLASS);
});

HTMLStartButtons.restart.addEventListener('click', () => {
  HTMLStartButtons.restart.classList.add(HIDDEN_CLASS);
  HTMLStartButtons.start.classList.remove(HIDDEN_CLASS);

  game.restart();
  placeState(game.getState(), HTMLCells);
  displayMessage(HTMLMessages, game.getStatus(), HIDDEN_CLASS);
});

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }

  HTMLScore.innerHTML = game.getScore();
  displayMessage(HTMLMessages, game.getStatus(), HIDDEN_CLASS);
  placeState(game.getState(), HTMLCells);
});
