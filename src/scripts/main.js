'use strict';

import { preenche, hideMessages, showMessage } from '../functions/functions.js';

const Game = require('../modules/Game.class.js');
const game = new Game();
let start = false;
const botao = document.querySelector('.button');

botao.addEventListener('click', function () {
  if (botao.classList.contains('start')) {
    hideMessages();
    game.start();
    game.insert2RandomNumbersStart();
    preenche(game.getState());
    botao.classList.remove('start');
    botao.classList.add('restart');
    botao.textContent = 'Restart';
    start = true;
  } else {
    game.restart();
    game.insert2RandomNumbersStart();
    hideMessages();
    preenche(game.getState());
  }
});

document.addEventListener('keydown', (evt) => {
  if (start) {
    switch (evt.key) {
      case 'ArrowUp':
        if (game.moveUpCheck()) {
          game.moveUp();
          game.insert1RandomNumber();
        }
        break;
      case 'ArrowDown':
        if (game.moveDownCheck()) {
          game.moveDown();
          game.insert1RandomNumber();
        }
        break;
      case 'ArrowRight':
        if (game.moveRightCheck()) {
          game.moveRight();
          game.insert1RandomNumber();
        }
        break;
      case 'ArrowLeft':
        if (game.moveLeftCheck()) {
          game.moveLeft();
          game.insert1RandomNumber();
        }
        break;
    }

    if (game.checkWin()) {
      game.setStatus('win');
      showMessage('win');
    } else if (
      !(
        game.moveUpCheck() ||
        game.moveDownCheck() ||
        game.moveRightCheck() ||
        game.moveLeftCheck()
      )
    ) {
      game.setStatus('lose');
      showMessage('lose');
    }

    preenche(game.getState());
  }
});
