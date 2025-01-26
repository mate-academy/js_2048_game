'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button');
const scoreButton = document.querySelector('.game-score');

// I don't know how to write logics for status:lose
// Expecialy the part how it is should detect 
// that the matrix can't change anymore

startButton.addEventListener('click', () => {
  if (startButton.getAttribute('class') === 'button start') {
    startButton.setAttribute('class', 'button restart');
    startButton.textContent = 'Restart';
    game.start();
  } else {
    game.restart();
  }

  game.getState();
  game.getStatus();
  scoreButton.textContent = game.getScore();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
    switch (e.key) {
      case 'ArrowLeft':
        // Якщо натиснута стрілка вліво
        game.moveLeft(); // Викликаємо метод moveLeft з класу Game
        game.addRandomTile();

        break;
      case 'ArrowRight': // Якщо натиснута стрілка вправо
        game.moveRight(); // Викликаємо метод moveRight з класу Game
        game.addRandomTile();

        break;
      case 'ArrowUp': // Якщо натиснута стрілка вгору
        game.moveUp(); // Викликаємо метод moveUp з класу Game
        game.addRandomTile();

        break;
      case 'ArrowDown': // Якщо натиснута стрілка вниз
        game.moveDown(); // Викликаємо метод moveDown з класу Game
        game.addRandomTile();

        break;
    }

    game.getState();

    if (game.getStatus() === 'win') {
      document
        .querySelector('.message-win')
        .setAttribute('class', 'message message-win');
    } else if (game.getStatus() === 'lose') {
      document
        .querySelector('.message-lose')
        .setAttribute('class', 'message message-lose');
    }

    scoreButton.textContent = game.getScore();
    // Оновлюємо інтерфейс після кожного руху
  }
});

// Write your code here
