'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startGame = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const userWin = document.querySelector('.message-win');
const userLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const restartGame = document.querySelector('.restart');

startGame.addEventListener('click', () => {
  game.start();
  game.render(cells);

  startGame.classList.add('hidden');
  restartGame.classList.remove('hidden');
});

restartGame.addEventListener('click', () => {
  game.restart();
  game.start();

  game.render(cells);

  scoreElement.textContent = 0;

  userWin.classList.add('hidden');
  userLose.classList.add('hidden');

  messageStart.classList.remove('hidden');
})

document.addEventListener('keydown', (e) => {
  const keyActions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const action = keyActions[e.key];

  if (!action) {
    return;
  }

  const changed = action();

  if (changed) {
    game.render(cells);
    scoreElement.textContent = game.getScore();

    const statusGame = game.getStatus();

    userWin.classList.add('hidden');
    userLose.classList.add('hidden');
    messageStart.classList.add('hidden');

    if (statusGame === 'win') {
      userWin.classList.remove('hidden');
      messageStart.classList.add('hidden');
    }

    if (statusGame === 'lose') {
      userLose.classList.remove('hidden');
      messageStart.classList.add('hidden');
    }

    if (statusGame === 'idle') {
      messageStart.classList.remove('hidden');
    }
  }
});
