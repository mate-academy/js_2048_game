'use strict';
import Game from '../modules/Game.class';

const table = document.querySelector('table');

const game = new Game(table);

const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMeassage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startMessage.classList.add('hidden');
  } else {
    game.restart();
    gameScore.textContent = game.getScore();
    loseMeassage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === Game.STATUS_PLAYING) {
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
    }
  }

  gameScore.textContent = game.getScore();

  switch (game.getStatus()) {
    case Game.STATUS_WIN:
      winMessage.classList.remove('hidden');
      break;

    case Game.STATUS_LOSE:
      loseMeassage.classList.remove('hidden');
      break;
  }
});
