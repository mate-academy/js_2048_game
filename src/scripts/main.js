'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

let touchStartX = 0;
let touchStartY = 0;

initialize();

function initialize() {
  startBtn.addEventListener('click', handleStartClick);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchend', handleTouchEnd);
}

function handleStartClick() {
  if (startBtn.classList.contains('start')) {
    startBtn.className = 'button restart';
    startBtn.textContent = 'Restart';
    startMessage.classList.add('hidden');
    game.start();
  } else {
    startBtn.className = 'button start';
    startBtn.textContent = 'Start';
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    score.textContent = '0';

    game.restart();
  }
}

function handleKeyDown(keyEvent) {
  keyEvent.preventDefault();

  let numbersMove = false;

  switch (keyEvent.key) {
    case 'ArrowUp':
      numbersMove = game.moveUp();
      break;
    case 'ArrowDown':
      numbersMove = game.moveDown();
      break;
    case 'ArrowRight':
      numbersMove = game.moveRight();
      break;
    case 'ArrowLeft':
      numbersMove = game.moveLeft();
      break;
  }

  handleMoveOutcome(numbersMove);
}

function handleTouchStart(touchEvent) {
  touchStartX = touchEvent.touches[0].clientX;
  touchStartY = touchEvent.touches[0].clientY;
}

function handleTouchEnd(touchEvent) {
  const touchEndX = touchEvent.changedTouches[0].clientX;
  const touchEndY = touchEvent.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

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

    handleMoveOutcome(true);
  }
}

function handleMoveOutcome(numbersMove) {
  if (numbersMove) {
    updateScore(game.getScore());

    const newStatus = game.getStatus();

    if (newStatus === Game.Status.win) {
      winMessage.classList.remove('hidden');
    } else if (newStatus === Game.Status.lose) {
      loseMessage.classList.remove('hidden');
    }
  }
}

function updateScore(newScore) {
  score.textContent = newScore;
}
