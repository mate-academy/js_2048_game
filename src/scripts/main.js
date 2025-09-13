'use strict';

//import { Game } from '../modules/Game.class.js';
import { preenche, hideMessages, showMessage } from '../functions/functions.js';

  const Game = require('../modules/Game.class.js');
  const game = new Game();
  let start = false;
  const botao = document.querySelector(".button");

  botao.addEventListener("click", function () {
    if (botao.classList.contains("start")) {
        // Muda de Start para Restart
        hideMessages();
        game.start();
        game.insert2RandomNumbersStart();
        preenche(game.returnState());
        botao.classList.remove("start");
        botao.classList.add("restart");
        botao.textContent = "Restart";
        start = true;
      } else {
        // Muda de Restart para Start
        game.restart();
        game.insert2RandomNumbersStart();
        hideMessages();
        preenche(game.returnState());
    }
  });


  document.addEventListener('keydown', (evt) => {
    if (start) {
      switch(evt.key) {
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
        game.getStatus = 'win';
        showMessage('win');
      }
      else if (!(game.moveUpCheck() || game.moveDownCheck() || game.moveRightCheck() || game.moveLeftCheck())) {
        game.getStatus = 'lose';
        showMessage('lose');
      }

      preenche(game.returnState());
    }
  });

