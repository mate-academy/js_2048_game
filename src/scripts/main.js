'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const gameField = document.querySelector('.game-field');
const messageStart = document.querySelector('p.message-start');
const messageWin = document.querySelector('p.message-win');
const messageLose = document.querySelector('p.message-lose');

const game = new Game(gameField);

const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');

startButton.addEventListener('click', () => {
  game.start();
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  startButton.style.display = 'none';
  restartButton.style.display = 'block';
});

restartButton.addEventListener('click', () => {
  game.restart();
  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  startButton.classList.add('start');
  messageStart.classList.remove('hidden');
  messageLose.classList.add('hidden');

  startButton.style.display = 'block';
  restartButton.style.display = 'none';
});

setupInputOnce();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

// eslint-disable-next-line no-shadow
function handleInput(event) {
  switch (event.key) {
    case 'ArrowLeft':
      if (game.canMoveLeft()) {
        game.moveLeft();
        game.createNewTile();
        game.checkGameOver();
      }
      break;
    case 'ArrowRight':
      if (game.canMoveRight()) {
        game.moveRight();
        game.createNewTile();
        game.checkGameOver();
      }
      break;
    case 'ArrowUp':
      if (game.canMoveUp()) {
        game.moveUp();
        game.createNewTile();
        game.checkGameOver();
      }
      break;
    case 'ArrowDown':
      if (game.canMoveDown()) {
        game.moveDown();
        game.createNewTile();
        game.checkGameOver();
      }
      break;
    default:
      setupInputOnce();

      return;
  }

  if (game.checkForWin()) {
    messageWin.classList.remove('hidden');
  }

  setupInputOnce();
}
