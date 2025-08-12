'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
    game.restart();
  } else {
    game.start();
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
});

document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  const boardBeforeMove = game.getState();

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

  const boardAftereMove = game.getState();

  if (compareBoards(boardBeforeMove, boardAftereMove)) {
    game.addNumber();
  }

  const currentStatus = game.getStatus();

  switch (currentStatus) {
    case 'win':
      document.querySelector('.message-win').classList.remove('hidden');
      document.removeEventListener('keydown', handleKeyDown);
      break;
    case 'lose':
      document.querySelector('.message-lose').classList.remove('hidden');
      document.removeEventListener('keydown', handleKeyDown);
      break;
  }
}

function compareBoards(beforeArr, afterArr) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const beforeCell = beforeArr[i][j];
      const afterCell = afterArr[i][j];

      if (beforeCell !== 0 && afterCell !== 0 && beforeCell !== afterCell) {
        return true;
      }

      if (beforeCell === 0 && afterCell !== 0) {
        return true;
      }

      if (beforeCell !== 0 && afterCell === 0) {
        return true;
      }
    }
  }

  return false;
}
