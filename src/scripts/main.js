'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const cells = document.querySelectorAll('.field-cell');

button.addEventListener('click', setupGame);

document.addEventListener('keydown', keeydown => {
  if (!gameKeys.includes(keeydown.key) || game.getStatus() === 'lose') {
    return;
  }

  defineMove(keeydown.key);

  score.textContent = game.getScore();
  game.drawBoard(cells);
  defineMessage();
});

function setupGame() {
  if (button.textContent === 'Start') {
    game.start();

    button.textContent = 'Restart';
    button.classList.toggle('restart');
    messageStart.classList.toggle('hidden');
  } else {
    game.restart();
    game.start();

    defineMessage();
  }

  game.drawBoard(cells);
}

function defineMove(keydown) {
  switch (keydown) {
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
}

function defineMessage() {
  switch (game.getStatus()) {
    case 'win':
      messageWin.classList.remove('hidden');
      break;

    case 'lose':
      messageLose.classList.remove('hidden');
      break;

    case 'playing':
      if (!messageWin.classList.contains('hidden')) {
        messageWin.classList.add('hidden');
      }

      if (!messageLose.classList.contains('hidden')) {
        messageLose.classList.add('hidden');
      }
  }
}
