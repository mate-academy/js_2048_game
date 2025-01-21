'use strict';
import Game from '../modules/Game.class.js';

const gameField = document.querySelector('.game__field');
const button = document.querySelector('.game__button');
const messageStart = document.querySelector('.game__message--start');
const messageLose = document.querySelector('.game__message--lose');
const messageWin = document.querySelector('.game__message--win');
const score = document.querySelector('.game__score');

const game = new Game(gameField);

button.addEventListener('click', () => {
  if (button.classList.contains('game__button--start')) {
    game.start();
    checkMessage();
    button.textContent = 'Restart';
    button.classList.remove('game__button--start');
    button.classList.add('game__button--restart');
  } else {
    game.restart();
    game.getScore(score);
    checkMessage();
    button.textContent = 'Start';
    button.classList.remove('game__button--restart');
    button.classList.add('game__button--start');
    messageStart.classList.remove('game__message--hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();

    if (document.activeElement === button) {
      button.blur();
    }

    switch (e.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;

      case 'ArrowRight':
        game.moveRight();
        break;

      case 'ArrowUp':
        game.moveUp();
        break;

      case 'ArrowDown':
        game.moveDown();
        break;

      default:
        return;
    }
    game.renderField();
    game.getScore(score);
    checkMessage();
  }
});

function checkMessage() {
  messageStart.classList.add('game__message--hidden');
  messageLose.classList.add('game__message--hidden');
  messageWin.classList.add('game__message--hidden');

  switch (game.status) {
    case 'idle':
      messageStart.classList.remove('game__message--hidden');
      break;
    case 'win':
      messageWin.classList.remove('game__message--hidden');
      break;
    case 'lose':
      messageLose.classList.remove('game__message--hidden');
      break;
    case 'playing':
    default:
      break;
  }
}
