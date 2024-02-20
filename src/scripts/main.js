'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();
const START_BUTTON = document.querySelector('.start');
const SCORE = document.querySelector('.game-score');
const RESTART_BUTTON = document.querySelector('.restart');
const WIN_MESSAGE = document.querySelector('.message-win');
const LOSE_MESSAGE = document.querySelector('.message-lose');
const START_MESSAGE = document.querySelector('.message-start');

START_BUTTON.addEventListener('click', () => {
  game.start();
  START_BUTTON.style.display = 'none';
  RESTART_BUTTON.style.display = 'block';
  LOSE_MESSAGE.style.display = 'none';
  WIN_MESSAGE.style.display = 'none';
  START_MESSAGE.style.display = 'none';
});

RESTART_BUTTON.addEventListener('click', () => {
  game.restart();
  game.start();
  LOSE_MESSAGE.style.display = 'none';
  WIN_MESSAGE.style.display = 'none';
  game.visualiseScore(SCORE);
});

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'ArrowLeft') {
    game.moveLeft();
    game.visualiseScore(SCORE);
    message();
  } else if (key === 'ArrowRight') {
    game.moveRight();
    game.visualiseScore(SCORE);
    message();
  } else if (key === 'ArrowUp') {
    game.moveUp();
    game.visualiseScore(SCORE);
    message();
  } else if (key === 'ArrowDown') {
    game.moveDown();
    game.visualiseScore(SCORE);
    message();
  }
});

function message() {
  const result = game.anilizeStatus(game.getStatus());

  if (result === 'win') {
    WIN_MESSAGE.style.display = 'block';

    return 'win';
  } else if (result === 'lose') {
    LOSE_MESSAGE.style.display = 'block';

    return 'lose';
  }

  return 'playing';
}
