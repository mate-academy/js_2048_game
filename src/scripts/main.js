'use strict';

import { Game } from '../modules/Game.class';
import {
  renderState,
  showStartMessage,
  showWinOrLoseMessage,
  startButton,
  toggleButton,
  updateScore,
} from '../modules/ui';

const game = new Game();

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();

    showStartMessage();
    toggleButton(true);
  } else {
    game.restart();
    game.start();
  }

  renderState(game.getState());
});

document.addEventListener('keydown', (e) => {
  let boardChanged = false;
  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      boardChanged = game.moveLeft();
      break;
    case 'ArrowRight':
      boardChanged = game.moveRight();
      break;
    case 'ArrowUp':
      boardChanged = game.moveUp();
      break;
    case 'ArrowDown':
      boardChanged = game.moveDown();
      break;
  }

  if (!boardChanged) {
    return;
  }

  const messageStatus = game.getStatus();

  if (messageStatus !== 'idle') {
    showWinOrLoseMessage(messageStatus);
  }

  updateScore(game.getScore());
  renderState(game.getState());
});
