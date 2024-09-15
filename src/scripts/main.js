'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();


// Отримуємо HTML-елементи
const startButton = document.querySelector('.start');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    game.start(); // Якщо це "Start", починаємо гру
  } else if (startButton.classList.contains('restart')) {
    game.restart(); // Якщо це "Restart", перезапускаємо гру
  }
});

document.addEventListener('keyup', (e) => {
  if (game.getStatus() === 'lose') {
    game.loseMessage();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    game.updateBoard();

    if (game.getStatus() === 'win') {
      game.winMessage();
    }
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    game.updateBoard();

    if (game.getStatus() === 'win') {
      game.winMessage();
    }
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    game.updateBoard();

    if (game.getStatus() === 'win') {
      game.winMessage();
    }
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    game.updateBoard();

    if (game.getStatus() === 'win') {
      game.winMessage();
    }
  }
});
