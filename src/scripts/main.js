'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');
const game = new Game();

game.CELL_SIZE = 75;
game.CELL_GAP = 10;

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messages = document.querySelectorAll('.message');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();

    messages.forEach((message) => {
      if (!message.classList.contains('hiiden')) {
        message.classList.add('hidden');
      }
    });
  }
});

function setupInput() {
  document.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (!game.canMoveLeft()) {
        setupInput();

        return;
      }
      await game.moveLeft();
      break;
    case 'ArrowRight':
      if (!game.canMoveRight()) {
        setupInput();

        return;
      }
      await game.moveRight();
      break;
    case 'ArrowUp':
      if (!game.canMoveUp()) {
        setupInput();

        return;
      }
      await game.moveUp();
      break;
    case 'ArrowDown':
      if (!game.canMoveDown()) {
        setupInput();

        return;
      }
      await game.moveDown();
      break;
    default:
      setupInput();

      return;
  }

  game.getScore();

  game.cellState.flat().forEach((cell) => {
    cell.mergeTiles();
  });

  game.createTile();

  if (game.noMovesPossible()) {
    const message = document.querySelector('.message-lose');

    message.classList.remove('hidden');
  }

  if (game.isWinner()) {
    const message = document.querySelector('.message-win');

    message.classList.remove('hidden');
  } else {
    setupInput();
  }
}
setupInput();
