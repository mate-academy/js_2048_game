'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function initializeGame() {
  const startButton = document.querySelector('.button');

  if (startButton) {
    startButton.addEventListener('click', () => {
      // Перевірка статусу гри перед запуском або перезапуском
      if (game.getStatus() === 'idle') {
        game.start(); // Запускає гру
      } else if (game.getStatus() === 'playing') {
        game.restart(); // Перезапускає гру
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeGame);
