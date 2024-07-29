'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';
import { fullCell } from '../modules/fullCell.class';

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
  window.addEventListener("keydown", handleInput, { once: true });
}

function handleInput(event) {
  switch (event.key) {
    case 'ArrowLeft':
      if (game.canMoveLeft()) {
        game.moveLeft();
        game.createNewTile();
      }
      break;
    case 'ArrowRight':
      if (game.canMoveRight()) {
        game.moveRight();
        game.createNewTile();
      }
      break;
    case 'ArrowUp':
      if (game.canMoveUp()) {
        game.moveUp();
        game.createNewTile();
      }
      break;
    case 'ArrowDown':
      if (game.canMoveDown()) {
        game.moveDown();
        game.createNewTile();
      }
      break;
    default:
      setupInputOnce();

      return;
  }

  if (game.checkForWin()) {
    messageWin.classList.remove('hidden');
  }

  if (
    !game.canMoveUp() &&
    !game.canMoveDown() &&
    !game.canMoveLeft() &&
    !game.canMoveRight()
  ) {
    game.status = 'lose';
    messageLose.classList.remove('hidden');
  }

  setupInputOnce();
}
