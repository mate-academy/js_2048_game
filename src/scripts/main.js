/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  // #region constants

  const MESSAGE_RESTART =
    'Are you sure you want to start a new game? All progress will be lost.';

  const game = new Game();
  const gameStart = document.querySelector('.button');
  const score = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message-start');

  // #endregion

  // #region func

  const checkStatus = () => {
    const hasStart = gameStart.classList.contains('start');

    if (hasStart) {
      game.start(gameStart);
      messageStart.classList.add('hidden');
    } else {
      if (confirm(MESSAGE_RESTART)) {
        game.restart(gameStart);
        game.start(gameStart);
      } else {
        return;
      }
    }

    setUpScore();
    setUpInputOnce();
  };

  const setUpInputOnce = () =>
    window.addEventListener('keydown', handleInput, { once: true });

  const setUpScore = () => {
    score.textContent = game.getScore();
  };

  const handleInput = (event) => {
    switch (event.key) {
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
      default:
        setUpInputOnce();

        return;
    }

    setUpScore();
    setUpInputOnce();
  };

  // #endregion

  // #region addEventListeners and initial
  setUpInputOnce();

  gameStart.addEventListener('click', checkStatus);
  // #endregion
});
