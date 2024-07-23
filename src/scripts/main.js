/* eslint-disable no-shadow */
'use strict';

import Game from '../modules/Game.class.js';

// #region constants

const game = new Game();
const gameStart = document.querySelector('.button');
// const gameField = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

// const messageWin = document.querySelector('.message-win');
// const messageLose = document.querySelector('.message-lose');

// #endregion

// #region func

const chekStatus = () => {
  if (gameStart.classList.contains('start')) {
    game.start(gameStart);
  } else {
    game.restart(gameStart);
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

setUpInputOnce();

// #endregion

// #region addEventListeners

gameStart.addEventListener('click', chekStatus);
// #endregion
