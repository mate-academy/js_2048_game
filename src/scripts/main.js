'use strict';

const gameField = document.querySelector('.game-field');
const scoreField = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const button = document.querySelector('.button');

const initialState = Array.from(
  { length: gameField.tBodies[0].rows.length },
  () => Array(gameField.tBodies[0].rows[0].cells.length).fill(0),
);

const Game = require('../modules/Game.class');
const game = new Game(initialState, gameField.tBodies[0], scoreField);

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';

    startMessage.classList.add('hidden');
  } else if (button.classList.contains('restart')) {
    game.restart();

    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';

    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  game.updateGameBoard();
});

setupInputOnce();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
  setupTouchControls();
}

function handleInput(e) {
  switch (e.key) {
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
    default:
      setupInputOnce();

      return;
  }

  updateGame();
}

function setupTouchControls() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const threshold = 50;

  window.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { once: true },
  );

  window.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;

      handleSwipe();
    },
    { once: true },
  );

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        game.moveRight();
      } else if (deltaX < -threshold) {
        game.moveLeft();
      }
    } else {
      if (deltaY > threshold) {
        game.moveDown();
      } else if (deltaY < -threshold) {
        game.moveUp();
      }
    }

    updateGame();
  }
}

function updateGame() {
  game.updateGameBoard();

  const resultStatus = game.getStatus();

  if (resultStatus === Game.STATUSES.win) {
    winMessage.classList.remove('hidden');
  }

  if (resultStatus === Game.STATUSES.lose) {
    loseMessage.classList.remove('hidden');
  }

  setupInputOnce();
}
