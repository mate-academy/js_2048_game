'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

const messages = {
  idle: startMessage,
  win: winMessage,
  lose: loseMessage,
};

function showMessage() {
  const currentStatus = game.getStatus();

  for (const key in messages) {
    if (messages[key]) {
      messages[key].classList.toggle('hidden', key !== currentStatus);
    }
  }
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    game.start();
    button.classList.replace('start', 'restart');
    button.innerHTML = 'Restart';
  } else {
    game.restart();
    score.innerHTML = game.getScore();
    button.classList.replace('restart', 'start');
    button.innerHTML = 'Start';
  }

  showMessage();
});

document.addEventListener('keyup', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.code) {
    case 'ArrowLeft':
      game.move('left');
      break;
    case 'ArrowRight':
      game.move('right');
      break;
    case 'ArrowUp':
      game.move('up');
      break;
    case 'ArrowDown':
      game.move('down');
      break;
  }

  score.innerHTML = game.getScore();

  showMessage();
});
