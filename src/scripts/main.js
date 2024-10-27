'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';

const startRestartButton = document.getElementById('start-button');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function handleGameStatus(gameStatus) {
  if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');

    startRestartButton.textContent = 'Restart';
    startRestartButton.classList.add('restart');
    startRestartButton.classList.remove('start');
  } else {
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }
}

startRestartButton.addEventListener('click', () => {
  if (startRestartButton.textContent === 'Start') {
    messageStart.classList.add('hidden');
    game.start();
    startRestartButton.textContent = 'Restart';
  } else {
    game.restart();
    messageStart.classList.add('hidden');
    handleGameStatus('playing');
  }
});

document.addEventListener('keydown', (evnt) => {
  switch (evnt.key) {
    case ARROW_LEFT:
      game.moveLeft();
      break;
    case ARROW_RIGHT:
      game.moveRight();
      break;
    case ARROW_UP:
      game.moveUp();
      break;
    case ARROW_DOWN:
      game.moveDown();
      break;
  }

  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell) => {
    cell.classList.add('moving');
  });

  game.updateUI();

  const gameStatus = game.getStatus();

  handleGameStatus(gameStatus);

  setTimeout(() => {
    cells.forEach((cell) => {
      cell.classList.remove('moving');
    });
  }, 300);
});
