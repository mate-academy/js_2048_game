'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');
const rows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    game.restart();
    updateBoard();
    score.textContent = 0;
  } else {
    startMessage.classList.add('hidden');
    game.start();
    updateBoard();
  }
});

document.addEventListener('keydown', (ev) => {
  if (game.status === 'lose') {
    // eslint-disable-next-line no-console
    console.log('Кнопки натискати не можна, гра закінчена!');

    return;
  }

  if (startMessage.classList.contains('hidden')) {
    startButton.setAttribute('class', 'button restart');

    switch (ev.key) {
      case 'ArrowLeft':
        game.moveLeft();
        score.textContent = game.score;
        game.checkWin();

        if (game.status === 'win') {
          winMessage.classList.remove('hidden');
        } else if (game.status === 'lose') {
          loseMessage.classList.remove('hidden');
        }
        break;

      case 'ArrowRight':
        game.moveRight();
        score.textContent = game.score;
        game.checkWin();

        if (game.status === 'win') {
          winMessage.classList.remove('hidden');
        } else if (game.status === 'lose') {
          loseMessage.classList.remove('hidden');
        }
        break;

      case 'ArrowUp':
        game.moveUp();
        score.textContent = game.score;
        game.checkWin();

        if (game.status === 'win') {
          winMessage.classList.remove('hidden');
        } else if (game.status === 'lose') {
          loseMessage.classList.remove('hidden');
        }
        break;

      case 'ArrowDown':
        game.moveDown();
        score.textContent = game.score;
        game.checkWin();

        if (game.status === 'win') {
          winMessage.classList.remove('hidden');
        } else if (game.status === 'lose') {
          loseMessage.classList.remove('hidden');
        }
        break;
    }

    updateBoard();
  }
});

function updateBoard() {
  const currentState = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (currentState[row][col]) {
        rows[row].children[col].textContent = currentState[row][col];

        rows[row].children[col].setAttribute(
          'class',
          `field-cell field-cell--${currentState[row][col]}`,
        );
      } else {
        rows[row].children[col].textContent = '';

        rows[row].children[col].setAttribute(
          'class',
          'field-cell field-cell--empty',
        );
      }
    }
  }
}
