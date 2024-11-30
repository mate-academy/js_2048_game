'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const rows = document.querySelectorAll('.field-row');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const BUTTON_RESTART = 'Restart';
const BUTTON_CLASS_RESTART = 'restart';
const BUTTON_START = 'Start';
const BUTTON_CLASS_START = 'start';

let showStartButton = true;

function update() {
  const state = game.getState();

  for (let row = 0; row < state.length; row++) {
    for (let column = 0; column < state[row].length; column++) {
      const value = state[row][column];

      if (value < 2 || value % 2 !== 0) {
        rows[row].children[column].replaceChildren();
        continue;
      }

      const newCell = document.createElement('div');

      newCell.textContent = value;
      newCell.classList.add('field-cell', `field-cell--${value}`);

      rows[row].children[column].replaceChildren(newCell);
    }
  }

  switch (game.getStatus()) {
    case 'playing':
      button.textContent = BUTTON_RESTART;
      button.classList.remove(BUTTON_CLASS_START);
      button.classList.add(BUTTON_CLASS_RESTART);

      messageStart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');

      break;
    case 'lose':
      messageLose.classList.remove('hidden');

      break;
    case 'win':
      messageWin.classList.remove('hidden');

      break;
    default:
      break;
  }

  if (showStartButton) {
    button.textContent = BUTTON_START;
    button.classList.remove(BUTTON_CLASS_RESTART);
    button.classList.add(BUTTON_CLASS_START);
  }

  gameScore.textContent = game.getScore();
}

button.addEventListener('click', () => {
  if (
    game.getStatus() === 'playing' &&
    !showStartButton &&
    confirm('Are you sure you want to restart the game?')
  ) {
    game.restart();
  } else if (game.getStatus() !== 'playing') {
    game.start();
  }

  update();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let pressedArrows = true;

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      pressedArrows = false;
  }

  if (pressedArrows) {
    showStartButton = false;
    update();
  }
});

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return (
    evt.touches || // browser API
    evt.originalEvent.touches
  ); // jQuery
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];

  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      game.moveLeft();
    } else {
      game.moveRight();
    }
  } else {
    if (yDiff > 0) {
      game.moveUp();
    } else {
      game.moveDown();
    }
  }

  update();

  xDown = null;
  yDown = null;
}
