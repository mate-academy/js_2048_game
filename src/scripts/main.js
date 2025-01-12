'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameHeader = document.querySelector('.game-header');
const button = gameHeader.querySelector('.button');

function ifMaxScore() {
  if (game.getStatus() === 'win') {
    removeEventListeners();
    document.querySelector('.message-win').classList.remove('hidden');
  }
}

function clickOnButton() {
  if (button.classList.contains('start')) {
    game.start();
    addEventListeners();
  } else {
    game.restart();
    addEventListeners();
  }
}

button.addEventListener('click', clickOnButton);

function moveLeft() {
  game.moveLeft();

  ifMaxScore();
}

function moveRight() {
  game.moveRight();

  ifMaxScore();
}

function moveUp() {
  game.moveUp();

  ifMaxScore();
}

function moveDown() {
  game.moveDown();

  ifMaxScore();
}

function removeEventListeners() {
  document.removeEventListener('keydown', moveLeft);
  document.removeEventListener('keydown', moveRight);
  document.removeEventListener('keydown', moveUp);
  document.removeEventListener('keydown', moveDown);
}

function addEventListeners() {
  document.addEventListener('keydown', moveLeft);
  document.addEventListener('keydown', moveRight);
  document.addEventListener('keydown', moveUp);
  document.addEventListener('keydown', moveDown);
}
