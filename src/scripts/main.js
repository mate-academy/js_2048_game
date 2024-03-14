'use strict';

import { Game } from '../modules/Game.class';
import { Tile } from '../modules/Tile.class';

const gridElement = document.getElementById('game-field');
const lose = document.querySelector('.message-lose');
const start = document.querySelector('.message-start');

const game = new Game(gridElement);

function setupInputOnce() {
  document.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(event) {
  switch(event.key) {
    case "ArrowUp":
      if (!game.canMoveUp()) {
        setupInputOnce();
        return;
      }
      game.moveUp();
      break;
    case "ArrowDown":
      if (!game.canMoveDown()) {
        setupInputOnce();
        return;
      }
      game.moveDown();
      break;
    case "ArrowLeft":
      if (!game.canMoveLeft()) {
        setupInputOnce();
        return;
      }
      game.moveLeft();
      break;
    case "ArrowRight":
      if (!game.canMoveRight()) {
        setupInputOnce();
        return;
      }
      game.moveRight();
      break;
    default:
      setupInputOnce();
      return;
  }

  const newTile = new Tile(gridElement);
  game.getRandomEmptyCell().linkTile(newTile);

  if (!game.canMoveUp() && !game.canMoveDown() && !game.canMoveLeft() && !game.canMoveRight()) {
    newTile.waitForAnimationEnd();
    lose.classList.toggle('hidden');
    return;
  }

  setupInputOnce();
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start(gridElement);
    setupInputOnce();
    button.classList.replace('start', 'restart');
    button.textContent = 'Restart';
    start.classList.toggle('hidden');
  } else {
    game.restart();
    button.classList.replace('restart', 'start');
    button.textContent = 'Start';
    start.classList.toggle('hidden');
  }
});

