'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const gameScore = document.querySelector('.game-score');
const button = document.querySelector('.button');

// Write your code here

gameScore.innerText = game.getScore();

function checkGameStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
    document.querySelector('.message-start').classList.add('hidden');
  } else if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
    document.querySelector('.message-start').classList.add('hidden');
  } else {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  }
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    game.start();
    game.render();
    document.querySelector('.message-start').classList.add('hidden');
    checkGameStatus();
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';
    game.restart();
    game.render();
    document.querySelector('.message-start').classList.remove('hidden');
    checkGameStatus();
  }
});

document.addEventListener('keydown', (e) => {
  const oldState = JSON.stringify(game.getState());

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  } else {
    return;
  }

  const newState = JSON.stringify(game.getState());

  if (oldState !== newState) {
    game.random();
  }

  game.render();
  gameScore.innerText = game.getScore();
  checkGameStatus();
});
