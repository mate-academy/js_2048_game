'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const btnStart = document.querySelector('.button.start');
const scoreCell = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');

render();

function gameStart() {
  if (!btnStart.classList.contains('restart')) {
    game.start();
    document.addEventListener('keydown', keyPush);

    if (game.getStatus() === 'playing') {
      btnStart.classList.add('restart');
      btnStart.innerHTML = 'Restart';
    }
  } else {
    document.removeEventListener('keydown', keyPush);
    btnStart.innerHTML = 'Start';
    btnStart.classList.remove('restart');
    game.restart();
  }
  render();
}

btnStart.addEventListener('click', gameStart);

function getClassNumber(element) {
  const numbsArr = element.className.match(/(\d+)/g);

  if (numbsArr) {
    return numbsArr[0];
  }

  return 0;
}

function showMessage(message) {
  const messages = document.querySelectorAll('.message');

  for (let i = 0; i < messages.length; i++) {
    const curentMsg = messages[i];

    if (curentMsg.classList.contains(`message-${message}`)) {
      if (curentMsg.classList.contains('hidden')) {
        curentMsg.classList.remove('hidden');
      }
    } else {
      if (!curentMsg.classList.contains('hidden')) {
        curentMsg.classList.add('hidden');
      }
    }
  }
}

function render() {
  for (let i = 0; i < fieldCells.length; i++) {
    const fieldCell = fieldCells[i];
    const flatState = game.getState().flat();
    const flatStateValue = flatState[i];

    if (flatStateValue !== +fieldCell.innerHTML) {
      if (flatStateValue !== 0) {
        fieldCell.innerHTML = String(flatStateValue);
      } else {
        fieldCell.innerHTML = '';
      }
    }

    if (getClassNumber(fieldCell) !== fieldCell.innerHTML) {
      fieldCell.classList.remove(`field-cell--${getClassNumber(fieldCell)}`);
      fieldCell.classList.add(`field-cell--${flatStateValue}`);
    }
  }
  scoreCell.innerHTML = game.getScore();

  switch (game.getStatus()) {
    case 'win':
    case 'lose':
      showMessage(game.getStatus());
      break;
    case 'idle':
      showMessage('start');
      break;
    case 'playing':
      showMessage();
      break;
  }
}

function keyPush(keyboardEvent) {
  switch (keyboardEvent.key) {
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
  }

  render();
}
