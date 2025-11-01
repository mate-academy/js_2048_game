'use strict';

import Game, { GAME_STATUS } from './modules/Game.class.js';

const button = document.querySelector('.game-control');
const infoBtn = document.querySelector('.game-description');

const game = new Game();

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    game.render();
  } else if (button.classList.contains('restart')) {
    game.restart();
    game.render();
  }
});

window.addEventListener('keydown', (eventKey) => {
  if (game.gameStatus === GAME_STATUS.playing) {
    switch (eventKey.key) {
      case 'ArrowUp':
        game.moveUp();
        break;
      case 'ArrowDown':
        game.moveDown();
        break;
      case 'ArrowLeft':
        game.moveLeft();
        break;
      case 'ArrowRight':
        game.moveRight();
        break;
    }
  }
});

infoBtn.addEventListener('click', () => {
  const infoText = `
    Use arrow keys to move the tiles.
    When two tiles with the same number touch, they merge into one!
    Reach 2048 to win!

    Developer: Maksym Shevcuk
  `;

  alert(infoText);
});
