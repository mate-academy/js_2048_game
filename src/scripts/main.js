'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function handleKeydown(e) {
  if (game.getStatus() !== 'playing') {
    return;
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
  }

  game.updateUI();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

document.addEventListener('keydown', handleKeydown);

game.updateUI();
