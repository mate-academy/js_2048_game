/* eslint-disable function-paren-newline */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');

// #region start/restart

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  const buttonText = button.classList[1];

  if (button.classList.contains('restart')) {
    game.start();
    startMessage.classList.add('hidden');
  }

  if (button.classList.contains('start')) {
    game.restart();
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
  }

  button.innerHTML = buttonText[0].toUpperCase() + buttonText.slice(1);

  gameToHTML();
});

// #endregion

window.addEventListener('keydown', (_event) => {
  if (button.classList.contains('restart')) {
    switch (_event.key) {
      case 'ArrowLeft':
        game.moveLeft();
        break;

      case 'ArrowUp':
        game.moveUp();
        break;

      case 'ArrowRight':
        game.moveRight();
        break;

      case 'ArrowDown':
        game.moveDown();
        break;
    }

    gameToHTML();

    if (game.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    }

    if (game.getStatus() === 'lose') {
      loseMessage.classList.remove('hidden');
    }
  }
});

// #region functions

function gameToHTML() {
  game.cells.forEach((row, rowIndex) =>
    row.forEach((num, numIndex) => {
      const neededIndex = numIndex + rowIndex * row.length;

      if (num === 0) {
        cells[neededIndex].innerHTML = '';
      } else {
        cells[neededIndex].innerHTML = num;
      }

      addColorForCell(cells[neededIndex]);
    }),
  );

  score.innerHTML = game.score;
}

function addColorForCell(element) {
  element.className = 'field-cell';

  switch (element.innerHTML) {
    case '2':
      element.classList.add('field-cell--2');
      break;
    case '4':
      element.classList.add('field-cell--4');
      break;
    case '8':
      element.classList.add('field-cell--8');
      break;
    case '16':
      element.classList.add('field-cell--16');
      break;
    case '32':
      element.classList.add('field-cell--32');
      break;
    case '64':
      element.classList.add('field-cell--64');
      break;
    case '128':
      element.classList.add('field-cell--128');
      break;
    case '256':
      element.classList.add('field-cell--256');
      break;
    case '512':
      element.classList.add('field-cell--512');
      break;
    case '1024':
      element.classList.add('field-cell--1024');
      break;
    case '2048':
      element.classList.add('field-cell--2048');
      break;
  }
}

// #endregion
