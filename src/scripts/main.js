/* eslint-disable prettier/prettier */
'use strict';

import Game from '../modules/Game.class';

const game = new Game();
const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (!startButton.classList.contains('start')) {
    game.restart();
  }

  if (startButton.classList.contains('start')) {
    game.start();
  }
});

document.addEventListener('keyup', (action) => {
  switch (action.key) {
    case 'ArrowUp':
      if (game.canMoveCellsUp()) {
        game.handleUpButtonClickAndUpdateField();
      }

      if (!game.canMoveCellsUp()) {
        game.checkLose();
      }
      break;
    case 'ArrowLeft':
      if (game.canMoveCellsLeft()) {
        game.handleLeftButtonClickAndUpdateField();
      }

      if (!game.canMoveCellsLeft()) {
        game.checkLose();
      }
      break;
    case 'ArrowDown':
      if (game.canMoveCellsDown()) {
        game.handleDownButtonClickAndUpdateField();
      }

      if (!game.canMoveCellsDown()) {
        game.checkLose();
      }
      break;
    case 'ArrowRight':
      if (game.canMoveCellsRight()) {
        game.handleRightButtonClickAndUpdateField();
      }

      if (!game.canMoveCellsRight()) {
        game.checkLose();
      }
      break;
    default:
      break;
  }
});
