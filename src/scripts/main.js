'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameButton = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');

const onClickGameButton = () => {
  const startMessage = document.querySelector('.message-start');
  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');

  if (gameButton.classList.contains('start')) {
    game.start();
    startMessage.hidden = true;
    gameButton.textContent = 'Restart';
    gameButton.classList.remove('start');
    gameButton.classList.add('restart');
  } else {
    game.restart();
    gameScore.textContent = '0';
    gameButton.textContent = 'Start';
    gameButton.classList.remove('restart');
    gameButton.classList.add('start');

    startMessage.hidden = false;
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }
};

gameButton.addEventListener('click', onClickGameButton);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  gameScore.textContent = game.getScore();

  const loseMessage = document.querySelector('.message-lose');
  const winMessage = document.querySelector('.message-win');

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
  }
});
