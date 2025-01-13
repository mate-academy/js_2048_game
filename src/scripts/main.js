'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

// обробка подій натиску кнопки 'Старт' або 'Перезапуск'
const button = document.querySelector('.button');

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

  updateGameField(gameField.tBodies[0], game.getState(), game.getScore());
});

// обробка подій натиску на стрілки для керування
setupInputOnce();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
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

  updateGameField(gameField.tBodies[0], game.getState(), game.getScore());

  const resultStatus = game.getStatus();

  if (resultStatus === Game.STATUSES.win) {
    winMessage.classList.remove('hidden');
  }

  if (resultStatus === Game.STATUSES.lose) {
    loseMessage.classList.remove('hidden');
  }

  setupInputOnce();
}

// функція для перемальовки ігрового поля
function updateGameField(gameBoard, currState, currScore = 0) {
  const regex = /field-cell--\d+/;

  score.innerText = currScore;

  for (let i = 0; i < currState.length; i++) {
    for (let j = 0; j < currState.length; j++) {
      if (currState[i][j] !== 0) {
        gameBoard.rows[i].cells[j].className =
          `field-cell field-cell--${currState[i][j]}`;
        gameBoard.rows[i].cells[j].innerText = currState[i][j];
      } else if (
        currState[i][j] === 0 &&
        regex.test(gameField.rows[i].cells[j].className)
      ) {
        gameBoard.rows[i].cells[j].className = 'field-cell';
        gameBoard.rows[i].cells[j].innerText = '';
      }
    }
  }
}
