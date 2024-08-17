'use strict';

const startButton = document.querySelector('.button');
const Game = require('../modules/Game.class');

const game = new Game();

function handleStart() {
  setupInput();

  return game.start();
}

startButton.addEventListener('click', handleStart);

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      await game.moveUp();
      break;
    case 'ArrowDown':
      await game.moveDown();
      break;
    case 'ArrowLeft':
      await game.moveLeft();
      break;
    case 'ArrowRight':
      await game.moveRight();
      break;

    default:
      setupInput();

      break;
  }
  game.cells.forEach((cell) => cell.mergeTiles());

  game.addRandomTile();
  game.updateScore();
  setupInput();
}
