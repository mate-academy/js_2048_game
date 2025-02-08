'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const startBut = document.querySelector('.button');
const score = document.querySelector('.game-score');

document.addEventListener('keydown', async (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
      await game.moveRight();
      break;
    case 'ArrowLeft':
      await game.moveLeft();
      break;
    case 'ArrowUp':
      await game.moveUp();
      break;
    case 'ArrowDown':
      await game.moveDown();
      break;
    default:
      return;
  }

  score.innerText = game.getScore();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

startBut.addEventListener('click', (e) => {
  if (startBut.classList.contains('start')) {
    game.start();
    document.querySelector('.message-start').classList.add('hidden');
    startBut.classList.remove('start');
    startBut.classList.add('restart');
    startBut.innerText = 'Restart';
    game.setNewNumber();
    game.setNewNumber();

    return;
  }

  if (startBut.classList.contains('restart')) {
    const messages = document
      .querySelector('.message-container')
      .querySelectorAll('.message');

    messages.forEach((m) => {
      if (!m.classList.contains('hidden')) {
        m.classList.add('hidden');
      }
    });

    score.innerText = 0;

    game.restart();
    game.setNewNumber();
    game.setNewNumber();
  }
});
