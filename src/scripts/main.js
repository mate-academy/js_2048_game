'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');
const game = new Game();

const start = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

const touchStart = { x: 0, y: 0 };

initialize();

function initialize() {
  start.addEventListener('click', onStartClick);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('touchstart', onTouchStart);
  document.addEventListener('touchend', onTouchEnd);
}

function onStartClick() {
  if (start.classList.contains('start')) {
    start.className = 'button restart';
    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
    game.start();
  } else {
    start.className = 'button start';
    start.textContent = 'Start';
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    gameScore.textContent = '0';

    game.restart();
  }
}

function onKeyDown(keyEvent) {
  keyEvent.preventDefault();

  let numbersMove = false;

  const ARROW_UP = 'ArrowUp';
  const ARROW_DOWN = 'ArrowDown';
  const ARROW_RIGHT = 'ArrowRight';
  const ARROW_LEFT = 'ArrowLeft';

  switch (keyEvent.key) {
    case ARROW_UP:
      numbersMove = game.moveUp();
      break;
    case ARROW_DOWN:
      numbersMove = game.moveDown();
      break;
    case ARROW_RIGHT:
      numbersMove = game.moveRight();
      break;
    case ARROW_LEFT:
      numbersMove = game.moveLeft();
      break;
  }

  updateState(numbersMove);
}

function onTouchStart(touchEvent) {
  touchStart.x = touchEvent.touches[0].clientX;
  touchStart.y = touchEvent.touches[0].clientY;
}

function onTouchEnd(touchEvent) {
  const touchX = touchEvent.changedTouches[0].clientX;
  const touchY = touchEvent.changedTouches[0].clientY;

  const deltaX = touchX - touchStart.x;
  const deltaY = touchY - touchStart.y;

  if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        game.moveRight();
      } else {
        game.moveLeft();
      }
    } else {
      if (deltaY > 0) {
        game.moveDown();
      } else {
        game.moveUp();
      }
    }

    updateState(true);
  }
}

function updateState(numbersMove) {
  if (numbersMove) {
    updateScore(game.getScore());

    const newStatus = game.getStatus();

    if (newStatus === Game.Status.win) {
      messageWin.classList.remove('hidden');
    } else if (newStatus === Game.Status.lose) {
      messageLose.classList.remove('hidden');
    }
  }
}

function updateScore(newScore) {
  gameScore.textContent = newScore;
}
